import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Downscale + inline images as data URIs so review pages are fully
// self-contained (servable from workspace/ or publishable as an Artifact).
// Uses ImageMagick (`magick`) with an ffmpeg fallback; both ship with the
// repo's documented toolchain.

function tmpFile(ext) {
  return path.join(os.tmpdir(), `backlot-inline-${process.pid}-${Math.random().toString(36).slice(2)}.${ext}`);
}

function hasBin(bin) {
  try {
    execFileSync("which", [bin], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

const MAGICK = hasBin("magick");

export function inlineImage(absPath, { maxWidth = 640, quality = 72 } = {}) {
  if (!absPath || !fs.existsSync(absPath)) return null;
  const out = tmpFile("jpg");
  try {
    if (MAGICK) {
      execFileSync("magick", [absPath, "-resize", `${maxWidth}x>`, "-quality", String(quality), out], { stdio: "pipe" });
    } else {
      execFileSync("ffmpeg", ["-y", "-v", "error", "-i", absPath, "-vf", `scale='min(${maxWidth},iw)':-1`, "-q:v", "5", out], { stdio: "pipe" });
    }
    return `data:image/jpeg;base64,${fs.readFileSync(out).toString("base64")}`;
  } catch {
    return null;
  } finally {
    fs.rmSync(out, { force: true });
  }
}

export function inlineGif(absPath, { maxWidth = 420, fps = 10 } = {}) {
  if (!absPath || !fs.existsSync(absPath)) return null;
  const out = tmpFile("gif");
  try {
    execFileSync("ffmpeg", [
      "-y", "-v", "error", "-i", absPath,
      "-vf", `fps=${fps},scale='min(${maxWidth},iw)':-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`,
      out,
    ], { stdio: "pipe" });
    return `data:image/gif;base64,${fs.readFileSync(out).toString("base64")}`;
  } catch {
    return null;
  } finally {
    fs.rmSync(out, { force: true });
  }
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export const PAGE_CSS = `
  :root { color-scheme: light dark; --ink: #1a1a18; --paper: #faf9f7; --line: rgba(0,0,0,.12); --card: #fff; --muted: #6b6b66; --accent: #e08a62; }
  @media (prefers-color-scheme: dark) { :root { --ink: #ececea; --paper: #161614; --line: rgba(255,255,255,.14); --card: #1f1f1d; --muted: #9a9a94; } }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 28px 32px 80px; background: var(--paper); color: var(--ink); font: 15px/1.5 -apple-system, "SF Pro Text", Inter, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; } h2 { font-size: 16px; margin: 36px 0 12px; border-bottom: 1px solid var(--line); padding-bottom: 6px; }
  .sub { color: var(--muted); font-size: 13px; margin-bottom: 20px; }
  .muted { color: var(--muted); } code { font: 12px/1.4 "SF Mono", ui-monospace, monospace; background: color-mix(in srgb, var(--ink) 7%, transparent); padding: 1px 5px; border-radius: 4px; }
`;
