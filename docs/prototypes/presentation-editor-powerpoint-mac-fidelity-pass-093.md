# Presentation Editor PowerPoint Mac Fidelity Pass 093

Date: 2026-06-18.

## Purpose

Refine the reusable PowerPoint-style editor so it reads more like a current
PowerPoint for Mac / Microsoft 365 document during Claude deck-update videos,
while staying fully editable HTML/CSS/GSAP.

## Source References

- Microsoft Support, "What's new in PowerPoint 2024 for Windows and Mac":
  https://support.microsoft.com/en-us/powerpoint/what-s-new-in-powerpoint-2024-for-windows-and-mac
  - Used for modern comments, new Office theme, gridlines, accessibility, and
    PowerPoint 2024 for Mac feature framing.
- Microsoft Support, "Basic tasks for creating a PowerPoint presentation":
  https://support.microsoft.com/en-us/powerpoint/basic-tasks-for-creating-a-powerpoint-presentation
  - Used for left slide thumbnail pane, Home tab New Slide flow, Shape/Shape
    Format ribbon behavior, corner resize handles, and bottom Notes pane.
- Microsoft Support, "Customize the ribbon in Office":
  https://support.microsoft.com/en-us/office/foundations-experiences/customize-the-ribbon-in-office
  - Used for Mac ribbon/toolbar preference language and the Office tab/group
    model.
- Fluent UI and Fluent 2:
  https://developer.microsoft.com/en-us/fluentui and
  https://fluent2.microsoft.design/components/web/react/
  - Used as Microsoft 365 control-system reference for toolbar, tablist,
    divider, button, menu, searchbox, slider, and grouped-control density.
- Fluent UI React license note:
  https://github.com/microsoft/fluentui/blob/master/packages/react/README.md
  - The repo states Fluent UI React files are MIT, while referenced fonts and
    icons have separate asset terms. This pass did not copy Fluent code,
    fonts, or icons.
- olton/ribbon-menu:
  https://github.com/olton/ribbon-menu
  - Used as an MIT-licensed ribbon structure reference for tabs, grouped
    commands, large commands, split buttons, and dividers. No code was copied.
- Local PowerPoint app capture:
  - Not available in this worktree session. `/Applications` did not contain a
    Microsoft PowerPoint app to capture, so this pass used official Microsoft
    support screenshots/docs plus license-compatible ribbon/control references.

## Before / After Deltas

1. Before: the titlebar still carried Keynote-era class names and a dormant
   Keynote donor asset variable. After: the visible and CSS structure use
   PowerPoint-specific naming, with a CSS-only PowerPoint-style tile.
2. Before: the titlebar had no Quick Access toolbar. After: it includes
   editable Save, Undo, and Redo glyphs next to the app tile.
3. Before: the document title was just `Launch Deck.pptx`. After: it includes
   a compact PowerPoint app context label beside the file name.
4. Before: the ribbon tabs lacked `File` and `Draw`. After: the tabs include
   `File`, `Home`, `Insert`, `Draw`, `Design`, `Transitions`, `Animations`,
   `Slide Show`, `Review`, `View`, and contextual `Shape Format`.
5. Before: the Home ribbon started with `Slides`. After: it includes a
   `Clipboard` group with a large Paste command, matching common Office ribbon
   composition.
6. Before: there was no visible drawing/inking tool cluster. After: the ribbon
   includes pen, highlighter, eraser, and ink color controls.
7. Before: thumbnails were generic blocks. After: the slide rail adds a
   `Launch Readout` section and per-slide labels: `Title + chart`, `Metrics`,
   `Revenue`, and `Next steps`.
8. Before: selection handles existed but were invisible in the direct capture.
   After: the selected object rectangle is visible by default, including a
   rotation handle and alignment guides.
9. Before: the canvas background had coarse grid treatment only. After: the
   stage has denser gridline cues and a numbered horizontal ruler.
10. Before: the inspector used abstract progress bars for fill/outline/arrange.
    After: it has dropdown-like controls for `Coral accent` and `No outline`,
    size fields, quick actions, a comment thread button, resolve state, and a
    reply field.
11. Before: the status bar had slide count, language, comments, view buttons,
    and zoom only. After: it adds `Accessibility: Good`, keeping the modern
    Office accessibility signal visible in deck-update scenes.
12. Before: the richer ribbon caused the body row to overrun the fixed capture.
    After: the body and stage heights are pinned so the Notes and status bars
    remain visible inside the 836x438 surface.

## Changed Implementation

- Updated `compositions/presentation-editor.html`.
- Kept the existing reusable component contract:
  `presentation-editor-surface`, `.presentation-editor-surface`, and
  `window.__timelines["presentation-editor-surface"]`.
- Did not copy proprietary Microsoft product code, screenshots, icons, fonts,
  or app assets.
- Did not copy Fluent UI or ribbon-menu source code. Their patterns informed
  hand-authored HTML/CSS controls only.

## Capture Evidence

- `npm run capture:presentation-editor`
  - Wrote `captures/surface-presentation-editor/target.png`.
  - Direct capture now shows File/Draw tabs, Clipboard and Draw groups,
    selected-object handles, slide section labels, notes, status bar, and the
    richer inspector/comments pane.
- `npm run capture:claude-presentation-chat-pane-workflow`
  - Wrote
    `captures/surface-claude-presentation-chat-pane-workflow/target.png`.
  - The richer PowerPoint surface remains legible when scaled behind the Claude
    deck chat pane.
- Full local capture restore
  - This fresh worktree initially lacked generated `captures/**` artifacts.
    Regenerated all missing ready captures declared in `surfaces/registry.json`
    so the registry gate could run exactly.

## Verification

- `npm run capture:presentation-editor`
  - Passed.
- `npm run capture:claude-presentation-chat-pane-workflow`
  - Passed.
- `npm run registry:check`
  - Passed: `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`

## Remaining Gaps

- Still not source-captured from a local Microsoft PowerPoint for Mac window.
  Exact titlebar geometry, Office account controls, and Mac-specific toolbar
  spacing should be recalibrated if PowerPoint becomes available locally.
- The ribbon is a static Home/Shape Format composite, not true tab-state
  variants. Future videos could add Insert, Draw, Review, and Comments states.
- Icons remain CSS approximations. This is intentional for rights safety, but
  they are less precise than audited first-party or open-source icon assets.
- The inspector/comment pane is compressed to fit the small reusable surface;
  a larger 16:10 source-captured editor could carry more accurate pane spacing.
- The workflow wrappers did not need code changes in this pass, but future
  choreography could drive child timeline states directly rather than relying
  on the editor's default selected-object state.
