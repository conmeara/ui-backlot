// Shared "app family" model for the review pages: one entry per real
// application, with its authentic brand mark (pulled from @iconify/json at
// build time — same source tools/find-icon.mjs searches — except the pinned
// #si-claude, which comes from assets/icons/source-authentic/).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function iconify(set, name) {
  const data = JSON.parse(fs.readFileSync(require.resolve(`@iconify/json/json/${set}.json`), "utf8"));
  const ic = data.icons[name];
  if (!ic) return null;
  const w = ic.width || data.width || 16;
  const h = ic.height || data.height || 16;
  return { viewBox: `0 0 ${w} ${h}`, body: ic.body };
}

function claudeMark(repoRoot) {
  const svg = fs.readFileSync(
    path.join(repoRoot, "assets", "icons", "source-authentic", "backlot-custom-symbols.svg"),
    "utf8"
  );
  const m = svg.match(/<symbol id="si-claude" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/);
  if (!m) return null;
  return { viewBox: m[1], body: m[2].replace("<path ", '<path fill="currentColor" ') };
}

const tag = (s, ...names) => names.some((t) => (s.tags || []).includes(t));

export function loadFamilies(repoRoot) {
  return [
    { key: "claude", label: "Claude", color: "#d97757", icon: claudeMark(repoRoot),
      match: (s) => /^claude/.test(s.id) },
    { key: "codex", label: "Codex", color: "#10a37f", icon: iconify("simple-icons", "openai"),
      match: (s) => /^codex/.test(s.id) || tag(s, "codex") },
    { key: "excel", label: "Excel", color: "#217346", icon: iconify("simple-icons", "microsoftexcel"),
      match: (s) => /excel/.test(s.id) || tag(s, "excel", "spreadsheet") },
    { key: "word", label: "Word", color: "#2b579a", icon: iconify("simple-icons", "microsoftword"),
      match: (s) => /word/.test(s.id) || tag(s, "word") },
    { key: "powerpoint", label: "PowerPoint", color: "#b7472a", icon: iconify("simple-icons", "microsoftpowerpoint"),
      match: (s) => /presentation|powerpoint/.test(s.id) || tag(s, "powerpoint", "presentation") },
    { key: "figma", label: "Figma", color: "#f24e1e", icon: iconify("simple-icons", "figma"),
      match: (s) => /figma/.test(s.id) || tag(s, "figma") },
    { key: "premiere", label: "Premiere", color: "#9999ff", icon: iconify("simple-icons", "adobepremierepro"),
      match: (s) => /premiere/.test(s.id) || tag(s, "premiere") },
    { key: "browser", label: "Browser", color: "#4285f4", icon: iconify("simple-icons", "googlechrome"),
      match: (s) => /browser/.test(s.id) || tag(s, "browser", "web-app") },
    { key: "calendar", label: "Calendar", color: "#ec5f59", icon: iconify("f7", "calendar"),
      match: (s) => /calendar/.test(s.id) || tag(s, "calendar") },
    { key: "macos", label: "macOS", color: "#8e8e93", icon: iconify("simple-icons", "apple"),
      match: (s) => /^mac-|finder|quickstart|desktop/.test(s.id) || tag(s, "macos", "mac", "finder") },
  ];
}

export function familyOf(surface, fams) {
  const f = fams.find((f) => f.match(surface));
  return f ? f.key : "macos";
}

export function familyIconSvg(fam, size = 22) {
  if (!fam.icon) return "";
  return `<svg width="${size}" height="${size}" viewBox="${fam.icon.viewBox}" aria-hidden="true">${fam.icon.body}</svg>`;
}

// docs/media/<name>.gif → family key
export const DEMO_FAMILY = {
  "claude-chat-interaction": "claude",
  "cowork-interaction": "claude",
  "claude-code-interaction": "claude",
  "codex-interaction": "codex",
  "excel-interaction": "excel",
  "word-interaction": "word",
  "powerpoint-interaction": "powerpoint",
  "browser-interaction": "browser",
  "finder-interaction": "macos",
  "mac-multi-app-demo": "macos",
};

// Shared icon-row markup + behavior for both review pages. Sections carry
// data-family; the row filters via document.documentElement.dataset.family.
export function familyNavHtml(fams, counts) {
  const chips = fams
    .filter((f) => counts[f.key])
    .map(
      (f) => `<button class="fam-chip" data-fam="${f.key}" style="--fam: ${f.color}" title="${f.label}">
        ${familyIconSvg(f)}
        <span>${f.label}</span><span class="n">${counts[f.key]}</span>
      </button>`
    )
    .join("\n");
  return `<nav class="fam-nav" aria-label="Application families">
    <button class="fam-chip all active" data-fam="all"><span>All</span></button>
    ${chips}
  </nav>`;
}

export const FAMILY_NAV_CSS = `
  .fam-nav { position: sticky; top: 0; z-index: 10; display: flex; gap: 8px; flex-wrap: wrap; padding: 10px 0 12px; background: color-mix(in srgb, var(--paper) 92%, transparent); backdrop-filter: blur(6px); border-bottom: 1px solid var(--line); margin-bottom: 18px; }
  .fam-chip { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); color: var(--ink); font: inherit; font-size: 13px; cursor: pointer; }
  .fam-chip svg { color: var(--fam, var(--muted)); flex: 0 0 auto; }
  .fam-chip .n { color: var(--muted); font-size: 11.5px; }
  .fam-chip:hover { border-color: color-mix(in srgb, var(--fam, var(--accent)) 55%, var(--line)); }
  .fam-chip.active { border-color: var(--fam, var(--accent)); box-shadow: inset 0 0 0 1px var(--fam, var(--accent)); }
  section[data-family] { scroll-margin-top: 70px; }
  /* Same (0,2,2) specificity as the per-family show rules below, which win by
     source order when the family matches. */
  html:not([data-family="all"]) section[data-family] { display: none; }
  ${["claude", "codex", "excel", "word", "powerpoint", "figma", "premiere", "browser", "calendar", "macos"]
    .map((k) => `html[data-family="${k}"] section[data-family="${k}"] { display: block; }`)
    .join("\n  ")}
  .fam-head { display: flex; align-items: center; gap: 10px; }
  .fam-head svg { color: var(--fam); }
`;

export const FAMILY_NAV_JS = `
  document.documentElement.dataset.family = "all";
  document.querySelectorAll(".fam-chip").forEach((b) => {
    b.addEventListener("click", () => {
      document.documentElement.dataset.family = b.dataset.fam;
      document.querySelectorAll(".fam-chip").forEach((x) => x.classList.toggle("active", x === b));
    });
  });
`;
