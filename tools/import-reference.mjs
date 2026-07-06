#!/usr/bin/env node
/*
 * File externally captured ground truth into a dated reference set.
 *
 * The manual-inbox half of the capture loop — for material agents can't
 * produce with Playwright:
 *   - screenshots the user took of native apps (Claude desktop, Finder, etc.)
 *   - tokens.json dumps extracted from the user's logged-in Chrome via the
 *     claude-in-chrome MCP (tools/extract-ui-tokens.js payload)
 *   - screencapture output from native-local captures
 *
 * Produces the same layout as tools/capture-live-reference.mjs:
 *   reference/<family>/<YYYY-MM-DD>/<label>/{screenshot.png, tokens.json, visible-text.md}
 *   reference/<family>/<YYYY-MM-DD>/manifest.json
 *
 * Usage:
 *   node tools/import-reference.mjs --family claude --label desktop-app-chat \
 *     [--image path.png ...] [--tokens dump.json] [--method manual-inbox|claude-in-chrome|screencapture] \
 *     [--note "..."] [--source "where this came from"] [--date YYYY-MM-DD]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = { images: [], method: "manual-inbox", date: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--family") args.family = argv[++i];
    else if (arg === "--label") args.label = argv[++i];
    else if (arg === "--image") args.images.push(argv[++i]);
    else if (arg === "--tokens") args.tokens = argv[++i];
    else if (arg === "--method") args.method = argv[++i];
    else if (arg === "--note") args.note = argv[++i];
    else if (arg === "--source") args.source = argv[++i];
    else if (arg === "--date") args.date = argv[++i];
  }
  if (!args.family || !args.label || (args.images.length === 0 && !args.tokens)) {
    throw new Error(
      "Usage: node tools/import-reference.mjs --family <family> --label <label> (--image path.png [--image ...] | --tokens dump.json) [--method m] [--note text] [--source text] [--date YYYY-MM-DD]"
    );
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = args.date || new Date().toISOString().slice(0, 10);
  const dateDir = path.join(root, "reference", args.family, date);
  const labelDir = path.join(dateDir, args.label);
  await fs.mkdir(labelDir, { recursive: true });

  const files = [];
  for (let i = 0; i < args.images.length; i += 1) {
    const src = path.resolve(args.images[i]);
    const ext = path.extname(src) || ".png";
    const dest = path.join(labelDir, args.images.length === 1 ? `screenshot${ext}` : `screenshot-${i + 1}${ext}`);
    await fs.copyFile(src, dest);
    files.push(path.basename(dest));
  }

  let capturedAt = new Date().toISOString();
  if (args.tokens) {
    const payload = JSON.parse(await fs.readFile(path.resolve(args.tokens), "utf8"));
    if (!payload.tokens) {
      throw new Error(`--tokens file does not look like an extract-ui-tokens payload: ${args.tokens}`);
    }
    capturedAt = payload.capturedAt || capturedAt;
    await fs.writeFile(path.join(labelDir, "tokens.json"), JSON.stringify(payload, null, 2));
    files.push("tokens.json");
    // Slim payloads (logged-in sessions) intentionally carry no elements/text.
    if (payload.elements?.length) {
      await fs.writeFile(
        path.join(labelDir, "visible-text.md"),
        payload.elements
          .filter((item) => item.text)
          .map((item) => `- ${item.tag}${item.role ? ` [${item.role}]` : ""} @ ${item.rect.x},${item.rect.y}: ${item.text}`)
          .join("\n") + "\n"
      );
      files.push("visible-text.md");
    }
  }

  const manifestPath = path.join(dateDir, "manifest.json");
  let manifest = { capturedAt, entries: [] };
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {
    /* first entry for this date */
  }
  manifest.entries = manifest.entries.filter((e) => e.label !== args.label);
  manifest.entries.push({
    label: args.label,
    method: args.method,
    source: args.source || null,
    capturedAt,
    files,
    note: args.note || null,
    assetDecision:
      "Ground-truth reference of the real application for fidelity work — recreate the surface as closely as possible from it. Logged-in captures may contain the owner's private content; keep those local and use synthetic demo content in tracked surfaces."
  });
  manifest.entries.sort((a, b) => a.label.localeCompare(b.label));
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(labelDir);
  console.log(manifestPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
