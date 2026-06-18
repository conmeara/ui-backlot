# Surfaces

Editable app surfaces for UI Backlot demos live here.

## Current Surface

- `claude-mac-finder.html`: a 1920x1080 macOS desktop scene with editable Finder,
  Claude, cursor/drag, Dock, and a presentation-editor placeholder.
- `browser-app-surface.html`: a 1920x1080 macOS browser scene with editable
  donor-informed browser chrome, overlapping tabs, tab/address bar, toolbar
  actions, web app sidebar, metrics, table, right inspector, cursor, and edit
  badge. The mounted HyperFrames version is generated into
  `../compositions/browser-app.html`.

Useful captures:

```bash
npm run capture:surface
npm run capture:finder
npm run capture:browser-app
npm run compare:finder
```

`claude-mac-finder.html?mode=finder` renders only the Finder window at its
captured CSS size. The capture script uses `--scale 2` for that mode so the
output matches the Retina source screenshot resolution.

## Source Status

- Finder: rebuilt from the synthetic `Launch Deck` Finder window capture and
  Computer Use accessibility tree.
- Claude: hand-built safe shell for now. A sanitized new-chat capture should
  replace/confirm its geometry before it becomes the final Claude primitive.
- Presentation editor: placeholder only. Replace with PowerPoint once available,
  or Keynote if we choose that as the interim Mac presentation workflow.
- Browser/app: code-native lab surface for future web-workflow demos. It is not
  a clone of StoreDesk or any real product. Its browser chrome now borrows
  geometry and behavior ideas from `react-chrome-tabs` and
  `react-browser-components` without vendoring those components. The lab
  remains full-frame for capture; the composition version crops to the browser
  window and mounts into the main render as a background app plate.

## Rule

Use screenshots as reference plates, not as final UI. Text, layout, colors, and
states should remain editable HTML/CSS unless a temporary plate is explicitly
called out.
