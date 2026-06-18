# Claude Browser Chat Workflow Menu Bar Pass 090

## Goal

Move the lean browser-plus-Claude chat-shell workflow onto the reusable macOS
menu bar component so clips that need sidebar, thread, and composer context can
import `mac-menu-bar`, `browser-app`, and `claude-chat-shell` as separate
editable surfaces.

## Source Evidence

- `compositions/mac-menu-bar.html`
- `compositions/browser-app.html`
- `compositions/claude-chat-shell.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-mac-menu-bar/target.png`
- `captures/surface-browser-app/target.png`
- `captures/surface-claude-chat-shell/target.png`
- `reference/open-source/macos-web/LICENSE`
- `reference/open-source/macos-web/src/components/TopBar/TopBar.svelte`
- `reference/open-source/macos-web/src/components/TopBar/MenuBar.svelte`
- `reference/open-source/macos-web/src/components/TopBar/TopBarTime.svelte`
- `docs/prototypes/mac-menu-bar-component-pass-088.md`
- `docs/prototypes/claude-browser-chat-workflow-pass-080.md`
- `docs/prototypes/claude-chat-shell-pass-079.md`

## Changes

- Updated `compositions/claude-browser-chat-workflow.html`.
  - Replaced the inline `minimal-mac-menu-bar` markup with a mounted
    `mac-menu-bar.html` component.
  - Removed the local Apple glyph CSS that pointed at the missing
    `reference/open-source/macos-web/public/icons/apple.svg` donor path.
  - Added a parent timeline entrance for `.menu-bar-component`.
- Updated `surfaces/registry.json`.
  - Added `mac-menu-bar` as a workflow dependency.
  - Updated source evidence and asset decision text.
- Updated primitive and surface docs to name the reusable menu-bar dependency.

## Asset Decision

The workflow mounts local hand-authored Backlot components only. The menu-bar
component is informed by MIT-licensed `macos-web` structure, but no donor source
code, donor Apple icon file, GPL material, product screenshots, private account
data, or app assets were copied.

## Verification

Passed in this pass:

- `npm run capture:claude-browser-chat-workflow`
- `npm run capture:mac-menu-bar`
- `npm run capture:claude-browser-chat-pane-workflow`
- Visual inspection of
  `captures/surface-claude-browser-chat-workflow/target.png`
- Capture metadata from
  `captures/surface-claude-browser-chat-workflow/capture.json`: 1960x1120
  viewport, 1920x1080 target, 226 elements, mounted ids
  `mac-menu-bar-surface`, `claude-chat-shell-surface`, and
  `browser-app-surface`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` ->
  `Surface registry OK: 50 surfaces, 31 components, 17 workflows, 50 ready captures.`
- `npm run hf:lint` -> 0 errors, with existing GSAP Studio editability and
  pointer-event warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> ok true, 0 issues
- `npm run hf:snapshot` -> 7 frames plus `snapshots/contact-sheet.jpg`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe renders/claude-keynote-workflow-draft.mp4` -> 1920x1080,
  30 fps, 16.000000 seconds, 480 frames, 2734921 bytes
- `git diff --check`

## Remaining Gaps

- Other wrappers still carry local menu-bar copies and should be migrated
  incrementally.
- The menu-bar component is currently static; a future variant API should expose
  active app name, menu labels, time, and right-side status state.
