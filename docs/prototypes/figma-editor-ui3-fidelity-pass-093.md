# Figma Editor UI3 Fidelity Pass 093

Date: 2026-06-18

## Purpose

Improve the editable Figma-style surfaces so Claude/Codex-to-design videos read
more like real Figma UI3 instead of generic design-editor mocks. This pass keeps
the implementation in hand-authored HTML/CSS and uses references only for layout,
control density, and interaction affordances.

## References

- Figma Help Center: [Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)
  - Used for the left navigation rail, bottom toolbar, Actions emphasis, Dev
    Mode entry point, grouped properties panel, property labels, selection
    actions, and zoom/view options.
- Figma Help Center: [Design, prototype, and explore layer properties in the right sidebar](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar)
  - Used for Design/Prototype right-sidebar behavior, selected-layer property
    controls, prototype interaction rows, export, and edit/view access cues.
- Figma Help Center: [View layers and pages in the left sidebar](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-pages-in-the-left-sidebar)
  - Used for Pages/Layers structure, layer-type icons, nested frames/groups,
    Assets availability, visibility/lock cues, and resizable/collapsible panel
    affordances.
- Figma Blog: [Making the Move to UI3](https://www.figma.com/blog/making-the-move-to-ui3-a-guide-to-figmas-next-chapter/)
  - Used for the bottom toolbar, Actions menu role, Dev Mode in the toolbar,
    and Figma AI/actions positioning.
- Figma Blog: [Our Approach to Designing UI3](https://www.figma.com/blog/our-approach-to-designing-ui3/)
  - Used for the properties-panel density direction: component controls,
    layout-related grouping, constraints visibility, and efficient explicit
    controls.
- Existing public/local reference notes:
  - `docs/prototypes/figma-editor-surface-pass-024.md`
  - `docs/prototypes/figma-onboarding-editor-pass-076.md`
  - `docs/prototypes/claude-code-figma-workflow-pass-077.md`

## Current-vs-Reference Deltas

1. Light editor toolbar had too few tools and mixed zoom into the same dock.
2. Light editor lacked a separate zoom/view status control near the canvas edge.
3. Left panel lacked file context, branch/history, and minimize/resizer cues.
4. Layer rows lacked visibility/lock states and enough distinct layer-type icons.
5. Canvas lacked rulers, frame size labels, and explicit measurement badges.
6. Selected object had only corner handles, not side handles or rotation handle.
7. Prototype mode existed as a tab but had no visible canvas connector.
8. Right properties panel lacked selected-layer header, alignment controls,
   constraints diagram, Stroke, Typography, and prototype interaction rows.
9. Dark onboarding editor had no right properties panel, making it read like a
   dark canvas rather than Figma.
10. Dark onboarding editor had no bottom floating toolbar or zoom/status control.
11. Dark selected frame lacked full blue handles and a selected-frame size chip.
12. Dark layer tree lacked nested text/button layers for the selected screen.

## Changes

- Updated `compositions/figma-editor.html`.
  - Added file context, minimize and branch/history affordances, denser Layers
    rows, visibility/lock indicators, section icon, canvas rulers, frame size
    tag, selected-object label, eight resize handles, rotation handle,
    measurement badges, prototype connector, multiplayer cursor label, separate
    zoom/view status control, selected-layer properties header, alignment strip,
    constraints diagram, Stroke, Typography, Prototype rows, and a denser bottom
    toolbar with Hand, Section, Resources, Comments, Actions, and Dev controls.
- Updated `compositions/figma-onboarding-editor.html`.
  - Added Design/Prototype mode pills, deeper layer tree, dark canvas grid,
    full selected-frame handles, selected-frame size chip, prototype connector,
    bottom floating toolbar, zoom/status control, and dark right properties
    panel with selected-frame, layout, constraints, fill, prototype, and export
    sections.
- Workflow integration stayed component-driven:
  - `compositions/claude-code-figma-workflow.html` picks up the improved dark
    editor through the existing Backlot component loader mount.
  - `compositions/claude-figma-workflow.html` picks up the improved light editor
    through the existing Backlot component loader mount.

## Asset Decision

No proprietary Figma code, fonts, icons, private files, or screenshot plates were
copied. Icons and controls are recreated with CSS primitives; public Figma
documentation and blog screenshots were used as reference material only.

## Verification

Passed:

- `npm run capture:figma-editor`
- `npm run capture:figma-onboarding-editor`
- `npm run capture:claude-code-figma-workflow`
- `npm run registry:check` -> `51 surfaces, 32 components, 17 workflows, 51 ready captures`

Capture outputs refreshed:

- `captures/surface-figma-editor/target.png`
- `captures/surface-figma-onboarding-editor/target.png`
- `captures/surface-claude-code-figma-workflow/target.png`

Note: this clean worktree initially lacked ignored local capture artifacts, so
`registry:check` first reported missing `captures/**/target.png` paths. I
regenerated the registry's ready capture artifacts and reran the requested gates.

## Remaining Deltas

- Live Figma desktop/browser inspection would still improve exact spacing,
  keyboard-shortcut labels, and hover states if a safe blank file is available.
- Dev Mode and Prototype tabs are visible but not separate alternate states yet.
- The CSS icon geometry is closer but still approximate; a later pass could add
  a shared icon primitive set for repeated Figma controls.
