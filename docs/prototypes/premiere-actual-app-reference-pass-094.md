# Premiere Actual App Reference Pass 094

Date: 2026-06-18

## Purpose

Reset the Premiere surface work around actual Adobe Premiere Pro screenshots
instead of broad documentation alone. The current editable surface is still far
from the real application in font, icon language, layout density, panel chrome,
and overall feel.

## Actual App Visual Sources

- Adobe Community: [Now in Beta: Properties panel for Premiere Pro](https://community.adobe.com/announcements-732/now-in-beta-properties-panel-for-premiere-pro-313857)
  - Direct image inspected in `/tmp/premiere-actual-app-refs/adobe-community-properties-panel.jpg`.
  - Direct source: `https://uploads-us-west-2.insided.com/adobedme-en/attachment/705368i8C6118EAE92376DB.jpg`.
  - Official Adobe-owned community post. Used for full Edit workspace: Project panel thumbnails, Program/Source monitor area, Properties/Effect Controls/Lumetri tabs, timeline tracks, tool strip, audio meter, and top app toolbar.
- Adobe Community: [Properties panel menu screenshot](https://community.adobe.com/announcements-732/now-in-beta-properties-panel-for-premiere-pro-313857)
  - Direct image inspected in `/tmp/premiere-actual-app-refs/adobe-community-properties-menu.png`.
  - Direct source: `https://uploads-us-west-2.insided.com/adobedme-en/attachment/705362i72553D0BCB1BB83C.png`.
  - Official Adobe-owned community image. Used for native macOS menu typography and the real Window menu list of Premiere panels.
- Adobe Blog: [Enhance your video editing workflows with the Adobe video ecosystem](https://blog.adobe.com/en/publish/2024/02/22/enhance-your-video-editing-workflows-power-adobe-video-ecosystem)
  - Direct image inspected in `/tmp/premiere-actual-app-refs/adobe-blog-video-ecosystem.jpg`.
  - Direct source: `https://blog.adobe.com/en/publish/2024/02/22/media_1c9dd624b5750eab160fc880d382bb64a9c1f24ec.jpg`.
  - Official Adobe blog image. Used for Essential Sound dark panel typography, spacing, toggles, sliders, and large-panel density.
- Adobe Help Center: [Set appearance preferences in Premiere](https://helpx.adobe.com/nz/premiere/desktop/get-started/preferences-and-settings/appearance-preferences.html)
  - Official Adobe Help page with Premiere UI screenshot in search result.
  - Used for Spectrum-era dark UI frame, project thumbnails, timeline color density, and general panel contrast.
- Adobe Help Center: [Navigation controls in the timeline](https://helpx.adobe.com/premiere/desktop/edit-projects/change-clip-sequence/navigation-controls-in-the-timeline.html)
  - Official Adobe Help page with labeled Timeline panel visual.
  - Used for time ruler, work area bar, playhead, playhead position, and zoom scroll bar targets.
- Adobe Learn: [Get to know Premiere](https://www.adobe.com/learn/premiere-pro/web/get-started-premiere-pro)
  - Official Adobe Learn page describing the four main panels: Project panel,
    Source Monitor, Program Monitor, and Timeline panel.
  - Used for layout priority and panel naming.
- Creative Bloq: [How to edit videos in Premiere Pro](https://www.creativebloq.com/entertainment/video-editing-software/how-to-edit-in-premiere-pro)
  - Third-party article screenshot credited on-page to Steve Paris.
  - Used as a non-Adobe public sanity check for the same real UI structure:
    dark panels, tool column, blue track targeting, compact timeline clips, and
    monitor control density. Reference only; do not copy image assets.

No actual Premiere app bundle was found locally:

- `mdfind "kMDItemCFBundleIdentifier == 'com.adobe.PremierePro'"` returned no path.
- `/Applications` and `/Users/conmeara/Applications` Premiere searches returned no app bundle.

## High-Priority Current Deltas

1. Surface uses `Anthropic Sans`; real Premiere uses compact Adobe/system UI
   typography with smaller labels, tighter metrics, and less display weight.
2. Top chrome is wrong: our File/Edit/Clip menu row sits inside the app window;
   real Premiere shows a home icon, Import/Edit/Export workspace tabs, centered
   project title, workspace name such as ESSENTIALS, and compact utility icons.
3. Our app window has rounded, polished Mac-card styling; real Premiere is
   flatter, darker, and mostly squared with thin separators.
4. Real Project panel is thumbnail/icon-view dominant in the reference; ours is
   still a hybrid list/freeform card panel.
5. Real Project thumbnails have tiny blue film/audio badges and truncated clip
   names under each thumbnail; ours uses large generic cards and colored dots.
6. Real monitor controls are tiny monochrome icon buttons in a long row; ours
   uses larger rounded control buttons.
7. Real Program/Source monitor labels sit in minimal dark tab bars with very
   small type and panel menu icons; ours is heavier and brighter.
8. Real Properties panel has tabs `Properties`, `Effect Controls`, `Lumetri
   Color`; ours still includes an invented `Graphics` tab in that group.
9. Real Properties panel has nested disclosure rows and reset/keyframe icons at
   the far right; ours uses card-like property boxes.
10. Real Properties values use blue numeric fields and inline rows; ours uses
    white values and stacked cards.
11. Real timeline track headers use blue source/target patches, lock icons,
    visibility icons, sync-lock, mute/solo/mic controls, and labels in very
    tight cells; ours is too big and symbolic.
12. Real timeline rows are flatter and more horizontally dense, with clips
    nearly filling row height; ours has rounded pill-like clips and too much
    vertical padding.
13. Real clips use saturated Premiere label colors, tiny `fx` badges, waveform
    overlays, and small thumbnails at cut points; ours only approximates this.
14. Real audio waveforms are dense continuous black-on-green/blue textures; ours
    uses five decorative waveform bars per clip.
15. Real time ruler has many fine ticks and a yellow render/work area bar; ours
    has sparse labels and simplified grid marks.
16. Real tool strip icons are monochrome, tiny, and precisely shaped; ours are
    oversized CSS approximations.
17. Real audio meter is very narrow with black background, dB scale, and bright
    bars; ours is close but still too wide and simplified.
18. Real panel dividers are thin 1px seams with little rounding; ours still has
    high-radius panels and visible card borders.
19. Real app palette is lower contrast charcoal with bright blue selection; our
    purple accent is too prominent and reads non-Premiere.
20. Real editing workspace leaves Project, monitors, right controls, tools,
    timeline, and audio meter aligned to a rigid grid; ours has custom layout
    proportions and warmer demo aesthetics.
21. Real macOS Window menu screenshot shows native menu font/spacing; our
    surface should not invent in-window menu text for those commands.
22. Real Essential Sound/Properties panels use large section titles sparingly,
    clear disclosure chevrons, and full-width sliders; ours compresses those
    into small boxes.

## Usage Decision

These screenshots are reference material only. Do not commit the downloaded
images and do not use Adobe assets, screenshots, icons, or code inside the
editable surface. Rebuild the observed structure as editable HTML/CSS.

## Implementation Changes

- Reworked `compositions/premiere-editor.html` around the official Adobe
  community full-workspace screenshot.
- Replaced the in-window command menu with a closer top app toolbar:
  macOS traffic controls, home icon, Import/Edit/Export tabs, centered project
  title, ESSENTIALS workspace label, compact utility icons, Frame.io, and Export.
- Switched the surface typography from `Anthropic Sans` to system UI font
  fallback so labels, tabs, and values read closer to the actual app.
- Flattened the dark chrome: lower radii, thinner separators, less purple, more
  Premiere-like charcoal and bright blue selection states.
- Moved the layout closer to the screenshot:
  Project panel top-left, Source and Program monitors top-center, Properties
  rail top-right, Audio meter far-right, and tool strip plus timeline below.
- Rebuilt the Project panel as a thumbnail/icon grid with truncated clip names,
  small durations, media badges, search row, and footer view controls.
- Rebuilt the Properties rail as inline rows with disclosure sections,
  blue numeric fields, reset/keyframe circles, and the real tab set:
  Properties, Effect Controls, Lumetri Color.
- Tightened monitor tabs and monitor controls with smaller monochrome control
  buttons and `Fit`/resolution controls.
- Tightened the timeline with blue source/target patches, a yellow work-area
  bar, denser tick marks, thinner blue playhead, flatter clips, saturated label
  colors, small `fx` badges, and denser track headers.
- Reduced the tools panel icon size and active blue selection to better match
  the real vertical tools strip.

## Verification

- `npm run capture:premiere-editor`
  - Refreshed `captures/surface-premiere-editor/target.png`.
  - Visual inspection: the surface is substantially closer to actual Premiere in
    font scale, chrome density, top toolbar, project bin, timeline layout,
    track patches, and Properties panel structure.
- `npm run capture:claude-premiere-workflow`
  - Refreshed `captures/surface-claude-premiere-workflow/target.png`.
  - Visual inspection: the updated editor still frames correctly behind Claude.
- `npm run registry:check`
  - Passed: `51 surfaces, 32 components, 17 workflows, 51 ready captures`.
- `git diff --check`
  - Passed.

## Remaining Blockers

- No local Adobe Premiere app bundle is installed, so this pass still lacks a
  first-party local capture from this machine.
- The monitor/video content remains stylized placeholder footage. It should be
  replaced by editable primitives that more closely resemble the actual
  reference footage framing and thumbnail crops.
- CSS-drawn tool and toolbar icons are closer in size and placement but still
  need a dedicated icon-shape pass against the actual app screenshot.
- Timeline waveforms are denser than before, but they are still repeated mini
  bars rather than continuous waveform textures.
