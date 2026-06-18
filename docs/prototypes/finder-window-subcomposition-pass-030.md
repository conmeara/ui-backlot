# Finder Window Subcomposition Pass 030

Date: 2026-06-18

## Purpose

Split the Finder `Launch Deck` window out of the older full macOS/Claude/Finder
surface lab into a reusable HyperFrames subcomposition. This lets future demos
assemble scenes that need Finder plus Claude, Finder plus Codex, or Finder plus
PowerPoint without importing the whole desktop backlot.

## Evidence Used

- `captures/finder-launch-deck/window.png`
  - Source reference from the clean local Finder `Launch Deck` window capture.
- `captures/surface-finder-window/target.png`
  - Existing isolated `?mode=finder` editable prototype used as the extraction
    baseline.
- `snapshots/finder-source-vs-surface.jpg`
  - Prior source-vs-prototype comparison sheet.
- `surfaces/claude-mac-finder.html`
  - Existing hand-authored Finder reconstruction. This pass extracts its stable
    window/content structure into a HyperFrames component boundary.

## Changes

- Added `compositions/finder-window.html` as a direct-capturable
  HyperFrames subcomposition with:
  - 920x436 component boundary.
  - Finder traffic lights, sidebar, toolbar, view/action/search controls.
  - Column-view file browser for `Launch Deck`.
  - Editable CSS folder/document/preview/code icons.
  - Registered `window.__timelines["finder-window-surface"]` entrance and
    selection emphasis timeline.
- Added `npm run capture:finder-window` for the new component capture.
- Added `npm run compare:finder-window` to generate
  `snapshots/finder-source-vs-component.jpg`.
- Updated the surface and primitive inventories so the Finder component is
  listed alongside Claude, browser, Codex terminal, Office, Figma, and Premiere
  subcompositions.

## Asset Decision

No Apple Finder code, private files, SF Symbols, or app assets were copied. The
component is hand-authored HTML/CSS based on the local source capture and the
repo's existing editable Finder reconstruction.

## Verification

- `npm run capture:finder-window` refreshed
  `captures/surface-finder-window-component/target.png`.
- `npm run compare:finder-window` generated
  `snapshots/finder-source-vs-component.jpg`.
- The new component capture and comparison sheet were visually inspected.
- `npm run hf:lint` passed with `0 error(s), 12 warning(s), 9 info(s)`.
  Warnings are existing Studio editability notes for GSAP-owned animated
  elements; the new Finder component also reports the same intentional
  GSAP-owned editability warning for its entrance/selection timeline.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed across 9 sampled frames with zero layout issues.
- `npm run hf:snapshot` refreshed 7 frame snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,665,696 bytes.
- `node -e "JSON.parse(...package.json...)"` passed.
- `git diff --check` passed.

## Remaining Gaps

- Finder sidebar and toolbar icons remain CSS approximations instead of exact
  SF Symbols.
- Native sidebar vibrancy and source font rasterization are close but not
  pixel-matched.
- The full host workflow still contains legacy Finder markup. A future pass
  should mount `compositions/finder-window.html` into `index.html` or a lean
  Claude/Finder wrapper through `runtime/backlot-component-loader.js`.
