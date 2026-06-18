# Claude Code Terminal Session Pass 075

## Purpose

Add a direct-capturable light Claude Code terminal component based on the public
2026-02-18 Claude Code-to-Figma reference clip. This gives future demo scenes a
small editable Claude Code terminal panel without importing the larger dark
Claude Code desktop shell.

## Evidence

- `reference/claude/videos/2026-02-18-claude-code-to-figma.mp4`
- `reference/claude/frame-study/code-to-figma/contact-sheet.jpg`
- `reference/claude/frame-study/code-to-figma/frame-12s.jpg`
- `reference/claude/frame-study/code-to-figma/frame-16s.jpg`

## Changes

- Added `compositions/claude-code-terminal-session.html` as a 660x760
  template-backed component.
- Modeled the light macOS window chrome, monospaced Claude Code header,
  highlighted user prompt, task/event rows, running `Scheming...` state, and
  lower terminal input area from the reference frames.
- Added `capture:claude-code-terminal-session` and a registry entry for agent
  discovery.

## Asset Decision

The component is hand-authored HTML/CSS informed by local frame studies from a
public reference video. It copies no screenshot plates, Claude product code,
private terminal sessions, private account data, fonts from the source video, or
app assets.

## Capture

- `npm run capture:claude-code-terminal-session`
- `captures/surface-claude-code-terminal-session/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-code-terminal-session`
- Visual inspection of `captures/surface-claude-code-terminal-session/target.png`
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

- The red header mark is a simplified CSS pixel mark, not a copied Claude Code
  asset.
- The terminal text is sanitized and illustrative rather than an exact product
  transcript.
