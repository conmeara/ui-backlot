# Focused Surface Pass 001

Date: 2026-06-17

## Scope

The active target has been narrowed to:

1. Claude on a macOS desktop.
2. Finder with a clean local project folder.
3. PowerPoint next, once the app is available for capture.

StoreDesk and other fictional reference-video apps are out of scope.

## Built

- Added `surfaces/claude-mac-finder.html`.
- Added a full 1920x1080 desktop composition with:
  - macOS menu bar and Dock.
  - editable Finder `Launch Deck` window.
  - editable Claude chat/composer shell.
  - drag chip and cursor state for moving a folder toward Claude.
  - presentation-editor placeholder named `Launch Deck.pptx`.
- Added `?mode=finder` to isolate the Finder primitive for comparison.
- Added `--scale` to `tools/capture-web-ui.mjs` so Retina captures can be
  matched.

## Evidence

- Real Finder source capture:
  `captures/finder-launch-deck/window.png`
- Full surface capture:
  `captures/surface-claude-mac-finder/viewport.png`
- Finder primitive capture:
  `captures/surface-finder-window/target.png`
- Finder comparison sheet:
  `snapshots/finder-source-vs-surface.jpg`

## Fidelity Notes

Finder is now structurally close enough to use as an editable primitive:
sidebar, toolbar, column view, selections, file order, and status text are all
code-native. Remaining gaps are icon fidelity, native vibrancy, exact toolbar
glyphs, and font rendering weight.

Claude is intentionally not source-captured yet because the live app may expose
private chat history. The next Claude pass should start from a sanitized new
chat or throwaway account state.

PowerPoint was not available locally during inventory. The current presentation
window is only a depth/composition placeholder and should not be treated as a
PowerPoint reconstruction.
