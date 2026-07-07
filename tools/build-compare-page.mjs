#!/usr/bin/env node
// Build workspace/compare.html — a self-contained review page for the fidelity
// loops. Per surface: a strip of labeled reference images (each badged with
// its provenance — tracked/web-sourced refs are shareable, gitignored local
// captures are local-only), a large BEFORE | CURRENT pair, and the changes
// applied by the last pass (read from workspace/fidelity/pass-log.json, which
// fidelity-push writes after its Gate phase). Click any image for a full-size
// lightbox. Media is inlined as data URIs. Usage: node tools/build-compare-page.mjs [--all]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { inlineImage, escapeHtml, PAGE_CSS } from "./lib/inline-media.mjs";

const repoRoot = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "registry.json"), "utf8"));
const includeAll = process.argv.includes("--all");

// Surface id → ground-truth labels in the newest dated dir of the family.
// Keep in sync with the FAMILIES list in .claude/workflows/fidelity-push.js.
const REF_MAP = {
  "claude-composed-app": { family: "claude", labels: ["web-app-chat-light", "web-app-chat-dark"] },
  "claude-home": { family: "claude", labels: ["web-app-home-light", "web-app-home-dark"] },
  "finder-window": { family: "macos", labels: ["finder-window-light", "finder-window-dark"] },
  "mac-menu-bar": { family: "macos", labels: ["menu-bar-light", "menu-bar-dark"] },
  "calendar-app": { family: "macos", labels: ["calendar-week-light", "calendar-week-dark"] },
};

// Surface id → tracked (shareable) reference image directories for families
// whose ground truth is official/web screenshots rather than dated captures.
const FAMILY_REF_DIRS = {
  "figma-editor": "reference/figma/actual-app",
  "codex-app": "reference/codex/app-screenshots",
  "codex-terminal": "reference/codex/app-screenshots",
  "presentation-editor": "reference/powerpoint/source-screenshots",
  "word-editor": "reference/word/screenshots",
};

const IMG_EXT = /\.(png|jpe?g|webp)$/i;

// Provenance via git: ignored file ⇒ local-only (private capture), tracked ⇒ shareable.
function isLocalOnly(relPath) {
  try {
    execFileSync("git", ["check-ignore", "-q", relPath], { cwd: repoRoot, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function newestDatedDir(family) {
  const dir = path.join(repoRoot, "reference", family);
  if (!fs.existsSync(dir)) return null;
  const dated = fs.readdirSync(dir).filter((d) => /^20\d\d-/.test(d)).sort();
  return dated.length ? path.join(dir, dated[dated.length - 1]) : null;
}

const MAX_REFS = 4;
function referencesFor(id) {
  const refs = [];
  const mapped = REF_MAP[id];
  if (mapped) {
    const dated = newestDatedDir(mapped.family);
    if (dated) {
      for (const label of mapped.labels) {
        const p = path.join(dated, label, "screenshot.png");
        if (fs.existsSync(p)) refs.push({ label: `${path.basename(dated)}/${label}`, abs: p, rel: path.relative(repoRoot, p) });
      }
    }
  }
  const famDir = FAMILY_REF_DIRS[id];
  if (famDir && fs.existsSync(path.join(repoRoot, famDir))) {
    for (const f of fs.readdirSync(path.join(repoRoot, famDir)).filter((f) => IMG_EXT.test(f)).sort()) {
      refs.push({ label: f.replace(IMG_EXT, ""), abs: path.join(repoRoot, famDir, f), rel: `${famDir}/${f}` });
    }
  }
  return refs.slice(0, MAX_REFS).map((r) => ({ ...r, localOnly: isLocalOnly(r.rel) }));
}

// Optional change log written after a fidelity pass (see CLAUDE.md):
// { pass, families: [{ family, verdict, applied: [{surface,file,change}], regressions, remaining }] }
let passLog = null;
const passLogPath = path.join(repoRoot, "workspace", "fidelity", "pass-log.json");
if (fs.existsSync(passLogPath)) {
  try { passLog = JSON.parse(fs.readFileSync(passLogPath, "utf8")); } catch { passLog = null; }
}
function changesFor(id) {
  if (!passLog) return { applied: [], verdict: null };
  const out = { applied: [], verdict: null };
  for (const fam of passLog.families || []) {
    for (const a of fam.applied || []) if (a.surface === id) { out.applied.push(a); out.verdict = fam.verdict || null; }
  }
  return out;
}

const fidelityDir = path.join(repoRoot, "workspace", "fidelity");
function beforePng(id) {
  const p = path.join(fidelityDir, `before-${id}.png`);
  return fs.existsSync(p) ? p : null;
}

const rows = [];
let localOnlyCount = 0;
for (const s of registry.surfaces) {
  if (s.status === "deprecated") continue;
  const current = s.capture?.path ? path.join(repoRoot, s.capture.path) : null;
  const cur = current && fs.existsSync(current) ? current : null;
  const refs = referencesFor(s.id);
  const before = beforePng(s.id);
  const changes = changesFor(s.id);
  if (!includeAll && !refs.length && !before && !changes.applied.length) continue;
  if (!cur && !refs.length && !before) continue;
  localOnlyCount += refs.filter((r) => r.localOnly).length;
  rows.push({ id: s.id, title: s.title, script: s.capture?.script, refs, before, cur, changes });
}
rows.sort((a, b) => (b.changes.applied.length - a.changes.applied.length) || (b.refs.length - a.refs.length) || a.id.localeCompare(b.id));

function img(dataUri, alt) {
  return `<img src="${dataUri}" alt="${escapeHtml(alt)}" tabindex="0" data-lightbox>`;
}

const built = new Date().toISOString().slice(0, 16).replace("T", " ");
const rowHtml = rows.map((r) => {
  const refCells = r.refs.map((ref) => {
    const uri = inlineImage(ref.abs, { maxWidth: 560, quality: 66 });
    if (!uri) return "";
    const badge = ref.localOnly
      ? '<span class="badge local">local-only · do not publish</span>'
      : '<span class="badge shareable">web-sourced · shareable</span>';
    return `<div class="cell ref"><span class="tag">reference · ${escapeHtml(ref.label)}</span>${img(uri, "reference " + ref.label)}${badge}</div>`;
  }).join("\n");

  const before = inlineImage(r.before, { maxWidth: 1000, quality: 70 });
  const cur = inlineImage(r.cur, { maxWidth: 1000, quality: 70 });
  const pair = `
    <div class="cell big">${before ? `<span class="tag">before</span>${img(before, r.id + " before")}` : '<span class="tag">before</span><span class="muted empty-note">no loop snapshot yet</span>'}</div>
    <div class="cell big">${cur ? `<span class="tag">current</span>${img(cur, r.id + " current")}` : `<span class="tag">current</span><span class="muted empty-note">${r.script ? "npm run " + escapeHtml(r.script) : "no capture"}</span>`}</div>`;

  const changes = r.changes.applied.length
    ? `<details class="changes" open><summary>${r.changes.applied.length} change${r.changes.applied.length > 1 ? "s" : ""} last pass${r.changes.verdict ? ` · verdict: <b>${escapeHtml(r.changes.verdict)}</b>` : ""}</summary><ul>${r.changes.applied.map((a) => `<li><code>${escapeHtml(a.file || "")}</code> — ${escapeHtml(a.change || "")}</li>`).join("")}</ul></details>`
    : "";

  return `<section class="row">
    <h2>${escapeHtml(r.title)} <code>${escapeHtml(r.id)}</code></h2>
    ${r.refs.length ? `<div class="refs">${refCells}</div>` : ""}
    <div class="pair">${pair}</div>
    ${changes}
  </section>`;
}).join("\n");

const banner = localOnlyCount
  ? `<p class="warn">⚠ This page inlines ${localOnlyCount} <b>local-only</b> reference image${localOnlyCount > 1 ? "s" : ""} (private captures from this machine — schedules, chat history). Fine to view here or in a private Artifact; do <b>not</b> publish this file to GitHub or share it broadly. Shareable web-sourced references are badged green.</p>`
  : "";

const passNote = passLog?.pass ? ` · last pass: ${escapeHtml(passLog.pass)}` : "";
const html = `<!doctype html>
<meta charset="utf-8">
<title>UI Backlot — before/after compare</title>
<style>${PAGE_CSS}
  .warn { background: color-mix(in srgb, #c9a227 14%, var(--card)); border: 1px solid color-mix(in srgb, #c9a227 45%, transparent); border-radius: 10px; padding: 10px 14px; font-size: 13.5px; max-width: 900px; }
  .refs { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
  .refs .cell { flex: 0 1 260px; }
  .pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
  .cell { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
  .cell img { width: 100%; border-radius: 6px; cursor: zoom-in; }
  .empty-note { display: grid; place-items: center; min-height: 110px; font-size: 13px; }
  .tag { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .badge { align-self: flex-start; font-size: 11px; border-radius: 999px; padding: 2px 9px; }
  .badge.local { background: color-mix(in srgb, #c0392b 16%, transparent); color: #c0392b; }
  .badge.shareable { background: color-mix(in srgb, #1e8e4e 14%, transparent); color: #1e8e4e; }
  .changes { margin-top: 10px; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 8px 14px; font-size: 13.5px; }
  .changes summary { cursor: pointer; } .changes ul { margin: 8px 0 4px; padding-left: 18px; } .changes li { margin: 3px 0; }
  #lightbox { position: fixed; inset: 0; background: rgba(0,0,0,.86); display: none; place-items: center; z-index: 50; cursor: zoom-out; padding: 24px; }
  #lightbox.open { display: grid; }
  #lightbox img { max-width: 96vw; max-height: 92vh; border-radius: 6px; }
  #lightbox .cap { position: fixed; bottom: 10px; left: 0; right: 0; text-align: center; color: #ddd; font-size: 13px; }
</style>
<h1>Before / After Compare</h1>
<p class="sub">Built ${built}${passNote} · references labeled with provenance · click any image to view full size · rebuild: <code>npm run compare:page</code>${includeAll ? "" : " · showing surfaces with references, loop snapshots, or pass changes; <code>--all</code> for everything"}</p>
${banner}
${rowHtml || '<p class="muted">Nothing to compare yet — run a capture sweep or a fidelity pass first.</p>'}
<div id="lightbox" role="dialog" aria-label="Full-size image"><img alt=""><span class="cap"></span></div>
<script>
  const lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".cap");
  function open(img) { lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt; lb.classList.add("open"); }
  document.querySelectorAll("[data-lightbox]").forEach((i) => {
    i.addEventListener("click", () => open(i));
    i.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
</script>
`;

const out = path.join(repoRoot, "workspace", "compare.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
// Artifact variant: the Claude Code Artifact harness wraps the file in its own
// doctype/head/body skeleton, so it must not carry a doctype of its own.
fs.writeFileSync(out.replace(/\.html$/, ".artifact.html"), html.replace(/^<!doctype html>\n/, ""));
console.log(`compare page: ${out} (+ .artifact.html) (${rows.length} surfaces, ${localOnlyCount} local-only refs, ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB)`);
