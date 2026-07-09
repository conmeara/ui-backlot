#!/usr/bin/env node
/**
 * build-wallpaper-gallery.mjs
 *
 * Renders surfaces/wallpapers.json into a self-contained, shareable gallery at
 * workspace/wallpapers.html — image wallpapers use their thumb inlined as a
 * data URI, CSS wallpapers paint from their stored `background` value. Grouped
 * by category, each tile shows the name + the data-wallpaper id to copy.
 *
 *   npm run wallpapers:gallery
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const cat = JSON.parse(readFileSync(resolve(ROOT, "surfaces/wallpapers.json"), "utf8"));

const GROUPS = [
  ["lineage", "macOS lineage — real images", "Every default OS X / macOS wallpaper, Cheetah → Tahoe"],
  ["color", "Mac & iMac colour masters — real images", "Apple's on-device colour wallpapers"],
  ["raycast", "Raycast — real images", "Raycast's wallpaper set (misc-assets.raycast.com)"],
  ["mesh", "Mesh gradients — CSS", "Original multi-blob mesh gradients with fine grain"],
  ["gradient", "Gradients — CSS", "Original linear & duotone gradients"],
  ["spotlight", "Spotlights — CSS", "Radial glow on dark — good behind terminals & app windows"],
  ["metallic", "Hello metallics — CSS", "Original radial metallics"],
  ["pattern", "Patterns — CSS", "Tiling grids, dots, stripes, topographic, carbon"],
  ["solid", "Solid colours — CSS", "Flat desktop colours"],
];

const dataUri = (rel) => {
  const buf = readFileSync(resolve(ROOT, rel));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function tile(w) {
  const swatch =
    w.type === "image"
      ? `<div class="sw" style="background-image:url('${dataUri(w.thumb)}')"></div>`
      : `<div class="sw" style="background:${w.css}"></div>`;
  const meta = [w.version ? `macOS ${esc(w.version)}` : null, w.type].filter(Boolean).join(" · ");
  return `<figure class="tile">${swatch}
    <figcaption><span class="nm">${esc(w.name)}</span><code>${esc(w.id)}</code><span class="mt">${esc(meta)}</span></figcaption>
  </figure>`;
}

const sections = GROUPS.map(([key, title, sub]) => {
  const items = cat.wallpapers.filter((w) => w.category === key);
  if (!items.length) return "";
  return `<section><h2>${esc(title)} <small>${items.length}</small></h2>
    <p class="sub">${esc(sub)}</p>
    <div class="grid">${items.map(tile).join("\n")}</div></section>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>UI Backlot — macOS Wallpaper Catalog</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0c0d11; color: #e7e9ee;
    font: 15px/1.5 -apple-system, "SF Pro Text", Inter, system-ui, sans-serif; }
  header { padding: 40px 32px 8px; }
  h1 { margin: 0 0 6px; font-size: 26px; letter-spacing: -0.02em; }
  header p { margin: 0; color: #9aa0ab; }
  header code { color: #cdd2db; background: #1a1c22; padding: 1px 6px; border-radius: 5px; }
  section { padding: 20px 32px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.06em; color: #c6cbd4; margin: 22px 0 2px; }
  h2 small { color: #6b7280; font-weight: 400; margin-left: 6px; }
  .sub { margin: 0 0 14px; color: #737985; font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
  .tile { margin: 0; }
  .sw { aspect-ratio: 16/10; border-radius: 10px; background-size: cover; background-position: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06); }
  figcaption { display: flex; flex-direction: column; gap: 1px; padding: 8px 2px 0; }
  .nm { font-weight: 600; font-size: 13.5px; }
  figcaption code { font-size: 12px; color: #8fb9ff; }
  .mt { font-size: 11.5px; color: #6b7280; }
</style></head><body>
<header>
  <h1>macOS Wallpaper Catalog</h1>
  <p>${cat.count} wallpapers · surface <code>mac-wallpaper</code> · set <code>data-wallpaper="&lt;id&gt;"</code> (default ${esc(cat.default)})</p>
</header>
${sections}
</body></html>
`;

mkdirSync(resolve(ROOT, "workspace"), { recursive: true });
const out = resolve(ROOT, "workspace/wallpapers.html");
writeFileSync(out, html);
const kb = Math.round(Buffer.byteLength(html) / 1024);
console.log(`Wrote workspace/wallpapers.html — ${cat.count} wallpapers, ${kb} KB`);
