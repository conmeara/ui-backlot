# Figma Actual App Reference Pass 094

Date: 2026-06-18

## Purpose

Reset the Figma fidelity work around actual Figma UI screenshots before doing
more implementation. The current editable surfaces are structurally useful but
still miss Figma's real font scale, icon geometry, panel density, canvas spacing,
and overall feel.

## Reference Images Saved

All images are official/public Figma documentation or Figma blog images saved for
visual reference only. See `reference/figma/actual-app/source-index.json` for
source URLs and notes.

- `reference/figma/actual-app/actual-figma-ui3-left-navigation-overview.png`
- `reference/figma/actual-app/actual-figma-ui3-toolbar-editor-wide.png`
- `reference/figma/actual-app/actual-figma-ui3-actions-toolbar.png`
- `reference/figma/actual-app/actual-figma-properties-design-prototype.png`
- `reference/figma/actual-app/actual-figma-left-panel-layers-pages.png`
- `reference/figma/actual-app/actual-figma-minimized-ui-selection.png`
- `reference/figma/actual-app/actual-figma-assets-panel.png`
- `reference/figma/actual-app/actual-figma-ui3-blog-full-editor.jpg`

Current UI Backlot comparison captures were refreshed and copied to:

- `reference/figma/current-surfaces/ui-backlot-figma-editor-current.png`
- `reference/figma/current-surfaces/ui-backlot-figma-onboarding-current.png`

## Source Decision

- I used official/public Figma screenshots instead of opening the local
  `/Applications/Figma.app` UI, because the local app may show private recent
  files or account context.
- Do not copy screenshot pixels, Figma proprietary icons, app assets, or source
  code into the editable surfaces. Use these as measurement/reference plates for
  spacing, type scale, layout, density, and state design.

## Fidelity Deltas To Fix Next

1. Our light editor uses a macOS titlebar; actual Figma UI3 screenshots emphasize
   Figma's file/navigation chrome and floating panels more than a native titlebar.
2. Actual Figma panel type is larger, heavier, and more system-like; our
   Anthropic Sans use makes the interface feel like a Claude-branded mock.
3. Actual Figma icons are heavier, rounder, and more distinctive; our CSS icons
   are thin approximations and often read as generic app icons.
4. Actual Figma active toolbar button is a large vivid blue rounded square; ours
   is smaller and too compact.
5. Actual toolbar icons have dropdown chevrons beside grouped tools; ours lacks
   the same grouped rhythm and exact chevron placement.
6. Actual bottom toolbar has stronger shadow, taller height, more generous
   horizontal spacing, and fewer visible borders; ours is too delicate.
7. Actual left navigation bar is a separate vertical rail with large icon +
   label states; our rail is narrow and icon-only.
8. Actual left navigation rail includes File, Assets, Find, Variables, and lower
   notification/library affordances; our rail content and order still differ.
9. Actual left panel has a large file/project header with Figma mark, dropdowns,
   and panel-collapse icon; ours compresses that area and uses different spacing.
10. Actual page/layer rows use taller row heights, very strong text contrast,
    and native Figma layer icons; ours has smaller text and weaker hierarchy.
11. Actual selected layer color is pale blue with dark text; ours uses gray in
    several places and does not match the exact blue selection treatment.
12. Actual layer tree has Figma's hash/frame/component/variant icon language;
    ours still uses simplified square/diamond glyphs.
13. Actual canvas in minimized/screenshot contexts can be dark gray with floating
    white panels; our light editor canvas stays pale with a visible grid.
14. Actual frames in public screenshots have subtler labels, less decorative
    content styling, and much more whitespace around design boards; our sample
    content dominates the editor chrome.
15. Actual selected frames show precise Figma handles with small blue corners and
    no oversized measurement chips unless the current interaction calls for them;
    ours over-explains selection dimensions.
16. Actual right properties panel is much wider-feeling, with large controls,
    strong section dividers, and exact field groups; ours is cramped and dense.
17. Actual Design/Prototype tabs are large, pill-like, and paired with Share,
    Play, avatar, and zoom in the right panel header; ours splits these controls
    across titlebar and panel differently.
18. Actual property controls use light gray filled fields with bold values and
    recognizable alignment icons; ours uses small bordered fields.
19. Actual Prototype panel includes device/model/orientation/background previews
    and flow rows; our prototype rows are thin text-only summaries.
20. Actual Assets panel is a distinct library browsing experience; ours only
    shows an Assets tab without real asset-panel density.
21. Actual Figma panels have rounded outer corners and float over the canvas in
    several UI3 states; ours still feels like a rigid four-column desktop app.
22. Actual Figma zoom is in the right-side header/control area in multiple
    references; ours adds a separate bottom status pill that may be the wrong
    hierarchy.
23. Actual Figma uses black/gray icon strokes with very specific weights; our
    dark onboarding editor uses mixed red/blue emphasis and custom app styling
    that pulls attention away from Figma chrome.
24. Actual dark/minimized reference still uses white floating panels over dark
    canvas; our dark onboarding editor makes the whole app dark, which may be
    appropriate for the Claude clip but is less representative of ordinary
    Figma.

## Next Implementation Bar

Before the next pass is considered successful:

- Use these actual-app screenshots as the comparison source, not just Figma docs
  text.
- Rebuild the chrome around Figma's real panel proportions, font scale, and icon
  density.
- Produce side-by-side comparison captures for at least the light editor and
  dark/onboarding workflow.
- Keep everything editable HTML/CSS; no bitmap-only mock replacement.
