# Surface Registry Pass 032

## Goal

Make UI Backlot easier for future Codex/HyperFrames agents to consume as a
library of standalone editable app surfaces instead of a pile of separate HTML
files and human-readable notes.

## Changes

- Added `surfaces/registry.json`, a machine-readable inventory of current
  reusable components and workflow wrappers.
- Added `tools/check-surface-registry.mjs` and `npm run registry:check` so the
  repo can catch broken source paths, missing capture scripts, missing capture
  images, missing prototype notes, duplicate ids, and invalid dependencies.
- Added a direct `capture:presentation-editor` script so the PowerPoint-like
  component has its own capture artifact instead of only appearing inside the
  main workflow render.
- Added a direct preview mount to `compositions/presentation-editor.html` and
  moved the animated edited-title/selection states into hidden base CSS so the
  static component capture starts in a clean initial state.
- Linked the registry from `SURFACES.md` and `surfaces/README.md`.

## Source Evidence

- Existing component files under `compositions/`.
- Existing lab surfaces under `surfaces/`.
- Existing prototype notes under `docs/prototypes/`.
- Existing captures under `captures/`.
- Existing source/donor decisions in `docs/research/open-source-ui-donor-repos.md`.

## Asset Decision

The registry and validator add metadata only. They do not copy any third-party
code, icons, screenshots, product assets, or private app data.

## Verification

- `npm run capture:presentation-editor`: passed and wrote
  `captures/surface-presentation-editor/target.png`.
- `npm run registry:check`: passed with 14 surfaces, 10 components, 2 workflows,
  and 14 ready captures.
- `npm run capture:claude-finder-workflow`: passed and refreshed
  `captures/surface-claude-finder-workflow/target.png`.
- `npm run hf:lint`: passed with 0 errors, 13 existing Studio edit-blocked
  warnings, and 10 info messages.
- `npm run hf:validate`: passed with no console errors.
- `npm run hf:inspect`: passed with 0 layout issues across 9 samples.
- `npm run hf:snapshot`: passed and refreshed 7 frames plus
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render`: passed and wrote
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4`:
  duration `16.000000`, size `2668101`.
- `git diff --check`: passed.
