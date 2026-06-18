# Claude Plus Word Workflow Pass 057

Date: 2026-06-18.

## Purpose

Add a focused Claude-plus-Word workflow wrapper. The project already had standalone Claude and Word-style document editor components, but no reusable composition for instructional videos where Claude is guiding or reporting on document edits while a Word-like editor remains visible behind it.

This pass makes that pairing directly importable and capturable without browser, Finder, PowerPoint, Excel, Figma, Premiere, Codex terminal, or the full desktop lab.

## Evidence Used

- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 055.
- `compositions/word-editor.html`
  - Used as the current editable Word-style document editor component from pass 021.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real child DOM instead of flattened screenshot plates.
- `docs/prototypes/claude-app-reference-breathing-room-pass-055.md`
  - Used for the current Claude component fidelity status and asset decision.
- `docs/prototypes/word-editor-surface-pass-021.md`
  - Used for the Word component donor references and asset decision.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, typography, editable-surface requirements, and no-copied-product-assets rule.

## Changes

- Added `compositions/claude-word-workflow.html`.
  - Mounts only `claude-app.html` and `word-editor.html`.
  - Adds a parent Mac menu bar, desktop field, cursor, click ring, and GSAP focus choreography.
  - Applies Word-specific text replacements to the mounted Claude child component for this scene, so the shared Claude working-thread shell can remain reusable while the wrapper talks about document edits rather than deck edits.
  - Exposes `?capture=hero` for the stable composed frame.
- Updated `package.json`.
  - Added `npm run capture:claude-word-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-word-workflow` as a workflow depending only on `claude-app` and `word-editor`.

## Asset Decision

No Claude product code, Microsoft product code, Word assets, screenshots, private documents, account data, app bundle assets, or reference-video frames were copied into the composition. The workflow assembles already-local editable Backlot components through the local loader.

## Capture

- `npm run capture:claude-word-workflow`
- Output: `captures/surface-claude-word-workflow/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-word-workflow`
- Visual inspection confirmed Claude is the foreground working-thread surface and the Word-style document editor remains visible as the document review surface behind it, without browser, Finder, PowerPoint, Excel, Figma, Premiere, Codex terminal, or full desktop surfaces.
- `npm run registry:check` -> `24 surfaces, 13 components, 9 workflows, 24 ready captures`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run hf:lint` -> 0 errors, 21 warnings, 15 info. The new workflow adds the expected mounted-component pointer advisory and parent-timeline advisory that match the other wrapper scenes.
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> duration `16.000000`, size `2737661`
- `git diff --check`

## Remaining Gaps

- The Word component still needs source-captured Microsoft Word reference geometry before claiming pixel-level Word fidelity.
- The Claude child component still needs sanitized live Claude capture comparison before it can be treated as final.
- The parent wrapper does not yet coordinate child timeline handles; it uses static mounted component states plus parent-level camera/cursor choreography.
