# Claude Cinematic Reply Split Pass 063

Date: 2026-06-18.

## Purpose

Split the Sonnet-launch-style cinematic reply state out of the large
`compositions/claude-app.html` working-thread component into its own reusable
HyperFrames subcomposition.

The previous pass made the standalone Claude app capture look much closer to
the reference video, but it did so by adding cinematic-only mode CSS and direct
preview logic to the already-large working-thread component. This pass makes
the project more modular: videos can import the full Claude working thread or
only the sparse cinematic reply/composer beat.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for sparse ivory field, one-line serif answer, compact composer, and
    large negative space.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for answer line position and response-mark relationship.
- `reference/claude/frame-study/sonnet-4-6/frame-40s.jpg`
  - Used for response scale and breathing room.
- `captures/surface-claude-app/target.png`
  - Used as the before/after check for the full app capture after removing
    cinematic-only mode styling.
- `captures/surface-claude-cinematic-reply/target.png`
  - Used as the direct capture check for the new component.
- `docs/prototypes/claude-app-cinematic-reference-pass-062.md`
  - Used as the immediate prior pass and split rationale.
- `DESIGN.md`
  - Used for palette, Anthropic font choices, editable UI constraints, and the
    no-copied-product-assets rule.

## Changes

- Added `compositions/claude-cinematic-reply.html`.
  - Defines `data-composition-id="claude-cinematic-reply-surface"`.
  - Provides a compact editable launch-style surface with one large Anthropic
    Serif answer, CSS response mark, `Reply...` composer, plus/folder/research
    controls, and red send button.
  - Registers a scoped GSAP timeline for answer reveal, response-mark reveal,
    composer reveal, control stagger, and finite response-mark drift.
- Updated `compositions/claude-app.html`.
  - Removed cinematic-only direct preview handling and CSS.
  - Kept `capture=reference` and the default imported working-thread state.
- Updated `package.json`.
  - Restored `npm run capture:claude-app` to the working-thread component.
  - Added `npm run capture:claude-cinematic-reply`.
- Updated `surfaces/registry.json`.
  - Kept `claude-app` as the full working-thread component.
  - Added `claude-cinematic-reply` as a separate component.
- Updated `surfaces/README.md`, `SURFACES.md`, and `PRIMITIVES.md`.
  - Documented the split and the intended import/capture use cases.

## Asset Decision

No Claude product code, private account data, screenshots, official icons, app
bundle assets, or reference-video frames were copied into the composition. The
surface remains hand-authored editable HTML/CSS/GSAP using local fonts and
reference captures only as visual evidence.

## Captures

- `npm run capture:claude-app`
  - Output: `captures/surface-claude-app/target.png`
- `npm run capture:claude-cinematic-reply`
  - Output: `captures/surface-claude-cinematic-reply/target.png`

## Verification

- `npm run capture:claude-app`
  - Wrote `captures/surface-claude-app/target.png`.
  - Visual inspection passed: the full Claude working-thread capture is back
    to the app/sidebar/task-rail component.
- `npm run capture:claude-cinematic-reply`
  - Wrote `captures/surface-claude-cinematic-reply/target.png`.
  - Visual inspection passed: the split component preserves the sparse
    launch-style answer, response mark, and compact composer.
- `npm run capture:claude-browser-thread-workflow`
  - Wrote `captures/surface-claude-browser-thread-workflow/target.png`.
  - Visual inspection confirmed wrapper scenes still mount the full
    `claude-app` working-thread component.
- `npm run registry:check`
  - `Surface registry OK: 28 surfaces, 15 components, 11 workflows, 28 ready captures.`
- JSON parse check
  - `package.json` and `surfaces/registry.json` parsed successfully.
- `git diff --check`
  - Passed before and after HyperFrames verification.
- `npm run hf:lint`
  - Passed with `0 error(s), 25 warning(s), 18 info(s)`.
  - The previous `composition_file_too_large` warning for
    `compositions/claude-app.html` is gone after this split.
  - The new `claude-cinematic-reply` warning is the expected GSAP write-back
    limitation for animated elements in a registered timeline.
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
  - `size=2737965`

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still required before
  claiming pixel-level accuracy for the full app shell.
- The CSS Claude mark is still an approximation and should not be treated as
  the official product asset.
- Further Claude modularity should split sidebar, thread, task rail, and
  composer from `compositions/claude-app.html` once the working-thread layout
  stabilizes.
