# Apple Calendar Fidelity Pass 093

Date: 2026-06-18

## Purpose

Improve `surfaces/calendar-app-surface.html` so the editable Calendar window is
more representative of Apple Calendar for scheduling and coordination workflow
videos while staying hand-authored HTML/CSS.

## Reference Evidence

- Apple Calendar User Guide for Mac, current macOS Tahoe guide:
  https://support.apple.com/guide/calendar/welcome/mac
- Apple guide image, Calendar window with color-coded sidebar:
  https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/6c51314ed8865910b9a2e61cbd23a412.png
- Apple guide image, Day view with scheduled reminders and right-side details:
  https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/dc7fbe0c8d9071e688da73c6420254be.png
- Apple guide image, event info popover:
  https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/bdb87cc3fcb04f126ef7f343492014d2.png
- Apple event-editing behavior reference:
  https://support.apple.com/guide/calendar/add-modify-or-delete-events-icalwr13-events/mac
- Apple calendar-list behavior reference:
  https://support.apple.com/guide/calendar/show-or-hide-a-calendar-icl1006/mac
- Local MIT donor reference restored at
  `reference/open-source/macos-web` pinned to
  `f0d4d4db147a1e5706bd3262e5aec5a08cef4026`.
  Relevant files:
  `src/components/apps/Calendar/Calendar.svelte`,
  `src/components/apps/Calendar/MonthView.svelte`,
  `src/components/apps/Calendar/calendar-constants.ts`, and
  `src/components/apps/Calendar/calendar-utils.ts`.

## Before Capture

- Baseline capture path:
  `captures/surface-calendar-app/target.png`.
- Baseline read: useful first pass, but the application chrome read closer to a
  generic macOS window than current Apple Calendar.

## Current-vs-Reference Deltas

1. The old titlebar centered a Calendar title and icon; Apple Calendar uses
   utility controls in the chrome and leaves app identity to content/context.
2. The old titlebar lacked Day, Week, Month, and Year segmented controls.
3. The old chrome lacked visible Calendar-list, inbox/reminders, quick-event,
   and search controls.
4. The old sidebar put the mini calendar first; Apple's current screenshots
   lead with account calendar lists and place the mini calendar lower.
5. The old sidebar was a flat `My Calendars` list without an iCloud account
   heading or an `Other` section.
6. The old calendar rows used color dots plus checkboxes that read more like a
   generic settings list than Apple Calendar's color-coded calendar list.
7. The old month title was smaller and less like the large month/year typography
   visible in Apple Calendar.
8. The old event pills were saturated blocks with white text, closer to a
   mobile calendar chip than macOS Calendar's lighter, category-colored event
   strips.
9. The old events had no all-day or recurring affordance cues.
10. The old month grid had slightly heavy date emphasis and less nuanced weekend
    and out-of-month contrast.
11. The old surface had no event-detail popover, even though Apple Calendar
    prominently uses detail/edit panels in day/week workflows.
12. The old window was smaller and more cramped than the guide images suggest
    for a video-readable scheduling surface.

## Changes

- Enlarged the Calendar window and tuned active-window background, corner radius,
  titlebar translucency, and toolbar density.
- Replaced the centered title with Calendar-style chrome controls: calendar-list
  toggle, inbox/reminders button, circular quick-event add button, centered
  Day/Week/Month/Year segmented control, and search control.
- Reworked the sidebar into an `iCloud` hierarchy with `My Calendars`, `Other`,
  Apple-like checked color swatches, lighter active state, and mini calendar at
  the bottom.
- Increased the month/year title scale and softened the month header and grid
  line treatment.
- Retuned date-number sizing, weekend shading, and out-of-month contrast for
  better macOS Calendar readability.
- Replaced saturated event pills with lighter category-tinted event strips,
  added all-day and recurring cues, and kept all labels editable HTML.
- Added a Calendar-style event detail popover to represent the day/week
  scheduling workflow without implementing a separate app state machine.

## Asset and License Notes

- No proprietary Apple assets or code were copied into the repo.
- Apple screenshots were used as external visual references only.
- The restored `macos-web` donor is MIT-licensed; this pass continues to
  translate observed patterns into local HTML/CSS rather than importing Svelte
  components.
- The donor Calendar icon path remains local-only and ignored under
  `reference/open-source/macos-web/public/app-icons/calendar/256.webp`.

## Verification

- `npm run capture:calendar`
  - Passed and refreshed `captures/surface-calendar-app/target.png`.
- Full ready-capture regeneration
  - Ran all 51 ready registry capture scripts because `captures/` is ignored in
    a fresh worktree and `registry:check` requires capture paths to exist.
- `npm run registry:check`
  - Passed: `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`

## Remaining Gaps

- The surface still renders one static Month state; Day and Week are represented
  through the segmented control and event-detail popover rather than separate
  selectable layouts.
- No privacy-safe local Apple Calendar capture was available in this worktree,
  so the comparison used public Apple guide images plus the local MIT donor.
- The event data remains demo-authored and is not connected to calendar data,
  drag/drop state, or recurrence logic.
