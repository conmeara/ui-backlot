#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kindOrder = new Map([
  ["surface", 0],
  ["component", 1],
  ["workflow", 2],
  ["lab", 3]
]);

function parseArgs(argv) {
  const args = {
    refreshCaptures: false,
    html: "captures/surface-inventory.html",
    png: "captures/surface-inventory.png",
    columns: 3,
    width: 1800
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--refresh-captures") args.refreshCaptures = true;
    else if (arg === "--html") args.html = argv[++index];
    else if (arg === "--png") args.png = argv[++index];
    else if (arg === "--columns") args.columns = Number.parseInt(argv[++index], 10);
    else if (arg === "--width") args.width = Number.parseInt(argv[++index], 10);
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(args.columns) || args.columns < 1) {
    throw new Error("--columns must be a positive integer");
  }
  if (!Number.isInteger(args.width) || args.width < 900) {
    throw new Error("--width must be an integer >= 900");
  }

  return args;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function posixRelative(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function formatLocalDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(date);
}

async function readJson(relativePath) {
  const file = await fs.readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(file);
}

function sortSurfaces(surfaces) {
  return surfaces
    .map((surface, index) => ({ ...surface, index }))
    .sort((a, b) => {
      const kindDelta = (kindOrder.get(a.kind) ?? 99) - (kindOrder.get(b.kind) ?? 99);
      return kindDelta || a.index - b.index;
    });
}

function runCaptureScripts(surfaces) {
  for (const surface of surfaces) {
    const script = surface.capture?.script;
    if (surface.capture?.status !== "ready" || !script) continue;

    console.log(`Refreshing ${surface.id} with npm run ${script}`);
    const result = spawnSync("npm", ["run", script], {
      cwd: root,
      stdio: "inherit",
      shell: false
    });

    if (result.status !== 0) {
      throw new Error(`Capture failed for ${surface.id}: npm run ${script}`);
    }
  }
}

async function captureExists(surface) {
  if (!surface.capture?.path) return false;
  try {
    await fs.access(path.join(root, surface.capture.path));
    return true;
  } catch {
    return false;
  }
}

async function buildHtml({ surfaces, outputHtml, columns, width }) {
  const htmlDir = path.dirname(outputHtml);
  const generatedAt = formatLocalDate(new Date());
  const cards = [];

  for (const [index, surface] of surfaces.entries()) {
    const hasCapture = await captureExists(surface);
    const imageSrc = surface.capture?.path
      ? posixRelative(htmlDir, path.join(root, surface.capture.path))
      : "";
    const statusClass = hasCapture ? "is-ready" : "is-missing";
    const figure = hasCapture
      ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(surface.title)} capture">`
      : `<div class="missing-capture">Missing capture<br><span>${escapeHtml(surface.capture?.path || "No capture path")}</span></div>`;

    cards.push(`    <article class="card ${escapeHtml(surface.kind)} ${statusClass}">
      <header>
        <span class="number">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h2>${escapeHtml(surface.title)}</h2>
          <p>${escapeHtml(surface.id)} · ${escapeHtml(surface.kind)}</p>
        </div>
      </header>
      <figure>${figure}</figure>
    </article>`);
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>UI Backlot Surface Inventory</title>
<style>
  @import url("../styles/backlot-foundation.css");

  html { background: #f7f5ef; }
  body {
    width: ${width}px;
    margin: 0;
    padding: 32px;
    background: #f7f5ef;
    color: #16120f;
    font-family: var(--font-claude-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    padding: 0 6px 24px;
    border-bottom: 1px solid rgba(40, 35, 30, 0.12);
    margin-bottom: 24px;
  }
  h1 {
    margin: 0 0 8px;
    font-size: 36px;
    line-height: 1;
    font-weight: 720;
    letter-spacing: 0;
  }
  .page-header p {
    margin: 0;
    color: #6b6259;
    font-size: 16px;
  }
  .meta {
    text-align: right;
    color: #6b6259;
    font-size: 14px;
    line-height: 1.45;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: 18px;
  }
  .card {
    min-width: 0;
    border: 1px solid rgba(40, 35, 30, 0.12);
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 253, 249, 0.86);
    box-shadow: 0 12px 30px rgba(62, 47, 34, 0.07);
  }
  .card header {
    height: 68px;
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 12px;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(40, 35, 30, 0.09);
    background: rgba(255, 253, 249, 0.92);
  }
  .number {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #efe9df;
    color: #6b6259;
    font-size: 13px;
    font-weight: 700;
  }
  .card h2 {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 17px;
    line-height: 1.15;
    font-weight: 720;
    letter-spacing: 0;
  }
  .card p {
    margin: 4px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #756d64;
    font-size: 12px;
    font-weight: 560;
  }
  figure {
    height: 300px;
    margin: 0;
    display: grid;
    place-items: center;
    background:
      linear-gradient(45deg, rgba(231, 224, 215, 0.34) 25%, transparent 25% 75%, rgba(231, 224, 215, 0.34) 75%),
      linear-gradient(45deg, rgba(231, 224, 215, 0.34) 25%, transparent 25% 75%, rgba(231, 224, 215, 0.34) 75%),
      #fbfaf6;
    background-position: 0 0, 8px 8px;
    background-size: 16px 16px;
  }
  img {
    max-width: calc(100% - 28px);
    max-height: 272px;
    display: block;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 1px 1px rgba(40, 35, 30, 0.04), 0 18px 50px rgba(40, 35, 30, 0.12);
    background: #fffdfa;
  }
  .missing-capture {
    width: calc(100% - 28px);
    height: 272px;
    display: grid;
    place-content: center;
    text-align: center;
    border: 1px dashed rgba(198, 91, 71, 0.45);
    border-radius: 8px;
    color: #a84535;
    background: rgba(255, 247, 244, 0.72);
    font-size: 18px;
    font-weight: 700;
  }
  .missing-capture span {
    display: block;
    margin-top: 8px;
    color: #756d64;
    font-size: 12px;
    font-weight: 560;
  }
</style>
</head>
<body>
  <header class="page-header">
    <div>
      <h1>UI Backlot Surface Inventory</h1>
      <p>Every registry-listed capture refreshed from the current worktree.</p>
    </div>
    <div class="meta">
      <strong>${surfaces.length} surfaces</strong><br>
      Generated ${escapeHtml(generatedAt)}<br>
      Source: surfaces/registry.json
    </div>
  </header>
  <main class="grid">
${cards.join("\n\n")}
  </main>
</body>
</html>
`;
}

async function screenshotInventory({ outputHtml, outputPng, width }) {
  const browser = await chromium.launch({
    args: ["--allow-file-access-from-files"]
  });
  const page = await browser.newPage({
    viewport: { width: width + 64, height: 1200 },
    deviceScaleFactor: 1
  });

  await page.goto(pathToFileURL(outputHtml).href, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
    await document.fonts?.ready;
  });
  await page.screenshot({ path: outputPng, fullPage: true });
  await browser.close();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const registry = await readJson("surfaces/registry.json");
  const surfaces = sortSurfaces(registry.surfaces || []);
  const outputHtml = path.resolve(root, args.html);
  const outputPng = path.resolve(root, args.png);

  if (args.refreshCaptures) {
    runCaptureScripts(surfaces);
  }

  await fs.mkdir(path.dirname(outputHtml), { recursive: true });
  await fs.mkdir(path.dirname(outputPng), { recursive: true });
  const html = await buildHtml({
    surfaces,
    outputHtml,
    columns: args.columns,
    width: args.width
  });
  await fs.writeFile(outputHtml, html);
  await screenshotInventory({
    outputHtml,
    outputPng,
    width: args.width
  });

  console.log(posixRelative(root, outputHtml));
  console.log(posixRelative(root, outputPng));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
