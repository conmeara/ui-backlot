#!/usr/bin/env node
// Validate the committed registry/ export (npm run registry:hf:check).
// Checks: staleness vs a fresh regeneration, item schema, no unrewritten
// relative paths, dependency-closure completeness, acyclic deps, and no
// conflicting target collisions across items.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const regRoot = path.join(repoRoot, "registry");
const errors = [];
const fail = (msg) => errors.push(msg);

if (!fs.existsSync(regRoot)) {
  console.error("registry/ does not exist — run: npm run registry:hf:generate");
  process.exit(1);
}

// 1. Staleness: regenerate into a temp dir and diff.
const tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), "backlot-hf-registry-"));
try {
  execFileSync("node", ["tools/generate-hyperframes-registry.mjs"], {
    cwd: repoRoot,
    env: { ...process.env, BACKLOT_HF_REGISTRY_OUT: tmpOut },
    stdio: "pipe",
  });
  try {
    execFileSync("diff", ["-rq", regRoot, tmpOut], { stdio: "pipe" });
  } catch (e) {
    const out = (e.stdout || "").toString().trim().split("\n").slice(0, 10).join("\n  ");
    fail(`registry/ is stale vs sources — run: npm run registry:hf:generate\n  ${out}`);
  }
} finally {
  fs.rmSync(tmpOut, { recursive: true, force: true });
}

// Load manifest + items.
const manifest = JSON.parse(fs.readFileSync(path.join(regRoot, "registry.json"), "utf8"));
const KIND_DIR = { "hyperframes:component": "components", "hyperframes:block": "blocks", "hyperframes:example": "examples" };
const items = new Map();
for (const entry of manifest.items) {
  const dir = KIND_DIR[entry.type];
  if (!dir) { fail(`${entry.name}: unknown type ${entry.type}`); continue; }
  const itemPath = path.join(regRoot, dir, entry.name, "registry-item.json");
  if (!fs.existsSync(itemPath)) { fail(`${entry.name}: manifest entry has no ${dir}/${entry.name}/registry-item.json`); continue; }
  items.set(entry.name, { ...JSON.parse(fs.readFileSync(itemPath, "utf8")), _dir: path.join(regRoot, dir, entry.name) });
}
// Orphan item dirs not in the manifest.
for (const kind of Object.values(KIND_DIR)) {
  const base = path.join(regRoot, kind);
  if (!fs.existsSync(base)) continue;
  for (const name of fs.readdirSync(base)) {
    if (name.startsWith(".")) continue;
    if (!items.has(name)) fail(`${kind}/${name}: item dir not listed in registry.json manifest`);
  }
}

// 2. Schema + files exist + no `..`.
for (const [name, item] of items) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(`${name}: not kebab-case`);
  for (const key of ["title", "description", "files"]) if (!item[key]) fail(`${name}: missing ${key}`);
  if (item.type === "hyperframes:block" && (!item.dimensions || !item.duration)) fail(`${name}: block missing dimensions/duration`);
  for (const f of item.files || []) {
    if (f.path.includes("..") || f.target.includes("..")) fail(`${name}: '..' in ${f.path} → ${f.target}`);
    if (!fs.existsSync(path.join(item._dir, f.path))) fail(`${name}: files[] entry missing on disk: ${f.path}`);
  }
  for (const dep of item.registryDependencies || []) {
    if (!items.has(dep)) fail(`${name}: dependency '${dep}' not in registry`);
  }
}

// 3. Acyclic deps.
const visiting = new Set(), done = new Set();
function visit(name, chain) {
  if (done.has(name)) return;
  if (visiting.has(name)) { fail(`dependency cycle: ${[...chain, name].join(" → ")}`); return; }
  visiting.add(name);
  for (const dep of items.get(name)?.registryDependencies || []) visit(dep, [...chain, name]);
  visiting.delete(name);
  done.add(name);
}
for (const name of items.keys()) visit(name, []);

// 4. Installed-target closure per item: every root-relative reference in every
// emitted html/css must be satisfied by the item's own targets plus its
// transitive dependencies' targets.
function installedTargets(name, acc = new Set(), seen = new Set()) {
  if (seen.has(name)) return acc;
  seen.add(name);
  const item = items.get(name);
  for (const f of item?.files || []) acc.add(f.target);
  for (const dep of item?.registryDependencies || []) installedTargets(dep, acc, seen);
  return acc;
}
const REF_RE = /\b(?:src|href|data-backlot-mount-src|data-composition-src)="([^"]+)"|url\(\s*["']?([^"')]+)["']?\s*\)/g;
for (const [name, item] of items) {
  const targets = installedTargets(name);
  for (const f of item.files || []) {
    if (!/\.(html|css)$/.test(f.path)) continue;
    const content = fs.readFileSync(path.join(item._dir, f.path), "utf8");
    const isCss = f.path.endsWith(".css");
    // HTML must be fully root-relative (compositions render with the project
    // root as base URL). External CSS resolves url() against its own location,
    // so ../ inside a stylesheet is legitimate — resolve before checking.
    if (!isCss && content.includes("../")) fail(`${name}/${f.path}: contains unrewritten '../' reference`);
    for (const m of content.matchAll(REF_RE)) {
      let url = (m[1] || m[2] || "").replace(/[?#].*$/, "");
      if (!url || /^(https?:|data:|\/)/.test(url) || m[0].startsWith("url(#")) continue;
      if (isCss) url = path.posix.normalize(path.posix.join(path.posix.dirname(f.target), url));
      if (!/^(compositions|styles|assets|runtime)\//.test(url)) continue;
      if (!targets.has(url)) fail(`${name}/${f.path}: reference '${url}' not satisfied by item files or dependencies`);
    }
  }
}

// 5. Cross-item target collisions must be byte-identical. Examples are
// standalone degit projects (never co-installed via `add`), so only
// components + blocks participate.
const byTarget = new Map();
for (const [name, item] of items) {
  if (item.type === "hyperframes:example") continue;
  for (const f of item.files || []) {
    const content = fs.readFileSync(path.join(item._dir, f.path));
    const prev = byTarget.get(f.target);
    if (prev && !prev.content.equals(content)) fail(`target collision with differing content: ${f.target} (${prev.name} vs ${name})`);
    if (!prev) byTarget.set(f.target, { name, content });
  }
}

if (errors.length) {
  console.error(`HyperFrames registry check FAILED (${errors.length}):`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`HyperFrames registry OK: ${items.size} items (${manifest.items.filter((i) => i.type.endsWith("block")).length} blocks, ${manifest.items.filter((i) => i.type.endsWith("component")).length} components, ${manifest.items.filter((i) => i.type.endsWith("example")).length} examples), targets ${byTarget.size}, deps acyclic, no stale output.`);
