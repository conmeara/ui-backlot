# macOS Shell Icon Fidelity Pass 094

Date: 2026-06-18.

## Purpose

Correct the shell-level macOS icon vocabulary after the broader modern shell
pass. This pass focuses on the top-right menu-bar status cluster, the Finder
toolbar/sidebar glyph language, and the Dock icons. It avoids deep Finder
file-list work and keeps everything editable HTML/CSS for HyperFrames and
Remotion scenes.

## References

- Local Finder inspection via Computer Use on 2026-06-18. Used for live toolbar
  and sidebar structure: thin back/forward chevrons, compact view-mode buttons,
  Group/Share/Tags/Action/Search glyph slots, and lightly weighted sidebar
  symbols.
- `reference/open-source/macos-web/LICENSE`: MIT license confirmed locally.
  Its structure and cursor assets remain safe references, but this pass no
  longer uses its colored Finder/Safari/Keynote/Notes Dock artwork.
- Apple Support, Desktop and menu bar on your Mac:
  https://support.apple.com/guide/imac/desktop-and-menu-bar-apd65991c417/mac.
  Used as public reference for right-side search, Control Center, Wi-Fi,
  battery, date, and time affordances.
- Bjango, Designing macOS menu bar extras:
  https://bjango.com/articles/designingmenubarextras/. Used for 22px working
  area and roughly 16px status-glyph weight.
- Existing Backlot captures from pass 093. Used as the before state: status
  icons read too large/chunky, the Applications sidebar icon was a literal
  heavy `A`, toolbar strokes were closer to 2px, and the Dock still showed
  saturated donor app icons.

## Before Deltas

1. The menu-bar status icons used 22px slots, making them read like toolbar
   buttons instead of menu extras.
2. Search, Wi-Fi, and Control Center were built from thick borders and chunky
   pseudo-elements.
3. The battery icon was too wide and used a heavier outline than the adjacent
   glyphs.
4. The desktop wrapper and shared workflow stylesheet duplicated the same
   oversized status icon shapes.
5. The Dock still loaded colored donor Finder, Safari, Keynote, and Notes app
   artwork from `reference/open-source/macos-web/public/app-icons`.
6. The Claude Dock tile was a saturated red/orange app-color tile, while the
   requested shell direction called for neutral Dock icons.
7. The presentation placeholder still carried colored Keynote artwork through
   `.ghost-app-icon`.
8. Finder toolbar glyphs used 20px slots and roughly 2px strokes, heavier than
   the local Finder reference.
9. Finder sidebar symbols used 1.75px strokes and the Applications item was a
   font letter rather than an icon primitive.
10. The HTML still used `dock-icon donor ...` classes, making the colored asset
    path look intentional even after CSS tuning.

## Changes

- Replaced menu-bar search, Control Center, and Wi-Fi drawings with compact
  hand-authored SVG masks sized around 15-18px inside the menu bar.
- Tuned the battery icon to a 24px shell slot, lighter 1.35px outline, and
  smaller editable fill.
- Mirrored the status-glyph treatment in `compositions/mac-menu-bar.html`,
  `surfaces/claude-mac-finder.html`, and `styles/workflow.css`.
- Removed Dock donor icon image references from the active shell CSS and
  removed `donor` classes from the Finder desktop Dock markup.
- Rebuilt Dock icons as neutral glass tiles with monochrome CSS/SVG-mask glyphs
  for Finder, Claude, Safari/browser, PowerPoint/presentation, and Notes.
- Rebuilt the small presentation ghost app icon as the same neutral
  presentation primitive rather than Keynote donor artwork.
- Reduced Finder toolbar slot size and stroke weights so the toolbar reads more
  like native Finder chrome.
- Added sidebar icon overrides that reduce stroke weight and replace the
  literal Applications `A` with a drawn editable mark.

## Asset Decision

No proprietary Apple assets, SF Symbols, or GPL code were copied. The status,
Dock, toolbar, and sidebar symbols are original hand-authored CSS/SVG-mask
primitives intended for editable composition, not literal platform asset
copies. `macos-web` remains an MIT-licensed reference for structure and cursor
precedent, but the colored app artwork has been removed from this Dock surface.

## Verification

Passed:

- `npm run capture:mac-menu-bar`
- `npm run capture:surface`
- `npm run capture:finder`
- `npm run registry:check`
  - `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`
- `git diff --check`

Visually inspected after capture:

- `captures/surface-mac-menu-bar/target.png`
- `captures/surface-claude-mac-finder/target.png`
- `captures/surface-finder-window/target.png`

Inspection notes:

- The top-right menu-bar cluster now reads as compact monochrome status extras
  rather than full toolbar buttons.
- The Dock no longer shows colored Finder, Safari, Keynote, Notes, or Claude
  app-color tiles; the visible icons are neutral editable primitives.
- Finder toolbar and sidebar symbols now use lighter strokes. File-list icons
  remain intentionally outside this shell-focused pass.

## Remaining Deltas

- The glyphs are editable approximations, not SF Symbols or exact Apple system
  glyphs.
- Dock magnification and dynamic icon badges are still not represented.
- Finder file-list icons remain out of scope for this shell pass.
- Dark mode and menu-bar display-notch variants still need separate states.
