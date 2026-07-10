#!/usr/bin/env node
// Build the public GitHub Pages catalog (docs/index.html + committed thumbs in
// docs/catalog-media/) AND the machine-readable llms.txt at the repo root —
// both generated from surfaces/registry.json + surfaces/wallpapers.json +
// registry/registry.json so they can never drift from the inventory.
//
// Page shape: a home view with one tile per application, and a hash-routed
// detail view per app (#/claude, #/macos, …) showing every demo GIF, every
// component with its variant chips (dark mode, pages, beats), the full
// recommended-use text, and — for macOS — the complete 141-wallpaper browser
// (image wallpapers as committed thumbs, CSS wallpapers rendered live).
// Search works across everything from any view.
//
// Serve locally with `python3 -m http.server 4173` → http://localhost:4173/docs/
// or GitHub Pages (main branch, /docs folder) → https://conmeara.github.io/ui-backlot/
// Regenerate after registry or capture changes: npm run pages:catalog

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { escapeHtml } from "./lib/inline-media.mjs";
import { loadFamilies, familyOf, familyIconSvg, DEMO_FAMILY } from "./lib/app-families.mjs";

const repoRoot = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "registry.json"), "utf8"));
const wallpapers = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "wallpapers.json"), "utf8"));
const hfManifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "registry", "registry.json"), "utf8"));
const blockNames = new Set(hfManifest.items.filter((i) => i.type === "hyperframes:block").map((i) => i.name));
const exampleNames = hfManifest.items.filter((i) => i.type === "hyperframes:example").map((i) => i.name);
const fams = loadFamilies(repoRoot);

const thumbsDir = path.join(repoRoot, "docs", "catalog-media", "thumbs");
const wpThumbsDir = path.join(repoRoot, "docs", "catalog-media", "wallpapers");
fs.mkdirSync(thumbsDir, { recursive: true });
fs.mkdirSync(wpThumbsDir, { recursive: true });

// ImageMagick when available, macOS-builtin sips otherwise.
const hasMagick = (() => {
  try { execFileSync("magick", ["-version"], { stdio: "pipe" }); return true; } catch { return false; }
})();

function shrinkJpeg(src, out, maxWidth, quality) {
  if (hasMagick) {
    execFileSync("magick", [src, "-resize", `${maxWidth}x>`, "-strip", "-quality", String(quality), out], { stdio: "pipe" });
  } else {
    const width = Number(execFileSync("sips", ["-g", "pixelWidth", src], { stdio: "pipe" }).toString().match(/pixelWidth: (\d+)/)?.[1] || 0);
    const resize = width > maxWidth ? ["--resampleWidth", String(maxWidth)] : [];
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", String(quality), ...resize, src, "--out", out], { stdio: "pipe" });
  }
}

function thumb(s) {
  const src = s.capture?.path ? path.join(repoRoot, s.capture.path) : null;
  const out = path.join(thumbsDir, `${s.id}.jpg`);
  if (src && fs.existsSync(src)) shrinkJpeg(src, out, 560, 70);
  return fs.existsSync(out) ? `catalog-media/thumbs/${s.id}.jpg` : null;
}

function wallpaperThumb(w) {
  const src = w.thumb ? path.join(repoRoot, w.thumb) : null;
  const out = path.join(wpThumbsDir, `${w.id}.jpg`);
  if (src && fs.existsSync(src)) {
    if (!fs.existsSync(out) || fs.statSync(src).mtimeMs > fs.statSync(out).mtimeMs) shrinkJpeg(src, out, 320, 60);
  }
  return fs.existsSync(out) ? `catalog-media/wallpapers/${w.id}.jpg` : null;
}

const surfaces = registry.surfaces.filter((s) => s.status !== "deprecated");

// One card per source file; registry entries sharing a source are variants.
const bySource = new Map();
for (const s of surfaces) {
  const key = s.source || s.id;
  if (!bySource.has(key)) bySource.set(key, []);
  bySource.get(key).push(s);
}

function variantLabel(s, baseId) {
  const paren = /\(([^)]+)\)\s*$/.exec(s.title || "");
  if (paren) return paren[1];
  if (s.id === baseId) return "Default";
  const cap = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);
  if (s.id.startsWith(`${baseId}-`)) {
    return s.id.slice(baseId.length + 1).split("-").map(cap).join(" ") || "Default";
  }
  // Variant id diverges mid-name (figma-onboarding-editor vs figma-editor):
  // label with the tokens the base doesn't have.
  const baseTokens = new Set(baseId.split("-"));
  return s.id.split("-").filter((w) => !baseTokens.has(w)).map(cap).join(" ") || "Default";
}

function cleanTitle(s) {
  return (s.title || s.id).replace(/\s*\([^)]*\)\s*$/, "");
}

// ---------------------------------------------------------------------------
// Component cards (app detail view)
// ---------------------------------------------------------------------------
let cardCount = 0;
// Home-tile hero: the family's largest installable block reads as "the app";
// small parts (progress widgets, composers) don't.
const heroByFamily = new Map();
function considerHero(famKey, base, t) {
  if (!t) return;
  const area = (base.dimensions?.width || 0) * (base.dimensions?.height || 0);
  const score = area + (blockNames.has(base.id) ? 1e9 : 0);
  const cur = heroByFamily.get(famKey);
  if (!cur || score > cur.score) heroByFamily.set(famKey, { t, score });
}
function card(group, famKey) {
  group.sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id));
  const base = group[0];
  const cid = base.id;
  const variants = group
    .map((s) => ({ s, t: thumb(s), label: variantLabel(s, base.id) }))
    .filter((v) => v.t || v.s.id === base.id);
  if (!variants.length) return "";
  cardCount += 1;
  considerHero(famKey, base, variants[0].t);

  const imgs = variants
    .map((v, i) =>
      v.t
        ? `<img loading="lazy" src="${v.t}" alt="${escapeHtml(v.s.title)}" data-v="${i}"${i ? " hidden" : ""}>`
        : `<div class="thumb-empty" data-v="${i}"${i ? " hidden" : ""}>capture pending</div>`
    )
    .join("\n  ");
  const chips =
    variants.length > 1
      ? `<div class="variants">${variants
          .map((v, i) => `<button data-card="${cid}" data-v="${i}" class="vchip${i ? "" : " active"}">${escapeHtml(v.label)}</button>`)
          .join("")}</div>`
      : "";
  const dims = base.dimensions ? `${base.dimensions.width}×${base.dimensions.height}` : "";
  const baseTitle = cleanTitle(base);
  const installable = blockNames.has(base.id);
  const search = group.flatMap((s) => [s.id, s.title, ...(s.tags || [])]).join(" ").toLowerCase();
  const use = base.recommendedUse
    ? `<p class="use" title="Click to expand">${escapeHtml(base.recommendedUse)}</p>`
    : "";
  return `<figure class="card" id="${cid}" data-group="${famKey}" data-search="${escapeHtml(search)}">
  ${imgs}
  <figcaption>
    <strong>${escapeHtml(baseTitle)}</strong>
    <span class="meta">${dims}${variants.length > 1 ? ` · ${variants.length} variants` : ""}${base.tags?.includes("dark-mode-ready") ? " · dark-ready" : ""}</span>
    ${chips}
    ${use}
    ${installable ? `<button class="install" data-cmd="npx hyperframes add ${escapeHtml(base.id)}"><code>npx hyperframes add ${escapeHtml(base.id)}</code></button>` : `<span class="meta">installs as part of a composed block</span>`}
  </figcaption>
</figure>`;
}

// ---------------------------------------------------------------------------
// Demo GIFs per family
// ---------------------------------------------------------------------------
const gifs = fs.readdirSync(path.join(repoRoot, "docs", "media")).filter((f) => f.endsWith(".gif")).sort();
const demosByFamily = new Map();
for (const f of gifs) {
  const name = f.replace(/\.gif$/, "");
  const fam = DEMO_FAMILY[name] || "macos";
  if (!demosByFamily.has(fam)) demosByFamily.set(fam, []);
  demosByFamily.get(fam).push({ name, file: f });
}

// ---------------------------------------------------------------------------
// Wallpaper browser (macOS detail view)
// ---------------------------------------------------------------------------
const WP_CATEGORY_LABELS = {
  lineage: "macOS lineage",
  color: "Mac colors",
  raycast: "Raycast",
  metallic: "Metallic",
  mesh: "Mesh",
  gradient: "Gradient",
  spotlight: "Spotlight",
  pattern: "Pattern",
  solid: "Solid",
};
const wpByCategory = new Map();
for (const w of wallpapers.wallpapers) {
  if (!wpByCategory.has(w.category)) wpByCategory.set(w.category, []);
  wpByCategory.get(w.category).push(w);
}

function wallpaperTile(w) {
  const cmd = `data-wallpaper="${w.id}"`;
  const search = `${w.id} ${w.name} ${w.category} wallpaper macos desktop`.toLowerCase();
  const visual = w.type === "image"
    ? (() => { const t = wallpaperThumb(w); return t ? `<img loading="lazy" src="${t}" alt="${escapeHtml(w.name)}">` : `<span class="wp-swatch"></span>`; })()
    : `<span class="wp-swatch" style="background: ${escapeHtml(w.css)}"></span>`;
  return `<button class="wp" data-cat="${w.category}" data-search="${escapeHtml(search)}" data-cmd='${escapeHtml(cmd)}' title='Copy ${escapeHtml(cmd)}'>
  ${visual}
  <span class="wp-name">${escapeHtml(w.name)}${w.id === wallpapers.default ? " ★" : ""}</span>
</button>`;
}

function wallpaperSectionHtml() {
  const chips = [
    `<button class="chip wchip active" data-wcat="all">All <span class="count">${wallpapers.count}</span></button>`,
    ...[...wpByCategory.keys()].map((c) => `<button class="chip wchip" data-wcat="${c}">${escapeHtml(WP_CATEGORY_LABELS[c] || c)} <span class="count">${wpByCategory.get(c).length}</span></button>`),
  ].join("\n");
  const tiles = wallpapers.wallpapers.map(wallpaperTile).join("\n");
  return `<div class="wallpapers" data-search-scope>
  <h3>Wallpapers <span class="count">${wallpapers.count} in one block</span></h3>
  <p class="wp-hint"><code>npx hyperframes add ${wallpapers.surface}</code>, then set
  <code>data-wallpaper="&lt;id&gt;"</code> on the mounted block (default <code>${wallpapers.default}</code>, marked ★).
  Click any tile to copy its attribute. Photographic sets are real bundled images; the rest render as pure CSS.</p>
  <div class="chips wp-chips">${chips}</div>
  <div class="wp-grid">${tiles}</div>
</div>`;
}

// ---------------------------------------------------------------------------
// App detail sections + home tiles
// ---------------------------------------------------------------------------
const cardsByFamily = new Map();
for (const group of bySource.values()) {
  const fam = familyOf(group[0], fams);
  if (!cardsByFamily.has(fam)) cardsByFamily.set(fam, []);
  cardsByFamily.get(fam).push(group);
}

const activeFams = fams.filter((f) => (cardsByFamily.get(f.key) || []).length || (demosByFamily.get(f.key) || []).length);

const sections = activeFams
  .map((f) => {
    const groups = cardsByFamily.get(f.key) || [];
    const demos = demosByFamily.get(f.key) || [];
    const demoCards = demos
      .map(
        (d) => `<figure class="card demo" data-group="${f.key}" data-search="${escapeHtml(d.name)} demo interaction">
  <img loading="lazy" src="media/${d.file}" alt="${escapeHtml(d.name)} demo">
  <figcaption><strong>${escapeHtml(d.name.replace(/-/g, " "))}</strong><span class="meta">scripted interaction · rendered, not recorded · <code>examples/${escapeHtml(d.name)}.html</code></span></figcaption>
</figure>`
      )
      .join("\n");
    const wp = f.key === "macos" ? wallpaperSectionHtml() : "";
    const counts = [`${groups.length} component${groups.length === 1 ? "" : "s"}`];
    if (demos.length) counts.push(`${demos.length} demo${demos.length === 1 ? "" : "s"}`);
    if (f.key === "macos") counts.push(`${wallpapers.count} wallpapers`);
    return `<section class="app" id="${f.key}" data-family="${f.key}" style="--fam: ${f.color}" hidden>
  <h2>${familyIconSvg(f, 24)} ${f.label} <span class="count">${counts.join(" · ")}</span></h2>
  <div class="grid">${demoCards}${groups.map((g) => card(g, f.key)).join("\n")}</div>
  ${wp}
</section>`;
  })
  .join("\n");

const homeTiles = activeFams
  .map((f) => {
    const groups = (cardsByFamily.get(f.key) || []).length;
    const demos = (demosByFamily.get(f.key) || []).length;
    const bits = [`${groups} component${groups === 1 ? "" : "s"}`];
    if (demos) bits.push(`${demos} demo${demos === 1 ? "" : "s"}`);
    if (f.key === "macos") bits.push(`${wallpapers.count} wallpapers`);
    const hero = heroByFamily.get(f.key)?.t;
    const visual = hero
      ? `<img loading="lazy" src="${hero}" alt="${escapeHtml(f.label)} surface">`
      : `<div class="thumb-empty">capture pending</div>`;
    return `<a class="tile" href="#/${f.key}" style="--fam: ${f.color}">
  ${visual}
  <div class="tile-cap">
    <span class="tile-head">${familyIconSvg(f, 18)} <strong>${escapeHtml(f.label)}</strong></span>
    <span class="meta">${bits.join(" · ")}</span>
  </div>
</a>`;
  })
  .join("\n");

const famKeysJson = JSON.stringify(activeFams.map((f) => f.key));
const appCount = activeFams.length;

const navChips = [
  `<a class="chip home-chip" href="#/">← All apps</a>`,
  ...activeFams.map(
    (f) => `<a class="chip app-chip" data-app="${f.key}" href="#/${f.key}" style="--fam: ${f.color}">${familyIconSvg(f, 15)} ${f.label}</a>`
  ),
].join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UI Backlot — surface catalog</title>
<meta name="description" content="Editable software sets for demo videos: high-fidelity HTML recreations of real app UIs, rendered with HyperFrames. Browse by application — every component, variant, dark mode, and wallpaper.">
<style>
:root {
  --paper: #f8f8f6; --ink: #0b0b0b; --muted: #6d6a64; --line: rgba(11,11,11,.12);
  --card: #ffffff; --accent: #e08a62; --accent-ink: #7c3f22; --code-bg: rgba(11,11,11,.06);
}
@media (prefers-color-scheme: dark) {
  :root { --paper: #161513; --ink: #eceae6; --muted: #9b978f; --line: rgba(236,234,230,.14); --card: #201f1c; --accent: #e08a62; --accent-ink: #f0b394; --code-bg: rgba(236,234,230,.09); }
}
:root[data-theme="dark"] { --paper: #161513; --ink: #eceae6; --muted: #9b978f; --line: rgba(236,234,230,.14); --card: #201f1c; --accent: #e08a62; --accent-ink: #f0b394; --code-bg: rgba(236,234,230,.09); }
:root[data-theme="light"] { --paper: #f8f8f6; --ink: #0b0b0b; --muted: #6d6a64; --line: rgba(11,11,11,.12); --card: #ffffff; --accent: #e08a62; --accent-ink: #7c3f22; --code-bg: rgba(11,11,11,.06); }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.55 -apple-system, "SF Pro Text", "Segoe UI", sans-serif; }
header { max-width: 1200px; margin: 0 auto; padding: 44px 28px 22px; }
.masthead { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin: 0 0 14px; }
.eyebrow { font: 600 11.5px/1 -apple-system, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-ink); }
.gh-link { font-size: 13.5px; color: var(--muted); text-decoration: none; }
.gh-link:hover { color: var(--accent-ink); }
h1 { font: 640 clamp(34px, 6vw, 56px)/1.05 ui-serif, Georgia, "Times New Roman", serif; letter-spacing: -0.015em; margin: 0 0 12px; text-wrap: balance; }
h1 .dot { color: var(--accent); }
.lede { max-width: 60ch; font-size: 17px; color: var(--muted); margin: 0 0 20px; }
.lede strong { color: var(--ink); font-weight: 600; }
.hero-install { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; max-width: 100%; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; cursor: copy; color: var(--ink); font: inherit; text-align: left; }
.hero-install code { font: 13px/1.4 "SF Mono", ui-monospace, Menlo, monospace; background: none; padding: 0; word-break: break-all; }
.hero-install .hint { font-size: 11.5px; color: var(--muted); white-space: nowrap; }
.hero-install:hover { border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); }
.hero-install.copied { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.hero-stats { color: var(--muted); font-size: 13px; margin: 14px 0 0; }
.hero-stats code { font: 12px/1.4 "SF Mono", ui-monospace, Menlo, monospace; background: var(--code-bg); padding: 1px 5px; border-radius: 4px; }
nav { position: sticky; top: 0; z-index: 5; background: color-mix(in srgb, var(--paper) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.chips { max-width: 1200px; margin: 0 auto; padding: 12px 28px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.chip { display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 5px 14px; font-size: 13.5px; cursor: pointer; text-decoration: none; font-family: inherit; }
.chip svg { color: var(--fam, var(--muted)); flex: 0 0 auto; }
.chip .count { font-size: 11.5px; color: var(--muted); }
.chip:hover { border-color: color-mix(in srgb, var(--fam, var(--accent)) 55%, var(--line)); }
.chip.active { border-color: var(--fam, var(--accent)); box-shadow: inset 0 0 0 1px var(--fam, var(--accent)); }
body[data-view="home"] .home-chip, body[data-view="home"] .app-chip { display: none; }
body[data-view="home"] nav { border-bottom: none; }
/* compact header off the home view so app content starts above the fold */
body:not([data-view="home"]) header { padding: 20px 28px 14px; }
body:not([data-view="home"]) .lede, body:not([data-view="home"]) .hero-install, body:not([data-view="home"]) .hero-stats { display: none; }
body:not([data-view="home"]) h1 { font-size: clamp(26px, 4vw, 34px); margin-bottom: 0; }
#search { margin-left: auto; border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 6px 14px; font-size: 13.5px; min-width: 180px; }
main { max-width: 1200px; margin: 0 auto; padding: 8px 28px 90px; }
h2 { display: flex; align-items: center; gap: 10px; font: 620 26px/1.2 ui-serif, Georgia, serif; margin: 30px 0 16px; }
h2 svg { color: var(--fam, var(--accent)); }
h3 { display: flex; align-items: baseline; gap: 10px; font: 620 20px/1.2 ui-serif, Georgia, serif; margin: 40px 0 6px; }
.count { color: var(--muted); font: 500 13px/1 -apple-system, sans-serif; }
/* home tiles */
#home { display: none; }
body[data-view="home"] #home { display: block; }
.tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-top: 14px; }
.tile { display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; text-decoration: none; color: var(--ink); }
.tile img { width: 100%; aspect-ratio: 8 / 5; object-fit: cover; object-position: top; display: block; border-bottom: 1px solid var(--line); background: #dcdcd8; }
.tile:hover { border-color: color-mix(in srgb, var(--fam, var(--accent)) 60%, var(--line)); }
.tile-cap { display: flex; flex-direction: column; gap: 3px; padding: 11px 14px 13px; }
.tile-head { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; }
.tile-head svg { color: var(--fam, var(--muted)); }
/* app sections */
body[data-view="home"] main section.app { display: none; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.card { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
.card img { width: 100%; display: block; border-bottom: 1px solid var(--line); background: #dcdcd8; }
.card.demo { outline: 1px solid color-mix(in srgb, var(--fam, var(--accent)) 40%, transparent); outline-offset: -1px; }
.thumb-empty { display: grid; place-items: center; min-height: 150px; color: var(--muted); font-size: 13px; border-bottom: 1px solid var(--line); }
figcaption { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px 14px; font-size: 14px; }
.meta { color: var(--muted); font-size: 12.5px; }
.meta code, .install code, .wp-hint code { font: 12px/1.4 "SF Mono", ui-monospace, Menlo, monospace; background: var(--code-bg); padding: 1px 5px; border-radius: 4px; }
.use { margin: 0; color: var(--muted); font-size: 12.5px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; cursor: pointer; }
.use.open { display: block; -webkit-line-clamp: unset; }
.variants { display: flex; gap: 5px; flex-wrap: wrap; }
.vchip { font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); cursor: pointer; }
.vchip.active { border-color: var(--fam, var(--accent)); color: var(--ink); }
.install { text-align: left; border: none; background: none; padding: 0; cursor: copy; }
.install:hover code { background: color-mix(in srgb, var(--accent) 22%, transparent); }
.install.copied code { background: color-mix(in srgb, var(--accent) 38%, transparent); }
.install:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
/* wallpapers */
.wp-hint { color: var(--muted); font-size: 13.5px; max-width: 76ch; margin: 4px 0 12px; }
.wp-chips { padding: 0 0 14px; }
.wp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.wp { margin: 0; padding: 0; border: 1px solid var(--line); background: var(--card); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; cursor: copy; font: inherit; color: var(--ink); text-align: left; }
.wp img, .wp .wp-swatch { width: 100%; aspect-ratio: 8 / 5; object-fit: cover; display: block; background: #dcdcd8; }
.wp .wp-name { padding: 6px 9px 7px; font-size: 12px; color: var(--muted); }
.wp:hover { border-color: color-mix(in srgb, var(--fam, var(--accent)) 60%, var(--line)); }
.wp.copied { border-color: var(--fam, var(--accent)); box-shadow: inset 0 0 0 1px var(--fam, var(--accent)); }
footer { border-top: 1px solid var(--line); color: var(--muted); font-size: 13.5px; }
footer .inner { max-width: 1200px; margin: 0 auto; padding: 22px 28px; display: flex; gap: 18px; flex-wrap: wrap; }
a { color: var(--accent-ink); }
@media (prefers-reduced-motion: no-preference) {
  .card, .tile { transition: transform .15s ease; }
  .card:hover, .tile:hover { transform: translateY(-2px); }
}
</style>
</head>
<body data-view="home">
<header>
  <div class="masthead">
    <span class="eyebrow">Open-source HyperFrames registry</span>
    <a class="gh-link" href="https://github.com/conmeara/ui-backlot">github.com/conmeara/ui-backlot ↗</a>
  </div>
  <h1>UI Backlot<span class="dot">.</span></h1>
  <p class="lede"><strong>Editable software sets for demo videos.</strong> High-fidelity HTML
  recreations of real apps — scriptable, themeable, and rendered with HyperFrames instead of
  screen-recorded. Open an application to see every component, variant, dark mode, and wallpaper,
  then click an install command to copy it.</p>
  <button class="hero-install" data-cmd='"registry": "https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry"'><code>"registry": "https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry"</code><span class="hint">copy → hyperframes.json</span></button>
  <p class="hero-stats">${cardCount} components · ${gifs.length} scripted demos · ${wallpapers.count} wallpapers · ${appCount} applications — starter scenes: <code>npx degit conmeara/ui-backlot/registry/examples/&lt;name&gt; my-video</code></p>
</header>
<nav><div class="chips">
${navChips}
<input id="search" type="search" placeholder="Search everything…" aria-label="Search surfaces, demos, and wallpapers">
</div></nav>
<main>
<div id="home"><div class="tiles">
${homeTiles}
</div></div>
${sections}
</main>
<footer><div class="inner">
  <a href="https://github.com/conmeara/ui-backlot">GitHub</a>
  <a href="https://github.com/conmeara/ui-backlot/blob/main/llms.txt">llms.txt (for agents)</a>
  <a href="https://github.com/conmeara/ui-backlot/blob/main/CONTRIBUTING.md">Contribute a surface</a>
  <span>Recreations are fair use; all marks belong to their owners.</span>
</div></footer>
<script>
const FAMS = ${famKeysJson};
const sections = [...document.querySelectorAll("main section.app")];
const searchables = [...document.querySelectorAll("[data-search]")];
const search = document.getElementById("search");

function route() {
  const key = location.hash.replace(/^#\\/?/, "");
  const app = FAMS.includes(key) ? key : null;
  document.body.dataset.view = app ? "app" : "home";
  sections.forEach((s) => { s.hidden = s.dataset.family !== app; });
  searchables.forEach((el) => { el.style.display = ""; });
  document.querySelectorAll(".app-chip").forEach((c) => c.classList.toggle("active", c.dataset.app === app));
  if (app) applyWpFilter();
  window.scrollTo(0, 0);
}

function applySearch() {
  const q = search.value.trim().toLowerCase();
  if (!q) { route(); return; }
  document.body.dataset.view = "search";
  sections.forEach((s) => {
    let any = false;
    s.querySelectorAll("[data-search]").forEach((el) => {
      const hit = el.dataset.search.includes(q);
      el.style.display = hit ? "" : "none";
      if (hit) any = true;
    });
    s.hidden = !any;
  });
}

function applyWpFilter() {
  const active = document.querySelector(".wchip.active");
  if (!active) return;
  const cat = active.dataset.wcat;
  document.querySelectorAll(".wp").forEach((t) => { t.style.display = cat === "all" || t.dataset.cat === cat ? "" : "none"; });
}

window.addEventListener("hashchange", route);
search.addEventListener("input", applySearch);
document.querySelectorAll(".wchip").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".wchip").forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  applyWpFilter();
}));
document.querySelectorAll(".vchip").forEach((b) => b.addEventListener("click", () => {
  const card = document.getElementById(b.dataset.card);
  card.querySelectorAll("img[data-v], .thumb-empty[data-v]").forEach((el) => { el.hidden = el.dataset.v !== b.dataset.v; });
  card.querySelectorAll(".vchip").forEach((x) => x.classList.toggle("active", x === b));
}));
document.querySelectorAll(".use").forEach((p) => p.addEventListener("click", () => p.classList.toggle("open")));
document.querySelectorAll(".install, .hero-install, .wp").forEach((b) => b.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(b.dataset.cmd); b.classList.add("copied"); setTimeout(() => b.classList.remove("copied"), 900); } catch {}
}));
route();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(repoRoot, "docs", "index.html"), html);

// ---------------------------------------------------------------------------
// llms.txt — the complete machine-readable inventory, same source of truth.
// ---------------------------------------------------------------------------
function llmsTxt() {
  const lines = [];
  lines.push("# UI Backlot");
  lines.push("");
  lines.push("> Editable, high-fidelity recreations of real app UIs (Claude, Codex, macOS,");
  lines.push("> Office, Figma, Premiere, browsers) for rendering scripted product-demo");
  lines.push("> videos with HyperFrames — no screen recording.");
  lines.push("");
  lines.push("## Use the surfaces in your own HyperFrames project");
  lines.push("");
  lines.push("1. In your project's `hyperframes.json`, set:");
  lines.push('   `"registry": "https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry"`');
  lines.push("2. Install a surface and its dependencies (fonts, foundation CSS, runtime, composed parts install transitively):");
  lines.push("   `npx hyperframes add <name>` — e.g. `npx hyperframes add excel-workbook`");
  lines.push("3. Compose scenes yourself by stacking blocks — e.g. a \"Claude working in Excel on a Mac\"");
  lines.push("   scene = `mac-menu-bar` + `mac-dock` + `excel-workbook` + `claude-chat-pane`, each mounted");
  lines.push("   in your host composition (see the mac-multi-app example for the pattern).");
  lines.push("4. Paste the printed snippets into your host composition, give each pasted host `<div>` a");
  lines.push("   unique `data-composition-id`, and render: `npx hyperframes render --quality draft`");
  lines.push("");
  lines.push("Complete starter scenes (scaffold with degit; the CLI's `init --example` only reads the official registry):");
  lines.push("`npx degit conmeara/ui-backlot/registry/examples/mac-multi-app my-video && cd my-video && npx hyperframes render --composition index.html --quality draft`");
  if (exampleNames.length) lines.push(`Available examples: ${exampleNames.join(", ")}.`);
  lines.push("");
  lines.push("Dark variants: blocks tagged `dark-mode-ready` support `class=\"theme-dark\"` on the composition root.");
  lines.push("");
  lines.push("## Full inventory by application");
  lines.push("");
  lines.push("Every installable block, its size, its variants, and how to parameterize it.");
  lines.push("Entries marked (part) are internal components that install transitively with their parent block.");
  lines.push("");
  for (const f of activeFams) {
    const groups = cardsByFamily.get(f.key) || [];
    const demos = demosByFamily.get(f.key) || [];
    const bits = [`${groups.length} block${groups.length === 1 ? "" : "s"}`];
    if (demos.length) bits.push(`${demos.length} scripted demo${demos.length === 1 ? "" : "s"}`);
    if (f.key === "macos") bits.push(`${wallpapers.count} wallpapers`);
    lines.push(`### ${f.label} (${bits.join(", ")})`);
    lines.push("");
    for (const group of groups) {
      group.sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id));
      const base = group[0];
      const dims = base.dimensions ? `${base.dimensions.width}×${base.dimensions.height}` : "";
      const partNote = blockNames.has(base.id) ? "" : " (part)";
      const head = [`- \`${base.id}\`${partNote} — ${cleanTitle(base)}`, dims].filter(Boolean).join(", ");
      lines.push(head + (base.recommendedUse ? `. ${base.recommendedUse}` : ""));
      if (group.length > 1) {
        lines.push(`  Registry variants: ${group.map((s) => `\`${s.id}\` (${variantLabel(s, base.id)})`).join(", ")}.`);
      }
    }
    if (demos.length) {
      lines.push(`  Scripted demos (compositions under \`examples/\`): ${demos.map((d) => `\`${d.name}\``).join(", ")}.`);
    }
    if (f.key === "macos") {
      lines.push("");
      lines.push(`#### Wallpapers (\`${wallpapers.surface}\` block — set \`data-wallpaper="<id>"\`, default \`${wallpapers.default}\`)`);
      for (const [cat, ws] of wpByCategory) {
        lines.push(`- ${WP_CATEGORY_LABELS[cat] || cat} (${ws.length}): ${ws.map((w) => w.id).join(", ")}`);
      }
    }
    lines.push("");
  }
  lines.push("## Key files");
  lines.push("");
  lines.push("- registry/registry.json — machine-readable item index (blocks, components, examples)");
  lines.push("- surfaces/registry.json — full surface inventory with provenance and capture metadata");
  lines.push("- surfaces/wallpapers.json — full wallpaper inventory (ids, categories, provenance)");
  lines.push("- docs/catalog.md — human-readable surface catalog");
  lines.push("- https://conmeara.github.io/ui-backlot/ — browsable catalog (this file's visual twin)");
  lines.push("- AGENTS.md / CLAUDE.md — how agents work inside this repo");
  lines.push("- runtime/backlot-interactions.js — scriptable UI actions (typing, clicking, streaming) for demo timelines");
  lines.push("");
  return lines.join("\n");
}

fs.writeFileSync(path.join(repoRoot, "llms.txt"), llmsTxt());

const thumbCount = fs.readdirSync(thumbsDir).length;
const wpThumbCount = fs.readdirSync(wpThumbsDir).length;
console.log(`pages catalog: docs/index.html (${cardCount} component cards, ${gifs.length} demos, ${appCount} apps, ${wallpapers.count} wallpapers; ${thumbCount} surface thumbs + ${wpThumbCount} wallpaper thumbs in docs/catalog-media/)`);
console.log("llms.txt: regenerated from surfaces/registry.json + surfaces/wallpapers.json");
