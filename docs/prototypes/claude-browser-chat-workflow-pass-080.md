# Claude Browser Chat Workflow Pass 080

## Goal

Add a lean browser-plus-Claude composition that imports only the editable
browser surface and the new Claude chat shell. This gives future instructional
videos a clean HyperFrames assembly path for clips that do not need Finder,
Office, Codex terminal, Premiere, or the full Cowork/task shell.

## Source Evidence

- `compositions/browser-app.html`
- `compositions/claude-chat-shell.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-browser-app/target.png`
- `captures/surface-claude-chat-shell/target.png`
- `docs/prototypes/claude-chat-shell-pass-079.md`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`

## Changes

- Added `compositions/claude-browser-chat-workflow.html`.
  - Defines `#claude-browser-chat-workflow` as a 1920x1080 root composition.
  - Mounts `browser-app` and `claude-chat-shell` through
    `runtime/backlot-component-loader.js`.
  - Adds minimal macOS menu-bar context, cursor, click ring, and finite wrapper
    choreography.
- Added `npm run capture:claude-browser-chat-workflow`.
- Added a `claude-browser-chat-workflow` registry workflow entry.
- Updated primitive and surface docs.

## Asset Decision

This composition mounts local hand-authored components only. It does not use
screenshot plates, copied product code, private account data, copied app
assets, or donor code.

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

- The browser surface remains a synthetic review-board app, not a real external
  product.
- A future pass should add timeline parameters for switching the Claude text
  from prompt to completion states.
