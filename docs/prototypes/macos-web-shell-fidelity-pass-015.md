# macOS Web Shell Fidelity Pass 015

Date: 2026-06-18

## Purpose

Use `PuruVJ/macos-web` as the strongest macOS donor reference to improve the
editable Mac shell in UI Backlot without importing the Svelte app runtime.

The pass focused on the global illusion: menu bar, Dock, app icons, traffic
lights, and window shadow geometry.

## Donor Inputs

- `reference/open-source/macos-web/src/components/Dock/Dock.svelte`
- `reference/open-source/macos-web/src/components/Dock/DockItem.svelte`
- `reference/open-source/macos-web/src/components/TopBar/TopBar.svelte`
- `reference/open-source/macos-web/src/components/TopBar/MenuBar.svelte`
- `reference/open-source/macos-web/src/components/Desktop/Window/Window.svelte`
- `reference/open-source/macos-web/src/components/Desktop/Window/TrafficLights.svelte`
- `reference/open-source/macos-web/public/app-icons/*`

The donor code remains reference material. UI Backlot keeps hand-authored
HTML/CSS surfaces.

## Changes

- Reworked the main menu bar toward the donor's 1.8rem translucent system bar:
  smaller text, lighter weights, tighter menu button spacing, and stronger
  backdrop blur.
- Rebuilt the Dock geometry around the donor structure: centered glass shelf,
  58px app icons, open-app dots, divider, stronger inset and projected shadows,
  and tooltip slots.
- Swapped CSS-only letter tiles for local-only donor icon URLs for Finder,
  Safari, Keynote/PowerPoint, and Notes. Claude remains a hand-authored
  Claude-like icon.
- Tightened traffic-light sizing and added hover glyph affordances based on the
  donor traffic light component.
- Strengthened macOS window shadows using the donor's two-layer active window
  shadow model.
- Applied the same shell treatment to `surfaces/claude-mac-finder.html` so
  standalone captures and the main render stay aligned.
- Added `react-desktop` and `PptxGenJS` to `tools/clone-reference-repos.sh`,
  `reference/open-source/README.md`, and the donor research notes.

## Asset Decision

The donor app icons are used through local paths inside ignored donor clones.
They render when `tools/clone-reference-repos.sh` has restored
`reference/open-source/macos-web`, but they are not committed or redistributed.

This keeps the demo visually closer during local fidelity work while avoiding a
rights decision about bundling Apple-like app icon assets.

## Verification

- `npm run hf:lint`
  - Passed with existing GSAP editability warnings and pointer-events info for
    intentionally non-editable primitives.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with `ok: true`, `errorCount: 0`, `warningCount: 0`.
- `npm run capture:finder`
  - Refreshed `captures/surface-finder-window/target.png`.
- `npm run capture:surface`
  - Refreshed `captures/surface-claude-mac-finder/target.png`.
- `npm run capture:browser-app`
  - Refreshed `captures/surface-browser-app/target.png`.
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.

## Remaining Gaps

- The Finder internals still use hand-authored file/icon shapes. Next Finder
  fidelity pass should use real Finder captures and compare against
  `react-desktop` / AppKit-style sidebar measurements.
- The menu bar status icons are still simplified CSS glyphs.
- Donor app icon paths depend on local ignored clones; a fresh checkout must run
  `tools/clone-reference-repos.sh` to see them.
