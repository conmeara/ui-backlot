# Dark Variants Pass (Pass 101)

Date: 2026-07-01 (evening). Follows pass 100.

## Method

The owner enabled system dark mode and signed into Figma; dark ground truth
was captured live via computer-use for **Calendar (month + week), Finder,
menu bar, Chrome, Codex, and Figma** (a Design draft was created to expose
the dark UI3 editor chrome — the owner's recents are all FigJam). Claude
desktop still cannot be made to open a window programmatically, so its dark
tokens are conservative product knowledge. Observations were encoded as
exact token specs and executed by the `pass101-dark-variants` workflow
(Sonnet fixers, Opus on claude; Opus judges enforcing TWO invariants —
dark fidelity AND light-capture invariance; Sonnet integrator + gate).

## Mechanism

- `tools/capture-web-ui.mjs` gained a `--root-class` flag: it adds a class
  (e.g. `theme-dark`) to the capture root before screenshotting.
- Each surface got ONE scoped `.theme-dark` override block appended as the
  LAST style block (wins the cascade), touching only color/border/shadow
  tokens. Same markup, zero duplication; the light rendering is unchanged.
- Ten `capture:<surface>-dark` scripts + ten `<surface>-dark` registry
  entries pair each variant with its base surface.

## Coverage (10 dark surfaces)

calendar-app, finder-window, mac-menu-bar, browser-app, codex-app,
codex-thread-core, figma-editor, claude-desktop-chat, claude-desktop-cowork,
claude-thread-core. Not darkened: premiere/codex-terminal/claude-desktop-code
(dark-native), Office family (no dark refs; queued), figma-onboarding
(queued with the UI3.x redesign).

## Key token decisions (from live observation)

- Calendar dark: `#1c1c21` grid / `#232329` chrome; events keep bright
  left bars, backgrounds drop to ~20% color-over-dark, text becomes a light
  tint of the calendar color; red now-pill and today circle unchanged.
- Codex dark is WARM (`#212019` canvas, cream `#ece9dd` headings) — not a
  neutral gray; Full-access orange brightens to `#e06c33`.
- Chrome dark: `#202126` strip / `#35363b` active tab + omnibox; the
  webpage content area stays light (content vs chrome rule).
- Figma dark UI3: `#2c2c2c` panels / `#1e1e1e` canvas / `#0d99ff` accents
  unchanged; design content on canvas stays light.
- Menu bar dark: glyphs flip to `#f5f5f7` over a `rgba(28,28,32,.55)` scrim.
- Claude dark (product knowledge): `#262624` canvas / `#1f1e1c` sidebar,
  terracotta accents unchanged.

## Verification

Six of seven families judged **improved** with light captures confirmed
unchanged and zero regressions. The browser fixer completed its edits but
crashed emitting structured output (never machine-judged); it was judged
manually in-session: both dual-source files carry identical 21-rule
`.theme-dark` blocks, the dark capture matches live dark Chrome, page
content stays light. Gate: 68/68 capture scripts pass, registry
**65 surfaces / 46 components / 17 workflows / 65 ready captures**, hf:lint
exactly at the 19-error baseline, catalog + inventory regenerated,
quickstart renders (14.0s).

## Notes / remaining

- Naming asymmetry: finder's light capture slug is
  `surface-finder-window-component` but the dark one is
  `surface-finder-window-dark` (integrator normalized to the surface name).
- Judge nits: dark menu-bar scrim could be a touch cooler/darker; calendar
  dark popover rules are untested (not instantiated in the surface).
- Dark variants for Office family + figma-onboarding queued; Claude dark
  should be re-verified against the live app when a window is available.
- Review deck (`captures/review/index.html`, gitignored) now has 31 slides:
  each dark variant is paired with its light sibling for A/B annotation.
