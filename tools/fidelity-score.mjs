#!/usr/bin/env node
/*
 * Fidelity scorecard: measure one UI capture against another.
 *
 * Primary use — our surface vs real-app ground truth:
 *   node tools/fidelity-score.mjs --label claude-composed-app \
 *     --ours captures/surface-claude-composed-app/capture.json \
 *     --theirs reference/claude/2026-07-05/web-app-chat/tokens.json \
 *     [--ours-png captures/.../target.png --theirs-png reference/.../screenshot.png]
 *
 * Drift use — this week's reference vs last week's (same flags, both sides
 * are reference tokens.json files).
 *
 * Token score compares the frequency-weighted tables both capture tools emit
 * (colors, typography, radii, shadows, spacing) and lists ranked, actionable
 * deltas. Pixel score (optional, needs both PNGs) is computed in a headless
 * Playwright canvas — no extra dependencies. Pixel score is only meaningful
 * between same-layout images (regression / drift); against the real app it is
 * directional and for judge eyes, which the report says explicitly.
 *
 * Writes reports/fidelity/<label>-<date>.json and prints a summary.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--ours") args.ours = argv[++i];
    else if (arg === "--theirs") args.theirs = argv[++i];
    else if (arg === "--ours-png") args.oursPng = argv[++i];
    else if (arg === "--theirs-png") args.theirsPng = argv[++i];
    else if (arg === "--label") args.label = argv[++i];
    else if (arg === "--out") args.out = argv[++i];
  }
  if (!args.ours || !args.theirs || !args.label) {
    throw new Error(
      "Usage: node tools/fidelity-score.mjs --label <name> --ours <capture.json> --theirs <tokens.json> [--ours-png a.png --theirs-png b.png] [--out report.json]"
    );
  }
  return args;
}

function parseColor(value) {
  // Live apps report modern formats: color(srgb 0.04 0.04 0.04 / 0.1)
  const srgb = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/.exec(value || "");
  if (srgb) {
    let alpha = srgb[4] === undefined ? 1 : Number.parseFloat(srgb[4]);
    if (typeof srgb[4] === "string" && srgb[4].endsWith("%")) alpha /= 100;
    if (alpha < 0.05) return null;
    return { r: Number.parseFloat(srgb[1]) * 255, g: Number.parseFloat(srgb[2]) * 255, b: Number.parseFloat(srgb[3]) * 255, a: alpha };
  }
  const match = /rgba?\(([^)]+)\)/.exec(value || "");
  if (!match) return null;
  const parts = match[1].split(",").map((p) => Number.parseFloat(p.trim()));
  if (parts.length < 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const alpha = parts.length > 3 ? parts[3] : 1;
  if (alpha < 0.05) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: alpha };
}

function toHex(c) {
  const h = (n) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

/* Similarity saturates at Δ128 — beyond that two colors are simply different;
 * normalizing by the full RGB diagonal (Δ441) flatters everything. */
const COLOR_DIST_SCALE = 128;

function colorDistance(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/* Frequency tables per role. Comparing text-to-text and background-to-background
 * matters: a dark theme's text color sits near a light theme's background, so a
 * role-blind palette match can't tell the themes apart. */
/* Translucent colors (hairline borders are often black at ~10% alpha) are
 * composited over the payload's dominant opaque background before comparison,
 * so a 10%-black border and a solid light-gray border measure as the near-
 * match they visually are. */
function compositeTables(tables, pageBackground) {
  let base = parseColor(pageBackground);
  if (!base || base.a < 0.95) {
    base = { r: 255, g: 255, b: 255 };
    for (const entry of tables.background) {
      if (entry.parsed && entry.parsed.a >= 0.95) {
        base = entry.parsed;
        break;
      }
    }
  }
  const composite = (c) =>
    c.a >= 0.95
      ? c
      : { r: c.r * c.a + base.r * (1 - c.a), g: c.g * c.a + base.g * (1 - c.a), b: c.b * c.a + base.b * (1 - c.a), a: 1 };
  for (const role of ["text", "background", "border"]) {
    tables[role] = tables[role].map((e) => (e.parsed ? { ...e, parsed: composite(e.parsed) } : e));
  }
  return tables;
}

function buildColorTables(payload) {
  // Slim payloads (extracted via the browser MCP from logged-in sessions)
  // carry pre-aggregated role tables instead of raw elements.
  if (!payload.elements?.length && payload.tokens?.colorRoles) {
    const fromRoles = (list) =>
      (list || []).map((e) => ({ value: e.value, count: e.count, parsed: parseColor(e.value) }));
    return compositeTables(
      {
        text: fromRoles(payload.tokens.colorRoles.text),
        background: fromRoles(payload.tokens.colorRoles.background),
        border: fromRoles(payload.tokens.colorRoles.border)
      },
      payload.pageBackground
    );
  }
  const tables = { text: new Map(), background: new Map(), border: new Map() };
  for (const el of payload.elements || []) {
    const add = (table, value) => {
      if (parseColor(value)) table.set(value, (table.get(value) || 0) + 1);
    };
    if (el.text) add(tables.text, el.style.color);
    add(tables.background, el.style.backgroundColor);
    if (el.style.borderColor) add(tables.border, el.style.borderColor);
  }
  const toList = (map) =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([value, count]) => ({ value, count, parsed: parseColor(value) }));
  return compositeTables(
    { text: toList(tables.text), background: toList(tables.background), border: toList(tables.border) },
    payload.pageBackground
  );
}

/* One-directional weighted match: for each entry on the "from" side, how close
 * is its nearest neighbor on the "to" side. Run both ways and average so
 * missing colors and invented colors both cost. */
function scoreColorList(fromList, toList, deltas, direction, role) {
  const from = fromList.filter((e) => e.parsed);
  const to = toList.filter((e) => e.parsed);
  if (from.length === 0 || to.length === 0) return null;
  let weighted = 0;
  let totalWeight = 0;
  for (const entry of from) {
    let best = null;
    for (const candidate of to) {
      const dist = colorDistance(entry.parsed, candidate.parsed);
      if (!best || dist < best.dist) best = { dist, candidate };
    }
    const similarity = Math.max(0, 1 - best.dist / COLOR_DIST_SCALE);
    weighted += similarity * entry.count;
    totalWeight += entry.count;
    if (best.dist > 12 && entry.count >= 3) {
      deltas.push({
        kind: `color:${role}`,
        severity: Math.min(1, (best.dist / COLOR_DIST_SCALE) * 0.5 + entry.count / 200),
        detail: `${direction}: ${role} ${toHex(entry.parsed)} (×${entry.count}) nearest counterpart ${toHex(best.candidate.parsed)} (Δ${best.dist.toFixed(1)})`
      });
    }
  }
  return totalWeight ? weighted / totalWeight : null;
}

function scoreColors(oursPayload, theirsPayload, deltas) {
  const ours = buildColorTables(oursPayload);
  const theirs = buildColorTables(theirsPayload);
  const roleScores = [];
  for (const role of ["text", "background", "border"]) {
    const a = scoreColorList(theirs[role], ours[role], deltas, "real-but-missing-in-ours", role);
    const b = scoreColorList(ours[role], theirs[role], deltas, "ours-but-not-in-real", role);
    const combined = a === null ? b : b === null ? a : (a + b) / 2;
    if (combined !== null) roleScores.push(combined);
  }
  if (roleScores.length === 0) return null;
  return roleScores.reduce((s, v) => s + v, 0) / roleScores.length;
}

function parseFontKey(key) {
  const [familyRaw = "", sizeRaw = "", weightRaw = ""] = key.split(" / ");
  const family = familyRaw.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
  return {
    family,
    size: Number.parseFloat(sizeRaw) || 0,
    weight: Number.parseFloat(weightRaw) || 400
  };
}

function scoreFonts(fromList, toList, deltas, direction) {
  if (!fromList?.length || !toList?.length) return null;
  const from = fromList.map((e) => ({ ...e, parsed: parseFontKey(e.value) }));
  const to = toList.map((e) => ({ ...e, parsed: parseFontKey(e.value) }));
  let weighted = 0;
  let totalWeight = 0;
  for (const entry of from) {
    let best = { score: 0, candidate: null };
    for (const candidate of to) {
      const familyMatch =
        entry.parsed.family === candidate.parsed.family ||
        entry.parsed.family.includes(candidate.parsed.family) ||
        candidate.parsed.family.includes(entry.parsed.family)
          ? 1
          : 0;
      const sizeDiff = Math.abs(entry.parsed.size - candidate.parsed.size);
      const sizeScore = Math.max(0, 1 - sizeDiff / 8);
      const weightDiff = Math.abs(entry.parsed.weight - candidate.parsed.weight);
      const weightScore = Math.max(0, 1 - weightDiff / 300);
      const score = familyMatch * 0.4 + sizeScore * 0.35 + weightScore * 0.25;
      if (score > best.score) best = { score, candidate };
    }
    weighted += best.score * entry.count;
    totalWeight += entry.count;
    if (best.score < 0.85 && entry.count >= 3 && best.candidate) {
      deltas.push({
        kind: "typography",
        severity: (1 - best.score) * 0.8,
        detail: `${direction}: "${entry.parsed.family}" ${entry.parsed.size}px/${entry.parsed.weight} (×${entry.count}) best counterpart "${best.candidate.parsed.family}" ${best.candidate.parsed.size}px/${best.candidate.parsed.weight}`
      });
    }
  }
  return totalWeight ? weighted / totalWeight : null;
}

function parsePxList(value) {
  return (value.match(/-?\d+(\.\d+)?px/g) || []).map((v) => Number.parseFloat(v));
}

function scorePxValues(fromList, toList, deltas, direction, kind, tolerance) {
  if (!fromList?.length || !toList?.length) return null;
  const toValues = toList.flatMap((e) => parsePxList(e.value));
  if (toValues.length === 0) return null;
  let weighted = 0;
  let totalWeight = 0;
  for (const entry of fromList) {
    const values = parsePxList(entry.value);
    if (values.length === 0) continue;
    const perValue = values.map((v) => {
      const nearest = toValues.reduce((best, t) => Math.min(best, Math.abs(v - t)), Infinity);
      return Math.max(0, 1 - nearest / tolerance);
    });
    const score = perValue.reduce((a, b) => a + b, 0) / perValue.length;
    weighted += score * entry.count;
    totalWeight += entry.count;
    if (score < 0.7 && entry.count >= 3) {
      deltas.push({
        kind,
        severity: (1 - score) * 0.6,
        detail: `${direction}: ${kind} ${entry.value} (×${entry.count}) has no close counterpart`
      });
    }
  }
  return totalWeight ? weighted / totalWeight : null;
}

function scoreShadows(fromList, toList) {
  if (!fromList?.length || !toList?.length) return null;
  const toSet = new Set(toList.map((e) => e.value));
  let weighted = 0;
  let totalWeight = 0;
  for (const entry of fromList) {
    // Exact match full credit; any shadow present at all gets partial credit —
    // shadow strings rarely match verbatim across implementations.
    weighted += (toSet.has(entry.value) ? 1 : 0.4) * entry.count;
    totalWeight += entry.count;
  }
  return totalWeight ? weighted / totalWeight : null;
}

function bidirectional(fn, ours, theirs, deltas, ...rest) {
  const a = fn(theirs, ours, deltas, "real-but-missing-in-ours", ...rest);
  const b = fn(ours, theirs, deltas, "ours-but-not-in-real", ...rest);
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return (a + b) / 2;
}

async function pixelDiff(oursPng, theirsPng) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Data URIs instead of file:// — blank-page contexts refuse local file loads.
  const toDataUri = async (p) => `data:image/png;base64,${(await fs.readFile(path.resolve(p))).toString("base64")}`;
  try {
    const result = await page.evaluate(
      async ({ a, b }) => {
        const load = (src) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`failed to load ${src}`));
            img.src = src;
          });
        const [imgA, imgB] = await Promise.all([load(a), load(b)]);
        const width = Math.min(imgA.naturalWidth, imgB.naturalWidth, 1600);
        const height = Math.round(width * (imgA.naturalHeight / imgA.naturalWidth));
        const draw = (img) => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          return ctx.getImageData(0, 0, width, height).data;
        };
        const dataA = draw(imgA);
        const dataB = draw(imgB);
        let sum = 0;
        let changed = 0;
        const total = width * height;
        for (let i = 0; i < dataA.length; i += 4) {
          const delta =
            (Math.abs(dataA[i] - dataB[i]) + Math.abs(dataA[i + 1] - dataB[i + 1]) + Math.abs(dataA[i + 2] - dataB[i + 2])) / 3;
          sum += delta;
          if (delta > 30) changed += 1;
        }
        return {
          width,
          height,
          meanAbsError: sum / total,
          pctPixelsChanged: (changed / total) * 100,
          aspectMismatch: Math.abs(imgA.naturalWidth / imgA.naturalHeight - imgB.naturalWidth / imgB.naturalHeight) > 0.02
        };
      },
      { a: await toDataUri(oursPng), b: await toDataUri(theirsPng) }
    );
    return { ...result, score: Math.max(0, 1 - result.meanAbsError / 64) };
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const ours = JSON.parse(await fs.readFile(path.resolve(args.ours), "utf8"));
  const theirs = JSON.parse(await fs.readFile(path.resolve(args.theirs), "utf8"));
  const deltas = [];

  const scores = {
    colors: scoreColors(ours, theirs, deltas),
    typography: bidirectional(scoreFonts, ours.tokens.fonts, theirs.tokens.fonts, deltas),
    radii: bidirectional(scorePxValues, ours.tokens.radii, theirs.tokens.radii, deltas, "radius", 6),
    spacing: bidirectional(scorePxValues, ours.tokens.spacing, theirs.tokens.spacing, deltas, "spacing", 8),
    shadows: scoreShadows(theirs.tokens.shadows, ours.tokens.shadows)
  };

  const weights = { colors: 0.3, typography: 0.3, radii: 0.15, spacing: 0.15, shadows: 0.1 };
  let overall = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (scores[key] !== null && scores[key] !== undefined) {
      overall += scores[key] * weight;
      weightSum += weight;
    }
  }
  scores.tokenOverall = weightSum ? overall / weightSum : null;

  let pixel = null;
  if (args.oursPng && args.theirsPng) {
    pixel = await pixelDiff(args.oursPng, args.theirsPng);
  }

  deltas.sort((a, b) => b.severity - a.severity);
  const report = {
    label: args.label,
    comparedAt: new Date().toISOString(),
    ours: path.relative(root, path.resolve(args.ours)),
    theirs: path.relative(root, path.resolve(args.theirs)),
    scores,
    pixel: pixel && {
      ...pixel,
      caveat: "Pixel score is only decisive between same-layout images (regression/drift). Against the real app it is directional; a judge must read the images."
    },
    deltas: deltas.slice(0, 40)
  };

  const date = new Date().toISOString().slice(0, 10);
  const outPath = path.resolve(args.out || path.join(root, "reports", "fidelity", `${args.label}-${date}.json`));
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(report, null, 2));

  const fmt = (v) => (v === null || v === undefined ? "  n/a" : v.toFixed(3));
  console.log(`fidelity-score ${args.label}`);
  console.log(`  colors     ${fmt(scores.colors)}`);
  console.log(`  typography ${fmt(scores.typography)}`);
  console.log(`  radii      ${fmt(scores.radii)}`);
  console.log(`  spacing    ${fmt(scores.spacing)}`);
  console.log(`  shadows    ${fmt(scores.shadows)}`);
  console.log(`  TOKEN      ${fmt(scores.tokenOverall)}`);
  if (pixel) console.log(`  pixel      ${fmt(pixel.score)} (MAE ${pixel.meanAbsError.toFixed(1)}, ${pixel.pctPixelsChanged.toFixed(1)}% changed)`);
  console.log(`  top deltas:`);
  for (const delta of report.deltas.slice(0, 8)) {
    console.log(`    - [${delta.kind}] ${delta.detail}`);
  }
  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
