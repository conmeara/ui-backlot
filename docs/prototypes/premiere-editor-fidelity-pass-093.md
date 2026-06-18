# Premiere Editor Fidelity Pass 093

Date: 2026-06-18

## Purpose

Improve the reusable editable Premiere-style editor so Claude/Codex-to-video
workflow demos read more like a real Adobe Premiere Pro edit workspace while
remaining hand-authored HTML/CSS. This pass refines the existing surface rather
than importing screenshots, Adobe assets, proprietary code, or private project
content.

## References And License Notes

- Adobe Help Center: [Premiere workspaces and home screen overview](https://helpx.adobe.com/premiere/desktop/get-started/tour-the-workspace/what-are-workspaces.html)
  - Used for the application-window, workspace, panel-group, and task-tab
    model. Reference only; no Adobe visual assets or text blocks copied.
- Adobe Help Center: [Overview of Source Monitor and Program Monitor](https://helpx.adobe.com/premiere/desktop/get-started/source-and-program-monitor-adjustments/about-source-monitor-and-program-monitor.html)
  - Used for monitor roles, timecode, playhead, scaling, resolution, In/Out,
    Insert/Overwrite, Lift/Extract, settings, and export-frame control cues.
    Reference only.
- Adobe Help Center: [Add media to the timeline using Source Patching](https://helpx.adobe.com/premiere/desktop/edit-projects/intro-to-editing/add-media-to-the-timeline-using-source-patching.html)
  - Used for source patch indicators, track targeting, Project-panel-to-Source
    Monitor flow, and multi-track edit placement behavior. Reference only.
- Adobe Help Center: [Customize List View in Project panel](https://helpx.adobe.com/premiere/desktop/get-started/customize-the-project-panel/customize-list-view-in-project-panel.html)
  - Used for Project panel list columns, preview area, metadata columns, and
    sortable media rows. Reference only.
- Adobe Help Center: [Use Properties panel in Premiere](https://helpx.adobe.com/premiere/desktop/add-text-images/stylize-text/about-properties-panel.html)
  - Used for unified selected-clip controls across video, audio, text,
    graphics, captions, transform, opacity, and quick access to related panels.
    Reference only.
- Adobe Help Center: [Navigate timelines with Sequence Index](https://helpx.adobe.com/premiere/desktop/organize-media/file-organization/navigate-timelines-with-sequence-index.html)
  - Used for the Sequence Index and searchable spreadsheet-style sequence
    troubleshooting affordance. Reference only.
- `xzdarcy/react-timeline-editor` at
  `4148f4a837dd767ea66807560d05bc7b65c7e578`
  - MIT donor reference already tracked in `reference/open-source/README.md`.
    Used only for editable timeline row/action geometry, handles, cursor,
    snap-line, and time-grid behavior. No donor runtime code copied.
- Local app availability check:
  - `mdfind "kMDItemCFBundleIdentifier == 'com.adobe.PremierePro'"` returned no
    bundle path.
  - `/Applications` search for `*Premiere*` returned no app bundle.
  - Result: no sanitized local Premiere capture was available for this pass.

## Current Baseline Deltas

Compared with the reference set, the pre-pass surface still had these concrete
gaps:

1. Top chrome lacked the dense Premiere-style application menu command row.
2. Panel tabs had no visible panel menus or grouped-header affordance.
3. Source and Program monitors had simplified control rows with too few
   scaling, safe-guide, insert/overwrite, and export-frame controls.
4. Monitor frames lacked metadata overlays that communicate clip/sequence
   context.
5. Project panel read as a simple asset list instead of List View plus preview
   metadata.
6. Project rows lacked metadata columns such as media start and duration.
7. Timeline source patching and track targeting were too compressed to read as
   separate source/target states.
8. Track headers lacked eye, mute/solo, lock, and targeted-track states.
9. Timeline had no captions lane, marker diamonds, transition wedges, or clip
   effect badges.
10. Selected graphics showed basic properties only; the right rail needed more
    Properties, Graphics, Lumetri, Captions, and Effects density.
11. Clip labels did not expose effect/color/graphics state such as Lumetri,
    Warp Stabilizer, motion keyframes, or title layers.
12. The dark editor chrome used rounded, polished dashboard cards more than the
    flatter rectangular language of production editor panels.

## Changes

- Refined `compositions/premiere-editor.html`.
  - Added a Premiere-like top command menu next to the project title.
  - Added panel menu glyphs across monitor, project, timeline, and properties
    panels.
  - Expanded Source and Program monitor controls with Fit/resolution controls,
    safe margin, export-frame, insert, overwrite, and mark-in affordances.
  - Added monitor metadata overlays for source clip and program workspace state.
  - Reworked Project panel into preview metadata, List View columns, and denser
    asset rows with media-start and duration cells.
  - Expanded timeline toolbar into Source and Target patch groups plus
    Insert/Overwrite, Snap, Linked, Markers, and Keyframes states.
  - Added a captions track lane, timeline markers, track targeting, track eye,
    mute/solo, and lock controls.
  - Added clip badges for effects/text, transition wedges, selected-clip trim
    handles, and richer clip subtitles.
  - Expanded the right rail with selected-graphic transform/keyframe rows,
    text/graphic controls, compact Lumetri wheels, captions controls, and
    applied-effect rows.
  - Tightened panel radii, row heights, and micro-control styling so the surface
    reads as dense editor chrome instead of a broad dashboard.

## Before And After Notes

- Before: the surface already communicated "video editor" through two monitors,
  a project bin, vertical tools, audio meters, and a timeline, but the panels
  felt sparse and generic.
- After: the same editable DOM now carries more Premiere-specific cues:
  workspace command chrome, panel menus, monitor controls, source/target
  patching, track controls, captions/markers/transitions, metadata-rich bins,
  and selected graphic/effects controls.
- `npm run capture:premiere-editor` now shows a denser standalone editor frame
  with the refined project/media bin, V4 captions lane, targeted tracks,
  markers, effect badges, and right-side Properties/Effects density.
- `npm run capture:claude-premiere-workflow` confirms the mounted editor still
  frames well behind Claude in the workflow wrapper without changing the parent
  composition.

## Remaining Deltas

- Still pending: a sanitized live Premiere capture or approved public frame for
  side-by-side pixel geometry comparison.
- The tool glyphs are CSS approximations; they should be compared against a
  safe reference frame before claiming high icon fidelity.
- The timeline is still static DOM geometry; a future data-driven primitive
  should generate tracks, clips, patching, markers, captions, and transitions
  from structured edit data.
- The surface represents a dense Edit workspace state only. Separate Import,
  Export, Color, Audio Mix, Graphics Templates, Text-Based Editing, and Effects
  Browser states would improve scene coverage.
- Audio meters are visually representative but not calibrated to a real dB
  meter scale.

## Verification

- `npm run capture:premiere-editor`
- `npm run capture:claude-premiere-workflow`
- `npm run registry:check`

