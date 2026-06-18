# Presentation Editor Source Screenshots Pass 094

Date: 2026-06-18.

## Purpose

Reset the PowerPoint editor work around actual app screenshots before further
visual implementation. The current editor is still too far from PowerPoint in
font, icon vocabulary, ribbon density, pane geometry, and overall look and
feel. This pass sources real screenshots and turns the mismatch into concrete
next deltas.

## Goal

Source-ground the PowerPoint editor reconstruction before further
implementation: collect at least 6 actual PowerPoint for Mac / Microsoft 365
app screenshots or screenshot-bearing official/source pages covering titlebar
and ribbon, slide thumbnails, canvas and selection handles, comments/inspector,
notes/status bar, and typography/icons; record source URLs, license and
asset-use notes, and local-reference availability; compare those references
against the current capture with at least 15 concrete deltas.

## Local App Availability

Checked `/Applications` and `~/Applications` for `Microsoft PowerPoint.app`.
No local PowerPoint install was available in this worktree session, so there is
no live local Office capture yet. The reference set below comes from official
Microsoft Support screenshot assets.

## Screenshot Set

The local files are copied as reference-only measurement plates under
`reference/powerpoint/source-screenshots/`. Do not copy pixels, Microsoft
icons, fonts, or screenshots into Backlot surfaces. Rebuild the observed
geometry and behavior in editable HTML/CSS.

| ID | Local file | Source page | Original image | Use |
|---|---|---|---|---|
| `notes-ribbon-status` | `reference/powerpoint/source-screenshots/notes-ribbon-status.png` | https://support.microsoft.com/en-us/powerpoint/training/add-speaker-notes-to-your-slides | https://support.microsoft.com/en-us/powerpoint/media/powerpoint-16-add-notes.png | Ribbon density, left thumbnails, Notes pane, status bar. |
| `mac-thumbnails-ribbon` | `reference/powerpoint/source-screenshots/mac-thumbnails-ribbon.png` | https://support.microsoft.com/en-us/powerpoint/training/add-speaker-notes-to-your-slides | https://support.microsoft.com/en-us/powerpoint/media/ppt16m-selectslide.png | Mac traffic lights, red app/ribbon chrome, slide thumbnail selection. |
| `mac-presenter-notes` | `reference/powerpoint/source-screenshots/mac-presenter-notes.png` | https://support.microsoft.com/en-us/powerpoint/training/add-speaker-notes-to-your-slides | https://support.microsoft.com/en-us/powerpoint/media/ppt16m-presenterview.png | PowerPoint Mac presenter typography and notes treatment. |
| `modern-comments-pane` | `reference/powerpoint/source-screenshots/modern-comments-pane.png` | https://support.microsoft.com/en-us/powerpoint/modern-comments-in-powerpoint | https://support.microsoft.com/en-us/powerpoint/media/ppt-comments-text-anchoring.jpg | Right comments pane, anchored selection handles, comment card geometry. |
| `add-comment-ribbon` | `reference/powerpoint/source-screenshots/add-comment-ribbon.png` | https://support.microsoft.com/en-us/powerpoint/modern-comments-in-powerpoint | https://support.microsoft.com/en-us/powerpoint/media/add-a-comment.png | Review tab comment command icon and ribbon treatment. |
| `mac-alt-text-pane` | `reference/powerpoint/source-screenshots/mac-alt-text-pane.png` | https://support.microsoft.com/en-us/accessibility/office-accessibility/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object | https://support.microsoft.com/en-us/accessibility/media/powerpoint-alt-text-pane.png | Mac side pane typography, close button, text area, checkbox, action button. |
| `mac-alt-text-ribbon-button` | `reference/powerpoint/source-screenshots/mac-alt-text-ribbon-button.png` | https://support.microsoft.com/en-us/accessibility/office-accessibility/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object | https://support.microsoft.com/en-us/accessibility/media/ppt-mac-alttextbutton.png | Mac ribbon icon size and label treatment for Alt Text. |
| `selection-pane-objects` | `reference/powerpoint/source-screenshots/selection-pane-objects.png` | https://support.microsoft.com/en-us/powerpoint/use-the-selection-pane-to-manage-objects-in-documents | https://support.microsoft.com/en-us/powerpoint/media/selection-pane-with-objects.png | Selection pane list typography, row heights, eye icons. |
| `mac-selection-pane-ribbon-button` | `reference/powerpoint/source-screenshots/mac-selection-pane-ribbon-button.png` | https://support.microsoft.com/en-us/powerpoint/use-the-selection-pane-to-manage-objects-in-documents | https://support.microsoft.com/en-us/powerpoint/media/word-mac-selection-pane-button-on-ribbon.png | Mac Shape Format ribbon button geometry. |

The structured manifest is
`reference/powerpoint/source-screenshots/manifest.json`.

## Current Prototype Capture

- Current capture:
  `captures/surface-presentation-editor/target.png`
- Current source:
  `compositions/presentation-editor.html`

The current capture is useful as an editable composition but still reads as a
compressed Office-like illustration rather than a source-grounded PowerPoint
for Mac surface.

## Concrete Deltas To Fix Next

1. Font stack: current uses Anthropic Sans/Serif; references use Office/system
   UI typography and slide text is not oversized editorial serif by default.
2. App chrome: current titlebar is a custom gray Mac-like strip; Mac reference
   has a red PowerPoint title/ribbon chrome in the older Mac screenshot, and
   Microsoft 365 references have a flatter Office app bar with tiny command
   icons.
3. App icon: current CSS `P` tile is too large and decorative; references use
   compact app/ribbon icons with smaller label relationships.
4. Quick Access icons: current save/undo/redo glyphs are rough CSS marks;
   references use small precise Office icon strokes with tighter spacing.
5. Ribbon height: current ribbon groups are tall and chunky at small scale;
   references show denser commands with slimmer row rhythm and smaller labels.
6. Ribbon labels: current tabs are too large and widely spaced; reference tabs
   are smaller, lighter, and closer to the top chrome.
7. Ribbon icon vocabulary: current icons are generic boxes/lines; references
   show recognizable Office command icons, colored accents, and more precise
   line weights.
8. Slide thumbnails: current thumbnails are mini mock cards with text labels;
   references show actual slide previews with image/content scaled into a
   narrow left rail, selected by a red/orange outline.
9. Thumbnail rail geometry: current rail has too much padding and synthetic
   section labeling; references use a tighter rail with slide numbers close to
   thumbnails.
10. Canvas scale: current slide canvas is too small relative to the editing
    workspace in the standalone surface; references give the slide more central
    visual authority.
11. Canvas content: current slide design is Backlot/editorial and not a typical
    PowerPoint document. Reference slides have more standard theme content,
    placeholders, charts, and image areas.
12. Selection handles: current selection rectangle is bright and simplified;
    references show tiny white corner handles, object anchors, and comment
    bubbles with subtler UI scale.
13. Comments pane: current comments are embedded inside a Format Shape pane;
    reference comments occupy a dedicated right pane with a `Comments` header,
    New button, thread cards, and reply fields.
14. Inspector/side pane: current Format Shape panel looks like a custom control
    inspector. Mac Alt Text and Selection Pane references use plainer pane
    typography, close buttons, list rows, and form controls.
15. Notes area: current Notes strip floats over the canvas with heavy border;
    reference Notes pane is a horizontal editor below the slide window/status
    area with much lighter treatment.
16. Status bar: current status text and zoom controls are large and stylized;
    references use compact Office status icons and small zoom controls.
17. Color palette: current coral/sage palette is Backlot-branded. References
    are mostly Office white/gray with PowerPoint orange/red accents and less
    warm decorative coloring.
18. Overall density: current composition feels like a compressed marketing
    illustration. References feel like a utilitarian production app with many
    small, precise controls.

## Next Implementation Order

1. Replace Anthropic font styling in the editor chrome with system/Office-like
   UI typography while keeping slide content editable.
2. Rebuild the ribbon at reference density: smaller tab text, smaller command
   icons, tighter group labels, less rounded control chrome.
3. Rework the slide rail from labeled cards into actual preview thumbnails with
   selected-slide outline and tighter numbering.
4. Separate comments from Format Shape when comments are the visible state, or
   add a true dedicated comments pane variant.
5. Rework notes/status as a native PowerPoint lower pane/status bar instead of
   a floating note card.
6. Use the reference plates to tune icon stroke widths, pane row heights, and
   selected-object handle scale before changing workflow choreography.

## Verification Needed After Implementation

- `npm run capture:presentation-editor`
- `npm run capture:claude-presentation-chat-pane-workflow`
- `npm run registry:check`
- Visual side-by-side review against the local screenshot set above.
