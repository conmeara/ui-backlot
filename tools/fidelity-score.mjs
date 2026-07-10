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

/* ---------------- Element-level matching (scorer v2) ----------------
 * Design2Code-style: match individual elements across the two captures,
 * then score color/typography/position/size per matched pair and emit
 * typed repair instructions. Research: docs/research/
 * fidelity-metrics-upgrade-2026-07-05.md (element matching, CIEDE2000,
 * typed element-wise feedback).
 * Reference-side element data comes from tokens.json when present, else a
 * sibling elements.json (full payload, local-only — it contains page text).
 */

function rgbToLab({ r, g, b }) {
  const srgb = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const [lr, lg, lb] = srgb;
  let x = (lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375) / 0.95047;
  let y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175;
  let z = (lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function ciede2000(c1, c2) {
  const lab1 = rgbToLab(c1);
  const lab2 = rgbToLab(c2);
  const rad = Math.PI / 180;
  const C1 = Math.hypot(lab1.a, lab1.b);
  const C2 = Math.hypot(lab2.a, lab2.b);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const a1p = lab1.a * (1 + G);
  const a2p = lab2.a * (1 + G);
  const C1p = Math.hypot(a1p, lab1.b);
  const C2p = Math.hypot(a2p, lab2.b);
  const h1p = C1p === 0 ? 0 : ((Math.atan2(lab1.b, a1p) / rad) + 360) % 360;
  const h2p = C2p === 0 ? 0 : ((Math.atan2(lab2.b, a2p) / rad) + 360) % 360;
  const dLp = lab2.L - lab1.L;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lbarp = (lab1.L + lab2.L) / 2;
  const Cbarp = (C1p + C2p) / 2;
  let hbarp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) > 180) hbarp += h1p + h2p < 360 ? 360 : -360;
    hbarp /= 2;
  }
  const T =
    1 -
    0.17 * Math.cos((hbarp - 30) * rad) +
    0.24 * Math.cos(2 * hbarp * rad) +
    0.32 * Math.cos((3 * hbarp + 6) * rad) -
    0.2 * Math.cos((4 * hbarp - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hbarp - 275) / 25) ** 2));
  const RC = 2 * Math.sqrt(Cbarp ** 7 / (Cbarp ** 7 + 25 ** 7));
  const SL = 1 + (0.015 * (Lbarp - 50) ** 2) / Math.sqrt(20 + (Lbarp - 50) ** 2);
  const SC = 1 + 0.045 * Cbarp;
  const SH = 1 + 0.015 * Cbarp * T;
  const RT = -Math.sin(2 * dTheta * rad) * RC;
  return Math.sqrt(
    (dLp / SL) ** 2 + (dCp / SC) ** 2 + (dHp / SH) ** 2 + RT * (dCp / SC) * (dHp / SH)
  );
}

function diceBigrams(a, b) {
  const grams = (s) => {
    const t = s.toLowerCase().replace(/\s+/g, " ").trim();
    const set = new Map();
    for (let i = 0; i < t.length - 1; i += 1) {
      const g = t.slice(i, i + 2);
      set.set(g, (set.get(g) || 0) + 1);
    }
    return set;
  };
  const ga = grams(a);
  const gb = grams(b);
  if (ga.size === 0 || gb.size === 0) return a.trim() === b.trim() ? 1 : 0;
  let overlap = 0;
  let total = 0;
  for (const [g, n] of ga) {
    total += n;
    overlap += Math.min(n, gb.get(g) || 0);
  }
  let totalB = 0;
  for (const n of gb.values()) totalB += n;
  return (2 * overlap) / (total + totalB);
}

function normalizeElements(payload) {
  const base = payload.targetRect || { x: 0, y: 0, width: payload.viewport?.width || 1, height: payload.viewport?.height || 1 };
  const pageBg = parseColor(payload.pageBackground) || { r: 255, g: 255, b: 255, a: 1 };
  const comp = (c) =>
    !c || c.a >= 0.95
      ? c
      : { r: c.r * c.a + pageBg.r * (1 - c.a), g: c.g * c.a + pageBg.g * (1 - c.a), b: c.b * c.a + pageBg.b * (1 - c.a), a: 1 };
  return (payload.elements || [])
    .filter((el) => el.rect.width >= 2 && el.rect.height >= 2)
    .map((el) => ({
      tag: el.tag,
      role: el.role || "",
      hint: el.id ? "#" + el.id : el.className ? "." + String(el.className).split(/\s+/)[0] : el.tag,
      text: (el.text || "").slice(0, 80),
      textNorm: (el.text || "").slice(0, 80).toLowerCase().replace(/\s+/g, " ").trim(),
      cx: (el.rect.x + el.rect.width / 2 - base.x) / base.width,
      cy: (el.rect.y + el.rect.height / 2 - base.y) / base.height,
      w: el.rect.width / base.width,
      h: el.rect.height / base.height,
      px: el.rect,
      color: comp(parseColor(el.style.color)),
      bg: comp(parseColor(el.style.backgroundColor)),
      fontSize: Number.parseFloat(el.style.fontSize) || null,
      fontWeight: Number.parseFloat(el.style.fontWeight) || null
    }));
}

/* Ancestry hint: for each element, record the text of its smallest enclosing
 * element that has text. Two counterparts should sit in similar-reading
 * containers even when the elements themselves are textless icons. */
function attachContext(els) {
  for (const el of els) {
    let best = null;
    const area = el.px.width * el.px.height;
    for (const other of els) {
      if (other === el || !other.textNorm) continue;
      const r = other.px;
      const s = el.px;
      if (r.x <= s.x + 1 && r.y <= s.y + 1 && r.x + r.width >= s.x + s.width - 1 && r.y + r.height >= s.y + s.height - 1) {
        const otherArea = r.width * r.height;
        if (otherArea > area * 1.15 && (!best || otherArea < best.area)) best = { area: otherArea, text: other.textNorm };
      }
    }
    el.ctx = best ? best.text : "";
  }
}

/* Truncation-tolerant text equality: capture tools clip text at different
 * lengths, so a long prefix counts as exact. */
function exactText(ta, tb) {
  if (!ta || !tb) return false;
  if (ta === tb) return true;
  return ta.length >= 12 && tb.length >= 12 && (ta.startsWith(tb) || tb.startsWith(ta));
}

function textSimilarity(a, b) {
  if (a.textNorm && b.textNorm) {
    if (exactText(a.textNorm, b.textNorm)) return 1;
    return diceBigrams(a.textNorm, b.textNorm);
  }
  if (a.textNorm || b.textNorm) return 0.15; // texty node vs textless node: almost certainly different
  return null; // both textless — text is uninformative
}

/* Style affinity is a TIE-BREAKER only (small cost weight): among reference
 * candidates that read the same and sit in the same place (nested wrappers),
 * prefer the one whose computed style agrees with ours. Kept weak so a genuine
 * style bug still matches its true counterpart via text + geometry. */
function styleAffinity(a, b) {
  let s = 0;
  let n = 0;
  if (a.fontSize && b.fontSize) {
    s += Math.max(0, 1 - Math.abs(a.fontSize - b.fontSize) / 12);
    n += 1;
  }
  if (a.fontWeight && b.fontWeight) {
    s += Math.max(0, 1 - Math.abs(a.fontWeight - b.fontWeight) / 300);
    n += 1;
  }
  if (a.color && b.color) {
    s += Math.max(0, 1 - ciede2000(a.color, b.color) / 40);
    n += 1;
  }
  if (a.bg && b.bg) {
    s += Math.max(0, 1 - ciede2000(a.bg, b.bg) / 40);
    n += 1;
  } else if (!!a.bg !== !!b.bg) {
    s += 0.3; // one paints a background, the other is transparent
    n += 1;
  }
  return n ? s / n : 0.5;
}

/* Geometry veto: two elements more than 30% of the frame apart are not the
 * same control unless their text matches exactly. */
const GEO_VETO_DIST = 0.3;
const PAIR_COST_MAX = 2.0;

function pairCost(a, b) {
  const centerDist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
  const textSim = textSimilarity(a, b);
  const exact = textSim === 1 && a.textNorm && b.textNorm;
  if (centerDist > GEO_VETO_DIST && !exact) return Infinity;
  const sizeDiff = Math.abs(a.w - b.w) + Math.abs(a.h - b.h);
  const textCost = textSim === null ? 0.55 : (1 - textSim) * 1.8; // text equality dominates
  const tagCost = a.tag === b.tag ? 0 : 0.25;
  const roleCost = a.role || b.role ? (a.role === b.role ? 0 : 0.15) : 0;
  const ctxCost = a.ctx && b.ctx ? (1 - diceBigrams(a.ctx, b.ctx)) * 0.35 : 0.15;
  const styleCost = (1 - styleAffinity(a, b)) * 0.3;
  return centerDist * 1.6 + sizeDiff * 0.9 + textCost + tagCost + roleCost + ctxCost + styleCost;
}

function matchElements(ours, theirs) {
  attachContext(ours);
  attachContext(theirs);
  const pairs = [];
  // Best/second-best cost per element on each side — a small margin between
  // them means the match was ambiguous (duplicate wrappers), so downgrade
  // confidence even when the winning pair looks good in isolation.
  const bestOurs = ours.map(() => [Infinity, Infinity]);
  const bestTheirs = theirs.map(() => [Infinity, Infinity]);
  const note = (slot, cost) => {
    if (cost < slot[0]) {
      slot[1] = slot[0];
      slot[0] = cost;
    } else if (cost < slot[1]) slot[1] = cost;
  };
  for (let i = 0; i < ours.length; i += 1) {
    for (let j = 0; j < theirs.length; j += 1) {
      const cost = pairCost(ours[i], theirs[j]);
      if (!Number.isFinite(cost)) continue;
      note(bestOurs[i], cost);
      note(bestTheirs[j], cost);
      if (cost < PAIR_COST_MAX) pairs.push({ i, j, cost });
    }
  }
  pairs.sort((p, q) => p.cost - q.cost);
  const usedOurs = new Set();
  const usedTheirs = new Set();
  const matched = [];
  for (const p of pairs) {
    if (usedOurs.has(p.i) || usedTheirs.has(p.j)) continue;
    usedOurs.add(p.i);
    usedTheirs.add(p.j);
    const margin = Math.min(bestOurs[p.i][1] - bestOurs[p.i][0], bestTheirs[p.j][1] - bestTheirs[p.j][0]);
    matched.push({
      ours: ours[p.i],
      theirs: theirs[p.j],
      cost: p.cost,
      confidence: matchConfidence(ours[p.i], theirs[p.j], Number.isFinite(margin) ? margin : 1)
    });
  }
  return {
    matched,
    unmatchedOurs: ours.filter((_, i) => !usedOurs.has(i)),
    unmatchedTheirs: theirs.filter((_, j) => !usedTheirs.has(j))
  };
}

/* Per-match confidence in [0,1]: how sure are we these two nodes are the same
 * control. Repairs from low-confidence matches are quarantined in
 * elements.uncertainRepairs instead of typedRepairs. */
const CONFIDENT_MATCH = 0.6;

function matchConfidence(a, b, margin) {
  const textSim = textSimilarity(a, b);
  const textConf = textSim === null ? 0.4 : a.textNorm && b.textNorm ? textSim : 0.2;
  const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
  const geoConf = Math.max(0, 1 - dist / 0.25);
  const sizeConf = Math.max(0, 1 - (Math.abs(a.w - b.w) + Math.abs(a.h - b.h)) / 0.3);
  const tagConf = a.tag === b.tag ? 1 : 0.4;
  const base = textConf * 0.45 + geoConf * 0.25 + sizeConf * 0.15 + tagConf * 0.15;
  let conf = Math.min(1, base + Math.min(Math.max(margin, 0), 0.5) * 0.3);
  // A short label ("Artifacts", "Code") recurring elsewhere in an app is weak
  // evidence: an exact-text match far from home is likely a different control
  // that happens to share the word.
  if (dist > 0.25 && (!a.textNorm || a.textNorm.length < 15)) conf = Math.min(conf, 0.5);
  return Math.round(conf * 100) / 100;
}

function scoreElements(oursPayload, theirsPayload) {
  if (!oursPayload.elements?.length || !theirsPayload.elements?.length) return null;
  const ours = normalizeElements(oursPayload);
  const theirs = normalizeElements(theirsPayload);
  const { matched, unmatchedOurs, unmatchedTheirs } = matchElements(ours, theirs);

  const weight = (el) => Math.sqrt(Math.max(el.w * el.h, 1e-6));
  const totalTheirs = theirs.reduce((s, el) => s + weight(el), 0);
  const matchScore = matched.reduce((s, m) => s + weight(m.theirs), 0) / (totalTheirs || 1);

  const repairs = [];
  let posSum = 0, sizeSum = 0, colorSum = 0, colorN = 0, typeSum = 0, typeN = 0, textSum = 0, textN = 0;
  for (const m of matched) {
    const dist = Math.hypot(m.ours.cx - m.theirs.cx, m.ours.cy - m.theirs.cy);
    const pos = Math.max(0, 1 - dist / 0.15);
    posSum += pos;
    const sizeDiff = Math.abs(m.ours.w - m.theirs.w) + Math.abs(m.ours.h - m.theirs.h);
    sizeSum += Math.max(0, 1 - sizeDiff / 0.25);
    if (pos < 0.6) {
      repairs.push({
        type: "move",
        target: m.ours.hint,
        severity: 1 - pos,
        confidence: m.confidence,
        detail: `${m.ours.hint} ("${m.ours.text.slice(0, 30)}") sits at (${m.ours.px.x},${m.ours.px.y}); real counterpart center offset ${(dist * 100).toFixed(1)}% of frame`
      });
    }
    for (const key of ["color", "bg"]) {
      if (m.ours[key] && m.theirs[key]) {
        const dE = ciede2000(m.ours[key], m.theirs[key]);
        colorSum += Math.max(0, 1 - dE / 25);
        colorN += 1;
        if (dE > 8) {
          repairs.push({
            type: "recolor",
            target: m.ours.hint,
            severity: Math.min(1, dE / 40),
            confidence: m.confidence,
            detail: `${m.ours.hint} ${key === "color" ? "text" : "background"} ${toHex(m.ours[key])} → real ${toHex(m.theirs[key])} (ΔE00 ${dE.toFixed(1)})`
          });
        }
      }
    }
    if (m.ours.fontSize && m.theirs.fontSize && m.ours.text && m.theirs.text) {
      const sizeScore = Math.max(0, 1 - Math.abs(m.ours.fontSize - m.theirs.fontSize) / 8);
      const weightScore = m.ours.fontWeight && m.theirs.fontWeight ? Math.max(0, 1 - Math.abs(m.ours.fontWeight - m.theirs.fontWeight) / 300) : 1;
      typeSum += sizeScore * 0.6 + weightScore * 0.4;
      typeN += 1;
      if (sizeScore < 0.75 || weightScore < 0.75) {
        repairs.push({
          type: "retype",
          target: m.ours.hint,
          severity: 1 - Math.min(sizeScore, weightScore),
          confidence: m.confidence,
          detail: `${m.ours.hint} is ${m.ours.fontSize}px/${m.ours.fontWeight}; real is ${m.theirs.fontSize}px/${m.theirs.fontWeight}`
        });
      }
    }
    if (m.ours.text && m.theirs.text) {
      textSum += diceBigrams(m.ours.text, m.theirs.text);
      textN += 1;
    }
  }

  // Nested wrappers report the same missing content many times over — one
  // add per distinct text reading is enough for a fix agent.
  const seenAddText = new Set();
  let addCount = 0;
  for (const el of unmatchedTheirs.sort((a, b) => weight(b) - weight(a))) {
    if (addCount >= 12) break;
    const sig = el.textNorm ? el.textNorm.slice(0, 40) : `${el.tag}@${Math.round(el.cx * 20)},${Math.round(el.cy * 20)}`;
    if (seenAddText.has(sig)) continue;
    seenAddText.add(sig);
    addCount += 1;
    repairs.push({
      type: "add",
      target: el.hint,
      severity: Math.min(1, weight(el) * 6),
      detail: `real app has <${el.tag}>${el.text ? ` "${el.text.slice(0, 40)}"` : ""} at (${el.px.x},${el.px.y} ${el.px.width}x${el.px.height}) with no counterpart in ours`
    });
  }
  for (const el of unmatchedOurs.sort((a, b) => weight(b) - weight(a)).slice(0, 8)) {
    repairs.push({
      type: "remove-or-verify",
      target: el.hint,
      severity: Math.min(1, weight(el) * 4),
      detail: `ours has ${el.hint} <${el.tag}>${el.text ? ` "${el.text.slice(0, 40)}"` : ""} at (${el.px.x},${el.px.y}) unmatched in the real app (invented control, or matcher miss — verify visually)`
    });
  }
  repairs.sort((a, b) => b.severity - a.severity);
  // Match-derived repairs from shaky correspondences are quarantined: a fix
  // agent should treat uncertainRepairs as "verify visually first", not apply.
  const confident = repairs.filter((r) => r.confidence === undefined || r.confidence >= CONFIDENT_MATCH);
  const uncertain = repairs.filter((r) => r.confidence !== undefined && r.confidence < CONFIDENT_MATCH);

  const n = matched.length || 1;
  const sub = {
    match: matchScore,
    position: posSum / n,
    size: sizeSum / n,
    color: colorN ? colorSum / colorN : null,
    typography: typeN ? typeSum / typeN : null,
    text: textN ? textSum / textN : null
  };
  const weights = { match: 0.3, color: 0.2, typography: 0.15, position: 0.15, size: 0.1, text: 0.1 };
  let overall = 0, wSum = 0;
  for (const [k, w] of Object.entries(weights)) {
    if (sub[k] !== null && sub[k] !== undefined) {
      overall += sub[k] * w;
      wSum += w;
    }
  }
  return {
    counts: { ours: ours.length, theirs: theirs.length, matched: matched.length },
    subscores: sub,
    elementOverall: wSum ? overall / wSum : null,
    typedRepairs: confident.slice(0, 30),
    uncertainRepairs: uncertain.slice(0, 20)
  };
}

function pngDims(buf) {
  // PNG IHDR: width/height as big-endian uint32 at offsets 16/20.
  if (buf.length < 24 || buf.readUInt32BE(12) !== 0x49484452) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function pixelDiff(oursPng, theirsPng) {
  // Same-dimension images: odiff (native, anti-aliasing-aware — the honest
  // regression/drift metric). Mismatched dimensions: canvas MAE fallback,
  // directional only.
  const [oursBuf, theirsBuf] = await Promise.all([
    fs.readFile(path.resolve(oursPng)),
    fs.readFile(path.resolve(theirsPng)),
  ]);
  const dimsA = pngDims(oursBuf);
  const dimsB = pngDims(theirsBuf);
  if (dimsA && dimsB && dimsA.width === dimsB.width && dimsA.height === dimsB.height) {
    try {
      const { compare } = await import("odiff-bin");
      const diffPath = path.join(root, "reports", "fidelity", "diff-latest.png");
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      const result = await compare(path.resolve(oursPng), path.resolve(theirsPng), diffPath, {
        antialiasing: true,
        threshold: 0.1,
        outputDiffMask: true,
      });
      const pct = result.match ? 0 : result.diffPercentage ?? 0;
      return {
        method: "odiff",
        width: dimsA.width,
        height: dimsA.height,
        pctPixelsChanged: pct,
        meanAbsError: null,
        diffMask: result.match ? null : path.relative(root, diffPath),
        score: Math.max(0, 1 - pct / 100),
      };
    } catch {
      /* odiff-bin unavailable — fall through to canvas */
    }
  }
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
    return { method: "canvas", ...result, score: Math.max(0, 1 - result.meanAbsError / 64) };
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const ours = JSON.parse(await fs.readFile(path.resolve(args.ours), "utf8"));
  const theirs = JSON.parse(await fs.readFile(path.resolve(args.theirs), "utf8"));
  // Slim reference payloads keep element data (which contains page text) in a
  // local-only sibling file.
  if (!theirs.elements?.length) {
    const sibling = path.join(path.dirname(path.resolve(args.theirs)), "elements.json");
    try {
      const full = JSON.parse(await fs.readFile(sibling, "utf8"));
      if (full.elements?.length) {
        theirs.elements = full.elements;
        theirs.targetRect = theirs.targetRect || full.targetRect;
        theirs.viewport = theirs.viewport || full.viewport;
      }
    } catch {
      /* no local element data — element scoring skipped */
    }
  }
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

  const elements = scoreElements(ours, theirs);
  if (elements) scores.elementOverall = elements.elementOverall;

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
    elements,
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
  if (elements) {
    const s = elements.subscores;
    console.log(`  ELEMENT    ${fmt(elements.elementOverall)} (match ${fmt(s.match)}, pos ${fmt(s.position)}, size ${fmt(s.size)}, color ${fmt(s.color)}, type ${fmt(s.typography)}, text ${fmt(s.text)}; ${elements.counts.matched}/${elements.counts.theirs} real elements matched)`);
  }
  if (pixel) console.log(`  pixel      ${fmt(pixel.score)} (${pixel.method}${pixel.meanAbsError != null ? `, MAE ${pixel.meanAbsError.toFixed(1)}` : ""}, ${pixel.pctPixelsChanged.toFixed(1)}% changed)`);
  console.log(`  top deltas:`);
  for (const delta of report.deltas.slice(0, 8)) {
    console.log(`    - [${delta.kind}] ${delta.detail}`);
  }
  if (elements?.typedRepairs.length) {
    console.log(`  typed repairs (top 10 of ${elements.typedRepairs.length}):`);
    for (const r of elements.typedRepairs.slice(0, 10)) {
      console.log(`    - [${r.type}${r.confidence !== undefined ? ` c${r.confidence}` : ""}] ${r.detail}`);
    }
  }
  if (elements?.uncertainRepairs.length) {
    console.log(`  uncertain repairs — shaky element correspondence, verify visually (top 5 of ${elements.uncertainRepairs.length}):`);
    for (const r of elements.uncertainRepairs.slice(0, 5)) {
      console.log(`    - [${r.type} c${r.confidence}] ${r.detail}`);
    }
  }
  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
