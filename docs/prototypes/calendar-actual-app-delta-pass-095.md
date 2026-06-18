# Calendar Actual App Delta Pass 095

Date: 2026-06-18

## Purpose

Turn the actual Apple Calendar screenshots from Pass 094 into a concrete
side-by-side delta list, then use that list to drive a higher-fidelity editable
Calendar surface.

## Side-by-Side Delta Audit

Primary comparison: current `captures/surface-calendar-app/target.png` against
the Apple Calendar week/day/detail screenshots linked in
`docs/prototypes/calendar-actual-app-reference-pass-094.md`.

1. Current surface renders a month table; strongest Apple reference shows Week
   view with a time ruler, all-day row, and timed event blocks.
2. Current selected view is Month; public Apple screenshot has Week selected
   for the main scheduling state.
3. Current title says `June 2026`; references show large `April 2025` or
   `April 1, 2025` typography with heavy month/day and lighter year.
4. Current title sits inside a separate 92px header; Apple Week view has the
   large month title closer to the grid and more integrated with the day header.
5. Current segmented control is too wide and too flat; Apple uses a compact
   pill with clearer selected inset and soft shadow.
6. Current toolbar icon silhouettes are approximate; Apple list/inbox/add/search
   icons have thinner, more specific geometry and sit in circular/rounded
   translucent controls.
7. Current traffic lights are visually acceptable but the titlebar spacing
   around them is too loose compared with Apple screenshots.
8. Current sidebar width and typography are too generic; Apple sidebar uses
   larger row text, tighter section labels, and more obvious checkbox states.
9. Current sidebar calendar names are demo-specific; Apple references use
   simple account names such as Calendar, Personal, Work, Family, School,
   Scheduled Reminders, and Birthdays.
10. Current active/dragging sidebar state is invented; Apple selected reminder
    state is a subtle light pill with red text and no drag underline.
11. Current calendar rows use right-side colored dots; Apple rows show status
    icons/share affordances only for some calendars, not all rows.
12. Current mini calendar uses Monday-first labels; Apple screenshot mini
    calendar uses Sunday-first labels in the reference screenshots.
13. Current mini calendar day weight is too heavy; Apple mini calendar is
    smaller, lighter, and gray except for selected/current date.
14. Current month grid lines are web-table-like; Apple schedule grid uses fine
    light horizontal time lines and vertical day separators.
15. Current date numbers are large and bold inside every cell; Apple week view
    day labels are restrained, with only today in a red filled circle.
16. Current event pills are small but still month-grid chips; Apple Week/Day
    timed events are translucent blocks with a strong leading color rule,
    dense title text, time metadata, and repeat icons.
17. Current all-day event treatment is a generic pill; Apple all-day row uses
    short tinted strips and reminder circles.
18. Current surface lacks a time ruler; Apple Week/Day views show 8 AM, 9 AM,
    10 AM, Noon, etc.
19. Current surface lacks the red current-time line and red time badge visible
    in Apple Day/Week screenshots.
20. Current event detail popover is too generic; Apple event editor uses grouped
    rounded field regions, a large title, compact native controls, and map/URL
    affordances.
21. Current color palette is too saturated in event text and sidebar dots;
    Apple colors are vivid accents inside very soft tinted fills.
22. Current overall layout feels like a responsive web dashboard; Apple Calendar
    feels like a dense native schedule canvas with very quiet chrome.
23. Current Dock/menu/cursor are acceptable background context, but Calendar
    fidelity should improve inside `.calendar-window` without broad desktop
    chrome churn.

## Fixes Targeted In This Pass

- Switch the visible state from Month to Week.
- Rebuild the content area as a time-grid schedule with all-day row, day
  headings, time ruler, current-time line, and Apple-like event blocks.
- Replace demo sidebar labels with Apple-reference calendar labels and
  Sunday-first mini calendar.
- Retune toolbar segmented control, navigation controls, font weights, grid
  lines, and event colors toward the actual screenshots.
- Replace the generic popover with inline native-style schedule/detail cues
  inside the week grid rather than an invented floating card.

## Implemented Changes

1. Switched the visible segmented selection from Month to Week.
2. Replaced the month table with a Week-view schedule canvas.
3. Added Apple-like week date headers from `Sun 30` through `Sat 5`.
4. Added an all-day row with purple all-day events and reminder circle styling.
5. Added a left time ruler with 8 AM through 4 PM labels and `Noon` treatment.
6. Added the red current-time badge, line, and day-position dot.
7. Rebuilt timed events as translucent blocks with strong leading color rules,
   dense titles, optional time metadata, and recurrence glyphs.
8. Changed visible calendar labels to Apple-reference labels: Calendar,
   Personal, Work, Family, School, Scheduled Reminders, and Birthdays.
9. Changed the mini calendar to April 2025 and Sunday-first weekday order.
10. Retuned sidebar row sizing, font weights, color checkbox dimensions, and
    selected calendar treatment toward the Apple screenshots.
11. Retuned toolbar control sizing, the segmented control, and calendar
    navigation buttons toward the Apple screenshots.
12. Removed the generic floating event popover from the main state so the
    surface reads like the actual Week-view app screenshot instead of a custom
    dashboard overlay.

## Verification

- `npm run capture:calendar`
  - Passed after implementation and refreshed
    `captures/surface-calendar-app/target.png`.
- Visual review
  - The refreshed capture now shows a Week-view Apple Calendar-like schedule
    with sidebar calendar list, mini calendar, all-day row, time ruler,
    current-time marker, and dense event blocks.
- `npm run registry:check`
  - Passed: `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`

## Remaining Gaps

- Toolbar icons are still CSS approximations; they are closer in placement and
  scale, but not exact Apple SF Symbols.
- The public screenshot set does not include a clean current Month view at the
  same scale, so this pass optimizes the visible state for the strongest actual
  Week/Day references.
- Local Calendar capture is still intentionally skipped until there is explicit
  permission or a sanitized local Calendar state.
