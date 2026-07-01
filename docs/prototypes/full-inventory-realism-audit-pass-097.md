# Full Inventory Realism Audit + Refinement (Pass 097)

Date: 2026-07-01

## What this pass did

Repo-wide fidelity audit of the surface inventory against real applications,
followed by a coordinated refinement sweep. Evidence used:

- Live macOS Tahoe captures taken on this machine during the pass (real
  Finder in column view on `demo-workspace/Launch Deck`, real menu bar, real
  Calendar month view). Live captures were reference-only and are not
  committed, per asset policy.
- `captures/finder-launch-deck/window.png` (existing real source capture).
- `reference/claude/images/current-app-2026-06-18/` (real + official Claude
  Cowork screenshots), `reference/codex/app-screenshots/`,
  `reference/figma/actual-app/`, `reference/word/screenshots/`,
  `reference/powerpoint/source-screenshots/`.

## Cross-cutting changes (every surface)

1. `styles/backlot-foundation.css` now applies
   `-webkit-font-smoothing: antialiased` / `-moz-osx-font-smoothing: grayscale`
   globally. Real macOS app text renders antialiased; default subpixel
   rendering made every surface read slightly heavy.
2. Traffic lights standardized: flat solid `#ff5f57 / #febc2e / #28c840`,
   12px diameter, 8px gap, `inset 0 0 0 0.5px rgba(0,0,0,0.12)` hairline.
   Removed glossy radial-gradient highlights (claude-app, finder-window) and
   off-spec hexes/sizes in other surfaces.
3. Hairlines moved toward translucent rgba values instead of solid grays
   where surfaces were touched.

## Core-slice changes

- `compositions/finder-window.html`: Tahoe chrome — frosted inset rounded
  sidebar panel, capsule toolbar groups with hairline+shadow, darker selected
  view segment, 15px/600 title, focused selection now blue `#3478f6` with
  white text (path column stays gray), selection-pulse animation retinted,
  16px window radius.
- `surfaces/claude-mac-finder.html`: same blue/gray selection split for the
  legacy `?mode=finder` primitive.
- `compositions/claude-app.html`: paper grid reduced to near-imperceptible
  (alpha 0.45 → 0.16, 48 → 56px cells) matching the real Cowork app; tool
  card rebuilt to real anatomy (terminal glyph + title left, trailing
  chevron, opaque `#fffefb` card, inner `#f6f4ee` code block with green
  `#2f7d4f` monospace); serif response resized from headline scale to real
  app scale (21px/1.42, uniform paragraphs); composer disclaimer line added
  ("Claude is AI and can make mistakes..."); account avatar now shows
  initials; sizes/weights matched to the 2026-06-18 real capture.
- Claude sibling components (~19 files): same treatment propagated where the
  patterns exist (grid, lights, cards, serif scale, disclaimer, initials).
  Launch-style cinematic surfaces intentionally keep oversized type.
- `compositions/mac-menu-bar.html`: status icon order corrected to match a
  real menu bar (battery, wifi, search, control center), menu text weight
  400 (app name 600), 10px item padding.
- `compositions/presentation-editor.html`: converted Windows-style ribbon to
  Microsoft 365 for Mac — group caption row removed, groups separated by
  translucent hairlines, centered controls, 10px labels; hid Windows quick
  access toolbar and titlebar app icon; filename without app-name suffix;
  12px flat traffic lights; selection handles now white circles with gray
  ring (real PowerPoint) instead of blue web-style squares.

## Delegated app-family changes

- Codex app/terminal: white sidebar, macOS font vars, commit-node glyph,
  meta-grid spacing fix, 12px lights/radius.
- Word/Excel: Mac-native titlebars, caption-less ribbons with accent
  underline (#2B579A / #217346), Mac popover menus, magenta comment
  balloons per reference, translucent hairlines, sheet-tab and grid header
  corrections. Removed the older Word-for-web chrome override.
- Figma editors, Premiere, browser chrome: see agent notes in this pass's
  session; browser tab curves, #DEE1E6 strip, #F1F3F4 URL pill; Premiere
  Spectrum-dark palette alignment.
- Calendar: Tahoe frosted inset sidebar over `#e2e2e5` canvas, capsule
  segmented control, capsule back/Today/forward group, right-aligned 11px
  day headers, weekend tinting (fixed a dead `:nth-of-type` selector),
  pastel event pills with darker same-hue text, 34px month title.

## Verification

- Every touched surface re-captured via its `capture:*` script and visually
  spot-checked against references; full capture sweep re-run at the end.
- `registry:check` and `registry:check:captures`: OK (51 surfaces, 51 ready
  captures). `catalog:generate`: regenerated. `hf:inspect`: OK.
- `example:quickstart:render`: 14.0s draft video rendered successfully.
- `hf:lint`: 19 pre-existing errors remain (21 before this pass). All are
  `invalid_parent_traversal_in_asset_path` cases introduced by the earlier
  repo-wide font adoption: `../styles/` imports in workflow wrappers,
  `../assets/` cursor paths, and `../runtime/` script refs. They are a
  dual-consumer conflict: local captures load compositions via `file://`
  (needs file-relative paths) while Studio/renders serve from the project
  root (needs root-relative). Template-embedded foundation imports in
  `browser-app`, `word-editor`, and `presentation-editor` were fixed this
  pass by moving them to outer preview-only style blocks (the pattern the
  clean component files already use — mounted children inherit fonts from
  the parent document). The remaining cases need a serving-model decision,
  e.g. switching `tools/capture-web-ui.mjs` to a local HTTP server rooted at
  the repo, after which all asset paths can become root-relative.
- `hf:validate`: navigation timeout in headless Chrome — verified
  pre-existing (fails identically with this pass's changes stashed);
  likely the CDN gsap fetch under headless/network variance.

## Known remaining gaps

- PowerPoint/Word/Excel ribbon icons are still simplified CSS glyphs, not
  Fluent-precise artwork.
- Word floating Track-Changes popover overlaps body text (inherited content
  choice, not chrome).
- Codex composer shadow depth slightly soft vs official screenshots.
- Menu bar keeps its registered 30px height (real Tahoe ≈ 24pt) to avoid
  rippling every wrapper layout; revisit if wrappers are re-measured.
- Live Claude/Terminal window captures were not obtainable this session
  (no Claude window opened; Terminal uses a custom user theme), so those
  surfaces rely on the on-disk reference set.
