# Claude Sidebar Surface Pass 067

## Goal

Split the Claude left navigation into its own HyperFrames-ready component so
future clips can show workspace, mode, task, project, and account context
without importing the full Claude app shell, central transcript, composer, or
task rail.

## Source Evidence

- `compositions/claude-app.html`
- `captures/surface-claude-app/target.png`
- `compositions/claude-home.html`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `docs/prototypes/claude-app-reference-focus-pass-060.md`

## Changes

- Added `compositions/claude-sidebar.html`.
  - Defines `#claude-sidebar-surface` as a 360x840 component boundary.
  - Adds `.claude-sidebar-stage` as a padded direct-capture boundary.
  - Keeps editable traffic lights, CSS Claude mark, Chat/Code/Cowork mode
    switch, New task/Search controls, active task rows, Today rows, Projects,
    local-folder readiness note, and workspace account row.
  - Excludes central transcript, topbar, composer, right task rail, and outer
    app window so the sidebar can be paired with only the app surfaces needed
    by a specific video.
  - Includes a finite GSAP entrance, row stagger, account reveal, local-context
    pulse, and active-task pulse.
- Added `npm run capture:claude-sidebar`.
- Added the `claude-sidebar` component entry to `surfaces/registry.json`.
- Updated `SURFACES.md`, `PRIMITIVES.md`, and `surfaces/README.md`.

## Asset Decision

Hand-authored HTML/CSS only. This pass does not copy Claude product code,
screenshots, launch-video frames, private account data, app bundle assets, or
unclear-license donor code. The component remains a safe reconstruction until a
sanitized live Claude sidebar capture is available for closer geometry and icon
comparison.

## Capture

- Ran `npm run capture:claude-sidebar`.
- Output: `captures/surface-claude-sidebar/target.png`.
- Visual inspection confirmed the full left-nav component fits inside the
  padded stage with no clipped rows, visible panel shadow, traffic lights,
  mode switch, active task state, local-context note, and account row.

## Verification

- `npm run registry:check`
  - `Surface registry OK: 32 surfaces, 19 components, 11 workflows, 32 ready captures.`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - clean before the prototype-note update.
- `npm run hf:lint`
  - `0 error(s), 29 warning(s), 20 info(s)`.
  - The new sidebar component only contributes the expected GSAP editability
    warning for animated entrance, row, readiness, and active-task targets.
- `npm run hf:validate`
  - `No console errors`
- `npm run hf:inspect`
  - `ok: true`
  - `issueCount: 0`
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Output: `renders/claude-keynote-workflow-draft.mp4`
  - Render completed in 38.1s.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2734754`
