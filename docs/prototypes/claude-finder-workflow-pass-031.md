# Claude Finder Workflow Pass 031

Date: 2026-06-18

## Purpose

Prove that UI Backlot can assemble a short workflow from only the needed
surfaces: Claude plus Finder, without importing the full desktop scene, browser
surface, or PowerPoint editor. This is the same modular direction as the
Claude/browser wrapper, but focused on the file/folder handoff workflow that
will recur in instructional videos.

## Evidence Used

- `compositions/claude-app.html`
  - Reusable Claude working-thread component refined in the dframe/fidelity
    passes.
- `compositions/finder-window.html`
  - Reusable Finder `Launch Deck` subcomposition extracted from the source
    Finder capture.
- `runtime/backlot-component-loader.js`
  - Existing local template-root loader used so parent wrapper captures contain
    real mounted child DOM instead of screenshot plates or visible iframes.
- `captures/surface-claude-finder-workflow/target.png`
  - New wrapper hero capture used as the visual quality gate for this pass.
- `DESIGN.md`
  - Used for warm Mac backlot palette, locked camera, precise cursor motion,
    and avoiding landing-page/explainer UI.

## Changes

- Added `compositions/claude-finder-workflow.html` as a 1920x1080 wrapper
  composition.
- Mounted only:
  - `compositions/finder-window.html`
  - `compositions/claude-app.html`
- Added parent-level scene context and choreography:
  - minimal macOS menu bar
  - subtle desktop field
  - cursor
  - click ring
  - temporary folder drag chip that fades after the handoff
- Added `npm run capture:claude-finder-workflow`.
- Updated primitive/surface inventories so this wrapper is listed as the lean
  Claude plus Finder assembly.

## Asset Decision

No new external assets, product code, screenshots, or private account data were
added. The wrapper composes existing hand-authored editable surfaces and the
local cursor path already documented from the ignored `macos-web` donor clone.

## Verification

- `npm run capture:claude-finder-workflow` refreshed
  `captures/surface-claude-finder-workflow/target.png`.
- The wrapper capture was visually inspected, then the drag chip/click ring
  choreography was tightened and recaptured.
- `node -e "JSON.parse(...package.json...)"` passed.
- `npm run hf:lint` passed with `0 error(s), 13 warning(s), 10 info(s)`.
  Warnings are the known Studio editability notes for GSAP-owned animated
  elements plus pointer-events notes for mounted child component roots.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed across 9 sampled frames with zero layout issues.
- `npm run hf:snapshot` refreshed 7 frame snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,664,631 bytes.
- `git diff --check` passed.

## Remaining Gaps

- The wrapper does not yet expose child timeline handles, so it choreographs
  only parent-level placement/cursor/drag states.
- The Finder and Claude child components remain independently editable, but the
  mounted child roots are intentionally `pointer-events: none` in the parent
  assembly for choreography/capture stability.
- A future `Claude + Finder + PowerPoint` wrapper should replace the legacy
  full host scene once the PowerPoint surface is source-captured.
