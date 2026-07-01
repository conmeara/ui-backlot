#!/usr/bin/env node
// One-time codemod: make every composition/surface use the shared font
// foundation (styles/backlot-foundation.css).
//
// 1. Injects `@import url("../styles/backlot-foundation.css");` at the top of
//    the first <style> block when missing.
// 2. Rewrites ad-hoc font-family stacks to the per-app-family variables,
//    keyed by filename. Only declarations whose first font is a known
//    placeholder (Inter, Georgia, JetBrains Mono, SF Pro/-apple-system,
//    Segoe UI, mono stacks) are touched; everything else is left alone.
//
// Usage: node tools/adopt-foundation-fonts.mjs [--dry-run]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const IMPORT_LINE = '@import url("../styles/backlot-foundation.css");';

function familyFor(file) {
  const f = path.basename(file);
  if (f.startsWith("browser-app")) return "browser";
  if (f.startsWith("figma")) return "figma";
  if (f.startsWith("premiere")) return "adobe";
  if (/^(word|excel|presentation)/.test(f)) return "office";
  if (/^(finder|mac-menu-bar|calendar)/.test(f) || f === "claude-mac-finder.html") return "macos";
  if (f.startsWith("codex")) return "codex"; // leave Inter: OpenAI UI is Inter-adjacent
  if (f.startsWith("claude-code")) return "claude";
  if (f.startsWith("claude")) return "claude";
  return "generic";
}

const UI_VAR = {
  browser: "var(--font-browser)",
  figma: "var(--font-figma)",
  adobe: "var(--font-adobe)",
  office: "var(--font-office-ui)",
  macos: "var(--font-macos)",
  claude: "var(--font-claude-ui)",
  generic: "var(--font-claude-ui)",
};

function rewriteFonts(css, family) {
  const changes = [];
  const out = css.replace(/font-family:\s*([^;{}]+);/g, (whole, stack) => {
    if (stack.includes("var(")) return whole;
    const first = stack.trim().replace(/^["']|["']$/g, "").split(",")[0].trim().replace(/["']/g, "");
    let replacement = null;
    if (first === "Inter" && family !== "codex") replacement = UI_VAR[family];
    else if (first === "Georgia" && family === "claude") replacement = "var(--font-claude-serif)";
    else if (/^(JetBrains Mono|ui-monospace|SF Mono|SFMono-Regular|Menlo|Monaco)$/.test(first)) replacement = "var(--font-terminal)";
    else if (/^(-apple-system|BlinkMacSystemFont|SF Pro Text|SF Pro Display)$/.test(first) && family === "macos") replacement = "var(--font-macos)";
    else if (first === "Segoe UI" && family === "office") replacement = "var(--font-office-ui)";
    if (!replacement || stack.trim() === replacement) return whole;
    changes.push(`${first} -> ${replacement}`);
    return `font-family: ${replacement};`;
  });
  return { out, changes };
}

const dirs = ["compositions", "surfaces"];
for (const dir of dirs) {
  for (const file of fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith(".html"))) {
    const filePath = path.join(root, dir, file);
    let text = fs.readFileSync(filePath, "utf8");
    const before = text;
    const family = familyFor(file);

    if (!text.includes("backlot-foundation.css")) {
      text = text.replace(/(<style[^>]*>)/, `$1\n      ${IMPORT_LINE}`);
    }

    const { out, changes } = rewriteFonts(text, family);
    text = out;

    if (text !== before) {
      if (!dryRun) fs.writeFileSync(filePath, text);
      const imported = before.includes("backlot-foundation.css") ? "" : " +import";
      console.log(`${dir}/${file} [${family}]${imported} ${changes.length ? changes.join("; ") : ""}`);
    }
  }
}
console.log(dryRun ? "(dry run - nothing written)" : "done");
