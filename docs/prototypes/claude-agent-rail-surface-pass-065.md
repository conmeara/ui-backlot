# Claude Agent Rail Surface Pass 065

## Goal

Split the Claude task/context rail into its own HyperFrames-ready component so
future videos can show progress, artifact, connector, local context, and
working-file state without importing the full Claude shell, transcript, or
composer.

## Source Evidence

- `compositions/claude-app.html`
- `compositions/claude-attachment-draft.html`
- `compositions/claude-tool-result.html`
- `captures/surface-claude-app/target.png`
- `docs/prototypes/claude-cowork-sibling-states-pass-045.md`

## Changes

- Added `compositions/claude-agent-rail.html`.
  - Defines `#claude-agent-rail-surface` as a 380x860 composition boundary.
  - Adds a padded `.claude-agent-rail-stage` capture boundary so the panel
    shadow is visible in direct screenshots.
  - Keeps the core editable rail states: working task status, progress rings,
    step rows, artifact card, selected folder/files, connector rows, working
    files, and local-context note.
  - Uses larger standalone typography than the tiny in-app rail while
    preserving the current Claude reconstruction's warm paper, muted ink,
    red active-state, and soft panel language.
  - Includes a finite GSAP entrance, section reveal, and active-state pulse.
- Added `npm run capture:claude-agent-rail`.
- Added the `claude-agent-rail` component entry to `surfaces/registry.json`.
- Updated `SURFACES.md`, `PRIMITIVES.md`, and `surfaces/README.md`.

## Asset Decision

Hand-authored HTML/CSS only. This pass does not copy Claude product code,
screenshots, launch-video frames, private project data, donor runtime code, or
app assets. The component remains a safe reconstruction until a sanitized live
Claude task-rail capture is available for closer pixel comparison.

## Capture

- `npm run capture:claude-agent-rail`
  - Output: `captures/surface-claude-agent-rail/target.png`
  - First capture showed the 720px component boundary clipping the top header
    and bottom note, so the component was corrected to 380x860 and recaptured.
  - Visual inspection confirmed the task header, progress rings, step rows,
    artifact, context, connectors, working files, and local-context note all
    fit inside the standalone frame.

## Verification

- `npm run registry:check`
  - Surface registry OK: 30 surfaces, 17 components, 11 workflows, 30 ready
    captures.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - Clean.
- `npm run hf:lint`
  - 0 errors, 27 warnings, 18 info.
  - New warning is the expected `gsap_studio_edit_blocked` notice for the rail
    timeline, matching the existing animated component pattern.
- `npm run hf:validate`
  - No console errors.
- `npm run hf:inspect`
  - `ok: true`, `issueCount: 0`.
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Output: `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2738074`
- Final `git diff --check`
  - Clean.
