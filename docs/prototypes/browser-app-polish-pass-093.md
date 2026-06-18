# Browser App Polish Pass 093

Date: 2026-06-18.

## Scope

This pass improves the editable browser/app surface for future Claude/Codex
workflow videos. The target remains hand-authored HTML/CSS in
`surfaces/browser-app-surface.html` and `compositions/browser-app.html`; no
proprietary browser assets, product UI code, or donor stylesheets were copied.

## References Checked

- Chrome official product page: current desktop UI references show grouped tabs,
  bookmark/tab management, split view, profile/update chips, and an address bar
  treated as the browser's primary command/search field.
  Source: https://www.google.com/chrome/
- Safari User Guide for macOS Tahoe 26: confirmed current macOS browser
  vocabulary around tabs, bookmarks, favorites, profiles, and the Smart Search
  field/Command-L interaction.
  Source: https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac
- Arc official product page: used as a visual/mood reference for calmer browser
  chrome and workspace-like browsing without copying Arc assets.
  Source: https://arc.net/
- Airtable support docs: used as SaaS workflow reference for views, grid/list
  switching, view sidebars, inline editable records, and interface overview
  layouts.
  Sources: https://support.airtable.com/docs/getting-started-with-airtable-views
  and https://support.airtable.com/docs/airtable-interface-layout-overview
- `react-browser-components`, restored locally at
  `reference/open-source/react-browser-components`, commit
  `9af4765144246ad0f2a68955fa893b4a9f53d747`. `LICENSE` is MIT, while
  `package.json` declares ISC, so this pass kept it reference-only.
- `react-chrome-tabs`, restored locally at
  `reference/open-source/react-chrome-tabs`, commit
  `929c02083e14c4769b1193bd52de39f805c1d52b`. `package.json` and
  `LICENSE.txt` declare MIT. This pass used it as geometry reference only,
  especially tab strip height, 240px-ish tab sizing, title masks, dividers, and
  active tab layering.

## Baseline Deltas

The baseline capture was generated with `npm run capture:browser-app` before
patching, then compared visually against the references above.

1. Browser window was slightly small for the 1920x1080 stage and left too much
   background around the app.
2. Tab row had only three tabs and no workspace/research tab, making it feel
   less like a real web workflow.
3. Active tab shape was present but too sparse; inactive tabs lacked enough
   density and visual layering.
4. Toolbar had back/forward/reload only, missing a home control and richer
   right-side browser actions.
5. Address field looked plausible but did not communicate private/local state
   strongly enough.
6. Browser had no bookmarks/favorites bar, which made it less representative
   of a working Chrome/Safari/Arc setup.
7. Sidebar was mostly labels and rows with no search, counts, or synced
   workspace context.
8. App page jumped straight from header to metrics and table, missing a
   SaaS-like view/filter/sort control row.
9. Metrics were large and sparse; the content did not fill the page canvas with
   enough realistic operational density.
10. Table lacked priority/blocked states and enough rows to read as an active
    editable record grid.
11. Right inspector only had a preview and three checks; it needed record fields
    and recent activity to support video storytelling.
12. The mounted component geometry in `surfaces/registry.json` still reflected
    the old `1516x864` bounds instead of the new capture result.

## Patched Gaps

- Enlarged the browser window to `1604x912` and updated the registry dimensions.
- Reworked the tab strip with four tabs, denser 228px tabs, a stronger active
  tab, title masks, dividers, and a board favicon.
- Expanded the toolbar with disabled forward state, home, capture, split,
  profile, more menu, and a stronger private URL state.
- Added a bookmarks bar with Launch Deck, Revenue CSV, Claude outputs, and
  Approved claims chips.
- Added sidebar search, record counts, view counts, and a Claude workspace
  status block.
- Added a view toolbar with Grid/Kanban/Timeline, filter, sort, and record
  count controls.
- Expanded metrics to four compact cards, including open blockers.
- Expanded the table to six rows with priority and blocked/ready/reviewing
  states.
- Added inspector record fields and recent activity cards.
- Mirrored the same chrome/app changes in `compositions/browser-app.html` so
  Claude/browser workflow wrappers use the improved browser component.

## Evidence

- Standalone capture after patch:
  `captures/surface-browser-app/target.png`
- Capture metadata after patch:
  `captures/surface-browser-app/capture.json`
  - `targetRect`: `x=136`, `y=72`, `width=1604`, `height=912`
- Visible text remains selectable/editable:
  `captures/surface-browser-app/visible-text.md`

## Remaining Deltas

- The surface is still a representative SaaS/browser app, not a direct
  source-captured Airtable, Chrome, Safari, or Arc reconstruction.
- Tabs and toolbar controls are static HTML/CSS; future video work could add
  stateful tab switching, tab close/add animation, and address-field focus.
- The app could later branch into a real Airtable-like grid, a Figma web file,
  or a browser research side-by-side scene once sanitized reference captures
  are available.
