# Browser App Surface Pass 006

Date: 2026-06-17

## Scope

This pass adds a standalone browser/app surface lab for future web-workflow
demos while keeping the main prototype focused on Claude, Finder, and a
PowerPoint-like editor. The surface is intentionally generic and code-native; it
is not a clone of StoreDesk or any real product.

## Built

- Added `surfaces/browser-app-surface.html`, a 1920x1080 macOS browser scene
  using local Anthropic Sans/Serif fonts.
- Modeled editable browser chrome, tabs, URL bar, app sidebar, metrics, table,
  right inspector, cursor, and an agent edit badge.
- Added `npm run capture:browser-app` for repeatable Playwright capture through
  the existing `tools/capture-web-ui.mjs` workflow.
- Updated `README.md`, `SURFACES.md`, `surfaces/README.md`, and
  `PRIMITIVES.md` with the new standalone surface primitive.

## Evidence

- Full viewport capture:
  `captures/surface-browser-app/viewport.png`
- Target window capture:
  `captures/surface-browser-app/target.png`
- Capture metadata:
  `captures/surface-browser-app/capture.json`
- Visible text scrape:
  `captures/surface-browser-app/visible-text.md`
- Target rect from `capture.json`: `x=168`, `y=86`, `width=1516`,
  `height=864`.

## Verification

Passed:

```bash
npm run capture:browser-app
npm run hf:lint
npm run hf:inspect
npm run hf:validate
npm run hf:snapshot
npm run compare:sheets
npm run hf:render
```

The capture visually confirms that the edit badge annotates the selected table
row without masking the status chip, and the UI text remains editable/searchable
in `visible-text.md`.

The main HyperFrames composition still renders as a 16 second draft MP4 at
`renders/claude-keynote-workflow-draft.mp4`. `hf:lint` keeps the expected
`gsap_studio_edit_blocked` warning because timeline-owned elements are
intentionally animated by GSAP.

## Remaining Visual Gaps

- This is a generic web-app lab surface, not a source-captured Airtable, Figma,
  or internal app target.
- The next production branch should use a real target app capture to replace
  the placeholder product geometry.
- The main render should continue to prioritize Claude, Finder, and
  PowerPoint-like presentation editing until those surfaces are convincing.
