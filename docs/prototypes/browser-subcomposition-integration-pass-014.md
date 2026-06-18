# Browser Subcomposition Integration Pass 014

Date: 2026-06-18.

## Purpose

This pass moves the donor-informed browser/app surface from a standalone lab
into the actual render path. The goal was to make the `browser-app-window`
primitive part of the 16 second HyperFrames workflow while preserving the
current Claude/Finder/PowerPoint focus.

## Built

- Added `compositions/browser-app.html`, a reusable `browser-app-surface`
  HyperFrames sub-composition derived from `surfaces/browser-app-surface.html`.
- Mounted the browser sub-composition in `index.html` as
  `#browser-app-clip`, using the same editable browser/window UI rather than a
  raster screenshot.
- Added host timeline choreography so the browser/app appears as a soft
  background app plate during the intro, then clears before the Finder/Claude
  workflow becomes dense.
- Added a small internal browser timeline for entrance, selected-row color, and
  sync-dot pulse.
- Replaced `font-family: inherit` in the browser surface and generated
  sub-composition with explicit `Anthropic Sans` fallback stacks to avoid
  non-deterministic font warnings during render.

## Technique Notes

The first integration attempt mounted a 1516x864 sub-composition inside a
smaller 930x530 host box. `hyperframes inspect` correctly failed with child
overflow and text occlusion, because the subcomposition content was clipped
instead of scaled and stayed visible underneath Claude/Finder text.

The fix was to keep the host wrapper at the sub-composition's real dimensions,
scale the wrapper with CSS, avoid host timeline `scale` tweens on that wrapper,
and schedule the browser app as an intro/background plate that fades out before
the main app windows overlap it.

## Verification

- `npm run capture:browser-app`
  - Updated `captures/surface-browser-app/target.png`.
- `npm run hf:lint`
  - Passed with expected `gsap_studio_edit_blocked` warnings for timeline
    controlled selectors and pointer-events info.
- `npm run hf:validate`
  - Passed; no console errors.
- `npm run hf:inspect`
  - Final solo run passed with `ok: true`, `errorCount: 0`,
    `warningCount: 0`.
  - A parallel run timed out once; rerunning solo completed normally.
- `npm run hf:snapshot`
  - Updated `snapshots/contact-sheet.jpg` and
    `snapshots/frame-00-at-1.0s.png`.
- `npm run compare:sheets`
  - Updated `snapshots/reference-vs-prototype-contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
  - Final `ffprobe`: duration `16.000000`, size `2604305`.
- Preview server check:
  - `curl -fsS http://localhost:3017` returned `preview-ok`.

## Visual Result

`snapshots/frame-00-at-1.0s.png` now shows the browser/app surface as a blurred,
subdued background app behind the Claude intro copy. This keeps the scene closer
to the launch-reference feel: code-native UI surfaces are visible, but the first
read remains editorial and calm.

## Remaining Gaps

- The browser/app content is still generic. It should be replaced or branched
  once a real Airtable, Figma web, dashboard, or other browser workflow target
  is selected.
- `compositions/browser-app.html` is currently mechanically derived from the
  standalone surface. If browser scenes become central, this should become a
  shared React/HTML partial or a small generator so the standalone lab and
  mounted composition cannot drift.
- The browser app is visible only as a background plate in the main workflow.
  A future browser-specific demo should foreground it and animate real tab,
  row, URL, and app-state changes.
