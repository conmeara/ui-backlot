# Claude Browser Composed Workflow Pass 069

## Goal

Prove a short Claude-plus-browser clip can import the componentized Claude
shell instead of the legacy monolithic Claude working-thread surface. The
workflow should keep the browser, Claude shell, sidebar, thread core, composer,
and agent rail as independently editable component sources for future
HyperFrames video assembly.

## Source Evidence

- `compositions/browser-app.html`
- `compositions/claude-composed-app.html`
- `compositions/claude-sidebar.html`
- `compositions/claude-thread-core.html`
- `compositions/claude-composer.html`
- `compositions/claude-agent-rail.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-browser-app/target.png`
- `captures/surface-claude-composed-app/target.png`
- `docs/prototypes/claude-composed-app-pass-068.md`

## Changes

- Updated `runtime/backlot-component-loader.js`.
  - After mounting a component, it now recursively resolves nested
    `data-backlot-mount-src` elements inside the cloned component.
  - This lets wrapper scenes import `claude-composed-app` and still receive the
    sidebar, thread core, composer, and agent rail DOM.
  - During import, it now removes animation-generated inline `opacity`,
    `visibility`, `transform`, `translate`, `rotate`, `scale`, `filter`, and
    `will-change` properties while preserving authored inline geometry such as
    widths, left offsets, and custom properties.
- Updated `compositions/claude-composed-app.html`.
  - Moved the composed-shell style block inside `#claude-composed-app` so the
    selected component root carries its layout styles when cloned by the
    loader.
- Added `compositions/claude-browser-composed-workflow.html`.
  - Defines a 1920x1080 wrapper that imports only `browser-app` and
    `claude-composed-app`.
  - Clips the browser lab down to its browser window and clips the composed
    Claude lab down to its app shell to avoid double desktop/background
    surfaces.
  - Adds a minimal macOS menu bar, local `macos-web` cursor path, click ring,
    and finite GSAP timeline with a `capture=hero` state.
- Added `npm run capture:claude-browser-composed-workflow`.
- Added `claude-browser-composed-workflow` to `surfaces/registry.json`.
- Updated `SURFACES.md`, `PRIMITIVES.md`, and `surfaces/README.md`.

## Asset Decision

This pass uses local hand-authored UI components and a local-only `macos-web`
cursor path already present in the workspace. It does not copy Claude product
code, screenshots, launch-video frames, private account data, app bundle assets,
external product assets, unclear-license donor code, or browser screenshots.

## Capture

- Ran `npm run capture:claude-composed-app`.
  - Output: `captures/surface-claude-composed-app/target.png`.
- Ran `npm run capture:claude-browser-composed-workflow`.
  - Output: `captures/surface-claude-browser-composed-workflow/target.png`.
- Capture/debug note:
  - The first composed-browser capture showed a blank foreground Claude window.
  - The child DOM was present, but iframe fallback had executed paused child
    GSAP timelines and cloned their inline hidden start state.
  - The loader now sanitizes animation-generated inline properties during
    import, and the recapture shows the nested sidebar, thread core, composer,
    and rail correctly inside the foreground Claude shell.

## Verification

- `npm run registry:check`
  - `Surface registry OK: 34 surfaces, 20 components, 12 workflows, 34 ready captures.`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - clean before the prototype-note update.
- `npm run hf:lint`
  - `0 error(s), 31 warning(s), 23 info(s)`.
  - New warning is the expected `gsap_studio_edit_blocked` note for
    `compositions/claude-browser-composed-workflow.html`, because GSAP owns the
    wrapper frame choreography.
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
  - Render completed in 35.1s.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2736504`
- Final `git diff --check`
  - clean before the prototype-note update.
