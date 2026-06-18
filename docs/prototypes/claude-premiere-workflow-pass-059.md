# Claude Plus Premiere Workflow Pass 059

Date: 2026-06-18.

## Purpose

Add a focused Claude-plus-Premiere workflow wrapper. The project already had
standalone Claude and Premiere-style video editor components, but no reusable
composition for instructional videos where Claude is reviewing sequence notes,
trim points, graphics, or export prep while a Premiere-like timeline remains
visible behind it.

This pass makes that pairing directly importable and capturable without
browser, Finder, PowerPoint, Word, Excel, Figma, Codex terminal, or the full
desktop lab.

## Evidence Used

- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 055.
- `compositions/premiere-editor.html`
  - Used as the current editable Premiere-style video editor component from
    pass 025.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real
    child DOM instead of flattened screenshot plates.
- `docs/prototypes/claude-app-reference-breathing-room-pass-055.md`
  - Used for the current Claude component fidelity status and asset decision.
- `docs/prototypes/premiere-editor-surface-pass-025.md`
  - Used for the Premiere component donor references, local app availability
    check, and asset decision.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, typography, editable-surface
    requirements, and no-copied-product-assets rule.

## Changes

- Added `compositions/claude-premiere-workflow.html`.
  - Mounts only `claude-app.html` and `premiere-editor.html`.
  - Adds a parent Mac menu bar, desktop field, cursor, click ring, and GSAP
    focus choreography.
  - Applies Premiere-specific text replacements to the mounted Claude and video
    editor child components for this scene, so the shared component shells can
    remain reusable while the wrapper talks about sequence review and timeline
    edits.
  - Exposes `?capture=hero` for the stable composed frame.
- Updated `package.json`.
  - Added `npm run capture:claude-premiere-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-premiere-workflow` as a workflow depending only on
    `claude-app` and `premiere-editor`.

## Asset Decision

No Claude product code, Adobe product code, Premiere assets, screenshots,
private project files, account data, app bundle assets, or reference-video
frames were copied into the composition. The workflow assembles already-local
editable Backlot components through the local loader.

## Capture

- `npm run capture:claude-premiere-workflow`
- Output: `captures/surface-claude-premiere-workflow/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-premiere-workflow`
- Visual inspection confirmed Claude is the foreground working-thread surface
  and the Premiere-style editor remains visible as the timeline, monitor,
  project, properties, and audio-meter surface behind it, without browser,
  Finder, PowerPoint, Word, Excel, Figma, Codex terminal, or full desktop
  surfaces.
- `npm run registry:check` -> `26 surfaces, 13 components, 11 workflows, 26
  ready captures`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run hf:lint` -> 0 errors, 23 warnings, 17 info. The new workflow adds
  the expected mounted-component pointer advisory and parent-timeline advisory
  that match the other wrapper scenes.
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> duration `16.000000`, size `2736749`
- `git diff --check`

## Remaining Gaps

- The Premiere component still needs source-captured Adobe Premiere reference
  geometry before claiming pixel-level Premiere fidelity.
- The Claude child component still needs sanitized live Claude capture
  comparison before it can be treated as final.
- The parent wrapper does not yet coordinate child timeline handles; it uses
  static mounted component states plus parent-level camera/cursor choreography.
