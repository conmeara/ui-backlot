# Realism Roadmap

Status: living document, started 2026-07-01. Goal: close the gap between UI
Backlot surfaces and the real applications so rendered clips read as authentic
in Claude-style demo videos.

## Diagnosis (2026-07-01 audit, all 50 surface/composition files)

The audit swept every file in `compositions/` and `surfaces/` for font, icon,
and foundation adoption. Findings:

- **Fonts were defined but not adopted.** `styles/backlot-foundation.css`
  carried the Anthropic Sans/Serif faces and per-app font variables, but 49 of
  50 files never imported it. Claude surfaces rendered in Inter/Georgia
  instead of Anthropic Sans/Serif. Fixed repo-wide by
  `tools/adopt-foundation-fonts.mjs` (one-time codemod, 2026-07-01).
- **Icons were the single biggest realism gap.** ~32% of files drew icons as
  empty spans styled with CSS borders/gradients, ~48% used bare text or
  unicode. Only `word-editor.html` and `codex-app.html` used real SVG.
- Recurring fakery patterns, by frequency:
  1. Traffic lights as flat colored circles (19 files).
  2. Sidebar icons as empty styled spans (Claude, Finder).
  3. Layer/file-type icons as single letters (Figma "T"/"F", Finder).
  4. Tab favicons as tiny colored squares (browser surfaces).
  5. Ribbon/toolbar glyphs as pseudo-element geometry (Office, Premiere).

## Icon system (shipped 2026-07-01)

`tools/build-icon-sprites.mjs` + `assets/icons/sprite-manifest.json` vendor
curated SVG symbol subsets from pinned open-source packages into
`assets/icons/source-authentic/`:

| Sprite | Source | License | Used for |
|---|---|---|---|
| `framework7/macos-symbols.svg` | framework7-icons@5.0.5 | MIT | Finder, menu bar, macOS chrome (SF-Symbols style) |
| `microsoft/office-symbols.svg` | @fluentui/svg-icons@1.1.331 | MIT | Word/Excel/PowerPoint ribbon + panes |
| `lucide/claude-symbols.svg` | lucide-static@1.23.0 | ISC | Claude composer/sidebar/topbar glyphs |
| `lucide/browser-symbols.svg` | lucide-static@1.23.0 | ISC | Browser toolbar, tabs |
| `lucide/design-symbols.svg` | lucide-static@1.23.0 | ISC | Figma + Premiere tools/panels |

Usage convention (established by `word-editor.html`): copy only the needed
`<symbol>` elements into a hidden `<svg style="display:none">` block in the
composition, render each icon as
`<svg class="backlot-icon"><use href="#prefix-name"/></svg>`.
Add icons by extending the manifest and rerunning the build tool; donor
packages cache in `.icon-donors/` (gitignored).

Note: Apple's SF Symbols may not be redistributed as extracted assets;
Framework7 Icons are the legally shippable SF-style stand-in.

## Font decisions

- Claude surfaces: `Anthropic Sans` / `Anthropic Serif` (tracked variable
  fonts) via `--font-claude-ui` / `--font-claude-serif`.
- macOS surfaces: `-apple-system` renders real SF Pro when captured on a Mac —
  correct by construction locally; fallbacks only matter for portability.
- Office: `--font-office-ui` (Segoe stack). Captures on macOS fall through to
  SF, which matches Office **for Mac** — the reference screenshots in
  `reference/powerpoint` and `reference/word` are Mac Office, so this is
  acceptable. If Windows-style Office is ever needed, vendor Selawik (MIT,
  metric-compatible Segoe UI) and Carlito (OFL, metric-compatible Calibri).
- Figma: Inter (what Figma actually uses).
- Terminal: `ui-monospace`/SF Mono stack.

## Workstreams

### 1. Per-surface icon adoption (in progress)

Flagship proofs first, then fan out to remaining surfaces in dependency order
(shared components before workflows that mount them):

- [x] claude-app.html (Lucide; 2026-07-01) — topbar/sidebar/composer/rail
      glyphs, gradient traffic lights, chat-bubble rows
- [x] finder-window.html (Framework7; 2026-07-01) — systemBlue sidebar icons,
      toolbar view controls, filled folders, photo/code file glyphs
- [x] browser-app.html + surfaces/browser-app-surface.html (Lucide;
      2026-07-01) — Chrome nav/toolbar icons, padlock, brand-colored favicons
- [x] mac-menu-bar.html (Framework7; 2026-07-01) — wifi/battery/search status
      icons plus a hand-authored Control Center two-pill glyph
- [ ] claude-sidebar / claude-composer / claude-thread-core / claude-agent-rail
- [ ] presentation-editor.html + excel-workbook.html (Fluent office sprite)
- [ ] figma-editor.html + figma-onboarding-editor.html (design sprite;
      replace letter glyphs in layer tree)
- [ ] premiere-editor.html (design sprite)
- [ ] claude-mac-finder.html, calendar-app-surface.html (Framework7)
- [ ] codex-app.html (already SVG; refine monochrome fills)

### 2. Shared chrome primitives

- [ ] Extract one traffic-light component (radial-gradient + inset shadow)
      and reuse across all 19 window shells.
- [ ] Consistent window shadow/corner-radius treatment vs. real macOS
      (compare against `captures/` references).

### 3. Layout/measurement fidelity

- [ ] Per-surface delta passes against real captures using the existing
      `compare:*` contact sheets; log px-level corrections in
      `docs/prototypes/` as before.
- [ ] Density audit: real apps run tighter line-heights and smaller paddings
      than the current reconstructions in several surfaces.

### 4. Verification loop

- After each surface upgrade: `npm run capture:<surface>` and eyeball the PNG;
  regenerate the inventory (`npm run inventory:refresh`) periodically;
  side-by-side compare with `tools/make-comparison-sheet.sh` when a real
  reference capture exists.

## Evidence

- Audit table: session 2026-07-01 (50-file sweep, summarized above).
- Upgraded captures verified 2026-07-01: `captures/surface-claude-app/`,
  `captures/surface-finder-window-component/`, `captures/surface-browser-app/`,
  `captures/surface-mac-menu-bar/`.
- Registry `assetDecision`/`sourceEvidence` updated for the four upgraded
  surfaces; `npm run registry:check` passes.
