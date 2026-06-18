# PowerPoint Ribbon Fidelity Pass 007

Date: 2026-06-17

## Scope

This pass improves the main HyperFrames composition's PowerPoint-like editor,
keeping the active lane focused on Claude, Finder, and presentation editing.
PowerPoint is still not installed locally, so this is a code-native
approximation informed by Microsoft Support surface descriptions rather than a
live PowerPoint capture.

## Source Signals

- Microsoft documents the PowerPoint for Mac ribbon as a row of tab labels at
  the top of the program, with tools/functions exposed when a tab is selected:
  https://support.microsoft.com/en-us/office/using-the-ribbon-in-powerpoint-for-mac-83816cc6-0410-45e2-a910-8b6a42ae2649
- Microsoft describes Normal editing view with the slide thumbnail pane on the
  left margin of the PowerPoint window:
  https://support.microsoft.com/en-us/office/show-or-hide-slide-thumbnails-f4ad3e11-e0f7-4787-b700-563d16762783
- Microsoft describes modern comments as anchored to slide objects with a
  comments pane available from the top-right Comments button:
  https://support.microsoft.com/en-us/office/modern-comments-in-powerpoint-c0aa37bb-82cb-414c-872d-178946ff60ec

## Built

- Reworked the editor markup in `index.html` while preserving the existing
  `.keynote-window` timeline selector for animation stability.
- Added macOS-style PowerPoint title chrome with file name, AutoSave, search,
  Share, and Comments controls.
- Added a dedicated ribbon tab row and denser Home ribbon groups for Slides,
  Font, Paragraph, Drawing, and Editing.
- Expanded the presentation editor plate and rebuilt the slide rail with
  numbered thumbnails and miniature slide content.
- Enlarged the slide canvas and added a section band, selected-object handles,
  chart baseline, speaker notes, and a bottom status/zoom strip.
- Reworked the right pane into a richer `Format Shape` panel with tabs,
  fill/outline/text/arrange controls, and a small comments card.
- Updated `STORYBOARD.md` and `SCRIPT.md` to remove stale online-store beats and
  reflect the current Claude + Finder + PowerPoint workflow.

## Evidence

- Snapshot contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet:
  `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`
- MP4 size: `2252089` bytes from `ffprobe`

## Verification

Passed:

```bash
npm run hf:lint
npm run hf:inspect
npm run hf:validate
npm run hf:snapshot
npm run compare:sheets
npm run hf:render
```

`hf:lint` now reports two expected warnings:

- `gsap_studio_edit_blocked`, because the composition intentionally uses a
  code-authored GSAP timeline.
- `composition_file_too_large`, because the prototype is still monolithic after
  this fidelity pass. The next structural pass should split Claude, Finder, and
  presentation editor surfaces into sub-compositions.

## Remaining Visual Gaps

- The editor is still hand-built. Replace or calibrate it against a real
  PowerPoint capture when PowerPoint is installed or a clean screenshot is
  supplied.
- The internal `.keynote-window` class name is intentionally preserved for now
  to avoid timeline churn; rename during modularization.
- The right formatting pane and ribbon command icons are still approximations,
  not pixel-matched Office controls.
- The main composition should be split into smaller HyperFrames
  sub-compositions before more heavy UI is added.
