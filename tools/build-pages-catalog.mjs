#!/usr/bin/env node
// Build the public GitHub Pages catalog: docs/index.html + committed
// thumbnails in docs/catalog-media/thumbs/. Serve locally with
// `python3 -m http.server 4173` → http://localhost:4173/docs/, or enable
// GitHub Pages (main branch, /docs folder) → https://conmeara.github.io/ui-backlot/
//
// Unlike the workspace review pages (data-URI, disposable), this page ships in
// git: thumbnails are small stripped JPEGs referenced relatively, and demo GIFs
// come from the already-tracked docs/media/. Regenerate after registry or
// capture changes: npm run pages:catalog

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { escapeHtml } from "./lib/inline-media.mjs";

const repoRoot = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "registry.json"), "utf8"));
const hfManifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "registry", "registry.json"), "utf8"));
const blockNames = new Set(hfManifest.items.filter((i) => i.type === "hyperframes:block").map((i) => i.name));

const thumbsDir = path.join(repoRoot, "docs", "catalog-media", "thumbs");
fs.mkdirSync(thumbsDir, { recursive: true });

function thumb(s) {
  const src = s.capture?.path ? path.join(repoRoot, s.capture.path) : null;
  const out = path.join(thumbsDir, `${s.id}.jpg`);
  if (src && fs.existsSync(src)) {
    execFileSync("magick", [src, "-resize", "560x>", "-strip", "-quality", "70", out], { stdio: "pipe" });
  }
  return fs.existsSync(out) ? `catalog-media/thumbs/${s.id}.jpg` : null;
}

// Same grouping as tools/generate-public-catalog.mjs — keep in sync.
const groups = [
  { key: "workflows", title: "Workflows", blurb: "Multi-surface scenes — the fastest path to a video.", match: (s) => s.kind === "workflow" },
  { key: "claude", title: "Claude & Chat", blurb: "Assistant shells, chat panes, composers, progress rails.", match: (s) => s.tags?.includes("claude") && s.kind === "component" },
  { key: "desktop", title: "Desktop & Browser", blurb: "macOS chrome and browser context around a demo.", match: (s) => ["macos", "mac", "finder", "browser", "web-app", "calendar"].some((t) => s.tags?.includes(t)) },
  { key: "apps", title: "Productivity & Creative Apps", blurb: "Office, design, and editing surfaces.", match: (s) => ["powerpoint", "presentation", "word", "excel", "figma", "premiere", "office", "spreadsheet", "document", "video"].some((t) => s.tags?.includes(t)) },
  { key: "terminal", title: "Codex & Terminal", blurb: "Agent coding, terminal, and review surfaces.", match: (s) => ["codex", "terminal", "cli", "developer-workflow"].some((t) => s.tags?.includes(t)) },
];

const seen = new Set();
let cardCount = 0;
function card(s, groupKey) {
  const t = thumb(s);
  const dims = s.dimensions ? `${s.dimensions.width}×${s.dimensions.height}` : "";
  const dark = s.tags?.includes("dark-mode-ready") || fs.existsSync(path.join(repoRoot, "registry", "blocks", s.id));
  const installable = blockNames.has(s.id);
  cardCount += 1;
  return `<figure class="card" data-group="${groupKey}" data-search="${escapeHtml([s.id, s.title, ...(s.tags || [])].join(" ").toLowerCase())}">
  ${t ? `<img loading="lazy" src="${t}" alt="${escapeHtml(s.title)}">` : `<div class="thumb-empty">capture pending</div>`}
  <figcaption>
    <strong>${escapeHtml(s.title)}</strong>
    <span class="meta">${escapeHtml(s.kind)}${dims ? ` · ${dims}` : ""}${s.tags?.includes("dark-mode-ready") ? " · dark-ready" : ""}</span>
    ${installable ? `<button class="install" data-cmd="npx hyperframes add ${escapeHtml(s.id)}"><code>npx hyperframes add ${escapeHtml(s.id)}</code></button>` : `<span class="meta">part of <code>${escapeHtml(s.id)}</code></span>`}
  </figcaption>
</figure>`;
}

const sections = groups.map((g) => {
  const members = registry.surfaces.filter((s) => s.status !== "deprecated" && !seen.has(s.id) && g.match(s));
  members.forEach((s) => seen.add(s.id));
  if (!members.length) return "";
  return `<section id="${g.key}">
  <h2>${g.title} <span class="count">${members.length}</span></h2>
  <p class="blurb">${g.blurb}</p>
  <div class="grid">${members.map((s) => card(s, g.key)).join("\n")}</div>
</section>`;
}).join("\n");

const gifs = fs.readdirSync(path.join(repoRoot, "docs", "media")).filter((f) => f.endsWith(".gif")).sort();
const demoCards = gifs.map((f) => {
  const name = f.replace(/\.gif$/, "");
  return `<figure class="card" data-group="demos" data-search="${escapeHtml(name)}">
  <img loading="lazy" src="media/${f}" alt="${escapeHtml(name)} demo">
  <figcaption><strong>${escapeHtml(name)}</strong><span class="meta">scripted interaction · rendered, not recorded</span></figcaption>
</figure>`;
}).join("\n");

const filters = [{ key: "all", title: "All" }, ...groups, { key: "demos", title: "Interaction demos" }]
  .map((g, i) => `<button class="chip${i === 0 ? " active" : ""}" data-filter="${g.key}">${g.title}</button>`).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UI Backlot — surface catalog</title>
<meta name="description" content="Editable, high-fidelity recreations of real app UIs for HyperFrames demo videos. Browse and install every surface.">
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
header { max-width: 1200px; margin: 0 auto; padding: 56px 28px 8px; }
h1 { font: 640 clamp(30px, 5vw, 44px)/1.1 ui-serif, Georgia, "Times New Roman", serif; letter-spacing: -0.015em; margin: 0 0 10px; text-wrap: balance; }
h1 .dot { color: var(--accent); }
.lede { max-width: 62ch; color: var(--muted); margin: 0 0 18px; }
.hero-install { display: inline-flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; }
.hero-install code { font: 13px/1.4 "SF Mono", ui-monospace, Menlo, monospace; }
nav { position: sticky; top: 0; z-index: 5; background: color-mix(in srgb, var(--paper) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.chips { max-width: 1200px; margin: 0 auto; padding: 12px 28px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.chip { border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 5px 14px; font-size: 13.5px; cursor: pointer; }
.chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
#search { margin-left: auto; border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 6px 14px; font-size: 13.5px; min-width: 180px; }
main { max-width: 1200px; margin: 0 auto; padding: 8px 28px 90px; }
h2 { font: 620 22px/1.2 ui-serif, Georgia, serif; margin: 44px 0 4px; }
.count { color: var(--muted); font: 500 13px/1 -apple-system, sans-serif; vertical-align: 3px; }
.blurb { color: var(--muted); font-size: 14px; margin: 0 0 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.card { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
.card img { width: 100%; display: block; border-bottom: 1px solid var(--line); background: #dcdcd8; }
.thumb-empty { display: grid; place-items: center; min-height: 150px; color: var(--muted); font-size: 13px; border-bottom: 1px solid var(--line); }
figcaption { display: flex; flex-direction: column; gap: 5px; padding: 12px 14px 14px; font-size: 14px; }
.meta { color: var(--muted); font-size: 12.5px; }
.meta code, .install code { font: 12px/1.4 "SF Mono", ui-monospace, Menlo, monospace; background: var(--code-bg); padding: 1px 5px; border-radius: 4px; }
.install { text-align: left; border: none; background: none; padding: 0; cursor: copy; }
.install:hover code { background: color-mix(in srgb, var(--accent) 22%, transparent); }
.install.copied code { background: color-mix(in srgb, var(--accent) 38%, transparent); }
.install:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
footer { border-top: 1px solid var(--line); color: var(--muted); font-size: 13.5px; }
footer .inner { max-width: 1200px; margin: 0 auto; padding: 22px 28px; display: flex; gap: 18px; flex-wrap: wrap; }
a { color: var(--accent-ink); }
@media (prefers-reduced-motion: no-preference) { .card { transition: transform .15s ease; } .card:hover { transform: translateY(-2px); } }
</style>
</head>
<body>
<header>
  <h1>UI Backlot<span class="dot">.</span> Editable software sets for demo videos.</h1>
  <p class="lede">Every surface below is a hand-built, high-fidelity HTML recreation of a real app —
  scriptable, themeable, and renderable with HyperFrames. No screen recording. Click any install
  command to copy it; point your <code>hyperframes.json</code> at
  <a href="https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry/registry.json">this registry</a> first.</p>
  <div class="hero-install"><code>"registry": "https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry"</code></div>
</header>
<nav><div class="chips">
${filters}
<input id="search" type="search" placeholder="Filter surfaces…" aria-label="Filter surfaces">
</div></nav>
<main>
${sections}
<section id="demos">
  <h2>Interaction demos <span class="count">${gifs.length}</span></h2>
  <p class="blurb">Scripted with <code>backlot-interactions.js</code> — typing, cursor moves, streaming replies, rendered frame by frame. Install as starter projects: <code>npx degit conmeara/ui-backlot/registry/examples/&lt;name&gt; my-video</code></p>
  <div class="grid">${demoCards}</div>
</section>
</main>
<footer><div class="inner">
  <a href="https://github.com/conmeara/ui-backlot">GitHub</a>
  <a href="https://github.com/conmeara/ui-backlot/blob/main/llms.txt">llms.txt (for agents)</a>
  <a href="https://github.com/conmeara/ui-backlot/blob/main/CONTRIBUTING.md">Contribute a surface</a>
  <span>Recreations are fair use; all marks belong to their owners.</span>
</div></footer>
<script>
const chips = [...document.querySelectorAll(".chip")], cards = [...document.querySelectorAll(".card")], sections = [...document.querySelectorAll("main section")];
const search = document.getElementById("search");
function apply() {
  const active = document.querySelector(".chip.active").dataset.filter, q = search.value.trim().toLowerCase();
  cards.forEach((c) => { c.style.display = (active === "all" || c.dataset.group === active) && (!q || c.dataset.search.includes(q)) ? "" : "none"; });
  sections.forEach((s) => { s.style.display = [...s.querySelectorAll(".card")].some((c) => c.style.display !== "none") ? "" : "none"; });
}
chips.forEach((ch) => ch.addEventListener("click", () => { chips.forEach((c) => c.classList.remove("active")); ch.classList.add("active"); apply(); }));
search.addEventListener("input", apply);
document.querySelectorAll(".install").forEach((b) => b.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(b.dataset.cmd); b.classList.add("copied"); setTimeout(() => b.classList.remove("copied"), 900); } catch {}
}));
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(repoRoot, "docs", "index.html"), html);
const thumbCount = fs.readdirSync(thumbsDir).length;
console.log(`pages catalog: docs/index.html (${cardCount} surface cards, ${gifs.length} demos, ${thumbCount} thumbs in docs/catalog-media/thumbs/)`);
