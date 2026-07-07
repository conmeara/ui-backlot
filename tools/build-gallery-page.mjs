#!/usr/bin/env node
// Build workspace/gallery.html — a self-contained catalog gallery: every
// registry surface with its capture thumbnail, plus the interaction demos with
// their GIFs. Media is inlined as data URIs so the page can be served from
// workspace/ or published as a Claude Code Artifact.

import fs from "node:fs";
import path from "node:path";
import { inlineImage, inlineGif, escapeHtml, PAGE_CSS } from "./lib/inline-media.mjs";

const repoRoot = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "registry.json"), "utf8"));

// Same grouping as tools/generate-public-catalog.mjs — keep in sync.
const groups = [
  { title: "Workflows (start here)", match: (s) => s.kind === "workflow" },
  { title: "Claude And Chat", match: (s) => s.tags?.includes("claude") && s.kind === "component" },
  { title: "Desktop And Browser", match: (s) => ["macos", "mac", "finder", "browser", "web-app", "calendar"].some((t) => s.tags?.includes(t)) },
  { title: "Productivity And Creative Apps", match: (s) => ["powerpoint", "presentation", "word", "excel", "figma", "premiere", "office", "spreadsheet", "document", "video"].some((t) => s.tags?.includes(t)) },
  { title: "Codex And Terminal", match: (s) => ["codex", "terminal", "cli", "developer-workflow"].some((t) => s.tags?.includes(t)) },
];

const seen = new Set();
function card(s) {
  const abs = s.capture?.path ? path.join(repoRoot, s.capture.path) : null;
  const img = abs && fs.existsSync(abs) ? inlineImage(abs, { maxWidth: 420, quality: 68 }) : null;
  const thumb = img
    ? `<img src="${img}" alt="${escapeHtml(s.title)}">`
    : `<div class="nocap muted">no capture on disk<br><code>npm run ${escapeHtml(s.capture?.script || "capture:…")}</code></div>`;
  const dims = s.dimensions ? `${s.dimensions.width}×${s.dimensions.height}` : "";
  return `<div class="card${s.status === "deprecated" ? " deprecated" : ""}">
    ${thumb}
    <div class="meta">
      <b>${escapeHtml(s.title)}</b>
      <span><code>${escapeHtml(s.id)}</code> · ${escapeHtml(s.kind)}${dims ? " · " + dims : ""}${s.status === "deprecated" ? " · <em>deprecated</em>" : ""}</span>
      <span class="muted">${(s.tags || []).slice(0, 5).map(escapeHtml).join(" · ")}</span>
    </div>
  </div>`;
}

const sections = groups.map((g) => {
  const members = registry.surfaces.filter((s) => !seen.has(s.id) && g.match(s));
  members.forEach((s) => seen.add(s.id));
  if (!members.length) return "";
  return `<h2>${g.title}</h2><div class="grid">${members.map(card).join("\n")}</div>`;
}).join("\n");
const rest = registry.surfaces.filter((s) => !seen.has(s.id));
const restHtml = rest.length ? `<h2>Other</h2><div class="grid">${rest.map(card).join("\n")}</div>` : "";

const mediaDir = path.join(repoRoot, "docs", "media");
const gifs = fs.existsSync(mediaDir) ? fs.readdirSync(mediaDir).filter((f) => f.endsWith(".gif")).sort() : [];
const demoCards = gifs.map((f) => {
  const uri = inlineGif(path.join(mediaDir, f), { maxWidth: 420, fps: 10 });
  if (!uri) return "";
  const name = f.replace(/\.gif$/, "");
  return `<div class="card"><img src="${uri}" alt="${escapeHtml(name)}"><div class="meta"><b>${escapeHtml(name)}</b><span class="muted"><code>examples/${escapeHtml(name)}.html</code> · full-res: <code>docs/media/${escapeHtml(f)}</code></span></div></div>`;
}).join("\n");

const built = new Date().toISOString().slice(0, 16).replace("T", " ");
const html = `<!doctype html>
<meta charset="utf-8">
<title>UI Backlot — surface gallery</title>
<style>${PAGE_CSS}
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
  .card img { width: 100%; display: block; background: #ddd; }
  .card .meta { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px 12px; font-size: 13px; }
  .card.deprecated { opacity: .5; }
  .nocap { display: grid; place-items: center; text-align: center; min-height: 140px; font-size: 12px; line-height: 1.8; }
</style>
<h1>Surface Gallery</h1>
<p class="sub">Built ${built} · ${registry.surfaces.length} registry surfaces + ${gifs.length} interaction demos · thumbnails from <code>captures/</code> (run capture scripts to fill gaps) · rebuild: <code>npm run gallery:page</code></p>
${sections}
${restHtml}
<h2>Interaction demos</h2>
<div class="grid">${demoCards}</div>
`;

const out = path.join(repoRoot, "workspace", "gallery.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
// Artifact variant: the Claude Code Artifact harness wraps the file in its own
// doctype/head/body skeleton, so it must not carry a doctype of its own.
fs.writeFileSync(out.replace(/\.html$/, ".artifact.html"), html.replace(/^<!doctype html>\n/, ""));
console.log(`gallery page: ${out} (+ .artifact.html) (${registry.surfaces.length} surfaces, ${gifs.length} demos, ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB)`);
