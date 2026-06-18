# Open-Source Goal And Finder Fidelity Pass 009

Date: 2026-06-17

## Scope

This pass records the goal refinement to use open-source UI repos as reference
material/component donors, then applies a small Finder fidelity pass to keep the
Claude-on-Mac lane moving.

The active goal is still Claude on macOS with Finder and a PowerPoint-like
editor. The donor-repo lane is now part of how we improve those surfaces.

## Goal Addendum

- Added `docs/research/open-source-ui-donor-repos.md`.
- Updated `README.md`, `DESIGN.md`,
  `docs/workflows/capture-first-ui-reconstruction.md`, and
  `docs/workflows/target-surface-inventory.md` to route future fidelity work
  through donor repo inspection when useful.
- Candidate donor repos now cover:
  - `macos-web`, `react-desktop`, and `AppKit-on-the-Web` for macOS/Finder/Dock
    patterns.
  - `assistant-ui` for Claude-like chat/composer/tool state architecture.
  - Browser-tab libraries for future browser scenes.
  - Fluent UI and `ribbon-menu` for Office-like command surfaces.
  - `PptxGenJS` for future real `.pptx` generation.

## Finder Improvements

- Tuned Finder toolbar glyphs, pill backgrounds, and selected column-view icon
  treatment to feel lighter and closer to the source Finder capture.
- Reduced Finder row text weight/scale and tightened sidebar vertical rhythm.
- Replaced generic sidebar icon placeholders with semantic CSS glyphs for
  Recents, Shared, Applications, Desktop, Downloads, and iCloud Drive.
- Mirrored Finder styling changes in both the standalone surface lab and the
  main HyperFrames workflow composition.

## Evidence

- Finder comparison sheet: `snapshots/finder-source-vs-surface.jpg`
- Full composition contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet:
  `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Focused composition frame: `snapshots/frame-01-at-3.0s.png`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`
- MP4 size: `2252420` bytes from `ffprobe`
- Preview server check: `http://localhost:3017` returned `preview-ok`

## Verification

Passed:

```bash
npm run capture:finder
npm run compare:finder
npm run hf:lint
npm run hf:inspect
npm run hf:validate
npm run hf:snapshot
npm run compare:sheets
npm run hf:render
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4
curl -fsS http://localhost:3017 >/dev/null && echo preview-ok || echo preview-not-responding
```

`hf:lint` reports two expected `gsap_studio_edit_blocked` warnings because the
main workflow and presentation sub-composition intentionally use registered GSAP
timelines.

## Remaining Gaps

- The Finder sidebar glyphs are still CSS approximations, not exact SF Symbols
  or source-extracted vectors.
- `macos-web` and `AppKit-on-the-Web` have not yet been inspected locally; the
  donor-repo lane is documented but not mined.
- Claude and Finder still live in the host `index.html`; only the PowerPoint-like
  editor has been extracted into a sub-composition.
