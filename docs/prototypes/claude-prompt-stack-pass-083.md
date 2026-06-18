# Claude Prompt Stack Pass 083

## Goal

Extract the Sonnet-launch-style prompt stack as its own direct-capturable
Claude component. This gives future HyperFrames clips an editable cinematic
Claude prompt sequence without importing a full app window, sidebar, composer,
browser, Finder, Office, Codex, or desktop chrome.

## Source Evidence

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-64s.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-72s.jpg`
- `captures/surface-claude-conversation/target.png`
- `captures/surface-claude-chat-pane/target.png`

## Changes

- Added `compositions/claude-prompt-stack.html`.
  - Defines `#claude-prompt-stack-surface` as a 1920x1080 component boundary.
  - Rebuilds the large right-aligned prompt bubble stack and lower-left
    Claude loading mark as editable HTML/CSS.
  - Uses synthetic prompt copy to preserve the visual rhythm without copying
    reference-video wording.
- Added `npm run capture:claude-prompt-stack`.
- Added a `claude-prompt-stack` registry component entry.
- Updated primitive and surface docs.

## Asset Decision

Hand-authored HTML/CSS only. This component uses local public launch-frame
studies as visual evidence and synthetic editable prompt text. It does not
copy Claude product code, screenshots, video frames, private account data, app
bundle assets, donor code, unclear-license assets, or reference-video wording.

## Verification

Passed in this pass:

- `npm run capture:claude-prompt-stack`
- Visual inspection of `captures/surface-claude-prompt-stack/target.png`
- Capture metadata -> 1920x1080 target, 23 visible elements
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `46 surfaces, 28 components, 16 workflows, 46 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- Bubble geometry should be tuned against additional launch frames when we
  build a dedicated side-by-side comparison sheet.
- A future wrapper should compose this prompt stack with the browser and app
  surfaces for launch-style multi-application scenes.
