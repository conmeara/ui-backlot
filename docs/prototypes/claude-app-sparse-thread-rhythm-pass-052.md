# Claude App Sparse Thread Rhythm Pass 052

Date: 2026-06-18.

## Purpose

This pass continues the Claude fidelity work by pulling the full
`claude-app.html` working-thread component closer to the sparse Sonnet 4.6
launch-video rhythm while preserving the editable Cowork/task surfaces that make
the component useful in workflow demos. The previous state had the right
component boundary, but the right rail, dense cards, and small response type
still made the scene read like a generic three-pane productivity app. This pass
makes the assistant response and composer the visual anchor.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for the sparse ivory field, edge guide lines, large serif response
    rhythm, pale user bubbles, and floating composer proportions.
- `captures/surface-claude-conversation/target.png`
  - Used as the strongest existing local translation of the launch-video sparse
    Claude canvas.
- `captures/surface-claude-app/target.png`
  - Used as the before/after quality gate for the full working-thread app.
- `compositions/claude-browser-workflow.html`
  - Used to verify the refined component still works when mounted beside a
    browser surface.
- `compositions/claude-finder-workflow.html`
  - Used to verify the refined component still works when mounted beside a
    Finder surface.
- `DESIGN.md`
  - Used for palette, Anthropic font choices, editable UI constraints, and the
    no-copied-product-assets rule.

## Changes

- Updated `compositions/claude-app.html`.
  - Narrowed the sidebar and right task rail while widening the central Claude
    thread column.
  - Replaced the repeated grid texture with subtle reference-like vertical edge
    guide lines.
  - Enlarged the serif assistant response and tightened its line-height so the
    answer is the first read.
  - Gave the prompt bubble and context chip row more room without changing their
    editable DOM structure.
  - Softened reasoning/tool cards and collapsed the local plan preview into a
    single quiet row so it no longer competes with the composer.
  - Increased the composer height, radius, placeholder scale, control size, and
    floating shadow to better match the launch-reference prompt object.
  - Reduced the visual weight of the right Task/Artifacts/Context rail while
    keeping it present for workflow-specific shots.
- Updated `surfaces/registry.json`.
  - Pointed the `claude-app` entry at this pass note.
- Refreshed dependent modular workflow captures.
  - `claude-browser-thread-workflow`
  - `claude-finder-thread-workflow`

## Asset Decision

No Claude product code, private account data, screenshots, icons, app bundle
assets, or reference-video frames were copied into the composition. The surface
remains hand-authored editable HTML/CSS/GSAP using local fonts and reference
captures only as visual evidence.

## Capture

- `npm run capture:claude-app`
- Output: `captures/surface-claude-app/target.png`

Regression wrapper captures:

- `npm run capture:claude-browser-thread-workflow`
- `npm run capture:claude-finder-thread-workflow`

## Verification

- `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
  - Visual inspection confirmed the assistant response and composer are now the
    primary read, the right task rail is quieter, and the collapsed local plan
    preview no longer collides with the composer.
- `npm run capture:claude-browser-thread-workflow`
  - Refreshed `captures/surface-claude-browser-thread-workflow/target.png`.
  - Visual inspection confirmed the refined Claude thread still mounts cleanly
    over the browser app surface.
- `npm run capture:claude-finder-thread-workflow`
  - Refreshed `captures/surface-claude-finder-thread-workflow/target.png`.
  - Visual inspection confirmed the refined Claude thread still mounts cleanly
    over the Finder surface.
- `npm run registry:check`
  - Passed: `20 surfaces, 13 components, 5 workflows, 20 ready captures`.
- JSON parse check for `package.json` and `surfaces/registry.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors. Existing warnings are GSAP Studio write-back/pointer
    and font advisories for the broader composition set.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Initially caught clipped right-rail task labels after the rail was
    narrowed. Fixed by shortening the labels to `Read folder`, `Map Q2 data`,
    and `Return file`.
  - Re-run passed with 0 issues.
- `npm run hf:snapshot`
  - Refreshed the 7-frame workflow snapshot set and
    `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2762476`
- `git diff --check`
  - Passed.

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still required before
  claiming pixel-level accuracy for the sidebar, model selector, composer, task
  rail, and message-card geometry.
- The component still has deliberate demo affordances, especially the right
  task/context rail, that may not exist in the exact same form in the real
  Claude app.
- The CSS Claude mark is still an approximation and should not be treated as
  the official product asset.
