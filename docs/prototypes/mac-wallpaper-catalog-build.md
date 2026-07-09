# mac-wallpaper — desktop wallpaper catalog

Status: prototype. One parameterized surface that supplies the desktop
background layer for macOS scenes (behind `mac-menu-bar`, `mac-dock`, and app
windows). Pick a wallpaper with `data-wallpaper="<id>"` (or `?wallpaper=<id>`
standalone); default `sonoma`.

## What's in the catalog (75 wallpapers)

- **Photographic — real bundled images** (`assets/wallpapers/macos/*.jpg`,
  2560×1600 cover-cropped JPEG):
  - **macOS lineage**, Cheetah → Tahoe, including day/night and light/dark
    variants (Mojave, Catalina, Big Sur, Monterey, Ventura, Sonoma, Sequoia,
    Tahoe) — sourced from the 512pixels.net 6K archive.
  - **Mac / iMac colour masters + Radial Sky Blue** — converted from
    `/System/Library/Desktop Pictures/` on the build machine.
- **CSS — original** (`tools/wallpapers/abstract-set.json`): "Hello" metallics,
  mesh/linear gradients, tiling patterns (dot-grid, blueprint, topographic,
  graphite), and the solid-colour set.

Photographic wallpapers are real images because CSS recreations of them looked
poor; CSS is reserved for what it renders better than a JPEG (crisp gradients,
flat colours, tiling patterns).

## Pipeline

1. `npm run wallpapers:assets` — `tools/wallpapers/build-wallpaper-assets.mjs`
   downloads/decodes each master (curl + `sips`), cover-crops to 2560×1600 +
   768×480 thumb, writes `assets/wallpapers/manifest.json`. Raw masters cache in
   gitignored `workspace/scratch/wp-src/`.
2. `npm run wallpapers:build` — `tools/wallpapers/build-wallpaper-surface.mjs`
   fuses the image manifest + abstract set into
   `compositions/mac-wallpaper.html` (generated — do not hand-edit) and the
   unified `surfaces/wallpapers.json`.

The surface is attribute-driven CSS only (image → `background-image`, abstract →
`background`, each rule scoped `#mac-wallpaper-surface[data-wallpaper=…]` so
solid colours outrank the fallback), so it renders with no JS when mounted.

## Licensing

Apple owns the wallpaper imagery; it is bundled only as demo backdrops. See
`assets/wallpapers/NOTICE.md`. Forks that don't want to redistribute Apple's
images can delete `macos/` + `thumbs/` and re-source locally; the CSS set always
ships.
