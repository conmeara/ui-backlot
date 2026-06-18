# Figma Editor Surface Pass 024

Date: 2026-06-18

## Purpose

Add the first reusable Figma-style design editor surface so UI Backlot can make
Claude-plus-design-workflow demos without importing the full Claude/Finder/
PowerPoint scene. This is a code-native editable surface, not a private Figma
capture.

## Evidence Used

- Figma Help Center: [View layers and pages in the left sidebar](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-pages-in-the-left-sidebar)
  - Used for the current Navigation panel, File/Assets tabs, layers/pages
    structure, resizable/collapsible panel behavior, and four-area editor model.
- Figma Help Center: [Access design tools from the toolbar](https://help.figma.com/hc/en-us/articles/360041064174-Access-design-tools-from-the-toolbar)
  - Used for the editor toolbar's Move, Frame, Shape, Pen, Text, Comments,
    Actions, Dev Mode, and Draw tool coverage.
- Figma Help Center: [Design, prototype, and explore layer properties in the right sidebar](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar)
  - Used for the right properties panel, Design/Prototype tabs, selected-layer
    controls, layout, position, fill, effects, and export sections.
- Figma Help Center: [Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)
  - Used for UI3-specific current structure: bottom toolbar, resizable panels,
    grouped modern properties, selection action row, and Actions emphasis.
- Figma Help Center: [Use the actions menu in Figma Design](https://help.figma.com/hc/en-us/articles/23570416033943-Use-the-actions-menu-in-Figma-Design)
  - Used for the Actions button's AI/productivity/plugin/search role.
- `/Applications/Figma.app/Contents/Info.plist`
  - Confirms local installed Figma desktop version `126.2.10`.

## Changes

- Added `compositions/figma-editor.html`.
  - Defines `data-composition-id="figma-editor-surface"`.
  - Provides a direct-preview fallback for standalone captures.
  - Adds `data-primitive="figma-design-editor-window"`.
  - Recreates a Figma-style titlebar, navigation rail, left File/Assets panel,
    layer tree, design canvas, selected desktop frame, selected card handles,
    right Design/Prototype properties panel, bottom toolbar, collaborator
    avatars, share/present controls, comment pin, and cursor.
  - Registers `window.__timelines["figma-editor-surface"]` for panel/frame
    entrances, selected-object handle reveal, progress-bar edit, comment pulse,
    cursor movement, and Actions highlight.
- Added `npm run capture:figma-editor`.
- Updated `PRIMITIVES.md`, `SURFACES.md`, `surfaces/README.md`, and
  `docs/research/open-source-ui-donor-repos.md`.

## Asset Decision

No Figma code, fonts, icons, app assets, or private file contents were copied.
The surface is hand-authored HTML/CSS from public Figma documentation and safe
local app metadata only.

## Verification

- `npm run capture:figma-editor` refreshed
  `captures/surface-figma-editor/target.png`.
- `npm run hf:lint` passed with `0 error(s), 8 warning(s), 6 info(s)`.
  The new Figma warning is the expected Studio editability warning for GSAP-
  animated elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,680,261 bytes.
- `git diff --check` passed.

## Remaining Gaps

- This is not yet compared against a sanitized live Figma file capture.
- Figma iconography is approximated in CSS; a later pass should improve icon
  geometry once we have a safe reference frame.
- The surface currently models a design-edit state. We still need separate
  Dev Mode, comment-review, prototype-linking, and Claude Design handoff states.
