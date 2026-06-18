# Sonnet 4.6 Scene Lab Audit

Last updated: 2026-06-17.

## Prototype

- Composition: `index.html`
- Duration: 16 seconds
- Render: `renders/sonnet-scene-lab-draft.mp4`
- Snapshot sheet: `snapshots/contact-sheet.jpg`
- Reference/prototype comparison: `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Reference sheet: `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`

## Implemented Primitives

1. Paper/sage stage with subtle contour-line texture.
2. Claude starburst mark with calm rotation.
3. Serif Claude response lines with masked reveal.
4. Rounded Claude composer with plus control and red send button.
5. macOS/browser shell with tab and URL bar.
6. Store admin/shipping surface with edited threshold.
7. PowerPoint-like slide editor with thumbnail rail and slide canvas.
8. Website hero surface with brand-color update.
9. Todo checklist with animated check states.
10. Cursor pointer with click ring.
11. Agent progress rows.
12. Revenue chart card.

## Techniques Tried

- HyperFrames standalone composition with `window.__timelines`.
- GSAP timeline-driven UI state changes.
- `clip-path` text reveal for typed Claude copy.
- CSS-built Claude starburst instead of SVG/image.
- CSS app-surface reconstruction rather than screenshots.
- Timeline-controlled checklist ticks instead of non-seekable callbacks.
- Browser/admin/slide surfaces layered as depth plates.
- HyperFrames `lint`, `validate`, `inspect`, `snapshot`, and `render`.
- FFmpeg vertical contact-sheet stacking for quick reference/prototype review.
- ImageMagick labeled comparison sheets.
- Playwright DOM/CSS capture script for future source-app reconstruction.

## Validation Evidence

Current passing checks:

```bash
npx hyperframes lint --verbose
npx hyperframes validate --no-contrast
npx hyperframes inspect --samples 9 --json
npx hyperframes snapshot . --at=1,4.5,7,9.8,12.6,15 --describe=false
npx hyperframes render --quality draft --output renders/sonnet-scene-lab-draft.mp4
```

Current render metadata:

- Size: 1920 x 1080
- Duration: 16.0 seconds
- Frame rate: 30 fps
- Frames: 480
- File size: 1.9 MB

Known lint warning:

- `gsap_studio_edit_blocked` remains because this prototype intentionally uses
  a manual GSAP timeline. It is acceptable for a code-authored scene lab.

Known contrast warnings:

- Full `npx hyperframes validate` exits successfully but reports contrast
  warnings on hidden, faded, or decorative app-plate text. The current count is
  85 contrast warnings. For this prototype, the stricter pass/fail gates are
  `inspect` for overlap/readability and `validate --no-contrast` for runtime
  errors. A later accessibility pass should either mark decorative plate text out
  of contrast scope or raise contrast for every visible UI label.

## Visual Gaps Versus Reference

- Claude typography still feels heavier and less premium than the reference.
- The StoreDesk/admin surface is from the reference video only and is not a real
  product target. Stop polishing it; replace future work with Claude, Finder,
  and PowerPoint surfaces captured from real apps.
- The browser/slide mid-scene still reads too "constructed"; the reference uses
  larger cropped app plates and lets details blur into the background.
- The todo list now has a reference-like title chip in the intro, but the full
  checklist still feels more like a compact web widget than a system surface.
- Cursor path works, but it needs more intentional "computer use" beats:
  hover, click, selection, edit, and completion.
- The final frame has a stronger prompt-card layout now, but the Claude mark,
  done response, and to-do card still need a clearer hierarchy.
- No audio, captions, or sound cues yet.
- A labeled reference/prototype contact sheet exists, but we still need
  per-surface crop sheets for precise app UI reconstruction.

## Pass 2 Changes

- Delayed the coral backing panel so the intro starts as a quieter paper/sage
  frame.
- Faded the coral and admin surfaces before the closing line for readability.
- Added a reference-like large prompt card with "Need help tackling my to-dos!"
  and a "Let's go" action.
- Moved the final Claude wordmark to avoid collision with the prompt card.

## Pass 3 Changes

- Moved cloned HyperFrames reference repositories outside the project scan path
  to prevent Studio from crawling their demo HTML and reporting irrelevant
  missing-asset errors.
- Added a dedicated intro `Today's to-dos` title chip so the first beat matches
  the reference more closely.
- Narrowed the coral strip and made the store/admin plate taller so the center
  field feels less like a generic dashboard block.
- Enlarged the cropped revenue chart plate.
- Raised and widened the final prompt card.
- Faded the browser surface away before the final prompt to remove text
  occlusion and match the cleaner reference ending.
- Created `snapshots/reference-vs-prototype-contact-sheet.jpg` for visual
  comparison.

## Pass 4 Pivot

- Reframed this prototype as a motion sandbox rather than the main fidelity
  target.
- Installed ImageMagick and added `tools/make-comparison-sheet.sh` for labeled
  comparison artifacts.
- Installed project-local Playwright and added `tools/capture-web-ui.mjs` for
  source-app DOM/CSS/screenshot capture.
- Added `docs/workflows/capture-first-ui-reconstruction.md` to make live apps,
  DOM/CSS, screenshots, and accessibility trees the preferred source material.
- Began increasing StoreDesk density, then intentionally stopped because
  StoreDesk is only a fictional reference-video app. Future fidelity work should
  target Claude, Finder, and PowerPoint instead.

## Next Fidelity Pass

1. Capture Claude.app or Claude web UI on this Mac and rebuild the shell as an
   editable HTML surface.
2. Capture Finder window states for a project folder and rebuild the Finder
   shell.
3. Locate or install/open PowerPoint and capture the editing UI.
4. Build standalone surface pages before putting them into the animated
   HyperFrames timeline.
5. Add explicit computer-use beats: hover, click, selected field, edit, save,
   drag/drop, and completion.
6. Use reference videos for composition and pacing, not fictional app detail.
