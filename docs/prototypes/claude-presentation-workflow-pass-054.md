# Claude Presentation Workflow Pass 054

Date: 2026-06-18.

## Purpose

This pass adds a focused Claude-plus-presentation workflow wrapper. The project
already had standalone Claude and PowerPoint-like presentation components, plus
focused wrappers for browser, Finder, and Codex terminal scenes. It did not yet
have a reusable composition for instructional videos where Claude is the
foreground planning or completion surface and a deck editor is visible behind
it. This pass makes that pairing directly importable and capturable without
browser, Finder, Codex terminal, or the full desktop lab.

## Evidence Used

- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 052.
- `compositions/presentation-editor.html`
  - Used as the current editable PowerPoint-like presentation component from
    pass 046.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real
    child DOM instead of flattened screenshot plates.
- `captures/surface-claude-app/target.png`
  - Used as the visual quality reference for the mounted Claude component.
- `captures/surface-presentation-editor/target.png`
  - Used as the visual quality reference for the mounted presentation editor
    component.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, editable-surface requirements, and
    no-copied-product-assets rule.

## Changes

- Added `compositions/claude-presentation-workflow.html`.
  - Mounts only `claude-app.html` and `presentation-editor.html`.
  - Adds a parent Mac menu bar, desktop field, cursor, click ring, and GSAP
    timeline.
  - Exposes `?capture=hero` for the stable composed frame.
- Updated `package.json`.
  - Added `npm run capture:claude-presentation-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-presentation-workflow` as a workflow depending only on
    `claude-app` and `presentation-editor`.

## Asset Decision

No Claude product code, Microsoft product code, PowerPoint assets, screenshots,
private deck data, account data, app bundle assets, or reference-video frames
were copied into the composition. The workflow assembles already-local editable
Backlot components through the local loader.

## Capture

- `npm run capture:claude-presentation-workflow`
- Output: `captures/surface-claude-presentation-workflow/target.png`

## Verification

- `npm run capture:claude-presentation-workflow`
  - Created `captures/surface-claude-presentation-workflow/target.png`.
  - Visual inspection confirmed Claude is the foreground working-thread surface
    and the PowerPoint-like presentation editor remains visible as the deck
    editing surface behind it, without browser, Finder, Codex terminal, or full
    desktop surfaces.
- `captures/surface-claude-presentation-workflow/visible-text.md`
  - Confirmed both mounted child DOM surfaces are present in the capture:
    Claude thread/task/context text and presentation ribbon/slide/inspector
    text.
- `npm run registry:check`
  - Passed: `22 surfaces, 13 components, 7 workflows, 22 ready captures`.
- JSON parse check for `package.json` and `surfaces/registry.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors. Existing warnings are GSAP Studio write-back/pointer
    and font advisories for the broader composition set; this wrapper adds the
    expected mounted-component pointer advisory and parent-timeline advisory.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with 0 issues.
- `npm run hf:snapshot`
  - Refreshed the 7-frame workflow snapshot set and
    `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2764464`
- `git diff --check`
  - Passed.

## Remaining Gaps

- The wrapper freezes child component states through parent positioning rather
  than driving child GSAP timelines directly.
- A source-captured PowerPoint reference is still needed before claiming exact
  presentation-editor geometry.
- A sanitized live Claude desktop/Cowork capture is still needed before
  claiming pixel-level accuracy for the Claude component itself.
