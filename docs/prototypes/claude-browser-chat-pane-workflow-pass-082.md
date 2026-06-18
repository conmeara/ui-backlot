# Claude Browser Chat Pane Workflow Pass 082

## Goal

Add the lightest Claude-plus-browser wrapper so future instructional clips can
import only a browser surface and the active Claude chat pane. This avoids
bringing along the Claude sidebar, Cowork/task rail, Finder, Office, Codex
terminal, Premiere, or the full desktop lab.

## Source Evidence

- `compositions/browser-app.html`
- `compositions/claude-chat-pane.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-browser-app/target.png`
- `captures/surface-claude-chat-pane/target.png`
- `docs/prototypes/claude-chat-pane-pass-081.md`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`

## Changes

- Added `compositions/claude-browser-chat-pane-workflow.html`.
  - Defines `#claude-browser-chat-pane-workflow` as a 1920x1080 root
    composition.
  - Mounts `browser-app` and `claude-chat-pane` through
    `runtime/backlot-component-loader.js`.
  - Keeps minimal macOS menu-bar context, cursor, click ring, and finite parent
    choreography.
- Added `npm run capture:claude-browser-chat-pane-workflow`.
- Added a `claude-browser-chat-pane-workflow` registry workflow entry.
- Updated primitive and surface docs.

## Asset Decision

This composition mounts local hand-authored components only. It does not use
screenshot plates, copied product code, private account data, copied app
assets, video frames, or donor code.

## Verification

Passed in this pass:

- `npm run capture:claude-browser-chat-pane-workflow`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `45 surfaces, 27 components, 16 workflows, 45 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The browser surface is still a synthetic review-board app, not a real
  external product.
- A future pass should add parameterized text/state variants for the mounted
  Claude chat pane.
