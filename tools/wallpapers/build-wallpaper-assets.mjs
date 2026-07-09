#!/usr/bin/env node
/**
 * build-wallpaper-assets.mjs
 *
 * Sources the real macOS wallpaper images and bundles a web-optimized set into
 * the repo so every user gets them (no Mac required).
 *
 *   - macOS lineage (Cheetah -> Tahoe): downloaded from the 512pixels.net 6K
 *     archive (Stephen Hackett's hand-upscaled masters).
 *   - Mac / iMac colour masters + Radial Sky Blue: converted from this Mac's
 *     /System/Library/Desktop Pictures (only shipped locally by Apple).
 *
 * Each master is cover-cropped to 16:10 and written twice: a full asset
 * (2560x1600, q80) and a gallery thumb (768x480, q72). Raw downloads are cached
 * in workspace/scratch/wp-src (gitignored) so re-runs are cheap.
 *
 * Requires macOS `sips` (built in) for HEIC decode + resample. Pure Node
 * otherwise.
 *
 * Usage:
 *   node tools/wallpapers/build-wallpaper-assets.mjs            # all sources
 *   node tools/wallpapers/build-wallpaper-assets.mjs sequoia    # id filter(s)
 *   node tools/wallpapers/build-wallpaper-assets.mjs --force    # re-download
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CACHE = resolve(ROOT, "workspace/scratch/wp-src");
const OUT = resolve(ROOT, "assets/wallpapers/macos");
const THUMBS = resolve(ROOT, "assets/wallpapers/thumbs");
const MANIFEST = resolve(ROOT, "assets/wallpapers/manifest.json");

const FULL = { w: 2560, h: 1600, q: 80 };
const THUMB = { w: 768, h: 480, q: 72 };

const CDN = "https://media.512pixels.net/downloads/macos-wallpapers-6k";
const DP = "/System/Library/Desktop Pictures";

// id | name | version | category | variant | source
// category: lineage | color   variant: light | dark | day | night | null
const SOURCES = [
  // ---- OS X / macOS lineage (remote 6K archive) ----------------------------
  ["cheetah", "Cheetah", "10.0", "lineage", null, url("10-0_10-1-6k.jpg")],
  ["jaguar", "Jaguar", "10.2", "lineage", null, url("10-2-6k.jpg")],
  ["panther", "Panther", "10.3", "lineage", null, url("10-3-6k.jpg")],
  ["tiger", "Tiger", "10.4", "lineage", null, url("10-4-6k.jpg")],
  ["leopard", "Leopard", "10.5", "lineage", null, url("10-5-6k.jpg")],
  ["snow-leopard", "Snow Leopard", "10.6", "lineage", null, url("10-6-6k.jpg")],
  ["lion", "Lion", "10.7", "lineage", null, url("10-7-6k.jpg")],
  ["mountain-lion", "Mountain Lion", "10.8", "lineage", null, url("10-8-6k.jpg")],
  ["mavericks", "Mavericks", "10.9", "lineage", null, url("10-9-6k.jpg")],
  ["yosemite", "Yosemite", "10.10", "lineage", null, url("10-10-6k.jpg")],
  ["el-capitan", "El Capitan", "10.11", "lineage", null, url("10-11-6k.jpg")],
  ["sierra", "Sierra", "10.12", "lineage", null, url("10-12-6k.jpg")],
  ["high-sierra", "High Sierra", "10.13", "lineage", null, url("10-13-6k.jpg")],
  ["mojave-day", "Mojave", "10.14", "lineage", "day", url("10-14-Day-6k.jpg")],
  ["mojave-night", "Mojave", "10.14", "lineage", "night", url("10-14-Night-6k.jpg")],
  ["catalina-day", "Catalina", "10.15", "lineage", "day", url("10-15-Day-6k.jpg")],
  ["catalina-night", "Catalina", "10.15", "lineage", "night", url("10-15-Night-6k.jpg")],
  ["big-sur-day", "Big Sur", "11", "lineage", "day", url("11-Big-Sur-Day-6k.jpg")],
  ["big-sur-night", "Big Sur", "11", "lineage", "night", url("11-Big-Sur-Night-6k.jpg")],
  ["big-sur-color-day", "Big Sur Graphic", "11", "lineage", "day", url("11-Big-Sur-Color-Day-6k.jpg")],
  ["big-sur-color-night", "Big Sur Graphic", "11", "lineage", "night", url("11-Big-Sur-Color-Night-6k.jpg")],
  ["monterey", "Monterey", "12", "lineage", "light", url("12-Monterey-Light.jpg")],
  ["monterey-dark", "Monterey", "12", "lineage", "dark", url("12-Monterey-Dark.jpg")],
  ["ventura", "Ventura", "13", "lineage", "light", url("13-Ventura-Light.jpg")],
  ["ventura-dark", "Ventura", "13", "lineage", "dark", url("13-Ventura-Dark.jpg")],
  ["sonoma", "Sonoma", "14", "lineage", "light", url("14-Sonoma-Light.jpg")],
  ["sonoma-dark", "Sonoma", "14", "lineage", "dark", url("14-Sonoma-Dark.jpg")],
  ["sonoma-horizon", "Sonoma Horizon", "14", "lineage", null, url("14-Sonoma-Horizon.png")],
  ["sequoia", "Sequoia", "15", "lineage", "light", url("15-Sequoia-Light-6K.jpg")],
  ["sequoia-dark", "Sequoia", "15", "lineage", "dark", url("15-Sequoia-Dark-6K.jpg")],
  ["sequoia-sunrise", "Sequoia Sunrise", "15", "lineage", null, url("15-Sequoia-Sunrise.png")],
  ["tahoe-light", "Tahoe", "26", "lineage", "light", url("26-Tahoe-Light-6K.png")],
  ["tahoe-dark", "Tahoe", "26", "lineage", "dark", url("26-Tahoe-Dark-6K.png")],

  // ---- Mac / iMac colour masters (local, Apple ships these only on-device) --
  ["radial-sky-blue", "Radial Sky Blue", "12", "color", null, local(`${DP}/Radial Sky Blue.heic`)],
  ["mac-blue", "Mac Blue", "15", "color", null, local(`${DP}/Mac Blue.heic`)],
  ["mac-pink", "Mac Pink", "15", "color", null, local(`${DP}/Mac Pink.heic`)],
  ["mac-purple", "Mac Purple", "15", "color", null, local(`${DP}/Mac Purple.heic`)],
  ["mac-yellow", "Mac Yellow", "15", "color", null, local(`${DP}/Mac Yellow.heic`)],
  ["imac-blue", "iMac Blue", "11", "color", null, local(`${DP}/iMac Blue.heic`)],
  ["imac-green", "iMac Green", "11", "color", null, local(`${DP}/iMac Green.heic`)],
  ["imac-orange", "iMac Orange", "11", "color", null, local(`${DP}/iMac Orange.heic`)],
  ["imac-pink", "iMac Pink", "11", "color", null, local(`${DP}/iMac Pink.heic`)],
  ["imac-purple", "iMac Purple", "11", "color", null, local(`${DP}/iMac Purple.heic`)],
  ["imac-silver", "iMac Silver", "11", "color", null, local(`${DP}/iMac Silver.heic`)],
  ["imac-yellow", "iMac Yellow", "11", "color", null, local(`${DP}/iMac Yellow.heic`)],
];

function url(file) { return { type: "url", ref: `${CDN}/${file}`, ext: file.split(".").pop() }; }
function local(path) { return { type: "local", ref: path, ext: path.split(".").pop() }; }

const args = process.argv.slice(2);
const force = args.includes("--force");
const filters = args.filter((a) => !a.startsWith("--"));

function sh(cmd, cmdArgs) {
  return execFileSync(cmd, cmdArgs, { stdio: ["ignore", "pipe", "pipe"] });
}
function dims(file) {
  const out = sh("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file]).toString();
  return {
    w: +/pixelWidth: (\d+)/.exec(out)[1],
    h: +/pixelHeight: (\d+)/.exec(out)[1],
  };
}
// cover-crop `src` to target w/h at jpeg quality q -> dest
function coverJpeg(src, dest, target) {
  const { w, h } = dims(src);
  const sf = Math.max(target.w / w, target.h / h);
  const nw = Math.round(w * sf);
  const tmp = dest + ".tmp.png";
  sh("sips", ["-s", "format", "png", "--resampleWidth", String(nw), src, "--out", tmp]);
  sh("sips", ["-c", String(target.h), String(target.w), tmp, "--out", tmp]);
  sh("sips", ["-s", "format", "jpeg", "-s", "formatOptions", String(target.q), tmp, "--out", dest]);
  sh("rm", ["-f", tmp]);
}

async function fetchToCache(entry) {
  const raw = resolve(CACHE, `${entry.id}.${entry.src.ext}`);
  if (entry.src.type === "local") {
    if (!existsSync(entry.src.ref)) throw new Error(`local source missing: ${entry.src.ref}`);
    copyFileSync(entry.src.ref, raw);
    return raw;
  }
  if (existsSync(raw) && !force && statSync(raw).size > 10000) return raw;
  const res = await fetch(entry.src.ref, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${entry.src.ref}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(raw, buf);
  return raw;
}

async function pool(items, size, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: size }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx).catch((e) => ({ error: e.message }));
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  [CACHE, OUT, THUMBS].forEach((d) => mkdirSync(d, { recursive: true }));
  let entries = SOURCES.map(([id, name, version, category, variant, src]) => ({
    id, name, version, category, variant, src,
  }));
  if (filters.length) entries = entries.filter((e) => filters.some((f) => e.id.includes(f)));

  console.log(`Sourcing ${entries.length} wallpaper(s)...`);
  const manifest = [];
  const failures = [];

  // Download (network) with concurrency; process (sips/CPU) sequentially after.
  const cached = await pool(entries, 6, async (e) => {
    process.stdout.write(`  ↓ ${e.id}\n`);
    const raw = await fetchToCache(e);
    return { e, raw };
  });

  for (const item of cached) {
    if (item.error || !item.raw) { failures.push(item); continue; }
    const { e, raw } = item;
    try {
      const full = resolve(OUT, `${e.id}.jpg`);
      const thumb = resolve(THUMBS, `${e.id}.jpg`);
      coverJpeg(raw, full, FULL);
      coverJpeg(raw, thumb, THUMB);
      const kb = Math.round(statSync(full).size / 1024);
      console.log(`  ✓ ${e.id.padEnd(20)} ${kb} KB`);
      manifest.push({
        id: e.id,
        name: e.name + (e.variant ? ` (${e.variant})` : ""),
        version: e.version,
        category: e.category,
        variant: e.variant,
        asset: `assets/wallpapers/macos/${e.id}.jpg`,
        thumb: `assets/wallpapers/thumbs/${e.id}.jpg`,
        width: FULL.w,
        height: FULL.h,
        provenance: e.src.type === "local" ? "apple-local" : "512pixels-archive",
        sourceUrl: e.src.type === "url" ? e.src.ref : null,
      });
    } catch (err) {
      console.log(`  ✗ ${e.id}: ${err.message}`);
      failures.push({ e, error: err.message });
    }
  }

  // Merge into any existing manifest so a filtered re-run updates just its
  // entries instead of clobbering the full catalog. Order follows SOURCES.
  let existing = [];
  if (existsSync(MANIFEST)) {
    try { existing = JSON.parse(readFileSync(MANIFEST, "utf8")).images || []; } catch {}
  }
  const byId = new Map(existing.map((i) => [i.id, i]));
  manifest.forEach((i) => byId.set(i.id, i));
  const order = new Map(SOURCES.map(([id], i) => [id, i]));
  const merged = [...byId.values()].sort(
    (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999),
  );
  writeFileSync(MANIFEST, JSON.stringify({ generated: "build-wallpaper-assets", images: merged }, null, 2) + "\n");
  console.log(`\nWrote ${manifest.length} image(s); manifest now has ${merged.length}`);
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):`);
    failures.forEach((f) => console.log(`  - ${f.e?.id || "?"}: ${f.error}`));
    process.exitCode = 1;
  }
}

main();
