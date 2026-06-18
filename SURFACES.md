# UI Surface Spec

## Current Target Surface Kit

1. `mac-desktop`: Sonoma/Tahoe-style wallpaper, menu bar, desktop space, and
   app-window shadows.
2. `finder-window`: real Finder sidebar, toolbar, path/search controls, file
   list/grid states, and selection/drag states.
3. `claude-window`: Claude desktop or web app shell, conversation column,
   message stack, composer, attachments/tool-use affordances, and project/file
   context.
4. `powerpoint-window`: PowerPoint editing chrome, ribbon/toolbar, slide
   thumbnail rail, slide canvas, comments/inspector areas, and selected object
   affordances.
5. `cursor`: black macOS pointer with hover, click, select, drag, and drop
   states.
6. `agent-status`: Claude/Codex progress rows, tool call chips, and file/action
   status.
7. `window-choreography`: app switching, window focus, sheet/modal entrances,
   and depth/focus states.
8. `browser-app-window`: editable browser chrome and web app surface for future
   website/SaaS demos.

## Current Prototype

`index.html` is the current renderable HyperFrames composition.
`compositions/presentation-editor.html` is the mounted PowerPoint-like editor
sub-composition used by the main workflow.
`compositions/browser-app.html` is the mounted browser/app sub-composition used
as an intro/background plate in the main workflow.
`surfaces/claude-mac-finder.html` remains the active standalone surface lab.
`surfaces/browser-app-surface.html` is the standalone browser/app surface lab.

- Finder is source-derived from the synthetic `Launch Deck` capture.
- Claude is an editable safe shell pending a sanitized live Claude capture.
- The presentation editor is now PowerPoint-like in structure and has a denser
  ribbon/thumbnail/slide/notes/formatting-pane treatment. It is now a
  sub-composition with its own internal title/chart/selection animation
  timeline, with source capture still pending for exact PowerPoint geometry.
- `?mode=finder` renders the Finder primitive alone for pixel comparison.
- Browser/app surface is code-native and intentionally generic, so it can be
  adapted later to Airtable, Figma web, or internal dashboards without copying a
  fictional reference-video product. Its current browser chrome is informed by
  `react-chrome-tabs` and `react-browser-components`, but remains editable
  hand-authored HTML/CSS. It now exists both as a standalone capture surface and
  as a mounted HyperFrames sub-composition.
- Reusable primitives are listed in `PRIMITIVES.md`.

## First Real Workflow

The first production-quality demo should show Claude on a Mac helping with a
PowerPoint workflow:

1. Start on a Mac desktop with Finder and a presentation/project folder.
2. Open or foreground Claude.
3. Attach or reference a local folder/file from Finder.
4. Claude reasons through the requested presentation update.
5. PowerPoint opens with a real-looking deck and selected slide.
6. The cursor edits text, chart values, or slide structure.
7. Claude reports the completed update.

## Fidelity Levels

- Source-captured: Claude, Finder, and PowerPoint should be captured from real
  local app/browser states whenever possible.
- Code-native: final demo surfaces should be editable HTML/CSS components, not
  flattened screenshots, except for temporary reference plates.
- Reference-only: downloaded Claude videos and extracted frames guide taste,
  pacing, and composition, not app UI structure.

## Current Focus

The active prototype should stay centered on Claude, the Mac desktop/Finder, and
PowerPoint, with the generic browser/app surface used only as a reusable
background/demo-shell proof. Airtable, Figma, Premiere, and other app-specific
surfaces are future branches after this core lane is convincing.
