# Claude App Context Rail Fidelity Pass 047

Date: 2026-06-18.

## Purpose

This pass refines the reusable Claude working-thread component after the
Cowork-style rail pass. The prior version had the right structure but still
felt too much like a dense generic agent dashboard. This pass moves the surface
toward the Sonnet 4.6 reference rhythm: a calmer central paper canvas, visible
folder/file context, flatter task cards, and a right rail that reads as Claude
working through selected project context.

## Evidence Used

- `captures/surface-claude-app/target.png`
  - Used as the before/after visual quality gate.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm ivory field, compact context/composer rhythm, clay mark
    color, and the reference's restrained Claude response treatment.
- `docs/prototypes/claude-app-cowork-rail-fidelity-pass-044.md`
  - Used as the existing local component-family target for dimensions, shell
    semantics, and no-copied-assets constraints.
- `DESIGN.md`
  - Used for editable UI constraints, Anthropic fonts, warm palette, and
    no-product-asset constraints.

## Changes

- Updated `compositions/claude-app.html`.
  - Kept the reusable component contract at `1180x780`.
  - Shifted width from side rails into the central thread by narrowing the
    sidebar and right context rail.
  - Added a thread context strip under the user prompt with editable folder,
    spreadsheet, notes, and PowerPoint-open chips.
  - Renamed the topbar sublabel to `Working in Launch Deck`.
  - Flattened thinking/tool/command cards so the thread feels more like Claude's
    paper canvas and less like a heavy dashboard.
  - Rebuilt the Progress rail with a status pill and per-step rows for read,
    map, prepare, and return states.
  - Added a quiet local-context note at the bottom of the rail.
  - Added finite GSAP entrances for the new context chips and progress rows.

## Asset Decision

No Claude product code, private account data, screenshots, icons, or app assets
were copied. The component remains hand-authored editable HTML/CSS/GSAP using
project-local fonts and safe reference media for visual direction only.

## Capture

- `npm run capture:claude-app`
- Output: `captures/surface-claude-app/target.png`

## Verification

- `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
- Visual inspection of `captures/surface-claude-app/target.png`
  - Confirmed the context strip, calmer central cards, and rebuilt progress rail
    are visible without clipping.
- `npm run capture:claude-browser-workflow`
  - Refreshed `captures/surface-claude-browser-workflow/target.png`.
- `npm run capture:claude-finder-workflow`
  - Refreshed `captures/surface-claude-finder-workflow/target.png`.
- Visual inspection of refreshed wrapper captures
  - Confirmed modular wrapper scenes still mount without crop or scale breaks.
- `npm run registry:check`
  - Passed: 18 surfaces, 13 components, 3 workflows, 18 ready captures.
- JSON parse checks for `package.json` and `surfaces/registry.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors, 17 expected GSAP Studio write-back warnings, and
    11 pointer/font info notes across the animated surface set.
- `npm run hf:validate`
  - Passed; no console errors.
- `npm run hf:inspect`
  - Passed with `ok: true`, `errorCount: 0`, `warningCount: 0`.
- `npm run hf:snapshot`
  - Updated `snapshots/contact-sheet.jpg` and frames at 1.0s, 3.0s, 5.4s,
    7.8s, 10.1s, 12.6s, and 15.0s.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
  - `ffprobe`: duration `16.000000`, size `2773093`.
- `git diff --check`
  - Passed.

## Remaining Gaps

- Sanitized live Claude desktop/Cowork captures are still needed before
  claiming pixel-level accuracy for the app shell, task rail, mode tabs, and
  composer geometry.
- The CSS Claude mark remains an approximation. Do not copy the real Claude app
  icon without a separate asset/license decision.
- This pass intentionally updates the active working-thread surface only. The
  home, attachment-draft, sparse conversation, and tool-result surfaces remain
  separate reusable states.
