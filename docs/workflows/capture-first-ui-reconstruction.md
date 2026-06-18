# Capture-First UI Reconstruction

Last updated: 2026-06-17.

## Principle

Reference videos are quality targets, not source material.

The source of truth for UI Backlot should be the actual app surface whenever we
can reach it:

1. Live web DOM and computed CSS for browser apps.
2. Screenshots, accessibility trees, and visible geometry for desktop apps.
3. Open-source UI projects for component structure, interaction states, and
   styling references when they map to the target app surface.
4. Video frames only when the real app is unavailable.
5. Hand-built HTML/CSS components as the final editable production surface.

The goal is not to make a pretty approximation first. The goal is to build an
editable UI twin that can be animated later.

## Capture Lanes

### Web Apps And Websites

Use HyperFrames capture first when the target is a website or web app that can
be captured without special logged-in state:

```bash
npx hyperframes capture https://example.com --output captures/example-hf
```

That captures screenshots and assets in the shape HyperFrames already expects
for video work.

Use Playwright when we need deeper rebuild data:

- Visible DOM text and bounding boxes.
- Computed typography, colors, shadows, radii, and layout.
- Semantic hints: role, aria label, ids, classes, and test ids.

Command:

```bash
npm run capture:web -- https://example.com --slug example --selector "main"
```

Outputs:

- `captures/<slug>/viewport.png`
- `captures/<slug>/target.png`
- `captures/<slug>/capture.json`
- `captures/<slug>/visible-text.md`

For logged-in apps such as Claude, Airtable, or Figma, prefer a persistent
browser profile or the local Chrome/Computer Use route so we can capture the
real UI state without storing secrets in the repo.

### Desktop Apps

Use Computer Use for local apps such as Finder, PowerPoint, Keynote, Preview,
Figma desktop, or Premiere Pro:

- Capture window screenshots at target states.
- Read the accessibility tree when available.
- Record window bounds, toolbar labels, visible menu/button text, and control
  positions.
- Avoid destructive clicks or any action that sends data without user approval.

The output should become a reconstruction brief before coding:

```text
surface-name/
  screenshot.png
  accessibility.md
  geometry.json
  tokens.md
  reconstruction-notes.md
```

### Open-Source Donor Repos

Use donor repos when the live app capture gives us pixels but not enough
component structure, or when a surface is unavailable locally.

Current candidate list:

`docs/research/open-source-ui-donor-repos.md`

Recommended use:

- `macos-web` and `AppKit-on-the-Web` for macOS desktop, Finder, Dock, menus,
  window chrome, and AppKit-like control details.
- `assistant-ui` for Claude-like chat architecture: message thread, composer,
  attachments, streaming states, and tool-call rows.
- Fluent UI and `ribbon-menu` for Office-like ribbons, panes, command bars, and
  control density.
- Browser-tab libraries for future browser/app surfaces.
- `PptxGenJS` later when the demo should generate a real `.pptx` from the same
  data shown in the video.

Before copying code or assets, verify license compatibility and attribution.
When possible, extract measurements, state models, and component boundaries
rather than vendoring an entire UI kit.

### HyperFrames Compositions

Use HyperFrames snapshots, not generic browser screenshots, when reviewing an
animated composition:

```bash
npx hyperframes snapshot . --at=1,4.5,7,9.8,12.6,15 --describe=false
```

HyperFrames seeks the timeline correctly. A raw browser or Playwright screenshot
of `index.html` captures only whatever the page does at normal load/play time.

### Video-Only References

Use video frames when the real UI is not available:

- Extract frames around unique UI states.
- Crop the app plate being rebuilt.
- Build a crop comparison sheet.
- Treat motion blur and video compression as non-authoritative.

Do not overfit the surrounding video composition if the current task is app UI
reconstruction.

## Reconstruction Workflow

1. Pick one surface, not one whole video.
2. Capture the source UI through the best lane.
3. Inspect any relevant donor repo for structure, controls, and interaction
   states.
4. Extract tokens: fonts, colors, radii, shadows, spacing, and icons.
5. Build the surface as standalone HTML/CSS.
6. Compare screenshot/crop to source.
7. Only then add timeline states and video choreography.

## Fidelity Gates

Each app surface should pass these checks before being used in a demo video:

- Visual: labeled source/rebuild comparison sheet exists.
- Editability: text, colors, and layout are HTML/CSS, not flattened screenshot
  pixels, unless explicitly marked as a temporary plate.
- Geometry: important controls match source position and scale within the target
  crop.
- Runtime: HyperFrames/Playwright can screenshot the surface without console
  errors.
- Reuse: the surface has a named primitive or component boundary.
- Provenance: copied code/assets from donor repos have license notes, or the
  repo is documented as reference-only.

## Current Pivot

The first `sonnet-scene-lab` composition is useful as a motion sandbox, but it
is too stylized to be the main quality benchmark. The focused target is now:

1. Claude chat/composer shell.
2. macOS desktop/menu/window background.
3. Finder window and file/folder interactions.
4. PowerPoint editing window and slide manipulation.

Once those are convincing on their own, the video timeline can reuse them.
