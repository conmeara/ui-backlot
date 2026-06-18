# Figma Onboarding Editor Pass 076

## Purpose

Add a dark Figma-style onboarding editor component that matches the left-hand
design surface in the 2026-02-18 Claude Code-to-Figma reference clip more
closely than the existing light generic Figma editor.

## Evidence

- `reference/claude/videos/2026-02-18-claude-code-to-figma.mp4`
- `reference/claude/frame-study/code-to-figma/contact-sheet.jpg`
- `reference/claude/frame-study/code-to-figma/frame-12s.jpg`
- `reference/claude/frame-study/code-to-figma/frame-16s.jpg`
- Existing reusable editor: `compositions/figma-editor.html`

## Changes

- Added `compositions/figma-onboarding-editor.html` as a 1120x760
  template-backed component.
- Modeled the dark Figma topbar, Layers/Assets sidebar, onboarding layer tree,
  dark canvas, and two editable mobile onboarding frames from the reference
  frames.
- Added `capture:figma-onboarding-editor` and a registry entry for agent
  discovery.

## Asset Decision

The component is hand-authored HTML/CSS informed by local frame studies from a
public reference video. It copies no screenshot plates, Figma product code,
private Figma files, private account data, fonts from the source video, or app
assets.

## Capture

- `npm run capture:figma-onboarding-editor`
- `captures/surface-figma-onboarding-editor/target.png`

## Verification

Passed in this pass:

- `npm run capture:figma-onboarding-editor`
- Visual inspection of `captures/surface-figma-onboarding-editor/target.png`
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

- The UI is a code-native approximation rather than a live Figma DOM capture.
- The onboarding app content is sanitized and illustrative rather than copied
  from a private or proprietary design file.
