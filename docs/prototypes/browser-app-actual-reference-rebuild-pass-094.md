# Browser App Actual Reference Rebuild Pass 094

Date: 2026-06-18.

## Scope

This pass tightens the editable browser/app surface against actual browser and
Airtable-like app screenshots instead of generic demo styling. The
implementation remains hand-authored HTML/CSS in
`surfaces/browser-app-surface.html` and `compositions/browser-app.html`. No
proprietary browser assets, app code, product CSS, or product icon files were
copied into the surface.

## Accepted Reference Screenshots

Saved references live in
`captures/reference-browser-app-actual/`. The screenshot folder is ignored
capture evidence, while this note records the source URLs and usage posture.
These are public product/support/guide pages, not permissively licensed UI
assets. Treat all screenshots as reference-only visual evidence owned by their
respective publishers. The implementation below recreates generic layout,
spacing, density, and control anatomy by hand without copying marks, code,
stylesheets, media, or product-specific artwork.

1. Chrome official product page, tab management screenshot.
   - Source: https://www.google.com/chrome/
   - Local file: `captures/reference-browser-app-actual/chrome-tabs-product-page.png`
   - Usage: visual reference only; recreated tab strip, address field, and
     toolbar controls by hand.
2. Chrome official product page, split-view/browser chrome screenshot.
   - Source: https://www.google.com/chrome/
   - Local file: `captures/reference-browser-app-actual/chrome-split-view-product-page.png`
   - Usage: visual reference only; no Chrome marks or artwork copied.
3. Arc official product page, workspace/sidebar browser screenshot.
   - Source: https://arc.net/
   - Local file: `captures/reference-browser-app-actual/arc-product-screenshot.png`
   - Usage: visual reference only for browser sidebar/chrome proportions.
4. Apple Safari official product page, Safari device/browser screenshot.
   - Source: https://www.apple.com/safari/
   - Local file: `captures/reference-browser-app-actual/safari-product-page.png`
   - Usage: visual reference only for neutral Safari/macOS browser tone.
5. Airtable support documentation, dashboard/interface screenshot.
   - Source: https://support.airtable.com/docs/interface-layout-dashboard
   - Local file: `captures/reference-browser-app-actual/airtable-interface-dashboard.jpg`
   - Usage: visual reference only for top app bar, dashboard canvas, right
     configuration panel, and interface editor density.
6. Airtable guide, grid-view section screenshot.
   - Source: https://www.airtable.com/guides/collaborate/interface-designer-dashboards
   - Local file: `captures/reference-browser-app-actual/airtable-guide-grid-view-section-clean.png`
   - Usage: visual reference only for grid element, view tiles, right data
     panel, compact typography, and selected element treatment.

Rejected captures in the same folder include cookie-modal, CAPTCHA/high-load,
logo-only, and text-only pages. They were not used as fidelity references.

## Baseline Deltas Against Previous Capture

The baseline was `captures/surface-browser-app/target.png` from pass 093. The
new capture is the same path after this pass.

1. Replaced the warm illustrated stage with a neutral macOS-like desktop field.
2. Enlarged the browser target from `1604x912` to `1712x944`.
3. Reduced browser corner radius from a soft demo-card radius to a tighter
   macOS window radius.
4. Tightened tab strip height from 52px to 46px.
5. Reduced tab height and width to feel closer to dense real browser tabs.
6. Kept overlapping active/inactive tab geometry but reduced title and favicon
   scale.
7. Tightened toolbar height and address bar typography.
8. Preserved editable CSS-drawn icons while reducing toolbar button visual mass.
9. Added an Airtable-like top base bar inside the app canvas.
10. Replaced the dark bespoke app sidebar with a light product sidebar.
11. Changed sidebar rows from generic workspace labels to tables, views, and
    interface elements.
12. Replaced editorial serif headline styling with system product typography.
13. Changed the page title from narrative/story framing to interface-editor
    framing.
14. Replaced the oversized four-card metrics band with three compact data cards.
15. Added actual Airtable-like view controls: Grid, Chart, Timeline, Calendar.
16. Changed filter/sort chips to filter/group/count controls like app builder UI.
17. Added table row numbers to match real grid anatomy.
18. Expanded the grid schema to title, section, channel, status, priority,
    owner, and due columns.
19. Reduced grid row height from 43px to 34px for stronger SaaS density.
20. Replaced deck-preview art in the right rail with an element picker.
21. Added right-rail connected elements matching the Airtable dashboard
    reference pattern.
22. Replaced record-fields/activity cards with Data and Appearance inspector
    sections.
23. Moved the edit badge onto the selected grid row instead of floating over
    the metrics band.
24. Updated registry dimensions and fidelity metadata for the browser-app
    component.

## Patched Files

- `surfaces/browser-app-surface.html`
- `compositions/browser-app.html`
- `surfaces/registry.json`
- `docs/prototypes/browser-app-actual-reference-rebuild-pass-094.md`

## Verification Evidence

- `npm run capture:browser-app`
  - Updated `captures/surface-browser-app/target.png`.
  - `targetRect`: `x=104`, `y=66`, `width=1712`, `height=944`.
- `npm run capture:claude-browser-chat-pane-workflow`
  - Updated `captures/surface-claude-browser-chat-pane-workflow/target.png`.
  - Confirms the denser browser surface remains readable behind the Claude
    chat-pane workflow.
- `npm run registry:check`
  - Passed with `51 surfaces`, `32 components`, `17 workflows`, and
    `51 ready captures`.

## Remaining Deltas

- Browser chrome is still a hand-built hybrid, not a pixel reconstruction of
  Chrome, Safari, or Arc.
- The favicon/app marks remain generic CSS shapes to avoid proprietary asset
  copying.
- Airtable-like UI now has correct product anatomy, but more work could add
  real grouped-row affordances, field-type icons, column menus, and selected
  element resize handles.
- The workflow wrapper still needs capture inspection to make sure the denser
  browser surface composes well inside Claude chat-pane videos.
