# Presentation Sub-Composition Pass 008

Date: 2026-06-17

## Scope

This pass turns the PowerPoint-like editor from host-page markup into a mounted
HyperFrames sub-composition while preserving the current Claude + Finder +
PowerPoint workflow timing.

## Built

- Added `compositions/presentation-editor.html` as the reusable
  `presentation-editor-surface` composition.
- Moved the presentation editor's markup, scoped CSS, fonts, and internal GSAP
  title/chart/selection timeline into the sub-composition.
- Replaced the large editor block in `index.html` with a
  `data-composition-src="compositions/presentation-editor.html"` mount.
- Kept the host `.keynote-window` wrapper in `index.html` so the parent
  timeline can still control the whole editor window entrance and exit.
- Removed presentation-editor CSS from `styles/workflow.css` except for the
  host window placement and shadow.
- Updated `README.md`, `PRIMITIVES.md`, and `SURFACES.md` to point at the new
  composition boundary.

## Evidence

- Snapshot contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet:
  `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Presentation frame check: `snapshots/frame-04-at-10.1s.png`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`
- MP4 size: `2247154` bytes from `ffprobe`
- Preview server check: `http://localhost:3017` returned `preview-ok`

## Verification

Passed:

```bash
npm run hf:lint
npm run hf:inspect
npm run hf:validate
npm run hf:snapshot
npm run compare:sheets
npm run hf:render
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4
curl -fsS http://localhost:3017 >/dev/null && echo preview-ok || echo preview-not-responding
```

`hf:lint` now reports two expected warnings:

- `gsap_studio_edit_blocked` in `index.html`, because the parent composition
  intentionally uses a code-authored GSAP timeline.
- `gsap_studio_edit_blocked` in `compositions/presentation-editor.html`,
  because the presentation editor's internal title/chart/selection state is
  timeline-owned.

The previous `composition_file_too_large` warning is gone after this split.

## Visual Check

- The contact sheet shows the PowerPoint-like editor still entering in the
  lower-left desktop slot.
- At 10.1s, the mounted sub-composition fills the host window, has switched to
  `Q2 launch story`, shows the updated chart colors, selected-object handles,
  right format pane, and highlighted speaker notes.

## Remaining Gaps

- The editor is still code-native and PowerPoint-like, not source-captured from
  Microsoft PowerPoint.
- The public host selector is still `.keynote-window` for timeline stability.
  Rename it once the parent timeline is refactored.
- Claude, Finder, desktop chrome, and shared cursor/status motion still live in
  `index.html`; split them into sub-compositions as their boundaries stabilize.
