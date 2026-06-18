# macOS Menu Bar Component Pass 088

Date: 2026-06-18.

## Purpose

This pass extracts the repeated macOS menu bar treatment into a standalone
HyperFrames component. Many workflow wrappers duplicated the same `Claude /
File / Edit / View / Window` menu bar HTML/CSS, which made future video scenes
less modular and caused some wrappers to depend on a missing local
`macos-web` Apple icon file. The new component gives wrappers a reusable
30px Mac-context strip that can be mounted without importing the full desktop
lab.

## Evidence Used

- `reference/open-source/README.md`
  - Used for the local donor clone commit and license table.
- `reference/open-source/macos-web/LICENSE`
  - Confirmed `macos-web` is MIT licensed.
- `reference/open-source/macos-web/src/components/TopBar/TopBar.svelte`
  - Used as structure reference for top-bar component boundaries.
- `reference/open-source/macos-web/src/components/TopBar/MenuBar.svelte`
  - Used as structure reference for Apple/menu text grouping.
- `reference/open-source/macos-web/src/components/TopBar/TopBarTime.svelte`
  - Used as structure reference for compact right-side time/status grouping.
- `docs/research/open-source-ui-donor-repos.md`
  - Used for current donor-repo guardrails and extraction notes.
- `compositions/claude-presentation-chat-pane-workflow.html`
  - Used as the first wrapper migration target.

## Changes

- Added `compositions/mac-menu-bar.html`.
  - Direct-capturable 1920x30 component with Claude app menus, right-side
    Wi-Fi/battery/time controls, and an inline Apple glyph mask.
  - Uses a direct-preview mount script for `capture:mac-menu-bar`.
- Updated `package.json`.
  - Added `npm run capture:mac-menu-bar`.
- Updated `surfaces/registry.json`.
  - Added `mac-menu-bar` as a component.
  - Updated `claude-presentation-chat-pane-workflow` dependencies to include
    `mac-menu-bar`.
- Updated `compositions/claude-presentation-chat-pane-workflow.html`.
  - Replaced inline menu-bar HTML/CSS with a mounted `mac-menu-bar.html`
    component.
  - Kept the parent timeline owning the wrapper entrance animation.

## Asset Decision

The component is hand-authored HTML/CSS informed by MIT-licensed `macos-web`
top-bar structure and existing Backlot wrappers. No `macos-web` source code,
icon file, wallpaper, private app asset, or GPL reference code was copied. The
Apple glyph is an inline CSS mask so the component does not depend on the
missing local `reference/open-source/macos-web/public/icons/apple.svg` path.

## Verification

Passed in this pass:

- `npm run capture:mac-menu-bar`
- Visual inspection of `captures/surface-mac-menu-bar/target.png`
- Capture metadata -> 1920x30 target, 9 visible elements
- `npm run capture:claude-presentation-chat-pane-workflow`
- Visual inspection of `captures/surface-claude-presentation-chat-pane-workflow/target.png`
- Capture metadata -> workflow at 1920x1080 target with 218 visible elements
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `50 surfaces, 31 components, 17 workflows, 50 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The component is currently static. Future wrappers may need data attributes
  or CSS variables for active app name, menu labels, time, battery state, and
  status icons.
- Older wrappers still duplicate menu-bar HTML/CSS. This pass proves the new
  component boundary in one workflow; a later sweep should migrate the rest.
