# Claude Codex Terminal Workflow Pass 053

Date: 2026-06-18.

## Purpose

This pass adds a focused Claude-plus-Codex CLI workflow wrapper. The library
already had standalone Claude and Codex terminal components, plus Claude
wrappers for browser and Finder scenes. It did not yet have a reusable
composition for instructional videos where Claude is the foreground planning or
supervision surface and Codex CLI is executing in Terminal behind it. This pass
makes that pairing directly importable and capturable without browser, Finder,
Office, or the full desktop scene.

## Evidence Used

- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 052.
- `compositions/codex-terminal.html`
  - Used as the current Codex CLI/Terminal component from pass 048.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real
    child DOM instead of flattened screenshot plates.
- `captures/surface-claude-app/target.png`
  - Used as the visual quality reference for the mounted Claude component.
- `captures/surface-codex-terminal/target.png`
  - Used as the visual quality reference for the mounted Codex terminal
    component.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, editable-surface requirements, and
    no-copied-product-assets rule.

## Changes

- Added `compositions/claude-codex-terminal-workflow.html`.
  - Mounts only `claude-app.html` and `codex-terminal.html`.
  - Adds a parent Mac menu bar, desktop field, cursor, click ring, and GSAP
    timeline.
  - Exposes `?capture=hero` for the stable composed frame.
- Updated `package.json`.
  - Added `npm run capture:claude-codex-terminal-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-codex-terminal-workflow` as a workflow depending only on
    `claude-app` and `codex-terminal`.

## Asset Decision

No Claude product code, Codex product code, Apple Terminal assets, screenshots,
private terminal sessions, account data, app bundle assets, or reference-video
frames were copied into the composition. The workflow assembles already-local
editable Backlot components through the local loader.

## Capture

- `npm run capture:claude-codex-terminal-workflow`
- Output: `captures/surface-claude-codex-terminal-workflow/target.png`

## Verification

- `npm run capture:claude-codex-terminal-workflow`
  - Created `captures/surface-claude-codex-terminal-workflow/target.png`.
  - Visual inspection confirmed Claude is the foreground working-thread surface
    and Codex CLI remains visible as the execution surface behind it, without
    browser, Finder, Office, or full desktop surfaces.
- `captures/surface-claude-codex-terminal-workflow/visible-text.md`
  - Confirmed both mounted child DOM surfaces are present in the capture:
    Claude thread/task/context text and Codex terminal/transcript/verification
    text.
- `npm run registry:check`
  - Passed: `21 surfaces, 13 components, 6 workflows, 21 ready captures`.
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
  - HyperFrames reduced render workers after calibration for this heavier
    capture workload, then completed normally.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2767847`
- `git diff --check`
  - Passed.

## Remaining Gaps

- The wrapper freezes child component states through parent positioning rather
  than driving child GSAP timelines directly.
- A sanitized live Codex CLI interaction capture would still help refine exact
  transcript rhythm and terminal prompt behavior.
- A sanitized live Claude desktop/Cowork capture is still needed before
  claiming pixel-level accuracy for the Claude component itself.
