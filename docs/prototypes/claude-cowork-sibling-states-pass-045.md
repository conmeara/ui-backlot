# Claude Cowork Sibling States Pass 045

Date: 2026-06-18

## Purpose

Bring the reusable Claude attachment-draft and completed-tool-result states up
to the same Cowork-style shell introduced in
`claude-app-cowork-rail-fidelity-pass-044.md`. The goal is for a video to swap
between pre-submit, active-working, and completed states without the Claude app
changing visual systems or component dimensions.

## Evidence Used

- `captures/surface-claude-attachment-draft/target.png`
  - Used as the attachment-state before/after visual quality gate.
- `captures/surface-claude-tool-result/target.png`
  - Used as the completed-state before/after visual quality gate.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm ivory field, clay mark color, launch-style prompt card, and
    compact composer rhythm.
- `https://simonwillison.net/2026/Jan/12/claude-cowork/`
  - Used as public layout evidence for the Claude Cowork left mode/task
    sidebar, central task area, and right Progress/Artifacts/Context rail.
    Used visually; no screenshot or code was copied into the repo.
- `docs/prototypes/claude-app-cowork-rail-fidelity-pass-044.md`
  - Used as the local component-family target for width, mode tabs, right rail,
    task language, and no-copied-assets constraints.
- `DESIGN.md`
  - Used for safe editable UI constraints, Anthropic font choices, warm
    palette, and no copied product assets.

## Changes

- Updated `compositions/claude-attachment-draft.html`.
  - Widened the component from `980x760` to `1180x780`.
  - Changed the shell to the same three-column layout: sidebar, draft/task
    stage, and agent context rail.
  - Added Chat/Code/Cowork mode tabs, `New task`, `Search tasks`, active task
    rows, sidebar context state, and a 12-ray CSS Claude mark.
  - Added a right rail with Progress, Context, Artifacts, Connectors, and
    Working files while preserving the attached-folder card, draft prompt, and
    folder chooser popover.
- Updated `compositions/claude-tool-result.html`.
  - Widened the component from `980x760` to `1180x780`.
  - Added the same Cowork mode/sidebar treatment and right rail.
  - Preserved the completed assistant response, completed-changes card, updated
    file artifact card, and follow-up composer.
- Updated `compositions/claude-browser-workflow.html` and
  `compositions/claude-finder-workflow.html`.
  - Set the mounted draft/thread Claude components to the same dimensions and
    scale so state swaps do not crop or jump.
- Updated `package.json` capture viewports and `surfaces/registry.json`
  dimensions/evidence/prototype-note pointers for both sibling states.
- Updated `SURFACES.md`, `surfaces/README.md`, and `PRIMITIVES.md`.

## Asset Decision

No Claude product code, private account data, app screenshots, icons, or copied
assets were added to the repo. Public and local references were used only to
derive layout, spacing, and state vocabulary. The surfaces remain hand-authored
editable HTML/CSS using project-local fonts.

## Verification

- Passed: `npm run capture:claude-attachment-draft`
  - Refreshed `captures/surface-claude-attachment-draft/target.png`.
- Passed: visual inspection of `captures/surface-claude-attachment-draft/target.png`.
  - Confirmed the widened shell, draft prompt card, folder popover, right rail,
    and bottom account state are visible without clipping.
- Passed: `npm run capture:claude-tool-result`
  - Refreshed `captures/surface-claude-tool-result/target.png`.
- Passed: visual inspection of `captures/surface-claude-tool-result/target.png`.
  - Confirmed the completed response, result rows, updated-file artifact,
    follow-up composer, and right rail are visible without clipping.
- Passed: `npm run capture:claude-browser-workflow`
  - Refreshed `captures/surface-claude-browser-workflow/target.png`.
- Passed: `npm run capture:claude-finder-workflow`
  - Refreshed `captures/surface-claude-finder-workflow/target.png`.
- Passed: visual inspection of refreshed wrapper captures.
- Passed: `npm run registry:check`
  - `Surface registry OK: 18 surfaces, 13 components, 3 workflows, 18 ready captures.`
- Passed: JSON parse checks for `package.json` and `surfaces/registry.json`.
- Passed: `npm run hf:lint`
  - `0 error(s), 17 warning(s), 11 info(s)`
  - Warnings are expected GSAP-owned editability and pointer-events notes.
- Passed: `npm run hf:validate`
  - No console errors.
- Passed: `npm run hf:inspect`
  - Zero issues across 9 sampled frames.
- Passed: `npm run hf:snapshot`
  - Refreshed 7 root timeline snapshots and `snapshots/contact-sheet.jpg`.
- Passed: `npm run hf:render`
  - Wrote `renders/claude-keynote-workflow-draft.mp4`.
- Passed: `ffprobe` on `renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2713910`
- Passed: `git diff --check`

## Remaining Gaps

- Sanitized live Claude desktop/Cowork captures are still needed before
  claiming pixel-level accuracy for the mode tabs, right rail, connector rows,
  and state-specific task spacing.
- The CSS Claude mark remains an approximation. Do not copy the real Claude app
  icon without a separate asset/license decision.
- Claude home/new-chat still uses its own launch-style centered state; it may
  stay separate or receive a Cowork variant later if we need an exact
  task-start surface.
