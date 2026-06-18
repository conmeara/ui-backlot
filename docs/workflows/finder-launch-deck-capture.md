# Finder Launch Deck Capture

Last captured: 2026-06-17.

## Source State

Synthetic local folder:

`/Users/conmeara/Projects/ui-backlot/demo-workspace/Launch Deck`

Files:

- `design-feedback.txt`
- `Q2 revenue.csv`
- `README.md`
- `slide-notes.md`

The folder is intentionally synthetic so Finder screenshots can be used as UI
reference without exposing private data.

## Capture

- Window screenshot: `captures/finder-launch-deck/window.png`
- App: Finder
- Bundle id: `com.apple.finder`
- Window title: `Launch Deck`
- View mode: column view

## Visible Structure

- macOS traffic-light window controls.
- Finder sidebar with Recents, Shared, Favorites, Locations, Tags.
- Toolbar with back/forward, icon/list/column/gallery view controls, group,
  share, tags, action, and search.
- Column browser:
  - Projects column.
  - `ui-backlot` column.
  - `demo-workspace` column.
  - `Launch Deck` file column.
- Status bar: `4 items`.

## Reconstruction Notes

Build this as a standalone editable HTML surface before using it in a timeline.
The important reusable states are:

1. Folder open in column view.
2. File selected.
3. File dragged toward Claude composer.
4. Folder/file chip attached in Claude.

## Editable Surface

- Source: `surfaces/claude-mac-finder.html`
- Full-scene capture: `npm run capture:surface`
- Finder-only Retina capture: `npm run capture:finder`
- Finder comparison sheet: `npm run compare:finder`

`claude-mac-finder.html?mode=finder` hides the desktop/Claude layers and renders
only the Finder window for source-to-rebuild comparison.
