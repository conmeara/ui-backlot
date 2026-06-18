# Claude Chat Shell Pass 079

## Goal

Add a lean, direct-capturable Claude chat shell for simple demo clips that need
the real chat rhythm without the heavier Cowork/task dashboard. This fills the
gap between the full task shell and the sparse launch-only conversation
surface.

## Source Evidence

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-56s.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-64s.jpg`
- `captures/surface-claude-cinematic-reply/target.png`
- `captures/surface-claude-home-launch/target.png`
- `compositions/claude-sidebar.html`
- `compositions/claude-composer.html`

## Changes

- Added `compositions/claude-chat-shell.html`.
  - Defines `#claude-chat-shell-surface` as a 1440x900 component boundary.
  - Keeps Claude editable as sidebar, topbar, message field, launch-style user
    bubbles, large serif assistant reply, CSS-drawn Claude mark, and bottom
    composer.
  - Removes the right task rail, progress checklist, command preview, and
    Cowork-specific tool cards so the surface reads as a simpler Claude chat
    window.
- Added `npm run capture:claude-chat-shell`.
- Added a `claude-chat-shell` registry component entry.
- Updated primitive and surface docs.

## Asset Decision

Hand-authored HTML/CSS only. The component is informed by local public
launch-frame studies and existing local reconstructions, but it does not copy
Claude product code, screenshots, video frames, private account data, app bundle
assets, external donor code, or unclear-license assets.

## Verification

Passed in this pass:

- `npm run capture:claude-chat-shell`
- `npm run capture:claude-browser-chat-workflow`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `43 surfaces, 26 components, 15 workflows, 43 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- Needs sanitized live Claude shell capture before claiming current-product
  pixel fidelity.
- Sidebar recents and project labels are synthetic demo-safe text.
