#!/usr/bin/env node
/*
 * Offline icon search over @iconify/json (200k+ icons, no network).
 *
 * Fidelity work needs the CLOSEST real glyph for whatever the live app shows.
 * This searches icon names (and aliases) across the collections the repo's
 * families use, and can emit a ready-to-paste <symbol> for a composition's
 * hidden sprite block.
 *
 * Usage:
 *   node tools/find-icon.mjs waveform mic              # search default sets
 *   node tools/find-icon.mjs slack --sets simple-icons # brand marks
 *   node tools/find-icon.mjs plus-circle --sets lucide --symbol
 *     → prints <symbol id="lucide-plus-circle" ...> ready for the sprite block
 *
 * Default sets mirror the family conventions: lucide (claude/browser),
 * fluent (Office), f7 = framework7 (macOS), simple-icons (brands).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const DEFAULT_SETS = ["lucide", "fluent", "f7", "simple-icons"];

function parseArgs(argv) {
  const args = { terms: [], sets: DEFAULT_SETS, symbol: false, limit: 12 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--sets") args.sets = argv[++i].split(",").map((s) => s.trim());
    else if (a === "--symbol") args.symbol = true;
    else if (a === "--limit") args.limit = Number.parseInt(argv[++i], 10) || 12;
    else args.terms.push(a.toLowerCase());
  }
  if (args.terms.length === 0) {
    console.error("Usage: node tools/find-icon.mjs <term...> [--sets lucide,fluent,f7,simple-icons] [--symbol] [--limit N]");
    process.exit(1);
  }
  return args;
}

function scoreName(name, terms) {
  const parts = name.split("-");
  let score = 0;
  for (const t of terms) {
    if (name === t) score += 100;
    else if (parts.includes(t)) score += 40;
    else if (name.includes(t)) score += 15;
    else return -1; // every term must appear somewhere
  }
  score -= parts.length; // prefer shorter, more canonical names
  return score;
}

async function loadSet(setName) {
  const file = require.resolve(`@iconify/json/json/${setName}.json`);
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function iconBody(data, name) {
  // Resolve aliases to their parent icon, applying nothing fancy — fidelity
  // work wants the plain glyph.
  let icon = data.icons[name];
  let resolved = name;
  while (!icon && data.aliases && data.aliases[resolved]) {
    resolved = data.aliases[resolved].parent;
    icon = data.icons[resolved];
  }
  if (!icon) return null;
  return {
    body: icon.body,
    width: icon.width || data.width || 16,
    height: icon.height || data.height || 16,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const results = [];
  for (const setName of args.sets) {
    let data;
    try {
      data = await loadSet(setName);
    } catch {
      console.error(`(set not found: ${setName})`);
      continue;
    }
    const names = [...Object.keys(data.icons), ...Object.keys(data.aliases || {})];
    for (const name of names) {
      const score = scoreName(name, args.terms);
      if (score >= 0) results.push({ set: setName, name, score });
    }
  }
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, args.limit);
  if (top.length === 0) {
    console.log("No matches. Try broader terms or --sets with more collections (any set in node_modules/@iconify/json/json/).");
    return;
  }
  for (const r of top) {
    console.log(`${r.set}:${r.name}`);
  }
  if (args.symbol) {
    const best = top[0];
    const data = await loadSet(best.set);
    const icon = iconBody(data, best.name);
    if (icon) {
      const prefix = best.set === "simple-icons" ? "si" : best.set;
      console.log("\n<!-- " + best.set + ":" + best.name + " via @iconify/json -->");
      console.log(
        `<symbol id="${prefix}-${best.name}" viewBox="0 0 ${icon.width} ${icon.height}">${icon.body}</symbol>`
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
