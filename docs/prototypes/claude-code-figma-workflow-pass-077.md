# Claude Code Plus Figma Workflow Pass 077

## Purpose

Add a lean HyperFrames wrapper for the 2026-02-18 Claude Code-to-Figma style of
demo: a dark Figma onboarding design editor on the left and a light Claude Code
terminal session on the right. This keeps the workflow modular so future clips
can import only Claude Code plus Figma without the full Claude app shell,
Finder, browser, Office, Codex terminal, Premiere, or the full desktop lab.

## Evidence

- `reference/claude/videos/2026-02-18-claude-code-to-figma.mp4`
- `reference/claude/frame-study/code-to-figma/contact-sheet.jpg`
- `reference/claude/frame-study/code-to-figma/frame-12s.jpg`
- `reference/claude/frame-study/code-to-figma/frame-16s.jpg`
- `compositions/claude-code-terminal-session.html`
- `compositions/figma-onboarding-editor.html`
- `runtime/backlot-component-loader.js`

## Changes

- Added `compositions/claude-code-figma-workflow.html` as a 1920x1080 root
  composition.
- Mounted `#figma-onboarding-editor-surface` and
  `#claude-code-terminal-session-surface` through the Backlot component loader
  so capture tooling sees real child DOM.
- Added the reference-style dotted ivory desktop field, local macOS cursor,
  click ring, and GSAP focus choreography owned by the parent wrapper.
- Added `capture:claude-code-figma-workflow` and a registry entry for agent
  discovery.

## Asset Decision

The parent wrapper mounts local editable UI Backlot components. Reference frames
guide layout, scale, rhythm, and contrast only. It copies no screenshot plates,
product code, private account data, private design files, copied app assets, or
restrictively licensed donor code.

## Capture

- `npm run capture:claude-code-figma-workflow`
- `captures/surface-claude-code-figma-workflow/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-code-terminal-session`
- `npm run capture:figma-onboarding-editor`
- `npm run capture:claude-code-figma-workflow`
- Visual inspection of:
  - `captures/surface-claude-code-terminal-session/target.png`
  - `captures/surface-figma-onboarding-editor/target.png`
  - `captures/surface-claude-code-figma-workflow/target.png`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `41 surfaces, 25 components, 14 workflows, 41 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The child components do not yet expose child timelines to the parent wrapper.
- The workflow is informed by public frame studies, not a live app capture.
