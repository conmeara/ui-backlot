# Excel Workbook Surface Pass 022

Date: 2026-06-18

## Purpose

Add the first reusable Excel-style workbook surface so future videos can show
spreadsheet review, formulas, selected ranges, chart analysis, and workbook
editing workflows without importing the full Claude/Finder/PowerPoint
composition.

This is a component expansion pass. It establishes a direct-capturable Excel
surface and does not claim pixel parity with a live Microsoft Excel session yet.

## Evidence Used

- `DESIGN.md`
  - Used for palette, typography, and motion constraints.
- `reference/open-source/ribbon-menu/src/components/RibbonMenu/RibbonMenu.less`
  - Used for ribbon tab height, active tab treatment, section padding, group
    dividers, bottom group labels, and large/split command structure.
- `reference/open-source/ribbon-menu/src/components/Button/Button.less` and
  `SplitButton/SplitButton.less`
  - Used for large command sizing, hover/active state concept, caption/icon
    stacking, and split-command affordances.
- `reference/open-source/fluentui/.../useToolbarStyles.styles.ts`,
  `useToolbarGroupStyles.styles.ts`, and `useTabStyles.styles.ts`
  - Used for toolbar flex alignment, padding scale, group layout, subtle tab
    states, selected tab treatment, and button-like tab structure.
- `compositions/word-editor.html` and `compositions/presentation-editor.html`
  - Used as the existing Office-family component pattern for macOS title chrome,
    AutoSave/search/share controls, ribbon density, and status surfaces.
- Local app availability check
  - `/Applications/Numbers.app` and `/Applications/LibreOffice.app` are
    available, but Microsoft Excel is not present. This pass therefore avoids
    live/private workbook capture and documents source-capture as a fidelity
    gap.

## Changes

- Added `compositions/excel-workbook.html`.
  - Defines `data-composition-id="excel-workbook-surface"`.
  - Provides a direct-preview fallback so the same file can be captured as a
    standalone workbook surface.
  - Uses local Anthropic Sans for deterministic render typography.
  - Contains a scoped GSAP timeline for window/ribbon/formula/sidebar/insights
    entrance, grid reveal, selected range reveal, chart bar growth, insight row
    reveal, and saved-state spinner.
- Added `npm run capture:excel-workbook`.
- Updated `PRIMITIVES.md`, `SURFACES.md`, `surfaces/README.md`,
  `docs/research/open-source-ui-donor-repos.md`, and
  `reference/open-source/README.md` to list the Excel component boundary and
  donor extraction.

## Asset Decision

No Microsoft Excel code, fonts, icons, screenshots, workbook data, or app assets
were copied. The Excel icon, ribbon controls, formula bar, workbook grid,
selected range, chart, analyze-data pane, sheet tabs, and status bar are
hand-built editable HTML/CSS. `ribbon-menu` and Fluent UI were used as
permissive local donor references for structure and spacing only.

## Verification

- `npm run capture:excel-workbook` refreshed
  `captures/surface-excel-workbook/target.png`.
- `npm run hf:lint` passed with `0 error(s), 7 warning(s), 5 info(s)`.
  The warnings are Studio editability warnings for GSAP-controlled elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,651,902 bytes.
- `git diff --check` passed.

## Remaining Gaps

- Capture a live Excel session or safe screenshots for exact ribbon geometry,
  formula-bar behavior, grid dimensions, sheet tabs, and analysis pane details.
- Mount the Excel workbook into a future Claude-plus-spreadsheet storyboard when
  the workflow needs spreadsheet review or chart generation.
- Add alternate Excel states: blank workbook, formula editing, autofill handle,
  filter dropdown, pivot/chart insert, error cell, and CSV import flow.
