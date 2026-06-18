# Browser Chrome Donor Refinement Pass 013

Date: 2026-06-18.

## Purpose

This pass applies the donor-repo goal refinement to the standalone browser/app
surface. The target was not a real product clone; it was a stronger editable
browser shell that can later host Airtable, Figma web, dashboards, or other
workflow surfaces without looking like a generic rectangle.

## Donor Repos

- Source: https://github.com/EnhancedJax/react-browser-components
- Local clone: `reference/open-source/react-browser-components`
- Commit: `9af4765144246ad0f2a68955fa893b4a9f53d747`
- License metadata: `LICENSE` is MIT, while `package.json` declares ISC. Treat
  as reference-only until the mismatch is intentionally resolved.

- Source: https://github.com/pansinm/react-chrome-tabs
- Local clone: `reference/open-source/react-chrome-tabs`
- Commit: `929c02083e14c4769b1193bd52de39f805c1d52b`
- License: MIT

Inspected `react-browser-components` files:

- `src/components/ChromeBrowser/ChromeBrowser.tsx`
- `src/components/ChromeBrowser/styles.ts`
- `src/components/ChromeBrowser/containers/Tab/index.tsx`
- `src/components/ChromeBrowser/containers/Tab/styles.ts`
- `src/components/ArcBrowser/ArcBrowser.tsx`
- `src/components/ArcBrowser/styles.ts`

Inspected `react-chrome-tabs` files:

- `css/chrome-tabs.css`
- `src/chrome-tabs.ts`
- `src/component.tsx`
- `src/hooks/useChromeTabs.tsx`
- `demo/index.tsx`

## Adapted Patterns

- Overlapping Chrome-like tabs with favicons, title masks, close controls, and
  an add-tab affordance.
- More complete toolbar anatomy: back, forward, reload, local URL badge, star,
  split/view control, profile chip, and more menu.
- Browser-frame decomposition from title/tab row, search row, and content shell.
- Web-app header actions for `Share`, `Export deck`, and `Synced from Finder`
  so future demos can show browser-hosted workflow commands.

All implementation stayed hand-authored in `surfaces/browser-app-surface.html`.
No donor component, stylesheet, icon, or media asset was copied into UI Backlot.

## Verification

- `npm run capture:browser-app`
  - Updated `captures/surface-browser-app/target.png`,
    `captures/surface-browser-app/viewport.png`, and
    `captures/surface-browser-app/visible-text.md`.
- `npm run hf:lint`
  - Passed with expected `gsap_studio_edit_blocked` warnings for timeline
    controlled selectors and pointer-events info.
- `npm run hf:validate`
  - Passed; no console errors.
- `npm run hf:inspect`
  - Passed with `ok: true`, `errorCount: 0`, `warningCount: 0`.
- `npm run hf:snapshot`
  - Updated `snapshots/contact-sheet.jpg`.
- `npm run compare:sheets`
  - Updated `snapshots/reference-vs-prototype-contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
  - `ffprobe`: duration `16.000000`, size `2364874`.
- Preview server check:
  - `curl -fsS http://localhost:3017` returned `preview-ok`.

## Visual Result

`captures/surface-browser-app/target.png` now shows the browser lab with a more
convincing demo-browser chrome: overlapped tabs, close buttons, favicon blocks,
reload/star/profile/more controls, and editable app actions in the page header.
The surface still exposes selectable text in `visible-text.md`, confirming it
remains an editable HTML reconstruction rather than a flattened screenshot.

## Remaining Gaps

- The web app content remains intentionally generic. A future branch should use
  a real target app capture for Airtable, Figma web, or another actual workflow
  surface.
- The tabs are static HTML/CSS. A later React/HyperFrames component could share
  tab state with story data and animate active tab, close, add, and reorder
  transitions.
- The browser lab is standalone and not yet in the main 16 second composition,
  because the current core lane still prioritizes Claude, Finder, and
  PowerPoint.
