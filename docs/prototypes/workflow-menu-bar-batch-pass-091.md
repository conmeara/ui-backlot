# Workflow Menu Bar Batch Pass 091

Date: 2026-06-18.

## Goal

Finish migrating the older Claude workflow wrappers from duplicated inline
macOS menu-bar markup to the reusable `mac-menu-bar` component. This makes the
workflow library more modular for HyperFrames clips: desktop chrome can now be
imported, revised, and captured as one component instead of being copied inside
each workflow.

## Workflows Migrated

- `claude-browser-composed-workflow`
- `claude-browser-workflow`
- `claude-browser-thread-workflow`
- `claude-codex-terminal-workflow`
- `claude-conversation-browser-workflow`
- `claude-excel-workflow`
- `claude-figma-workflow`
- `claude-finder-workflow`
- `claude-finder-thread-workflow`
- `claude-launch-browser-workflow`
- `claude-premiere-workflow`
- `claude-presentation-workflow`
- `claude-word-workflow`

## Source Evidence

- `compositions/mac-menu-bar.html`
- `captures/surface-mac-menu-bar/target.png`
- `reference/open-source/macos-web/LICENSE`
- `reference/open-source/macos-web/src/components/TopBar/TopBar.svelte`
- `reference/open-source/macos-web/src/components/TopBar/MenuBar.svelte`
- `reference/open-source/macos-web/src/components/TopBar/TopBarTime.svelte`
- `docs/prototypes/mac-menu-bar-component-pass-088.md`
- Existing workflow prototype notes retained in `surfaces/registry.json`
  `sourceEvidence`

## Changes

- Replaced each inline `<header class="mac-menu-bar">` block with a mounted
  `mac-menu-bar.html` component frame.
- Removed duplicated local menu-bar CSS and all local Apple-glyph definitions
  from the migrated workflow wrappers.
- Retargeted each existing parent timeline entrance from `.mac-menu-bar` to
  `.menu-bar-component`.
- Updated `surfaces/registry.json`.
  - Added `mac-menu-bar` as a dependency for each migrated workflow.
  - Added `mac-menu-bar` tags and shared source evidence.
  - Preserved each workflow's original prototype note in `sourceEvidence`.

## Asset Decision

The workflows mount local hand-authored Backlot components only. The menu-bar
component is informed by MIT-licensed `macos-web` structure, but no donor source
code, donor Apple icon file, GPL material, product screenshots, private account
data, or app assets were copied.

## Verification

Passed in this pass:

- `npm run capture:mac-menu-bar`
- `npm run capture:claude-browser-workflow`
- `npm run capture:claude-browser-thread-workflow`
- `npm run capture:claude-browser-composed-workflow`
- `npm run capture:claude-conversation-browser-workflow`
- `npm run capture:claude-launch-browser-workflow`
- `npm run capture:claude-launch-browser-workflow-prompt`
- `npm run capture:claude-finder-workflow`
- `npm run capture:claude-finder-thread-workflow`
- `npm run capture:claude-codex-terminal-workflow`
- `npm run capture:claude-presentation-workflow`
- `npm run capture:claude-figma-workflow`
- `npm run capture:claude-word-workflow`
- `npm run capture:claude-excel-workflow`
- `npm run capture:claude-premiere-workflow`
- Capture metadata check across the batch:
  - Each migrated capture is 1920x1080 except the 1920x30 `mac-menu-bar`
    component capture.
  - Every workflow capture includes mounted `mac-menu-bar-surface` DOM.
  - Mounted child ids include expected paired app surfaces such as
    `browser-app-surface`, `finder-window-surface`, `codex-terminal-surface`,
    `presentation-editor-surface`, `figma-editor-surface`,
    `word-editor-surface`, `excel-workbook-surface`, and
    `premiere-editor-surface`.
- Visual inspection of
  `captures/workflow-menu-bar-batch-pass-091-contact-sheet.jpg`.
- JSON parse for `package.json` and `surfaces/registry.json`.
- `npm run registry:check` ->
  `Surface registry OK: 50 surfaces, 31 components, 17 workflows, 50 ready captures.`
- Search check: no remaining `<header class="mac-menu-bar">`,
  `minimal-mac-menu-bar`, `icons/apple.svg`, or `tl.from(".mac-menu-bar"`
  patterns in `compositions/*.html`.
- `npm run hf:lint` -> 0 errors, with existing GSAP Studio editability and
  pointer-event warnings.
- `npm run hf:validate` -> no console errors.
- `npm run hf:inspect` -> ok true, 0 issues.
- `npm run hf:snapshot` -> 7 frames plus `snapshots/contact-sheet.jpg`.
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe renders/claude-keynote-workflow-draft.mp4` -> 1920x1080,
  30 fps, 16.000000 seconds, 480 frames, 2736283 bytes.
- `git diff --check`.

## Remaining Gaps

- `mac-menu-bar` is still static. A future variant API should expose active app
  name, menu labels, time, battery state, and right-side status icons.
- The older workflows still use broad `claude-app` in several places. Future
  passes should continue replacing those with narrower Claude primitives when a
  clip only needs a pane, composer, thread, or completion beat.
