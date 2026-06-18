# Claude App Fidelity Pass 029

Date: 2026-06-18

## Purpose

Continue refining the reusable Claude-only surface so videos can import a
Claude thread without also carrying Finder, browser, or PowerPoint scaffolding.
This pass focuses on visible fidelity gaps from the current capture: sidebar
width, Claude mark geometry, left-rail icon quality, grouped-card density, and
composer weight.

## Evidence Used

- `captures/surface-claude-app/target.png`
  - Used as the live quality gate for the reusable Claude component after the
    previous dframe pass.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for the warm page, serif assistant copy, compact prompt bubbles, clay
    accent color, and centered composer/card restraint.
- `/Applications/Claude.app/Contents/Info.plist`
  - Confirms the local installed Claude desktop version is `1.12603.1`.
- `/Applications/Claude.app/Contents/Resources/ion-dist/assets/v1/*.css`
  - Inspected as reference only for broad geometry and token cues: 48px header,
    wider desktop sidebar intent, 8px row radii, warm background/text/brand
    families, and dframe/epitaxy vocabulary.

## Changes

- Widened the Claude sidebar from the earlier cramped 236px approximation to a
  260px video-friendly desktop rail while preserving the 980px component
  boundary used by existing captures and workflow mounts.
- Rebuilt the CSS Claude mark from a half-turn placeholder into a full 10-ray
  radial mark used by both the app brand and assistant response gutter.
- Polished the left rail with calmer row spacing, lighter selected/new-chat
  surfaces, smaller section labels, and more plausible project, document, chat,
  and folder glyphs.
- Reduced visual heaviness in the topbar, user prompt bubble, thinking/action
  cards, tool rows, and composer so the component reads more like Claude and
  less like a generic demo panel.
- Replaced the obvious dashed composer dropzone with a subtle inset active
  state that keeps attachment affordances editable without drawing attention to
  the scaffold.

## Asset Decision

No Claude product CSS, app code, images, icons, or private account captures were
copied into the repo. The installed app bundle and release-video frames were
used only as reference evidence. The component remains hand-authored editable
HTML/CSS with project-local fonts.

## Verification

- `npm run capture:claude-app` refreshed
  `captures/surface-claude-app/target.png`.
- Fresh capture was visually inspected after both the layout pass and icon
  polish pass.
- `npm run capture:claude-browser-workflow` refreshed
  `captures/surface-claude-browser-workflow/target.png` and confirmed the
  refined Claude component still mounts cleanly over the browser plate.
- `npm run hf:lint` passed with `0 error(s), 11 warning(s), 8 info(s)`.
  Warnings are existing Studio editability notes for GSAP-owned animated
  elements and pointer-events overlays.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed across 9 sampled frames with zero layout issues.
- `npm run hf:snapshot` refreshed 7 frame snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,668,502 bytes.
- `node -e "JSON.parse(...package.json...)"` passed.
- `git diff --check` passed.

## Remaining Gaps

- Sidebar and topbar glyphs are still CSS approximations. A sanitized live
  Claude new-chat/thread capture should be used for pixel-level icon and
  spacing calibration.
- The component still models one working thread state. Separate empty-thread,
  long-thread, file-upload, and tool-result variants are needed.
- The sidebar width is a compromise for the existing 980px component boundary;
  a future wide desktop variant should use the full 280px sidebar intent seen
  in the local app reference.
