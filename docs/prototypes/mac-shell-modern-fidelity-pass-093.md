# macOS Shell Modern Fidelity Pass 093

Date: 2026-06-18.

## Purpose

Improve the editable macOS shell primitives so Backlot desktop scenes read as a
modern Mac while remaining hand-authored HTML/CSS for HyperFrames and Remotion.
This pass stays out of deep Finder file-list fidelity; it focuses on the shell
around app surfaces.

## References

- `reference/open-source/macos-web` at
  `f0d4d4db147a1e5706bd3262e5aec5a08cef4026`, MIT license. Used for menu bar
  structure, Dock glass/shadow geometry, cursor asset states, traffic-light
  hover behavior, and active-window shadow vocabulary.
- `reference/open-source/playground-macos` at
  `2c9e82dca487432ad9922ddf9b0a26aadeae81e5`, MIT license. Used as a second
  React reference for app/menu grouping, Dock placement, search/control center
  slots, and window/Dock boundaries.
- `reference/open-source/macos-portfolio` at
  `23fe176c6e49d27edb06df365e11ba14708ea9a9`, MIT license. Used as a second
  Svelte reference for always-visible Dock, menu bar density, action center,
  and active window framing.
- Apple Support, [Desktop and menu bar on your Mac](https://support.apple.com/guide/imac/desktop-and-menu-bar-apd65991c417/mac).
  Used as platform reference for menu bar top placement, Dock bottom placement,
  Apple/app menu ordering, and right-side Wi-Fi/Control Center/battery/search
  affordances.
- Apple Support, [Change Desktop & Dock settings on Mac](https://support.apple.com/guide/mac-help/change-desktop-dock-settings-mchlp1119/mac).
  Used as platform reference for Dock size, magnification, open-app indicators,
  Dock position, and window behavior between menu bar and Dock.
- Bjango, [Designing macOS menu bar extras](https://bjango.com/articles/designingmenubarextras/).
  Used for practical menu-bar extra sizing: modern menu bars around 24pt,
  22pt working area, and roughly 16pt icon weight.

## Current Deltas

1. `mac-menu-bar` used Anthropic Sans instead of the macOS system text stack.
2. `mac-menu-bar` had only Wi-Fi, battery, and combined date/time; modern shell
   references also show search and Control Center-style slots.
3. Menu bar item boxes occupied the full 30px height instead of a 22-24px
   working area for text/icons.
4. Menu bar text spacing was wider and heavier than the donor references.
5. The desktop wallpaper used two radial light blooms and a single diagonal
   gradient, which felt more illustrative than a macOS abstract desktop field.
6. The wrapper menu bar and standalone `mac-menu-bar` had different font,
   spacing, and status icon vocabularies.
7. The Dock shelf was a bit tall and toy-like, with heavier icon shadows and
   less refined glass than the donor Dock references.
8. Active and inactive window shadows were too similar, so foreground focus was
   carried mostly by overlap rather than depth.
9. Cursor support was only a single normal-select asset, even though workflow
   scenes need text, link, drag, and default states.
10. The right-side status cluster in the desktop wrapper lacked a search glyph
    and had oversized gaps compared with the 16pt/22pt menu-extra reference.
11. The CSS shell vocabulary was duplicated across the desktop wrapper and
    shared workflow stylesheet, making later wrapper scenes likely to drift.
12. The component had no simple data hook for active app state, so future scenes
    could not identify which app the menu bar represents.

## Changes

- Rebuilt `compositions/mac-menu-bar.html` around the system font stack,
  24px menu-item hit areas, a `data-active-app` hook, tighter app-menu spacing,
  and richer right-side search, Control Center, Wi-Fi, battery, date, and time
  groups.
- Updated `surfaces/claude-mac-finder.html` with the same menu/status
  treatment and kept the visible cursor on the normal Mac pointer while adding
  reusable `text`, `link`, and `drag` cursor states.
- Reworked the desktop wallpaper into layered editable CSS gradients inspired
  by modern macOS abstract color fields without importing Apple wallpaper
  assets.
- Tuned the Dock shelf to a smaller 78px glass slab, 56px icons, subtler gaps,
  stronger backdrop blur, and a cleaner projected shadow.
- Split active and inactive window shadows so the foreground Claude window reads
  as active and the Finder window can sit behind it with a quieter shadow.
- Mirrored the shell CSS variables and primitive treatments in
  `styles/workflow.css` so workflow wrappers can inherit the same menu bar,
  status icon, Dock, cursor, wallpaper, and shadow vocabulary.

## Asset Decision

The implementation remains editable HTML/CSS. The macOS pointer and local Dock
icons still reference the ignored `macos-web` clone when available, following
the existing local-only donor-asset decision. No Apple wallpaper, SF Symbols,
private screenshots, GPL code, or donor runtime code was copied into Backlot.

## Verification

Passed:

- `npm run capture:mac-menu-bar`
- `npm run capture:surface`
- `npm run capture:finder`
- Full ready-capture refresh for missing ignored `captures/*` artifacts.
- `npm run registry:check`
  - `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`
- `git diff --check`

The first baseline run failed because `node_modules` was absent and Playwright
could not be imported. `npm ci` restored the lockfile dependencies. A fresh
worktree also lacked most ignored capture artifacts, so `registry:check`
initially failed on missing capture paths; regenerating the ready captures made
the registry gate pass.

## Remaining Deltas

- The Dock still uses local donor icon paths; a fresh checkout needs
  `tools/clone-reference-repos.sh` or a future audited asset strategy.
- Dock magnification and bounce are not implemented yet; only the static
  geometry is represented.
- Menu bar variants still need a small data/API layer for active app name,
  menus, battery state, dark mode, display notch mode, and clock updates.
- Finder internals remain hand-authored and should stay with the Finder thread
  unless shell integration requires a small adjustment.
- The desktop wallpaper is a CSS approximation, not a pixel match to any Apple
  wallpaper.
