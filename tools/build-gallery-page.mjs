#!/usr/bin/env node
// Build workspace/gallery.html — a self-contained catalog gallery organized by
// application: a sticky row of real app icons filters to one family; each
// family section shows its interaction demo GIFs and one card per component,
// with variant chips (dark mode, pages, beats) that swap the capture in place.
// Deprecated registry entries are excluded. Media is inlined as data URIs so
// the page can be served from workspace/ or published as a Claude Code
// Artifact.

import fs from "node:fs";
import path from "node:path";
import { inlineImage, inlineGif, escapeHtml, PAGE_CSS } from "./lib/inline-media.mjs";
import { loadFamilies, familyOf, familyIconSvg, familyNavHtml, FAMILY_NAV_CSS, FAMILY_NAV_JS, DEMO_FAMILY } from "./lib/app-families.mjs";

const repoRoot = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "registry.json"), "utf8"));
const fams = loadFamilies(repoRoot);

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
  return s.id.slice(baseId.length).replace(/^-/, "").split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ") || "Default";
}

let cardSeq = 0;
function card(group) {
  group.sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id));
  const base = group[0];
  const cid = `c${cardSeq++}`;
  const variants = group
    .map((s) => {
      const abs = s.capture?.path ? path.join(repoRoot, s.capture.path) : null;
      const img = abs && fs.existsSync(abs) ? inlineImage(abs, { maxWidth: 460, quality: 68 }) : null;
      return { s, img, label: variantLabel(s, base.id) };
    })
    .filter((v) => v.img || v.s.id === base.id);
  if (!variants.length) return "";

  const imgs = variants
    .map((v, i) =>
      v.img
        ? `<img src="${v.img}" alt="${escapeHtml(v.s.title)}" data-v="${i}"${i ? ' hidden' : ""} tabindex="0" data-lightbox>`
        : `<div class="nocap muted" data-v="${i}"${i ? " hidden" : ""}>no capture on disk<br><code>npm run ${escapeHtml(v.s.capture?.script || "capture:…")}</code></div>`
    )
    .join("\n");
  const chips =
    variants.length > 1
      ? `<div class="variants">${variants
          .map((v, i) => `<button data-card="${cid}" data-v="${i}" class="vchip${i ? "" : " active"}">${escapeHtml(v.label)}</button>`)
          .join("")}</div>`
      : "";
  const dims = base.dimensions ? `${base.dimensions.width}×${base.dimensions.height}` : "";
  const baseTitle = (base.title || base.id).replace(/\s*\([^)]*\)\s*$/, "");
  const use = base.recommendedUse ? `<span class="muted use" title="${escapeHtml(base.recommendedUse)}">${escapeHtml(base.recommendedUse)}</span>` : "";
  return `<div class="card" id="${cid}">
    <div class="shot">${imgs}</div>
    <div class="meta">
      <b>${escapeHtml(baseTitle)}</b>
      <span><code>${escapeHtml(base.id)}</code>${dims ? " · " + dims : ""}${variants.length > 1 ? ` · ${variants.length} variants` : ""}</span>
      ${chips}
      ${use}
    </div>
  </div>`;
}

// Demo GIFs per family.
const mediaDir = path.join(repoRoot, "docs", "media");
const gifs = fs.existsSync(mediaDir) ? fs.readdirSync(mediaDir).filter((f) => f.endsWith(".gif")).sort() : [];
const demosByFamily = new Map();
for (const f of gifs) {
  const name = f.replace(/\.gif$/, "");
  const fam = DEMO_FAMILY[name] || "macos";
  if (!demosByFamily.has(fam)) demosByFamily.set(fam, []);
  demosByFamily.get(fam).push({ name, file: f });
}

// Group cards per family.
const cardsByFamily = new Map();
for (const group of bySource.values()) {
  const fam = familyOf(group[0], fams);
  if (!cardsByFamily.has(fam)) cardsByFamily.set(fam, []);
  cardsByFamily.get(fam).push(group);
}

const counts = {};
for (const f of fams) counts[f.key] = (cardsByFamily.get(f.key) || []).length + (demosByFamily.get(f.key) || []).length;

const sections = fams
  .map((f) => {
    const groups = cardsByFamily.get(f.key) || [];
    const demos = demosByFamily.get(f.key) || [];
    if (!groups.length && !demos.length) return "";
    const demoCards = demos
      .map((d) => {
        const uri = inlineGif(path.join(mediaDir, d.file), { maxWidth: 460, fps: 10 });
        if (!uri) return "";
        return `<div class="card demo">
          <div class="shot"><img src="${uri}" alt="${escapeHtml(d.name)}" tabindex="0" data-lightbox></div>
          <div class="meta"><b>${escapeHtml(d.name.replace(/-/g, " "))}</b><span class="muted">interaction demo · <code>examples/${escapeHtml(d.name)}.html</code></span></div>
        </div>`;
      })
      .join("\n");
    return `<section data-family="${f.key}" style="--fam: ${f.color}">
      <h2 class="fam-head">${familyIconSvg(f, 20)} ${f.label} <span class="muted">${groups.length} component${groups.length === 1 ? "" : "s"}${demos.length ? ` · ${demos.length} demo${demos.length === 1 ? "" : "s"}` : ""}</span></h2>
      <div class="grid">${demoCards}${groups.map(card).join("\n")}</div>
    </section>`;
  })
  .join("\n");

const built = new Date().toISOString().slice(0, 16).replace("T", " ");
const html = `<!doctype html>
<meta charset="utf-8">
<title>UI Backlot — catalog gallery</title>
<style>${PAGE_CSS}${FAMILY_NAV_CSS}
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
  .card .shot { position: relative; background: color-mix(in srgb, var(--ink) 5%, transparent); }
  .card .shot img { width: 100%; display: block; cursor: zoom-in; }
  .card.demo { outline: 1px solid color-mix(in srgb, var(--fam, var(--accent)) 40%, transparent); outline-offset: -1px; }
  .card .meta { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px 12px; font-size: 13px; }
  .use { font-size: 12px; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .variants { display: flex; gap: 5px; flex-wrap: wrap; }
  .vchip { font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); cursor: pointer; }
  .vchip.active { border-color: var(--fam, var(--accent)); color: var(--ink); }
  .nocap { display: grid; place-items: center; text-align: center; min-height: 150px; font-size: 12px; line-height: 1.8; }
  #lightbox { position: fixed; inset: 0; background: rgba(0,0,0,.86); display: none; place-items: center; z-index: 50; cursor: zoom-out; padding: 24px; }
  #lightbox.open { display: grid; }
  #lightbox img { max-width: 96vw; max-height: 92vh; border-radius: 6px; }
  #lightbox .cap { position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; color: #ddd; font-size: 13px; }
</style>
<h1>Catalog Gallery</h1>
<p class="sub">Built ${built} · ${surfaces.length} surfaces as ${bySource.size} components across ${fams.filter((f) => counts[f.key]).length} apps + ${gifs.length} interaction demos · click an app to filter, click a chip to switch variant, click an image to zoom · rebuild: <code>npm run gallery:page</code></p>
${familyNavHtml(fams, counts)}
${sections}
<div id="lightbox" role="dialog" aria-label="Full-size image"><img alt=""><span class="cap"></span></div>
<script>
${FAMILY_NAV_JS}
  document.querySelectorAll(".vchip").forEach((b) => {
    b.addEventListener("click", () => {
      const card = document.getElementById(b.dataset.card);
      card.querySelectorAll(".shot [data-v]").forEach((el) => { el.hidden = el.dataset.v !== b.dataset.v; });
      card.querySelectorAll(".vchip").forEach((x) => x.classList.toggle("active", x === b));
    });
  });
  const lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".cap");
  function openLb(img) { lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt; lb.classList.add("open"); }
  document.querySelectorAll("[data-lightbox]").forEach((i) => {
    i.addEventListener("click", () => openLb(i));
    i.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); } });
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
</script>
`;

const out = path.join(repoRoot, "workspace", "gallery.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
// Artifact variant: the Claude Code Artifact harness wraps the file in its own
// doctype/head/body skeleton, so it must not carry a doctype of its own.
fs.writeFileSync(out.replace(/\.html$/, ".artifact.html"), html.replace(/^<!doctype html>\n/, ""));
console.log(`gallery page: ${out} (+ .artifact.html) (${bySource.size} components, ${gifs.length} demos, ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB)`);
