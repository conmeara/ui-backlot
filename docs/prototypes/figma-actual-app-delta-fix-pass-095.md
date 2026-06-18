# Figma Actual App Delta Fix Pass 095

Date: 2026-06-18

## Purpose

Rework the editable Figma surfaces against the actual Figma UI3 screenshots
saved in `reference/figma/actual-app/`. This pass does not replace surfaces with
bitmap plates; it uses CSS/HTML primitives to move the chrome, density, type, and
layout closer to real Figma.

## Reference Inputs

- `reference/figma/actual-app/actual-figma-minimized-ui-selection.png`
- `reference/figma/actual-app/actual-figma-ui3-left-navigation-overview.png`
- `reference/figma/actual-app/actual-figma-ui3-actions-toolbar.png`
- `reference/figma/actual-app/actual-figma-properties-design-prototype.png`
- `reference/figma/actual-app/actual-figma-left-panel-layers-pages.png`
- `reference/figma/actual-app/source-index.json`

## Changes

- Rebuilt `compositions/figma-editor.html` around actual Figma UI3 composition:
  floating white panels over a dark canvas, labeled left navigation rail,
  larger system typography, stronger layer hierarchy, real-scale bottom toolbar,
  right-panel top controls, filled property fields, and subdued selection
  measurements.
- Rebuilt `compositions/figma-onboarding-editor.html` so the dark onboarding
  clip still shows the mobile design work, but Figma chrome is now closer to the
  actual app: white floating panels, large File/Layers header, actual-style
  Design/Prototype/zoom header, white toolbar, heavier icon geometry, and more
  faithful right-sidebar controls.
- Workflow integration remains component-based. `claude-code-figma-workflow`
  picks up the improved onboarding editor through the existing Backlot mount.

## Delta Resolution Map

1. Mac titlebar mismatch: addressed by hiding the native-style titlebar in the
   light editor and using floating Figma panels over the canvas.
2. Font personality: addressed by switching the Figma surfaces to system/Inter
   family instead of Anthropic Sans for product chrome.
3. Thin generic icons: improved with heavier CSS strokes, larger toolbar glyphs,
   and more Figma-specific rail/layer glyphs.
4. Active toolbar button scale: addressed with larger 40-45px blue active tool
   buttons and stronger rounded-square treatment.
5. Toolbar chevron/group rhythm: partially addressed through toolbar grouping,
   separators, and larger grouped-tool spacing. Exact chevron geometry remains
   approximate because icons are CSS primitives.
6. Bottom toolbar weight/shadow: addressed with taller white toolbar, stronger
   shadow, wider spacing, and fewer delicate borders.
7. Left navigation rail labels: addressed with separate vertical rail and visible
   File, Assets, Find, Variables, Library, and Updates labels.
8. Left rail content/order: addressed with File, Assets, Find, Variables, lower
   Library/Updates affordances matching UI3 references more closely.
9. Left file header compression: addressed with a large file header, Figma mark,
   title/subtitle, and collapse affordance.
10. Page/layer row size and contrast: addressed with taller rows, stronger type,
    and higher-contrast active/selected states.
11. Selected layer color: addressed with pale blue selected-frame row and gray
    active layer treatment closer to Figma's hierarchy.
12. Layer icon language: improved with hash/frame/component/text-style icon
    primitives; still approximate because proprietary icon assets were not
    copied.
13. Canvas darkness: addressed by moving both editor surfaces to dark canvas
    contexts with floating white panels.
14. Frame dominance: addressed by shrinking/repositioning the sample design
    frames so editor chrome reads first.
15. Selection affordances: addressed by removing oversized measurement chips
    from the default capture and using smaller handles/selection tags.
16. Right panel width/density: addressed with wider-feeling floating right panel,
    larger controls, stronger section dividers, and filled fields.
17. Design/Prototype/share/play/zoom hierarchy: addressed with right-panel top
    controls and tabs plus zoom in the same header area.
18. Property controls: addressed with light gray filled controls, larger value
    text, and stronger alignment-control blocks.
19. Prototype panel depth: partially addressed with visible Prototype rows and
    right-panel header/tab placement. Full device/model preview state remains a
    separate alternate state to build.
20. Assets panel: partially addressed with visible Assets preview/search rows in
    the left panel. A full library browser state remains future work.
21. Floating panels: addressed by converting rigid columns into rounded floating
    panels over the canvas.
22. Zoom hierarchy: addressed by moving zoom into right-panel header controls.
23. Dark onboarding emphasis: addressed by changing the surrounding Figma chrome
    to actual-style white panels and reserving dark styling for the mobile app
    designs/canvas.
24. White panels over dark canvas: addressed in `figma-onboarding-editor.html`
    with white left/right panels and white bottom toolbar over a dark canvas.

## Evidence

Passed:

- `npm run capture:figma-editor`
- `npm run capture:figma-onboarding-editor`
- `npm run capture:claude-code-figma-workflow`

Comparison sheets:

- `snapshots/figma-actual-vs-backlot-light-pass-095.jpg`
- `snapshots/figma-actual-vs-backlot-onboarding-pass-095.jpg`

## Remaining Limitations

- Exact Figma icon vectors and proprietary assets were intentionally not copied;
  CSS icon geometry remains approximate.
- The full Prototype device/model preview and full Assets library browsing
  should become separate editable states rather than overloading the default
  capture.
- The sample design content is sanitized and illustrative; a future pass could
  make it look more like the reference mobile app frames while still avoiding
  copied screenshot pixels.
