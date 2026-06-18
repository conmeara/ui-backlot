#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^file:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "capture";
}

function parseArgs(argv) {
  const args = { viewport: "1920x1080", selector: null, slug: null, scale: 1 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--selector") args.selector = argv[++i];
    else if (arg === "--slug") args.slug = argv[++i];
    else if (arg === "--viewport") args.viewport = argv[++i];
    else if (arg === "--scale") args.scale = Number.parseFloat(argv[++i]);
    else if (!args.url) args.url = arg;
  }
  if (!args.url) {
    throw new Error("Usage: node tools/capture-web-ui.mjs <url-or-file> [--slug name] [--selector css] [--viewport 1920x1080] [--scale 1]");
  }
  const [width, height] = args.viewport.split("x").map((item) => Number.parseInt(item, 10));
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error(`Invalid viewport: ${args.viewport}`);
  }
  if (!Number.isFinite(args.scale) || args.scale <= 0) {
    throw new Error(`Invalid scale: ${args.scale}`);
  }
  return { ...args, width, height };
}

function resolveUrl(value) {
  if (/^https?:\/\//.test(value) || value.startsWith("file://")) return value;
  return pathToFileURL(path.resolve(root, value)).href;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const url = resolveUrl(args.url);
  const slug = args.slug || slugify(args.url);
  const outDir = path.join(root, "captures", slug);
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    args: ["--allow-file-access-from-files"]
  });
  const page = await browser.newPage({
    viewport: { width: args.width, height: args.height },
    deviceScaleFactor: args.scale
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page
    .waitForFunction(() => {
      const state = window.__backlotComponentsState;
      return !state || state === "ready" || state === "error";
    }, { timeout: 15_000 })
    .catch(() => {});

  const backlotComponentState = await page.evaluate(() => ({
    state: window.__backlotComponentsState || null,
    error: window.__backlotComponentsError || null
  }));
  if (backlotComponentState.state === "error") {
    throw new Error(`Backlot component mount failed: ${backlotComponentState.error || "unknown error"}`);
  }

  await page.waitForTimeout(500);

  const captureTarget = args.selector ? page.locator(args.selector).first() : page;
  await page.screenshot({ path: path.join(outDir, "viewport.png"), fullPage: false });
  await captureTarget.screenshot({ path: path.join(outDir, "target.png") });

  const payload = await page.evaluate((selector) => {
    const targetRoot = selector ? document.querySelector(selector) : document.body;
    const rootEl = targetRoot || document.body;
    const rootRect = rootEl.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    function isVisible(el, rect, style) {
      if (!rect || rect.width < 1 || rect.height < 1) return false;
      if (style.visibility === "hidden" || style.display === "none") return false;
      if (Number.parseFloat(style.opacity || "1") < 0.03) return false;
      return true;
    }

    function textOf(el) {
      const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
      return text.slice(0, 240);
    }

    function compactRect(rect) {
      return {
        x: Math.round(rect.x * 10) / 10,
        y: Math.round(rect.y * 10) / 10,
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10
      };
    }

    function styleOf(el, computed) {
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
        opacity: computed.opacity,
        display: computed.display,
        position: computed.position,
        zIndex: computed.zIndex
      };
    }

    const elements = Array.from(rootEl.querySelectorAll("*"))
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        if (!isVisible(el, rect, computed)) return null;
        const text = textOf(el);
        const role =
          el.getAttribute("role") ||
          (el instanceof HTMLButtonElement ? "button" : "") ||
          (el instanceof HTMLInputElement ? "input" : "") ||
          (el instanceof HTMLAnchorElement ? "link" : "");
        const testId =
          el.getAttribute("data-testid") ||
          el.getAttribute("data-test") ||
          el.getAttribute("aria-label") ||
          el.getAttribute("title") ||
          "";
        return {
          tag: el.tagName.toLowerCase(),
          role,
          id: el.id || "",
          className: typeof el.className === "string" ? el.className.slice(0, 180) : "",
          label: testId.slice(0, 160),
          text,
          rect: compactRect(rect),
          style: styleOf(el, computed)
        };
      })
      .filter(Boolean)
      .filter((el) => el.text || el.role || el.label || el.style.backgroundColor !== "rgba(0, 0, 0, 0)")
      .sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x)
      .slice(0, 600);

    const colors = new Map();
    const fonts = new Map();
    const radii = new Map();
    const shadows = new Map();

    for (const item of elements) {
      for (const color of [item.style.color, item.style.backgroundColor, item.style.borderColor]) {
        if (color && color !== "rgba(0, 0, 0, 0)") colors.set(color, (colors.get(color) || 0) + 1);
      }
      if (item.style.fontFamily) {
        const fontKey = `${item.style.fontFamily} / ${item.style.fontSize} / ${item.style.fontWeight}`;
        fonts.set(fontKey, (fonts.get(fontKey) || 0) + 1);
      }
      if (item.style.borderRadius && item.style.borderRadius !== "0px") radii.set(item.style.borderRadius, (radii.get(item.style.borderRadius) || 0) + 1);
      if (item.style.boxShadow && item.style.boxShadow !== "none") shadows.set(item.style.boxShadow, (shadows.get(item.style.boxShadow) || 0) + 1);
    }

    const topEntries = (map) => Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([value, count]) => ({ value, count }));

    return {
      url: location.href,
      title: document.title,
      capturedAt: new Date().toISOString(),
      selector,
      viewport,
      targetRect: compactRect(rootRect),
      tokens: {
        colors: topEntries(colors),
        fonts: topEntries(fonts),
        radii: topEntries(radii),
        shadows: topEntries(shadows)
      },
      elements
    };
  }, args.selector);

  await fs.writeFile(path.join(outDir, "capture.json"), JSON.stringify(payload, null, 2));
  await fs.writeFile(
    path.join(outDir, "visible-text.md"),
    payload.elements
      .filter((item) => item.text)
      .map((item) => `- ${item.tag}${item.role ? ` [${item.role}]` : ""} @ ${item.rect.x},${item.rect.y}: ${item.text}`)
      .join("\n") + "\n"
  );

  await browser.close();
  console.log(outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
