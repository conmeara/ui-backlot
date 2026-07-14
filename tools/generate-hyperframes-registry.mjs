#!/usr/bin/env node
// Generate registry/ — the HyperFrames-format component registry that lets
// external projects install UI Backlot surfaces with `npx hyperframes add`.
//
// Layout (served raw from GitHub at REGISTRY_URL):
//   registry/registry.json                      manifest (doubles as the agent index)
//   registry/components/<name>/registry-item.json + files   shared infra
//   registry/blocks/<name>/registry-item.json + files       one per surface
//   registry/examples/<name>/registry-item.json + files     vendored starter projects
//
// Every relative URL in emitted HTML/CSS is rewritten repo-root-relative
// (../styles/x.css → styles/x.css) because HyperFrames serves consumer
// projects with the project root as base URL and installs our targets at
// root-relative paths. Output is deterministic: re-running on an unchanged
// tree produces a zero diff (validated by tools/check-hyperframes-registry.mjs).

import fs from "node:fs";
import path from "node:path";
import { REGISTRY_NAME, HOMEPAGE, REGISTRY_URL, SHARED_COMPONENTS, EXAMPLES } from "./hyperframes-publish.config.mjs";

const repoRoot = process.cwd();
// BACKLOT_HF_REGISTRY_OUT lets the checker regenerate into a temp dir for a
// staleness diff without touching the committed registry/.
const outRoot = process.env.BACKLOT_HF_REGISTRY_OUT || path.join(repoRoot, "registry");
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, "surfaces", "registry.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));

const SCHEMA_ITEM = "https://hyperframes.heygen.com/schema/registry-item.json";

// ---------------------------------------------------------------- rewriting

// Attribute + CSS URL patterns that may carry relative paths.
const ATTR_RE = /\b(src|href|data-backlot-mount-src|data-composition-src)="([^"]+)"/g;
const CSS_URL_RE = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
const IMPORT_RE = /@import\s+url\(\s*["']?([^"')]+)["']?\s*\)/g;

function isRewritable(url) {
  return url && !/^(https?:|data:|#|\/)/.test(url);
}

// Resolve a relative URL against the source file's repo dir → root-relative,
// preserving any query/fragment suffix.
function rootRelative(url, sourceDirAbs) {
  const m = url.match(/^([^?#]*)([?#].*)?$/);
  const [, filePart, suffix = ""] = m;
  if (!filePart) return url;
  const abs = path.resolve(sourceDirAbs, filePart);
  const rel = path.relative(repoRoot, abs);
  if (rel.startsWith("..")) throw new Error(`reference escapes repo: ${url}`);
  return rel.split(path.sep).join("/") + suffix;
}

function rewriteHtml(html, sourceDirAbs, refs) {
  const sub = (whole, url, rebuild) => {
    if (!isRewritable(url)) return whole;
    const rewritten = rootRelative(url, sourceDirAbs);
    refs.add(rewritten.replace(/[?#].*$/, ""));
    return rebuild(rewritten);
  };
  let out = html.replace(ATTR_RE, (w, attr, url) => sub(w, url, (r) => `${attr}="${r}"`));
  out = out.replace(CSS_URL_RE, (w, url) => sub(w, url, (r) => `url("${r}")`));
  // Inline JS can also carry relative paths (e.g. `loader.src = "../runtime/…"`).
  // Rewrite any explicitly-relative quoted string that resolves to a real repo file.
  out = out.replace(/"((?:\.\.\/|\.\/)[^"\n]+)"/g, (w, url) => {
    const resolved = rootRelative(url, sourceDirAbs);
    const filePart = resolved.replace(/[?#].*$/, "");
    if (!fs.existsSync(path.join(repoRoot, filePart))) return w;
    refs.add(filePart);
    return `"${resolved}"`;
  });
  return out;
}

// External CSS is copied byte-identical — url() inside a stylesheet resolves
// against the STYLESHEET's own location, so its ../ paths are already correct
// at the install target. We only parse it to walk the reference closure.
function cssRefs(css, sourceDirAbs, refs) {
  for (const m of css.matchAll(CSS_URL_RE)) {
    if (!isRewritable(m[1])) continue;
    refs.add(rootRelative(m[1], sourceDirAbs).replace(/[?#].*$/, ""));
  }
}

// ---------------------------------------------------------------- helpers

const bySource = new Map(); // compositions/x.html → surface (first non-deprecated wins)
for (const s of registry.surfaces) {
  if (s.status === "deprecated") continue;
  if (!bySource.has(s.source)) bySource.set(s.source, s);
}

const sharedByPrefix = [
  { prefix: "styles/backlot-foundation.css", item: "backlot-foundation" },
  { prefix: "runtime/", item: "backlot-runtime" },
  { prefix: "assets/cursors/", item: "backlot-cursors" },
];
const sharedFileSet = new Set(SHARED_COMPONENTS.flatMap((c) => c.files));

function fileType(target) {
  if (target.endsWith(".html")) return "hyperframes:composition";
  if (target.endsWith(".css")) return "hyperframes:style";
  return "hyperframes:asset";
}

function writeItem(kind, name, item, payload) {
  const dir = path.join(outRoot, kind, name);
  fs.mkdirSync(dir, { recursive: true });
  for (const [rel, content] of payload) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  item.files.sort((a, b) => a.path.localeCompare(b.path));
  if (item.registryDependencies) item.registryDependencies.sort();
  fs.writeFileSync(path.join(dir, "registry-item.json"), JSON.stringify(item, null, 2) + "\n");
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repoRoot, rel));
}

function durationOf(html) {
  const m = html.match(/data-duration="([\d.]+)"/);
  return m ? Number(m[1]) : 10;
}

function darkReady(id) {
  return Boolean(pkg.scripts[`capture:${id}-dark`]);
}

// ---------------------------------------------------------------- generate

fs.rmSync(outRoot, { recursive: true, force: true });
const manifestItems = [];

// Shared components: byte-identical copies, path == target.
for (const c of SHARED_COMPONENTS) {
  const item = {
    $schema: SCHEMA_ITEM,
    name: c.name,
    type: "hyperframes:component",
    title: c.title,
    description: c.description,
    tags: c.tags,
    files: c.files.map((f) => ({ path: f, target: f, type: fileType(f) })),
  };
  writeItem("components", c.name, item, c.files.map((f) => [f, readRepo(f)]));
  manifestItems.push({ name: c.name, type: item.type, title: c.title, description: c.description, tags: c.tags });
}

// Blocks: one per non-deprecated surface. The rewritten composition is the
// main file; shared refs become registryDependencies; anything else referenced
// (app icons, etc.) is vendored into the item under its root-relative path.
const publishedBlocks = new Map(); // surface id → item
const surfaces = registry.surfaces.filter((s) => s.status !== "deprecated").sort((a, b) => a.id.localeCompare(b.id));
for (const s of surfaces) {
  if (bySource.get(s.source) !== s) continue; // variant sharing a source file (e.g. ?page= views) — the primary block covers it
  const srcAbs = path.join(repoRoot, s.source);
  const html = fs.readFileSync(srcAbs, "utf8");
  const refs = new Set();
  const rewritten = rewriteHtml(html, path.dirname(srcAbs), refs);

  // Walk the reference closure. Vendored HTML (e.g. a deprecated atom folded
  // into its composed shell) is itself rewritten against its own dir, and its
  // references join the same closure — so nothing vendored keeps a '../'.
  const deps = new Set();
  const vendored = [];
  const vendoredContent = new Map(); // repo-rel path → rewritten content
  const seen = new Set([s.source]);
  const queue = [...refs].sort();
  while (queue.length) {
    const ref = queue.shift();
    if (seen.has(ref)) continue;
    seen.add(ref);
    const shared = sharedByPrefix.find((r) => ref === r.prefix || ref.startsWith(r.prefix));
    if (shared && (sharedFileSet.has(ref) || shared.prefix.endsWith("/"))) { deps.add(shared.item); continue; }
    if (ref.startsWith("compositions/")) {
      const dep = bySource.get(ref);
      if (dep) { deps.add(dep.id); continue; }
    }
    if (!fs.existsSync(path.join(repoRoot, ref))) throw new Error(`${s.id}: broken reference ${ref}`);
    vendored.push(ref);
    if (ref.endsWith(".html")) {
      const nested = new Set();
      vendoredContent.set(ref, rewriteHtml(fs.readFileSync(path.join(repoRoot, ref), "utf8"), path.dirname(path.join(repoRoot, ref)), nested));
      queue.push(...[...nested].sort());
    }
  }
  vendored.sort();
  // Foundation css pulls the fonts; cursors are their own item — a block that
  // uses either needs the runtime only if it mounts something.
  const mainFile = `${s.id}.html`;
  const description = `${s.fidelity ? s.fidelity[0].toUpperCase() + s.fidelity.slice(1) + ". " : ""}${s.recommendedUse || ""}`.trim()
    + (darkReady(s.id) ? ' Dark theme: add class "theme-dark" to the composition root.' : "");
  const tags = [...(s.tags || []), ...(darkReady(s.id) ? ["dark-mode-ready"] : [])];
  const item = {
    $schema: SCHEMA_ITEM,
    name: s.id,
    type: "hyperframes:block",
    title: s.title,
    description,
    tags,
    dimensions: s.dimensions,
    duration: durationOf(html),
    files: [
      { path: mainFile, target: `compositions/${s.id}.html`, type: "hyperframes:composition" },
      ...vendored.map((v) => ({ path: v, target: v, type: fileType(v) })),
    ],
    registryDependencies: [...deps],
  };
  writeItem("blocks", s.id, item, [[mainFile, rewritten], ...vendored.map((v) => [v, vendoredContent.get(v) ?? readRepo(v)])]);
  publishedBlocks.set(s.id, item);
  manifestItems.push({ name: s.id, type: item.type, title: s.title, description, tags });
}

// Examples: fully vendored starter projects (installable via degit). Walk the
// reference closure recursively from the example page.
for (const ex of EXAMPLES.sort((a, b) => a.name.localeCompare(b.name))) {
  const payload = new Map(); // target → content
  const queue = [ex.source];
  const seen = new Set();
  let mainHtml = null;
  while (queue.length) {
    const rel = queue.shift();
    if (seen.has(rel)) continue;
    seen.add(rel);
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) throw new Error(`${ex.name}: missing ${rel}`);
    const dirAbs = path.dirname(abs);
    if (rel.endsWith(".html")) {
      const refs = new Set();
      const out = rewriteHtml(fs.readFileSync(abs, "utf8"), dirAbs, refs);
      if (rel === ex.source) mainHtml = out; else payload.set(rel, out);
      queue.push(...refs);
    } else if (rel.endsWith(".css")) {
      const refs = new Set();
      cssRefs(fs.readFileSync(abs, "utf8"), dirAbs, refs);
      payload.set(rel, readRepo(rel));
      queue.push(...refs);
    } else {
      payload.set(rel, readRepo(rel));
    }
  }
  const files = [["index.html", mainHtml], ...[...payload.entries()].sort(([a], [b]) => a.localeCompare(b))];
  const hfConfig = JSON.stringify({
    $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
    registry: REGISTRY_URL,
    paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
  }, null, 2) + "\n";
  files.push(["hyperframes.json", hfConfig]);
  const html = fs.readFileSync(path.join(repoRoot, ex.source), "utf8");
  const dims = html.match(/data-width="(\d+)"[^>]*data-height="(\d+)"/);
  const item = {
    $schema: SCHEMA_ITEM,
    name: ex.name,
    type: "hyperframes:example",
    title: ex.name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
    description: `${ex.description} Fully self-contained: npx degit conmeara/ui-backlot/registry/examples/${ex.name} my-video && cd my-video && npx hyperframes render --composition index.html --quality draft`,
    tags: ["example", "starter"],
    dimensions: dims ? { width: Number(dims[1]), height: Number(dims[2]) } : undefined,
    duration: durationOf(html),
    files: files.map(([target]) => ({ path: target, target, type: target === "hyperframes.json" ? "hyperframes:asset" : fileType(target) })),
  };
  if (!item.dimensions) delete item.dimensions;
  writeItem("examples", ex.name, item, files);
  manifestItems.push({ name: ex.name, type: item.type, title: item.title, description: item.description, tags: item.tags });
}

// Manifest — also the machine-readable index agents fetch first.
manifestItems.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
const manifest = {
  name: REGISTRY_NAME,
  homepage: HOMEPAGE,
  description: "Editable, high-fidelity recreations of real app UIs (Claude, Codex, macOS, Office, Figma, Premiere, browsers) for HyperFrames demo videos. Install blocks with `npx hyperframes add <name>` after pointing hyperframes.json at this registry; install examples with degit.",
  items: manifestItems,
};
fs.writeFileSync(path.join(outRoot, "registry.json"), JSON.stringify(manifest, null, 2) + "\n");

const counts = manifestItems.reduce((acc, i) => ((acc[i.type] = (acc[i.type] || 0) + 1), acc), {});
console.log(`registry/: ${manifestItems.length} items —`, counts);
