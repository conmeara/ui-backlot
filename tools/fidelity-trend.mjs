#!/usr/bin/env node
/*
 * Score history across all fidelity reports — the convergence view.
 *
 * Scans reports/fidelity/*.json (each written by tools/fidelity-score.mjs),
 * groups by surface (label minus its -v2/-before/-after/-rN/date suffixes),
 * and prints token/element/pixel scores over time so pass-over-pass progress
 * is data, not recollection.
 *
 * Usage:
 *   node tools/fidelity-trend.mjs [surface-filter]
 *   npm run fidelity:trend
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filter = (process.argv[2] || "").toLowerCase();

function surfaceOf(label) {
  return String(label)
    .replace(/-(v2|before|after|baseline|fix|current|followup|judge-r\d+|build|r\d+)$/g, "")
    .replace(/-vs-live$/, "");
}

const dir = path.join(root, "reports", "fidelity");
let files;
try {
  files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
} catch {
  console.error("no reports/fidelity directory yet — run npm run fidelity:score first");
  process.exit(1);
}

const rows = [];
for (const file of files) {
  let report;
  try {
    report = JSON.parse(await fs.readFile(path.join(dir, file), "utf8"));
  } catch {
    continue;
  }
  if (!report.label || !report.scores) continue;
  rows.push({
    surface: surfaceOf(report.label),
    label: report.label,
    at: report.comparedAt || "",
    token: report.scores.tokenOverall ?? null,
    element: report.scores.elementOverall ?? report.elements?.elementOverall ?? null,
    pixel: report.pixel?.score ?? null,
  });
}

rows.sort((a, b) => a.surface.localeCompare(b.surface) || a.at.localeCompare(b.at));
const fmt = (v) => (v == null ? "   —  " : v.toFixed(3));

let current = null;
let prev = null;
for (const r of rows) {
  if (filter && !r.surface.toLowerCase().includes(filter)) continue;
  if (r.surface !== current) {
    current = r.surface;
    prev = null;
    console.log(`\n${r.surface}`);
    console.log(`  ${"when".padEnd(17)} ${"token".padEnd(7)} ${"elem".padEnd(7)} ${"pixel".padEnd(7)} label`);
  }
  const delta =
    prev != null && r.token != null && prev.token != null
      ? ` (${r.token - prev.token >= 0 ? "+" : ""}${(r.token - prev.token).toFixed(3)})`
      : "";
  console.log(
    `  ${r.at.slice(0, 16).padEnd(17)} ${fmt(r.token).padEnd(7)} ${fmt(r.element).padEnd(7)} ${fmt(r.pixel).padEnd(7)} ${r.label}${delta}`
  );
  prev = r;
}
console.log();
