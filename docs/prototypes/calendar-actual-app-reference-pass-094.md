# Calendar Actual App Reference Pass 094

Date: 2026-06-18

## Purpose

Re-baseline the editable Calendar surface against actual Apple Calendar
screenshots before another implementation pass. The prior surface is still too
far away in font scale, icon drawing, toolbar hierarchy, grid density, event
treatment, and overall Apple Calendar feel.

## Actual-App Screenshot Sources

These are public Apple Support screenshots and should remain linked references,
not vendored project assets.

| State | Source | What It Shows |
|---|---|---|
| Account setup window | https://support.apple.com/guide/calendar/get-started-iclc0d84c7fa/mac | Calendar chrome, traffic lights, toolbar placement, account dialog geometry. Direct image: https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/4e0828b9eba2a6bccae7ebae37f67b5f.png |
| Color-coded sidebar and week/month toolbar | https://support.apple.com/guide/calendar/welcome/mac | iCloud sidebar hierarchy, calendar checkbox treatment, Day/Week/Month/Year segmented control, search/add/list/inbox icons, event strip density. Direct image: https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/6c51314ed8865910b9a2e61cbd23a412.png |
| Day view with reminders | https://support.apple.com/guide/calendar/use-reminders-icl873b9a527/mac | Day header typography, time ruler, current-time line, all-day rows, right-side reminder/detail area, sidebar calendar list. Direct image: https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/9e004a58df0c2d6fb34b9cbefe502374.png |
| Event detail editor | https://support.apple.com/guide/calendar/get-started-iclc0d84c7fa/mac | Event detail surface, rounded grouped fields, large event title, date/address/map sections. Direct image: https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/37d882fced5807011e8daddcf0bc74a3.png |
| Quick event dialog | https://support.apple.com/guide/calendar/get-started-iclc0d84c7fa/mac | Natural-language quick event popover, toolbar add-button behavior, popover shadow and input shape. Direct image: https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/10b9a53bdc13b1b2f60848e0fa803523.png |
| Calendar color menu | https://support.apple.com/guide/calendar/change-a-calendars-name-or-color-icl1030/mac | Native context menu geometry, selected calendar row, color dot palette, sidebar row spacing. Direct image: https://help.apple.com/assets/67DB4AD617009A1F970697F4/67DB4AD747D53316F70BB655/en_US/fb8d8846e60b90642d6c426f589212b8.png |
| Month-view event symbols | https://support.apple.com/guide/calendar/symbols-used-in-calendar-symbls/mac | Apple definitions for month-view all-day bars, timed-event dots, reminder open circles, birthday styling, notification symbols. |

## Privacy Boundary

No local Calendar screenshot was captured in this pass. Capturing the local app
could expose private meetings, calendars, contacts, locations, or reminders.
Use a local screenshot only after explicit permission or after the user provides
a sanitized Calendar window/state.

## Immediate Fidelity Implications

1. Use Apple Calendar screenshots as the primary geometry source, with
   `macos-web` only as a permissive donor for rough shell ideas.
2. The toolbar needs actual Calendar icon silhouettes: calendar-list grid,
   inbox tray, circular add button, search magnifier, and compact chevrons.
3. The app should not rely on a centered title; Apple Calendar's chrome is
   functional and view-focused.
4. The segmented control needs tighter sizing, better selected-pill geometry,
   and visual centering relative to the full window.
5. Sidebar rows need thinner typography, real checkbox/color treatment, hover
   share/status affordances, and iCloud/Other hierarchy.
6. The mini calendar should be low in the sidebar and much smaller than the
   primary month/week canvas.
7. Month-view events should distinguish all-day bars, timed-event dots, open
   reminder circles, and birthday symbols per Apple's symbol guide.
8. Timed day/week events use tinted strips with a strong leading color edge and
   dense text, not large saturated pills.
9. Date typography is currently too heavy and too high-contrast; Apple uses
   more restrained SF weights except for selected/current dates.
10. Grid lines and weekend shading need to be subtler and more spatially
    precise; the current grid still feels web-table-like.
11. The current event popover is conceptually useful but too generic; it needs
    grouped field blocks, native controls, and Apple-like button geometry.
12. The surface needs one true Apple Calendar target state before branching into
    invented demo content.

## Next Implementation Gate

Before the next code patch, create a side-by-side comparison between
`captures/surface-calendar-app/target.png` and the actual-app screenshots above,
then list at least 20 visual deltas. The next HTML/CSS pass should address at
least 10 of those deltas and re-run:

- `npm run capture:calendar`
- `npm run registry:check`
