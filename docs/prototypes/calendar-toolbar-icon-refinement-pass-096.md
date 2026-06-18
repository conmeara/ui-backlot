# Calendar Toolbar Icon Refinement Pass 096

Date: 2026-06-18

## Purpose

Address the largest remaining visual delta after the Week-view reconstruction:
the Calendar toolbar and sidebar icons still looked like rough CSS drawings
instead of native Apple Calendar controls.

## Changes

- Replaced the gradient-built calendar-list glyph with a mask-based vector
  calendar grid icon.
- Replaced the hand-drawn inbox outline with a mask-based tray icon.
- Joined the calendar-list and inbox buttons into a shared rounded capsule with
  a center divider, matching the Apple screenshot structure more closely.
- Replaced the text `+` button with two vector strokes inside the circular
  quick-event control.
- Replaced the search icon with a mask-based magnifier.
- Replaced previous/next text chevrons in the header controls with CSS stroke
  chevrons.
- Replaced mini-calendar text chevrons with smaller CSS stroke chevrons.
- Replaced diagonal sidebar swatches with Apple-style rounded checked color
  boxes.

## Verification

- `npm run capture:calendar`
  - Passed and refreshed `captures/surface-calendar-app/target.png`.
- Visual review
  - Top chrome now reads as native toolbar controls rather than text/gradient
    placeholders.

## Remaining Gaps

- Icons are still hand-authored vector masks, not exact SF Symbols.
- Calendar-list and inbox glyphs may need one more sizing pass if a sanitized
  local Calendar capture is approved later.
