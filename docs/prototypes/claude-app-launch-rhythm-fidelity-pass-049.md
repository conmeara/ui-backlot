# Claude App Launch Rhythm Fidelity Pass 049

Date: 2026-06-18.

## Purpose

This pass pulls the reusable Claude working-thread component closer to the
Sonnet 4.6 launch-video rhythm without removing the editable task UI needed for
demo workflows. The prior pass had the right component boundary and context rail
but still read as a dense three-pane agent dashboard. This pass makes the center
feel more like Claude: warmer paper, larger serif response type, quieter cards,
less dominant side chrome, and a composer that behaves like a floating prompt
surface.

## Evidence Used

- `captures/surface-claude-app/target.png`
  - Used as the before/after quality gate for the working-thread component.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for the sparse ivory field, large serif response rhythm, small red
    Claude mark, pale user bubbles, and floating composer proportions.
- `captures/surface-claude-conversation/target.png`
  - Used as the strongest existing local translation of the launch-video sparse
    Claude canvas.
- `docs/prototypes/claude-app-context-rail-fidelity-pass-047.md`
  - Used as the prior component state and verification baseline.
- `DESIGN.md`
  - Used for palette, Anthropic font choices, editable UI constraints, and the
    no-copied-product-assets rule.

## Changes

- Updated `compositions/claude-app.html`.
  - Kept the importable `1180x780` component contract and
    `claude-app-surface` composition id.
  - Narrowed the left sidebar and right task rail while widening the central
    transcript area.
  - Added subtle paper-grid guide lines to the primary Claude pane, matching the
    quieter launch-frame field used elsewhere in the project.
  - Enlarged the assistant response and tightened its line-height so the
    response, not the tool cards, is the primary visual read.
  - Replaced the last context chip with a `Working in folder` pill so the
    context row reads as an active Claude affordance instead of a status dump.
  - Renamed the task cards to calmer, user-facing phrases:
    `Reading the selected context`, `Making the deck update`, and
    `Local plan preview`.
  - Softened task-card borders, backgrounds, and active rows.
  - Reduced the visual weight of the rail by renaming `Progress` to `Task`,
    shrinking status dots, and lowering rail opacity.
  - Raised the composer shadow and radius so it reads more like the floating
    Claude prompt card in the launch reference.

## Asset Decision

No Claude product code, private account data, screenshots, icons, app bundle
assets, or reference-video frames were copied into the composition. The surface
remains hand-authored editable HTML/CSS/GSAP using local fonts and reference
captures only as visual evidence.

## Capture

- `npm run capture:claude-app`
- Output: `captures/surface-claude-app/target.png`
- Regression wrapper captures:
  - `npm run capture:claude-browser-workflow`
  - `npm run capture:claude-finder-workflow`

## Verification

- `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
  - Visual inspection passed: the central response is more prominent, the
    sidebars recede, the compact Task rail no longer clips, and the floating
    composer remains inside the component frame.
- `npm run capture:claude-browser-workflow`
  - Refreshed `captures/surface-claude-browser-workflow/target.png`.
- `npm run capture:claude-finder-workflow`
  - Refreshed `captures/surface-claude-finder-workflow/target.png`.
- `npm run registry:check`
  - Passed: `18 surfaces, 13 components, 3 workflows, 18 ready captures`.
- JSON parse check for `package.json` and `surfaces/registry.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors. Existing warnings are GSAP Studio write-back/pointer
    and font advisories for the broader composition set.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with 0 issues after shortening the narrow rail label from
    `Prepare deck changes` to `Prepare slides`.
- `npm run hf:snapshot`
  - Refreshed the 7-frame workflow snapshot set and
    `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2774447`
- `git diff --check`
  - Passed.

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still required before
  claiming pixel-level accuracy for the sidebar, model selector, composer,
  task rail, and message-card geometry.
- The wrapper captures currently prove modular mounting still works, but their
  hero frames emphasize the attachment-draft state rather than this edited
  working-thread state.
- The CSS Claude mark is still an approximation and should not be treated as
  the official product asset.
