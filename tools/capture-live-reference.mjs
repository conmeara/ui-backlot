#!/usr/bin/env node
/*
 * Capture a dated ground-truth reference set from a live URL.
 *
 * Playwright path — works for public pages and any URL that renders without
 * auth. For logged-in apps (claude.ai, figma.com) the agent drives the user's
 * own Chrome via the claude-in-chrome MCP instead, then files the results
 * with tools/import-reference.mjs. Both paths produce the same layout:
 *
 *   reference/<family>/<YYYY-MM-DD>/<label>/
 *     screenshot.png
 *     tokens.json        (same shape as captures/<slug>/capture.json)
 *     visible-text.md
 *   reference/<family>/<YYYY-MM-DD>/manifest.json
 *
 * Usage:
 *   node tools/capture-live-reference.mjs <url> --family claude --label web-app-chat \
 *     [--selector css] [--viewport 1440x900] [--theme dark] [--wait 2000] [--date YYYY-MM-DD]
 *
 * Logged-in apps use a persistent Playwright profile the user authenticates
 * once (never enter credentials on the user's behalf — open the window and let
 * them sign in):
 *   node tools/capture-live-reference.mjs https://claude.ai --login --profile .playwright-profile
 *   node tools/capture-live-reference.mjs https://claude.ai/new --family claude --label web-app-home \
 *     --profile .playwright-profile --slim
 * --slim keeps element text out of tokens.json (personal content); screenshots
 * of logged-in sessions are gitignored either way.
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = { viewport: "1440x900", selector: null, theme: "light", wait: 1500, date: null, slim: false, login: false, profile: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--family") args.family = argv[++i];
    else if (arg === "--label") args.label = argv[++i];
    else if (arg === "--selector") args.selector = argv[++i];
    else if (arg === "--viewport") args.viewport = argv[++i];
    else if (arg === "--theme") args.theme = argv[++i];
    else if (arg === "--wait") args.wait = Number.parseInt(argv[++i], 10);
    else if (arg === "--wait-for") args.waitFor = argv[++i];
    else if (arg === "--date") args.date = argv[++i];
    else if (arg === "--note") args.note = argv[++i];
    else if (arg === "--slim") args.slim = true;
    else if (arg === "--login") args.login = true;
    else if (arg === "--headed") args.headed = true;
    else if (arg === "--profile") args.profile = argv[++i];
    else if (!args.url) args.url = arg;
  }
  if (!args.url || (!args.login && (!args.family || !args.label))) {
    throw new Error(
      "Usage: node tools/capture-live-reference.mjs <url> --family <family> --label <label> [--selector css] [--viewport WxH] [--theme light|dark] [--wait ms] [--note text] [--profile dir] [--slim] | <url> --login --profile dir"
    );
  }
  const [width, height] = args.viewport.split("x").map((v) => Number.parseInt(v, 10));
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new Error(`Invalid viewport: ${args.viewport}`);
  return { ...args, width, height };
}

async function updateManifest(dateDir, entry) {
  const manifestPath = path.join(dateDir, "manifest.json");
  let manifest = { capturedAt: new Date().toISOString(), entries: [] };
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {
    /* first entry for this date */
  }
  manifest.entries = manifest.entries.filter((e) => e.label !== entry.label);
  manifest.entries.push(entry);
  manifest.entries.sort((a, b) => a.label.localeCompare(b.label));
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  return manifestPath;
}

async function launchPage(args) {
  const pageOptions = {
    viewport: { width: args.width, height: args.height },
    colorScheme: args.theme === "dark" ? "dark" : "light"
  };
  if (args.profile) {
    const profileDir = path.resolve(root, args.profile);
    await fs.mkdir(profileDir, { recursive: true });
    // Headed by design for logged-in apps: bot checks (Cloudflare) block
    // headless Chromium, and evading them is off the table. A brief visible
    // window is the honest cost. If a human-verification checkbox appears,
    // the HUMAN clicks it — never automate that.
    const context = await chromium.launchPersistentContext(profileDir, {
      headless: !(args.login || args.headed),
      ...pageOptions
    });
    const page = context.pages()[0] || (await context.newPage());
    return { page, close: () => context.close() };
  }
  const browser = await chromium.launch();
  const page = await browser.newPage(pageOptions);
  return { page, close: () => browser.close() };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.login) {
    // Headed session for the user to sign in themselves; the profile persists
    // for later headless captures. Waits until the app UI appears or 5 min.
    const { page, close } = await launchPage(args);
    await page.goto(args.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    console.log("Log in in the opened browser window. Waiting up to 5 minutes...");
    try {
      await page.waitForFunction(
        () => !!document.querySelector('a[href^="/chat/"], [data-testid="chat-input"], textarea, [contenteditable="true"]'),
        { timeout: 300_000, polling: 2_000 }
      );
      console.log("Login detected. Profile saved.");
    } catch {
      console.log("Timed out waiting for login UI; profile saved with whatever state exists.");
    }
    await close();
    return;
  }

  const date = args.date || new Date().toISOString().slice(0, 10);
  const labelDir = path.join(root, "reference", args.family, date, args.label);
  await fs.mkdir(labelDir, { recursive: true });

  const extractorSource = await fs.readFile(path.join(root, "tools", "extract-ui-tokens.js"), "utf8");

  const { page, close } = await launchPage(args);

  await page.goto(args.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});

  // Bot-check guard: wait out an auto-resolving interstitial; if one persists,
  // abort WITHOUT writing so a scheduled run never overwrites good reference
  // data with a challenge page. Never automate human-verification widgets —
  // if a checkbox variant appears, a human must click it (rerun with --headed
  // and complete it manually).
  const botCheck = () =>
    page.evaluate(() => /verifying you are human|security verification|verify you are human/i.test(document.body?.innerText || ""));
  if (await botCheck()) {
    console.error("Bot-check interstitial detected; waiting up to 90s for it to clear...");
    try {
      await page.waitForFunction(
        () => !/verifying you are human|security verification|verify you are human/i.test(document.body?.innerText || ""),
        { timeout: 90_000, polling: 2_000 }
      );
      await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
    } catch {
      await close();
      console.error("Bot check did not clear. Nothing written. Rerun with --headed and complete the verification manually if a checkbox is shown.");
      process.exit(2);
    }
  }

  if (args.waitFor) {
    await page.waitForSelector(args.waitFor, { timeout: 60_000 });
  }
  await page.waitForTimeout(args.wait);

  const target = args.selector ? page.locator(args.selector).first() : page;
  await target.screenshot({ path: path.join(labelDir, "screenshot.png") });

  const payload = await page.evaluate(
    ({ source, selector, slim }) => {
      // eslint-disable-next-line no-eval
      eval(source);
      return extractUiTokens(selector, { slim });
    },
    { source: extractorSource, selector: args.selector, slim: args.slim }
  );

  await fs.writeFile(path.join(labelDir, "tokens.json"), JSON.stringify(payload, null, 2));
  if (payload.elements?.length) {
    await fs.writeFile(
      path.join(labelDir, "visible-text.md"),
      payload.elements
        .filter((item) => item.text)
        .map((item) => `- ${item.tag}${item.role ? ` [${item.role}]` : ""} @ ${item.rect.x},${item.rect.y}: ${item.text}`)
        .join("\n") + "\n"
    );
  }

  const manifestPath = await updateManifest(path.join(root, "reference", args.family, date), {
    label: args.label,
    method: args.profile ? "playwright-profile" : "playwright-public",
    url: args.url,
    viewport: args.viewport,
    theme: args.theme,
    selector: args.selector,
    capturedAt: payload.capturedAt,
    note: args.note || null,
    assetDecision:
      "Ground-truth measurement of a live/public page. Screenshot and computed-style measurements only; do not copy product code, CSS, icons, or screenshot pixels into editable surfaces."
  });

  await close();
  console.log(labelDir);
  console.log(manifestPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
