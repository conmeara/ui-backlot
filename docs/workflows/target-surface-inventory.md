# Target Surface Inventory

Last checked: 2026-06-17.

## Current Focus

Build editable HTML surfaces for demo videos centered on:

1. Claude on macOS.
2. macOS desktop and Finder.
3. PowerPoint editing workflows.

Reference videos guide pacing and taste only. They should not decide which apps
we rebuild unless the app is part of our real workflow.

Open-source donor repos are tracked in
`docs/research/open-source-ui-donor-repos.md` and should be consulted as
structure/reference material after live capture and before hand-tuning.

## Local Availability

### Claude

- App found: `/Applications/Claude.app`
- Bundle id: `com.anthropic.claudefordesktop`
- Status from app inventory: running/recently used
- Capture lane: Computer Use screenshot/accessibility tree, plus manual
  sanitized state setup if current chat content is private.
- Rebuild target: Claude shell, chat messages, composer, attachment/file chips,
  progress/tool-use rows, project/file context.
- Donor repo lane: `assistant-ui` for thread/composer/attachment/tool-call
  structure, restyled into a Claude-like surface.

### Finder

- App found: `/System/Library/CoreServices/Finder.app`
- Bundle id: `com.apple.finder`
- Status from app inventory: running
- Capture lane: Computer Use screenshot/accessibility tree.
- First clean capture:
  `docs/workflows/finder-launch-deck-capture.md`
- Rebuild target: menu bar, window chrome, sidebar, toolbar, file list/grid,
  selected items, drag/drop states, folder path.
- Donor repo lane: `macos-web`, `react-desktop`, and `AppKit-on-the-Web` for
  macOS chrome, Dock/menu/sidebar/window details.

### PowerPoint

- App not found in `/Applications`, recent app inventory, or Spotlight app
  search.
- Related files exist, but not the application bundle.
- Capture lane once available: Computer Use screenshot/accessibility tree.
- Interim option: use Keynote only as a Mac presentation-editor stand-in, or
  rebuild PowerPoint from supplied screenshots/reference if the real app is not
  installed.
- Donor repo lane: Fluent UI and `ribbon-menu` for command bars, ribbon density,
  tabs, panes, and Office-like controls. Use `PptxGenJS` later for real deck
  generation, not UI chrome.

### Keynote

- App found: `/Applications/Keynote.app`
- Use only as a temporary presentation-editor capture source if PowerPoint is
  unavailable.

## Capture Priority

1. Set up sanitized Claude new-chat state.
2. Rebuild Finder from the purpose-made `Launch Deck` demo folder capture.
3. Capture PowerPoint once installed/opened, or decide whether Keynote is an
   acceptable temporary stand-in.
4. Build standalone surfaces before reinserting them into any HyperFrames
   timeline.
