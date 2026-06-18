# Claude App Reference Focus Pass 060

Date: 2026-06-18.

## Purpose

Continue refining the reusable Claude working-thread component against the
Sonnet 4.6 launch reference. The previous component was more usable for
workflow demos, but the standalone Claude capture still read too much like an
operations dashboard: the right rail, stacked cards, and long deck-specific
answer competed with the sparse Claude response/composer rhythm in the
reference frames.

This pass adds a direct-capture reference-focus mode while preserving the
default mounted component state used by existing workflow wrappers.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for sparse ivory field, subdued operational chrome, large serif
    response hierarchy, and floating composer proportions.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for one-line answer rhythm, red starburst placement, and negative
    space around the answer.
- `captures/surface-claude-app/target.png`
  - Used as the before/after visual quality gate for the direct Claude capture.
- `docs/prototypes/claude-app-reference-breathing-room-pass-055.md`
  - Used as the previous fidelity baseline and remaining-gap list.
- `DESIGN.md`
  - Used for palette, Anthropic font choices, editable UI constraints, and the
    no-copied-product-assets rule.

## Changes

- Updated `compositions/claude-app.html`.
  - Added `data-reference-focus="true"` styling for the direct capture mode.
  - In reference focus mode, narrowed and faded side rails, softened guide
    lines, increased the central transcript width, enlarged the floating
    composer, and reduced reasoning/tool/command card weight.
  - In reference focus mode only, shortens the assistant answer copy to match
    the launch-reference one-line response rhythm.
  - Keeps the default component DOM and copy intact for workflow wrappers that
    mount `claude-app.html` through `runtime/backlot-component-loader.js`.
- Updated `package.json`.
  - Pointed `npm run capture:claude-app` at
    `compositions/claude-app.html?capture=reference`.
- Updated `surfaces/registry.json`.
  - Pointed the `claude-app` entry at this prototype note.

## Asset Decision

No Claude product code, private account data, screenshots, official icons, app
bundle assets, or reference-video frames were copied into the composition. The
surface remains hand-authored editable HTML/CSS/GSAP using local fonts and
reference captures only as visual evidence.

## Capture

- `npm run capture:claude-app`
- Output: `captures/surface-claude-app/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
  - Visual inspection confirmed the direct Claude capture now gives the
    assistant answer/composer more hierarchy, keeps the answer on one line, and
    reduces side-rail/card competition compared with pass 055.
- `npm run capture:claude-browser-thread-workflow`
  - Refreshed `captures/surface-claude-browser-thread-workflow/target.png`.
  - Visual inspection confirmed the default mounted Claude state still appears
    in wrapper scenes; the reference-focus mode does not leak into
    component-loader mounts.
- `npm run registry:check` -> `26 surfaces, 13 components, 11 workflows, 26
  ready captures`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run hf:lint` -> 0 errors, 23 warnings, 17 info. Warnings remain the
  expected registered-timeline and pointer/font advisories for existing
  animated surfaces.
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> duration `16.000000`, size `2733514`
- `git diff --check`

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still required before
  claiming pixel-level accuracy for sidebar, model selector, composer, task
  rail, and message-card geometry.
- The default mounted Claude working-thread state still carries deliberate demo
  affordances, especially the right task/context rail.
- The CSS Claude mark is still an approximation and should not be treated as
  the official product asset.
