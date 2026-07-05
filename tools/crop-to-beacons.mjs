#!/usr/bin/env node
/*
 * Crop a browser-window screenshot to the page-content region.
 *
 * Companion to the live-capture flow for logged-in apps. The agent:
 *   1. injects one 6px magenta (rgb(255,0,255)) fixed div at the viewport's
 *      top-left corner (a bottom-right beacon gets clipped by the macOS
 *      rounded window corner, so only the origin beacon is used),
 *   2. captures the window with `screencapture -R` (beacon shot),
 *   3. removes the beacon and captures again (clean shot),
 *   4. runs this tool: the beacon shot provides the content origin, the
 *      viewport size and devicePixelRatio provide the extent, and the crop is
 *      applied to the clean shot.
 *
 * Usage:
 *   node tools/crop-to-beacons.mjs <beacon.png> <out.png> --viewport 1440x757 --dpr 2 [--apply-to clean.png]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const [, , inPath, outPath, ...rest] = process.argv;
const flag = (name) => {
  const i = rest.indexOf(name);
  return i === -1 ? null : rest[i + 1];
};
const viewportArg = flag("--viewport");
const dpr = Number.parseFloat(flag("--dpr") || "2");
const applyTo = flag("--apply-to");
if (!inPath || !outPath || !viewportArg) {
  console.error("Usage: node tools/crop-to-beacons.mjs <beacon.png> <out.png> --viewport WxH [--dpr 2] [--apply-to clean.png]");
  process.exit(1);
}
const [vw, vh] = viewportArg.split("x").map((v) => Number.parseInt(v, 10));

const dataUri = `data:image/png;base64,${(await fs.readFile(path.resolve(inPath))).toString("base64")}`;
const cleanUri = applyTo
  ? `data:image/png;base64,${(await fs.readFile(path.resolve(applyTo))).toString("base64")}`
  : dataUri;

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  const result = await page.evaluate(
    async ({ src, cleanSrc, vw, vh, dpr }) => {
      const load = (s) =>
        new Promise((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error("failed to load image"));
          el.src = s;
        });
      const [img, cleanImg] = await Promise.all([load(src), load(cleanSrc)]);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      // Tolerant of color-profile conversion (screencapture writes Display P3).
      const isBeacon = (i) => data[i] > 235 && data[i + 1] < 60 && data[i + 2] > 235;
      let minX = Infinity, minY = Infinity;
      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          if (isBeacon((y * canvas.width + x) * 4)) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
          }
        }
      }
      if (minX === Infinity) return { error: "no beacon pixels found" };
      const rect = {
        x: minX,
        y: minY,
        w: Math.min(Math.round(vw * dpr), cleanImg.naturalWidth - minX),
        h: Math.min(Math.round(vh * dpr), cleanImg.naturalHeight - minY)
      };
      const out = document.createElement("canvas");
      out.width = rect.w;
      out.height = rect.h;
      out.getContext("2d").drawImage(cleanImg, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
      return { rect, png: out.toDataURL("image/png").split(",")[1] };
    },
    { src: dataUri, cleanSrc: cleanUri, vw, vh, dpr }
  );
  if (result.error) throw new Error(result.error);
  await fs.writeFile(path.resolve(outPath), Buffer.from(result.png, "base64"));
  console.log(`${outPath} (${result.rect.w}x${result.rect.h} from offset ${result.rect.x},${result.rect.y})`);
} finally {
  await browser.close();
}
