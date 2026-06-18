# Presentation Editor Fidelity Pass 004

Date: 2026-06-17

## Scope

This pass narrows the active prototype back to the core workflow: Claude on a
Mac, Finder folder context, and a PowerPoint-like presentation editor.

The browser/website preview beat is removed from the main render path. Future
app surfaces should wait until the Claude + Finder + PowerPoint lane is strong.

## Built

- Updated visible workflow copy from Keynote/browser language to PowerPoint
  presentation language.
- Kept the internal `.keynote-window` class for timeline stability, while the
  public primitive is now `presentation-editor`.
- Removed the website preview from `index.html` and the primary timeline.
- Replaced the website update beat with a second presentation-editor polish
  beat: selection box, inspector color change, speaker-notes highlight, and
  todo completion.
- Centered the Dock around Finder, Claude, and presentation app icons only.
- Updated `PRIMITIVES.md`, `SURFACES.md`, and `README.md` to reflect the
  narrowed surface kit.

## Evidence

- Snapshot contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet:
  `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`

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

`hf:lint` still reports the expected `gsap_studio_edit_blocked` warning because
timeline-owned elements are intentionally animated by GSAP.

## Local App Inventory

- Claude.app is installed and running.
- Microsoft PowerPoint was not found in `/Applications` or Spotlight bundle
  search, so exact PowerPoint source capture is still pending.

## Remaining Visual Gaps

- The editor is still hand-built and PowerPoint-like, not yet source-captured
  from Microsoft PowerPoint.
- Claude needs a sanitized live-app capture for exact current geometry.
- Finder needs a dedicated native icon/vibrancy pass.
- The main composition remains monolithic until the primitive boundaries settle.
