# macOS Web Calendar Surface Pass 016

Date: 2026-06-18

## Purpose

Add a reusable editable macOS Calendar surface that can support future
Claude-on-Mac scheduling, planning, and coordination demos.

The pass uses `PuruVJ/macos-web` as the donor reference, but keeps the UI
Backlot implementation as hand-authored HTML/CSS instead of importing Svelte
components.

## Donor Inputs

- `reference/open-source/macos-web/src/components/apps/Calendar/Calendar.svelte`
- `reference/open-source/macos-web/src/components/apps/Calendar/MonthView.svelte`
- `reference/open-source/macos-web/src/components/apps/Calendar/calendar-constants.ts`
- `reference/open-source/macos-web/src/components/apps/Calendar/calendar-utils.ts`
- `reference/open-source/macos-web/public/app-icons/calendar/256.webp`
- `reference/open-source/dayflow-calendar/packages/plugins/sidebar/src/DefaultCalendarSidebar.tsx`
- `reference/open-source/dayflow-calendar/packages/plugins/sidebar/src/components/CalendarList.tsx`
- `reference/open-source/dayflow-calendar/packages/core/src/components/common/MiniCalendar.tsx`
- `reference/open-source/dayflow-calendar/packages/plugins/drag/src/plugin.ts`

## Changes

- Added `surfaces/calendar-app-surface.html`, a 1920x1080 editable macOS
  Calendar lab surface.
- Translated the donor titlebar/main-area split, month/year header, compact
  rounded previous/today/next controls, Monday-first weekday row, fixed 42-cell
  month layout, weekend dimming, and red today marker into plain HTML/CSS.
- Added editable event pills for future workflow staging.
- Added a DayFlow-informed scheduling sidebar with a mini calendar, visible
  calendar source rows, color dots, a drag/reorder cue, and event draft card.
- Added a matching macOS menu bar, Dock, cursor, and local-only donor Calendar
  icon path so the surface can be captured as a full desktop scene or as just
  the app window.
- Added `npm run capture:calendar` for repeatable Playwright capture.
- Updated surface, primitive, donor, and reference docs.

## Asset Decision

The Calendar icon is referenced through the ignored local `macos-web` clone and
is not committed or redistributed.

If a future packaged demo needs bundled Calendar icons, perform a separate asset
rights decision or replace the icon with a project-owned vector/raster asset.

## Verification

- `npm run capture:calendar`
  - Refreshed `captures/surface-calendar-app/target.png` and
    `captures/surface-calendar-app/viewport.png`.
- `npm run hf:lint`
  - Passed with existing GSAP editability warnings and pointer-events info for
    intentionally timeline-controlled/non-editable primitives.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed on solo rerun with `ok: true`, `errorCount: 0`, `warningCount: 0`.
  - A parallel run timed out during navigation, so use solo inspect for the
    canonical gate.
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
  - `ffprobe` reported `duration=16.000000` and `size=2628046`.
- `npm run compare:sheets`
  - Refreshed `snapshots/reference-vs-prototype-contact-sheet.jpg`.
- `npm run compare:finder`
  - Refreshed `snapshots/finder-source-vs-surface.jpg`.

## Remaining Gaps

- Calendar is not yet mounted into the main Claude/Finder/PowerPoint timeline.
- No local macOS Calendar app source capture has been compared yet.
- Events and sidebar sources are useful demo placeholders, not source-captured
  user data.
