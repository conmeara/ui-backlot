# UI Backlot Primitives

The main HyperFrames composition marks reusable pieces with `data-primitive`.
Heavy surfaces should move into composition files once their primitive boundary
is stable.

Current sources: `index.html`, `compositions/presentation-editor.html`,
`compositions/browser-app.html`

## Rendered Workflow Primitives

1. `mac-menu-bar`: menu bar with app menus, date, time, and status icons.
2. `mac-dock`: glassy Dock with Finder, Claude, and presentation app icons,
   app wrappers, open-app dots, and a separator inspired by the local
   `macos-web` donor reference.
3. `finder-window`: editable Finder column-view window sourced from the clean
   `Launch Deck` capture.
4. `claude-controller-chat`: Claude-style controller shell using local
   Anthropic fonts, sidebar, model pill, user prompt, assistant response,
   grouped reasoning/action/source parts, and `assistant-ui`-informed composer
   controls.
5. `progress-rows`: Claude tool/progress card with grouped action header,
   done/ready/active states, duration, and status dots.
6. `composer`: attachment chips, attachment count, placeholder text, action
   chips, voice affordance, dropzone outline, and red running-state control.
7. `drag-chip`: draggable folder chip used between Finder and Claude.
8. `cursor`: macOS pointer with timeline movement.
9. `click-ring`: click feedback primitive.
10. `todo-panel`: task checklist with checked and pending states.
11. `presentation-editor`: PowerPoint-like editor with macOS title chrome,
    AutoSave/search/share controls, saved/sync indicator, ribbon tabs, Home
    command groups, `ribbon-menu`/Fluent-informed large commands, split
    controls, toggle clusters, contextual Shape Format tab, slide thumbnail
    rail, selected slide canvas, comment pin, speaker notes/status bar,
    formatting pane, quick inspector actions, comment card, and selected-object
    handles. Source:
    `compositions/presentation-editor.html`, mounted from the host wrapper in
    `index.html`.
12. `browser-app-window`: editable browser/app review-board surface mounted as
    an intro/background plate. Its chrome is informed by `react-chrome-tabs`
    and `react-browser-components`, and the same primitive remains available as
    a standalone capture surface. Source: `compositions/browser-app.html`.
13. `intro-claude-copy`: editorial Claude launch-style opener.
14. `completion-card`: final summary card for video wrap states.

## Standalone Surface Primitives

1. `browser-app-window-lab`: standalone 1920x1080 browser/app lab with
   `react-chrome-tabs`/`react-browser-components`-informed overlapping tabs,
   favicons, close buttons, add-tab affordance, reload/star/profile/more
   toolbar controls, URL bar, sidebar navigation, header actions, metric cards,
   data table, right inspector, cursor, and live edit badge. Source:
   `surfaces/browser-app-surface.html`.

## Current Motion States

- Intro text and Claude mark entrance.
- Finder and Claude window entrance.
- Folder drag from Finder toward Claude.
- Assistant typing reveal.
- Progress row and todo state changes.
- PowerPoint title, chart, selection, inspector, and speaker-note state changes.
- Browser/app surface entrance and selected-row/sync pulse inside its
  subcomposition.
- Final focus pull to completion card.

## Known Gaps

- Finder icons are simplified CSS shapes, not yet pixel-matched to macOS.
- Claude shell is a safe hand-built approximation pending sanitized live
  Claude capture. Its current thread/composer structure is informed by
  `assistant-ui`, not copied from a donor component.
- Presentation editor is now donor-informed but still hand-built. Replace
  geometry with source-captured PowerPoint once the app or screenshots are
  available.
- Browser app is now in the render path, but the web app content remains
  generic until a real Airtable/Figma/dashboard target is selected and captured.
- Claude, Finder, and shared motion primitives are still in the host
  composition; split them next if file size or reuse pressure increases.
