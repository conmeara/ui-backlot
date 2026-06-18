# Open-Source Reference Clones

These directories are local, shallow clones used as reference material for UI
Backlot reconstruction work. They are not production dependencies.

The clone directories are ignored by git. Restore them in a fresh checkout with:

```bash
tools/clone-reference-repos.sh
```

See [../../GOAL.md](../../GOAL.md) for the donor-repo mandate and
[../../docs/research/open-source-ui-donor-repos.md](../../docs/research/open-source-ui-donor-repos.md)
for the full candidate list.

## Clones

| Repo | Commit | License | Current Use |
|---|---:|---|---|
| [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web) | `f0d4d4db147a1e5706bd3262e5aec5a08cef4026` | MIT | Reference and possible component donor for macOS desktop, Dock, menu bar, window chrome, and active-app Dock state. |
| [AppKit-on-the-Web](https://github.com/andrewmcwattersandco/AppKit-on-the-Web) | `7407236851a2a0a20636c7fbb010e5b5f843f7a1` | GPLv2 | Visual/reference-only unless GPL obligations are explicitly accepted. Useful for AppKit sidebar, sheet, menu, and control measurements. |
| [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui) | `bca6ebe3c5a5d12a1f654cd4b2eeb635c2baec72` | MIT | Reference and possible component donor for Claude-like thread, grouped message parts, composer attachments, action bars, and tool-call states. |
| [olton/ribbon-menu](https://github.com/olton/ribbon-menu) | `2d695939b068e8cc58945e818b4493b69dda8881` | MIT | Reference and possible component donor for PowerPoint-like ribbon tabs, command groups, split/dropdown buttons, dividers, and group labels. |
| [microsoft/fluentui](https://github.com/microsoft/fluentui) | `672afec62c04eada141116387483d47c13c3da68` | MIT | Reference and possible component donor for Office-like toolbar, tab, button, divider, and command-state geometry. Font/icon assets have separate Microsoft terms. |
| [EnhancedJax/react-browser-components](https://github.com/EnhancedJax/react-browser-components) | `9af4765144246ad0f2a68955fa893b4a9f53d747` | Mixed permissive metadata: `LICENSE` is MIT, `package.json` says ISC | Reference-only until license metadata is clarified. Useful for browser-frame structure, tab/search rows, toolbar icon slots, and demo-browser framing. |
| [pansinm/react-chrome-tabs](https://github.com/pansinm/react-chrome-tabs) | `929c02083e14c4769b1193bd52de39f805c1d52b` | MIT | Reference and possible component donor for Chrome-style tab geometry, close buttons, dynamic widths, favicon/title masks, drag/reorder behavior, and plus-tab affordance. |
| [gabrielbull/react-desktop](https://github.com/gabrielbull/react-desktop) | `bba61374849dec896a9eea321cf4e3f02b3fd4c6` | MIT | Reference and possible component donor for React-based macOS High Sierra window chrome, buttons, sidebars, and component boundaries. |
| [gitbrent/PptxGenJS](https://github.com/gitbrent/PptxGenJS) | `3c9ec1b687c174952166f6a34b5e87ebf69fa469` | MIT | Future workflow donor for generating real `.pptx` artifacts from the same structured slide data shown in videos. |
| [dayflow-js/calendar](https://github.com/dayflow-js/calendar) | `a6f59063ac46a766cf386a557d04a6ff44bae0c2` | MIT | Future donor for richer Calendar interactions: day/week/month/year views, event editing, drag/drop, search, sidebar calendars, and resource grids. |
| [Renovamen/playground-macos](https://github.com/Renovamen/playground-macos) | `2c9e82dca487432ad9922ddf9b0a26aadeae81e5` | MIT | Additional React macOS desktop reference for Dock/menu/window state, Launchpad, Spotlight, and app-window decomposition. |
| [esrakllci/macos-portfolio](https://github.com/esrakllci/macos-portfolio) | `23fe176c6e49d27edb06df365e11ba14708ea9a9` | MIT | Additional Svelte macOS shell reference for Dock, menu bar, Finder, Calendar, Notes, action center, traffic lights, and draggable windows. |
| [Cognipeer/chat-ui](https://github.com/Cognipeer/chat-ui) | `8cf89318f63b1099b8f5e6a7000a39b89ee36eea` | MIT in `package.json`; no top-level `LICENSE` file found | Secondary AI chat reference for message lists, inputs, uploads, and tool-call cards. Treat direct copying cautiously until attribution text is confirmed. |
| [xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor) | `4148f4a837dd767ea66807560d05bc7b65c7e578` | MIT | Reference and possible component donor for video-editor style timeline rows, action clips, drag/resize affordances, playhead/cursor, snap guides, and time-to-pixel geometry. |

## Current Extraction Notes

- `macos-web/src/components/Dock/Dock.svelte` and
  `macos-web/src/components/Dock/DockItem.svelte` model Dock glass, dividers,
  open-app indicator dots, app wrappers, and magnification/bounce behavior.
- `macos-web/src/components/TopBar/TopBar.svelte` and
  `macos-web/src/components/TopBar/MenuBar.svelte` are useful references for
  menu bar structure, Apple icon glyph treatment, and menu interaction states.
- `macos-web/src/components/TopBar/ActionCenterToggle.svelte` and
  `macos-web/src/components/TopBar/TopBarTime.svelte` are useful references
  for compact right-side menu-bar status/action-center treatment.
- `compositions/mac-menu-bar.html` now translates the `macos-web` top-bar
  structure into a standalone Backlot component. The implementation uses
  hand-authored HTML/CSS and an inline Apple glyph mask so it does not depend
  on a missing donor icon asset; Claude workflow wrappers that need desktop
  chrome now mount this component instead of carrying local menu-bar copies.
- `macos-web/src/css/theme.css`, `src/css/global.css`, and
  `public/cursors/normal-select.svg` are useful references for replacing
  hand-drawn cursor placeholders with the donor normal-select pointer.
- `macos-web/src/components/Desktop/Window/Window.svelte` and
  `macos-web/src/components/Desktop/Window/TrafficLights.svelte` are useful
  references for active-window shadows and hover-revealed traffic-light glyphs.
- `macos-web/src/components/apps/Calendar/Calendar.svelte`,
  `MonthView.svelte`, `calendar-constants.ts`, and `calendar-utils.ts` are
  useful references for the Calendar titlebar/main-area split, month header,
  compact controls, Monday-first weekday row, fixed 42-cell month layout,
  weekend dimming, and red today marker.
- `AppKit-on-the-Web/stylesheets/Sidebar List.css` is useful as a
  reference-only source for Finder/AppKit sidebar row heights, label sizing,
  section spacing, and selected-row treatment.
- `assistant-ui/examples/with-chain-of-thought/app/MyThread.tsx` models grouped
  reasoning, tool-call, and source message parts inside an assistant thread.
- `assistant-ui/templates/minimal/components/assistant-ui/thread.tsx`,
  `attachment.tsx`, and `tool-fallback.tsx` are useful references for composer
  attachment/dropzone structure, action bars, send/cancel state, tool status
  icons, durations, and collapsible tool details.
- `ribbon-menu/demo/index.jsx`, `demo/index.less`,
  `src/components/RibbonMenu/RibbonMenu.less`, `Button/Button.less`,
  `IconButton/IconButton.less`, `ToolButton/ToolButton.less`,
  `SplitButton/SplitButton.less`, `DropdownMenu/DropdownMenu.less`,
  `ButtonGroup/ButtonGroup.less`, and the `Tabs/*` components are useful
  references for compact Office ribbons made from tab groups, dividers, large
  commands, small command clusters, split buttons, dropdowns, and group titles.
- `fluentui/packages/react-components/react-toolbar/.../useToolbarStyles.styles.ts`,
  `useToolbarGroupStyles.styles.ts`, `useToolbarDividerStyles.styles.ts`,
  `react-button/.../useButtonStyles.styles.ts`, and
  `react-tabs/.../useTabListStyles.styles.ts` / `useTabStyles.styles.ts` are
  useful references for Office-like flex toolbar sizing, grouped controls,
  subtle button states, dividers, selected tabs, and contextual tab treatment.
  These references now inform both the PowerPoint-like editor and
  `compositions/word-editor.html` / `compositions/excel-workbook.html`.
- `react-browser-components/src/components/ChromeBrowser/ChromeBrowser.tsx`,
  `ChromeBrowser/styles.ts`, `ChromeBrowser/containers/Tab/*`, and the
  `ArcBrowser/*` files are useful references for browser-window decomposition,
  tab/search rows, toolbar icon slots, traffic-light sizing, selected-tab
  decoration, and demo-browser/content framing.
- `react-chrome-tabs/css/chrome-tabs.css`, `src/chrome-tabs.ts`,
  `src/component.tsx`, `src/hooks/useChromeTabs.tsx`, and `demo/index.tsx` are
  useful references for overlapping Chrome-like tabs, 46px tab bars, 36px tab
  bodies, 9px content margins, title masking, close controls, add-tab controls,
  and drag/reorder event contracts.
- `macos-web/public/app-icons/*` is useful as a local-only reference asset set
  for Dock fidelity while the donor clone exists locally. UI Backlot should not
  redistribute those icon files unless we deliberately audit and accept their
  asset rights.
- `dayflow-calendar/packages/core/src/views/MonthView.tsx`,
  `WeekView.tsx`, `DayView.tsx`, `YearView.tsx`,
  `packages/core/src/plugins/eventsPlugin.ts`,
  `packages/plugins/sidebar/src/DefaultCalendarSidebar.tsx`, and
  `packages/plugins/drag/src/plugin.ts` are useful references for the next
  Calendar pass once static month geometry needs event editing and interaction
  states.
- `playground-macos/src/components/AppWindow.tsx`,
  `components/dock/Dock.tsx`, `components/dock/DockItem.tsx`,
  `components/menus/TopBar.tsx`, `components/menus/AppleMenu.tsx`,
  `components/menus/ControlCenterMenu.tsx`, `components/Spotlight.tsx`,
  `components/Launchpad.tsx`, `pages/Desktop.tsx`, and
  `stores/slices/dock.ts` are useful React references for macOS shell
  decomposition and app/window state.
- `macos-portfolio/src/components/Desktop/Window/Window.svelte`,
  `TrafficLights.svelte`, `Dock/Dock.svelte`, `Dock/DockItem.svelte`,
  `TopBar/TopBar.svelte`, `TopBar/MenuBar.svelte`,
  `TopBar/ActionCenter.svelte`, `apps/Finder/Finder.svelte`,
  `apps/Calendar/Calendar.svelte`, and `apps/Notes/Notes.svelte` are useful
  Svelte references to compare against `macos-web` before the next macOS shell
  fidelity pass.
- `cognipeer-chat-ui/src/components/chat/Chat.tsx`,
  `ChatMessageList.tsx`, `ChatMessage.tsx`, `ChatInput.tsx`,
  `ToolCall.tsx`, `MessageActions.tsx`, and `providers/ChatProvider.tsx` are
  useful references for richer Claude-like tool cards, file uploads, message
  actions, and chat state wiring.
- `react-timeline-editor/packages/timeline/src/components/edit_area/*`,
  `components/cursor/cursor.less`, `components/time_area/time_area.less`, and
  `utils/deal_data.ts` are useful references for the Premiere-style timeline:
  rows with action blocks, start/end to pixel transforms, action handles,
  dashed snap/drag lines, a draggable cursor/playhead, and subtle track-grid
  treatment.

## Later Extraction Targets

| Repo | First Surface To Improve |
|---|---|
| `gabrielbull/react-desktop` | Compare against `macos-web`, `playground-macos`, and `macos-portfolio` for macOS window chrome, sidebar, buttons, and component boundaries. |
| `dayflow-calendar` | Expand the Calendar surface from static month grid into event editing, sidebar calendars, and day/week/year views. |
| `cognipeer-chat-ui` | Refine Claude-like visible tool cards, upload states, and message action affordances. |
| `gitbrent/PptxGenJS` | Real `.pptx` output from the same data used by the video surface. |
| `react-timeline-editor` | Deepen Premiere and future video-editor timelines with real drag, trim, snap, and row-reorder states. |

## Guardrails

- Do not copy GPLv2 code or assets into UI Backlot without a deliberate license
  decision.
- If MIT code from `macos-web` is copied rather than only referenced, preserve
  attribution in the relevant prototype note.
- Keep donor icon and wallpaper assets local unless their redistribution rights
  are explicitly reviewed.
- Prefer translating observed patterns into our existing HTML/CSS primitives so
  the rendered scenes remain small, editable, and HyperFrames-friendly.
