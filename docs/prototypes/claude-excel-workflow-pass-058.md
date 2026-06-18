# Claude Plus Excel Workflow Pass 058

Date: 2026-06-18.

## Purpose

Add a focused Claude-plus-Excel workflow wrapper. The project already had standalone Claude and Excel-style workbook components, but no reusable composition for instructional videos where Claude is checking formulas, workbook context, or a chart range while an Excel-like surface remains visible behind it.

This pass makes that pairing directly importable and capturable without browser, Finder, PowerPoint, Word, Figma, Premiere, Codex terminal, or the full desktop lab.

## Evidence Used

- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 055.
- `compositions/excel-workbook.html`
  - Used as the current editable Excel-style workbook component from pass 022.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real child DOM instead of flattened screenshot plates.
- `docs/prototypes/claude-app-reference-breathing-room-pass-055.md`
  - Used for the current Claude component fidelity status and asset decision.
- `docs/prototypes/excel-workbook-surface-pass-022.md`
  - Used for the Excel component donor references, local app availability check, and asset decision.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, typography, editable-surface requirements, and no-copied-product-assets rule.

## Changes

- Added `compositions/claude-excel-workflow.html`.
  - Mounts only `claude-app.html` and `excel-workbook.html`.
  - Adds a parent Mac menu bar, desktop field, cursor, click ring, and GSAP focus choreography.
  - Applies Excel-specific text replacements to the mounted Claude and workbook child components for this scene, so the shared component shells can remain reusable while the wrapper talks about workbook and chart-range work.
  - Exposes `?capture=hero` for the stable composed frame.
- Updated `package.json`.
  - Added `npm run capture:claude-excel-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-excel-workflow` as a workflow depending only on `claude-app` and `excel-workbook`.

## Asset Decision

No Claude product code, Microsoft product code, Excel assets, screenshots, private workbooks, account data, app bundle assets, or reference-video frames were copied into the composition. The workflow assembles already-local editable Backlot components through the local loader.

## Capture

- `npm run capture:claude-excel-workflow`
- Output: `captures/surface-claude-excel-workflow/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-excel-workflow`
- Visual inspection confirmed Claude is the foreground working-thread surface and the Excel-style workbook remains visible as the spreadsheet/formula/chart surface behind it, without browser, Finder, PowerPoint, Word, Figma, Premiere, Codex terminal, or full desktop surfaces.
- `npm run registry:check` -> `25 surfaces, 13 components, 10 workflows, 25 ready captures`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run hf:lint` -> 0 errors, 22 warnings, 16 info. The new workflow adds the expected mounted-component pointer advisory and parent-timeline advisory that match the other wrapper scenes.
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> duration `16.000000`, size `2736842`
- `git diff --check`

## Remaining Gaps

- The Excel component still needs source-captured Microsoft Excel reference geometry before claiming pixel-level Excel fidelity.
- The Claude child component still needs sanitized live Claude capture comparison before it can be treated as final.
- The parent wrapper does not yet coordinate child timeline handles; it uses static mounted component states plus parent-level camera/cursor choreography.
