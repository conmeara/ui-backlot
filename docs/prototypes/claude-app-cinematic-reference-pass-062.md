# Claude App Cinematic Reference Pass 062

Date: 2026-06-18.

## Purpose

Improve the standalone Claude app capture against the Sonnet 4.6 launch-video
reference without breaking the fuller Claude working-thread component used by
workflow wrappers.

The previous direct capture still exposed too much app/task chrome for the
launch-reference shot language. This pass adds a separate cinematic capture
state so UI Backlot can render a sparse Claude reply beat when a video only
needs the answer/composer moment, while wrappers can still import the default
working-thread UI with sidebar, tool cards, and task rail.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for sparse ivory field, one-line serif answer, red response mark,
    compact composer, and large negative space.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for the centered answer-line and response-mark relationship.
- `reference/claude/frame-study/sonnet-4-6/frame-40s.jpg`
  - Used for title scale, line weight, and breathing room.
- `captures/surface-claude-app/target.png`
  - Used as the before/after quality gate for the direct Claude capture.
- `captures/surface-claude-browser-thread-workflow/target.png`
  - Used to verify that the default mounted Claude component still renders in
    workflow wrappers.
- `docs/prototypes/claude-app-reference-focus-pass-060.md`
  - Used as the previous fidelity baseline and remaining-gap list.
- `DESIGN.md`
  - Used for palette, typography, editable HTML constraints, and
    no-copied-product-assets guidance.

## Changes

- Updated `compositions/claude-app.html`.
  - Added `capture=cinematic` handling for direct preview mode.
  - Adds `data-cinematic-focus="true"` on the component and a matching body
    flag for a flat ivory capture background.
  - In cinematic mode, hides sidebar, topbar, user prompt, context pills, tool
    cards, command output, task rail, and attachment chips.
  - Repositions the assistant answer, response mark, and composer into a
    launch-reference composition.
  - Converts the running stop button back into the red send-arrow state for
    the cinematic composer.
  - Keeps `capture=reference` and the default imported component state intact.
- Updated `package.json`.
  - Pointed `npm run capture:claude-app` at
    `compositions/claude-app.html?capture=cinematic`.
- Updated `surfaces/registry.json`.
  - Pointed `claude-app` at this prototype note and described the dual-use
    standalone/import behavior.

## Asset Decision

No Claude product code, private account data, screenshots, official icons, app
bundle assets, or reference-video frames were copied into the composition. The
surface remains hand-authored editable HTML/CSS/GSAP using local fonts and
reference captures only as visual evidence.

## Capture

- `npm run capture:claude-app`
- Output: `captures/surface-claude-app/target.png`

## Verification

- `npm run capture:claude-app`
  - Wrote `captures/surface-claude-app/target.png`.
  - Visual inspection passed: the direct capture now reads as a sparse
    launch-reference Claude reply with one large serif answer, a red response
    mark, and a compact composer.
- `npm run capture:claude-browser-thread-workflow`
  - Wrote `captures/surface-claude-browser-thread-workflow/target.png`.
  - Visual inspection confirmed the default mounted Claude working-thread
    state still renders in wrappers; the cinematic state does not leak into
    imported workflow scenes.
- `npm run registry:check`
  - `Surface registry OK: 27 surfaces, 14 components, 11 workflows, 27 ready captures.`
- JSON parse check
  - `package.json` and `surfaces/registry.json` parsed successfully.
- `git diff --check`
  - Passed before and after HyperFrames verification.
- `npm run hf:lint`
  - Passed with `0 error(s), 25 warning(s), 18 info(s)`.
  - New warning: `compositions/claude-app.html` is now over the recommended
    composition size threshold and should be split in a future modularity pass.
  - Other warnings remain the expected registered-timeline and pointer/font
    advisories for existing animated surfaces.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with `errorCount: 0`, `warningCount: 0`, `issueCount: 0`.
- `npm run hf:snapshot`
  - Saved 7 snapshots plus `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Completed draft render to `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2740840`

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still required before
  claiming pixel-level accuracy for sidebar, model selector, composer, task
  rail, and message-card geometry.
- The cinematic state intentionally prioritizes launch-video composition over
  full app chrome accuracy.
- `compositions/claude-app.html` should be split into smaller subcomponents
  before much more Claude-specific styling is added.
- The CSS Claude mark is still an approximation and should not be treated as
  the official product asset.
