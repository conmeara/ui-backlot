# Premiere Editor Surface Pass 025

Date: 2026-06-18

## Purpose

Add the first reusable Premiere-style video editor surface so UI Backlot can
make Claude-plus-video-editing demos without importing the full Claude/Finder/
PowerPoint scene. This is a code-native editable surface, not a private
Premiere capture.

## Evidence Used

- Adobe Help Center: [Premiere workspaces and home screen overview](https://helpx.adobe.com/premiere/desktop/get-started/tour-the-workspace/what-are-workspaces.html)
  - Used for the panel-based workspace model, task-oriented workspace tabs, and
    the Edit/Assembly/Color/Effects/Audio/Graphics workspace framing.
- Adobe Help Center: [Overview of Source Monitor and Program Monitor](https://helpx.adobe.com/premiere/desktop/get-started/source-and-program-monitor-adjustments/about-source-monitor-and-program-monitor.html)
  - Used for the Source Monitor role, Program Monitor role, timecode controls,
    playhead, scaling/resolution controls, source In/Out concepts, and Program
    sequence preview.
- Adobe Help Center: [Tools panel in Premiere](https://helpx.adobe.com/premiere/desktop/get-started/tour-the-workspace/tools-panel-and-options-panel.html)
  - Used for the vertical tools strip: Selection, Track Select, Ripple Edit,
    Razor, Pen, Hand, Text, and Generative Extend.
- Adobe Help Center: [Add media to the timeline using Source Patching](https://helpx.adobe.com/premiere/desktop/edit-projects/intro-to-editing/add-media-to-the-timeline-using-source-patching.html)
  - Used for source patch indicators, Project-panel-to-Source-Monitor flow,
    Mark In/Out, Insert/Overwrite concepts, and timeline track targeting.
- Adobe Help Center: [Adobe Premiere desktop release notes](https://helpx.adobe.com/premiere/desktop/whats-new/release-notes.html)
  - Used for current 2026-era references to Source Monitor audio waveforms,
    Sequence Index, marker search, Global Mute, and export settings.
- `xzdarcy/react-timeline-editor` at
  `4148f4a837dd767ea66807560d05bc7b65c7e578`
  - Used as MIT donor reference for timeline rows, action start/end geometry,
    time-to-pixel transforms, clip handles, dashed snap/drag lines, and cursor
    treatment. Relevant files inspected:
    `packages/timeline/src/components/edit_area/edit_row.less`,
    `edit_action.less`, `drag_lines.less`, `components/cursor/cursor.less`,
    `components/time_area/time_area.less`, and `utils/deal_data.ts`.
- Local app check:
  - `mdfind "kMDItemCFBundleIdentifier == 'com.adobe.PremierePro'"` returned no
    bundle path.
  - `/Applications` glob checks found no Adobe Premiere Pro app bundle during
    this pass.

## Changes

- Added `compositions/premiere-editor.html`.
  - Defines `data-composition-id="premiere-editor-surface"`.
  - Provides a direct-preview fallback for standalone captures.
  - Adds `data-primitive="premiere-video-editor-window"`.
  - Recreates a Premiere-style macOS titlebar, workspace tabs, Source Monitor,
    Program Monitor, Project panel, freeform media cards, vertical Tools panel,
    audio meters, Properties/Effects panel, source patch buttons, timeline
    ruler, track headers, video/audio tracks, editable clips, waveform rows,
    selected clip trim handles, snap guides, playhead, program safe guides,
    lower-third, and cursor.
  - Registers `window.__timelines["premiere-editor-surface"]` for panel
    entrances, clip reveals, selected-clip emphasis, snap-line reveal,
    playhead scrub, program graphic update, audio-meter pulse, and cursor move.
- Added `npm run capture:premiere-editor`.
- Added `react-timeline-editor` to the ignored reference clone script and
  reference documentation.
- Updated `PRIMITIVES.md`, `SURFACES.md`,
  `surfaces/README.md`, and
  `docs/research/open-source-ui-donor-repos.md`.

## Asset Decision

No Adobe code, fonts, icons, app assets, private project contents, or donor
runtime code were copied. The `Pr` square is hand-authored CSS/text for UI
recognition only. The timeline geometry translates MIT donor patterns into our
own editable HTML/CSS.

## Verification

- `npm run capture:premiere-editor` refreshed
  `captures/surface-premiere-editor/target.png`.
- `npm run hf:lint` passed with `0 error(s), 9 warning(s), 7 info(s)`.
  The new Premiere warnings are expected Studio editability warnings for
  GSAP-animated elements plus an intentional pointer-events note for non-editable
  snap/playhead guide overlays.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,678,127 bytes.

## Remaining Gaps

- This is not yet compared against a sanitized live Premiere project capture.
- Premiere iconography is approximated in CSS; the next pass should improve
  tool glyph geometry against a safe reference frame.
- The surface models one Edit workspace state. We still need separate Import,
  Export, Color/Lumetri, Captions/Graphics, audio mix, and deeper trimming
  states.
- Timeline clips are static DOM blocks today. A future React component could
  make start/end/track data drive the same visual timeline and a real render
  script.
