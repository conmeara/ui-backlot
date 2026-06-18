# Claude App Cowork Rail Fidelity Pass 044

Date: 2026-06-18

## Purpose

Move the reusable Claude working-thread component closer to current Claude
desktop/Cowork task UI while preserving it as an editable HyperFrames
subcomposition. The previous pass improved the shell and message texture, but
the app still read mostly as a generic chat sidebar. This pass adds the
task-oriented layout signals visible in public Claude Cowork references:
mode tabs, New task language, a central working thread, and a right rail for
progress, artifacts, context, connectors, and working files.

## Evidence Used

- `captures/surface-claude-app/target.png`
  - Used as the before/after visual quality gate.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm ivory field, clay mark color, and compact `Reply...`
    composer rhythm.
- `https://simonwillison.net/2026/Jan/12/claude-cowork/`
  - Used as public layout evidence for Claude Cowork: left mode/task sidebar,
    central task thread, right Progress/Artifacts/Context rail, and command
    card rhythm. Used visually; no screenshot or code was copied into the repo.
- `/Applications/Claude.app/Contents/Resources/ion-dist/assets/v1/*.css`
  - Kept as reference-only context for dframe/epitaxy sizing vocabulary from
    earlier passes.
- `DESIGN.md`
  - Used for safe editable UI constraints, Anthropic font choices, warm
    palette, and no copied product assets.

## Changes

- Updated `compositions/claude-app.html`.
  - Widened the component from `980x760` to `1180x780` so the right rail can
    exist as editable UI rather than a cramped overlay.
  - Changed the shell to a three-column app layout: sidebar, thread pane, and
    agent context rail.
  - Added Chat/Code/Cowork mode tabs and changed the primary action from
    `New chat` to `New task`.
  - Added a right rail with Progress, Artifacts, Context, Connectors, and
    Working files sections.
  - Added an editable command-output card beneath the tool progress rows.
  - Updated the thread title/subtitle to read like a Claude Cowork task while
    retaining sanitized Launch Deck content.
- Updated parent dimensions in `index.html`, `styles/workflow.css`,
  `compositions/claude-browser-workflow.html`, and
  `compositions/claude-finder-workflow.html` so modular wrapper captures do not
  crop the widened Claude component.
- Updated `package.json` capture viewport and `surfaces/registry.json`
  dimensions/evidence/prototype note.
- Updated `SURFACES.md`, `surfaces/README.md`, and `PRIMITIVES.md`.

## Asset Decision

No Claude product code, private account data, app screenshots, icons, or copied
assets were added to the repo. Public and local references were used only to
derive layout, spacing, and state vocabulary. The surface remains hand-authored
editable HTML/CSS using project-local fonts.

## Verification

- Passed: `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
- Passed: visual inspection of `captures/surface-claude-app/target.png`.
  - Confirmed the widened shell, right rail, command card, and bottom composer
    are visible without clipping.
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
- Passed after scaling the main-workflow Claude mount: `npm run hf:inspect`
  - Zero issues across 9 sampled frames.
- Passed: `npm run hf:snapshot`
  - Refreshed 7 root timeline snapshots and `snapshots/contact-sheet.jpg`.
- Passed: `npm run hf:render`
  - Wrote `renders/claude-keynote-workflow-draft.mp4`.
- Passed: `ffprobe` on `renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2715560`
- Passed: `git diff --check`

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still needed before
  claiming pixel-level accuracy for the mode tabs, right rail, connector rows,
  and command-card spacing.
- The CSS Claude mark remains an approximation. Do not copy the real Claude app
  icon without a separate asset/license decision.
- The attachment-draft and tool-result Claude surfaces still use the narrower
  shell; they should either remain focused states or receive a separate
  right-rail variant if future videos need those exact app states.
