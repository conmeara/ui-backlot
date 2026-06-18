# Claude Shell Font Fidelity Pass 005

Date: 2026-06-17

## Scope

This pass improves the editable Claude controller shell without capturing live
Claude conversation content. The technique was to inspect static assets bundled
with the installed `/Applications/Claude.app` and use those as safe source
signals.

## Built

- Copied Anthropic Sans and Anthropic Serif variable fonts into
  `assets/fonts/`.
- Added `@font-face` declarations in `styles/workflow.css`.
- Replaced generic Inter and EB Garamond styling with Anthropic Sans/Serif.
- Tuned the Claude shell toward the installed app's structure: warmer white
  main surface, denser sidebar rows, sidebar icons, workspace footer,
  current-model pill, topbar project chip, composer tool pills, plus/mic/send
  controls, and active tool-row treatment.
- Added a finite GSAP spinner on the active tool row so the working state is
  visible and seekable in HyperFrames.
- Updated `DESIGN.md` so future passes use Anthropic fonts as the preferred
  local Claude source when available.

## Evidence

- Snapshot contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet:
  `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`
- HyperFrames snapshot output confirmed:
  `Fonts loaded: Anthropic Sans (300 900 normal), Anthropic Serif (300 900 normal)`

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

## Remaining Visual Gaps

- This is still a safe approximation, not a sanitized live Claude window
  capture.
- The Claude shell geometry should be checked against a new-chat-only capture
  before being treated as production quality.
- The PowerPoint-like editor remains hand-built because Microsoft PowerPoint was
  not found on this Mac.
