# Word Editor Microsoft 365 Fidelity Pass 093

Date: 2026-06-18

## Purpose

Improve the editable Word-style document editor so it is more representative
of Microsoft Word / Microsoft 365 review workflows for demo videos. This pass
keeps the surface as hand-authored HTML/CSS and focuses on ribbon layout,
page geometry, comments, review markers, side panels, and visible text editing
states.

## Reference Evidence

1. Microsoft Support, "Customize the ribbon in Word"
   - URL: https://support.microsoft.com/en-us/word/customize-the-ribbon-in-word
   - Use: confirmed Word ribbon is organized around tabs, groups, and commands,
     and that default commands/groups are part of the visible ribbon model.
   - License note: used as observation-only product documentation. No Microsoft
     screenshots, icons, code, fonts, or assets were copied.
2. Microsoft Support, "Using Modern comments in Word"
   - URL: https://support.microsoft.com/en-us/word/using-modern-comments-in-word
   - Use: modeled contextual/list comment view, right-side Comments pane, active
     comment borders, text anchor highlights, New comment affordance, Resolve,
     Reply, and thread overflow controls.
   - License note: used as observation-only product documentation. No Microsoft
     screenshots, icons, code, fonts, or assets were copied.
3. Microsoft Support, "Accept tracked changes"
   - URL: https://support.microsoft.com/en-us/word/training/accept-tracked-changes
   - Use: modeled Review tab tracking vocabulary, All Markup state, Accept,
     Reject, Previous, and Next commands.
   - License note: used as observation-only product documentation. No Microsoft
     screenshots, icons, code, fonts, or assets were copied.
4. Fluent 2 Design System, "React Toolbar"
   - URL: https://fluent2.microsoft.design/components/web/react/core/toolbar/usage
   - Use: reinforced toolbar groupings, icon-labeled commands, divider spacing,
     and pinned top toolbar behavior for text editing surfaces.
   - License note: used as design guidance only. No Fluent component code was
     copied.
5. Fluent UI license and Fluent 2 iconography guidance
   - URLs:
     - https://github.com/microsoft/fluentui/blob/master/LICENSE
     - https://fluent2.microsoft.design/iconography
   - Use: recorded that Fluent UI code is MIT licensed while referenced fonts
     and icons carry separate terms; Fluent System Icons are MIT licensed, but
     this pass still used hand-drawn CSS glyphs instead of importing icons.

Local Office capture check: `/Applications/Microsoft Word.app` was not present
in this worktree's host environment, so no local Word app capture was available
for this pass.

## Current-vs-Reference Deltas

1. Before: Home tab was active while the scene emphasized comments and tracked
   changes. Reference: review workflows center the Review tab and its Tracking,
   Comments, and Changes commands.
2. Before: ribbon controls were generic Home-tab formatting clusters.
   Reference: Review ribbon needs New Comment, Show Comments/Markup, Track
   Changes, All Markup, Reviewing Pane, Accept, Reject, Previous, and Next.
3. Before: ribbon had group dividers but weaker command grouping. Reference:
   Office ribbon uses named groups and clear vertical separations.
4. Before: titlebar lacked quick access affordances. Reference: Word commonly
   presents save/undo/redo adjacent to the app/document identity.
5. Before: document page was short and landscape-like. Reference: Word print
   layout reads as a portrait page with visible margins and page shadow.
6. Before: only a simplified horizontal ruler existed. Reference: print layout
   benefits from horizontal and vertical rulers with ticks and indent markers.
7. Before: comments pane was a simple list. Reference: modern comments expose
   Contextual/List view, New, per-thread metadata, overflow, Resolve, Reply,
   and reply entry states.
8. Before: comment anchor was a detached dot. Reference: active comment text is
   highlighted and connected to the contextual pane or side margin.
9. Before: tracked changes were represented by a blue callout only. Reference:
   Word review mode shows insertions/deletions, a revision bar, and accept or
   reject controls.
10. Before: text editing state was implied by revised copy. Reference: demos
    need visible selection and insertion caret states inside the document body.
11. Before: status bar was sparse. Reference: Word status includes page/word
    count, language/accessibility state, view buttons, focus, and zoom.
12. Before: document typography used Backlot serif/sans choices that read more
    editorial than Word-like. Reference: Word documents read closer to
    Cambria/Georgia headings and Aptos/Calibri body text.

## Changes

- Reworked the titlebar with quick access save/undo/redo glyphs, a centered
  search box, and stronger Share/Comments actions.
- Shifted the ribbon to an active Review tab and replaced the command surface
  with Comments, Tracking, Changes, Protect, and Proofing groups.
- Added Track Changes, All Markup, Show Markup, Reviewing Pane, Accept, Reject,
  Previous, and Next affordances using hand-authored HTML/CSS.
- Rebuilt the document stage around a portrait page, top/left margin guides,
  horizontal and vertical rulers, indent markers, and a stronger print-layout
  canvas.
- Added visible text selection, a blinking caret, comment highlight, comment
  connector, revision deletion/insertion styling, and a floating accept/reject
  review control.
- Expanded the right Comments pane with Contextual/List toggle, New button,
  avatars, timestamps, overflow controls, Resolve/Reply actions, reply input,
  and a structured tracked-changes summary.
- Enriched the status bar with accessibility state, view-mode buttons, focus,
  zoom minus button, slider thumb, and adjusted zoom level.
- Updated the mounted-component GSAP timeline to animate the new revision
  elements instead of the removed title-swap elements.

## Verification

- `npm install`
  - Restored the declared Playwright dependency in the fresh worktree.
- `npm run capture:word-editor`
  - Output: `captures/surface-word-editor/target.png`
  - Visual check: Review ribbon, portrait page, rulers, comments pane,
    selection/caret, tracked changes, and status bar all render without
    collisions at 1400x880.
- `npm run capture:claude-word-workflow`
  - Output: `captures/surface-claude-word-workflow/target.png`
  - Visual check: the refined Word surface remains legible behind the Claude
    working-thread component in the composed workflow.
- `npm run registry:check`
  - Output: `Surface registry OK: 51 surfaces, 32 components, 17 workflows,
    51 ready captures.`
  - Note: this fresh worktree initially only had the two Word captures, so
    missing generated captures were restored from the canonical local
    `ui-backlot/captures/` directory before rerunning the registry gate.

## Remaining Deltas

- Capture a sanitized live Word for Mac or Word for web window when available
  for exact titlebar, menu, and page spacing comparison.
- Add alternate states for blank document creation, inline comment drafting,
  resolved comments, Compare documents, and restricted editing.
- Add a true Home-tab variant for formatting-focused document editing scenes.
- Add a zoomed text-editing/detail shot so caret, selection, and review floatie
  can be used as separate close-up video beats.
- Consider MIT Fluent System Icons only after attribution and asset handling are
  deliberately added; this pass intentionally uses CSS glyphs.

## Asset Decision

No Microsoft product code, screenshots, icons, fonts, document contents, or app
assets were copied. The updated Word surface remains an editable HTML/CSS
reconstruction informed by public Microsoft Support documentation and Fluent UI
design guidance.
