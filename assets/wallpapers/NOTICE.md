# Wallpaper assets — provenance & licensing

This directory bundles a catalog of macOS desktop wallpapers so UI Backlot
scenes have real, high-fidelity desktop backgrounds without every user needing
a Mac to extract them. Regenerate with `npm run wallpapers:assets` (sources) +
`npm run wallpapers:build` (surface). Raw 6K masters are cached in the
gitignored `workspace/scratch/wp-src/` between runs.

## `macos/` and `thumbs/` — real wallpaper images

These are photographs and rendered artwork **owned by Apple Inc.**, shipped as
the default desktop pictures of OS X / macOS. They are trademarks/copyright of
Apple and are included here only as demo-surface backdrops. **Apple retains all
rights.** Do not treat their presence here as a license to redistribute them for
other purposes.

Sources for the bundled, web-optimized (2560×1600 JPEG) copies:

- **macOS lineage** (Cheetah → Tahoe): downloaded from Stephen Hackett's
  *Every Default macOS Wallpaper* archive — <https://512pixels.net/projects/default-mac-wallpapers-in-5k/>
  (hand-upscaled 6K masters). Each image's `sourceUrl` is recorded in
  `manifest.json`.
- **Mac / iMac colour masters + Radial Sky Blue**: converted from this build
  machine's `/System/Library/Desktop Pictures/` (Apple ships these only
  on-device). Marked `"provenance": "apple-local"` in `manifest.json`.
- **Raycast set**: downloaded from `misc-assets.raycast.com/wallpapers/`
  (the collection at <https://www.raycast.com/wallpapers>). These are
  **© Raycast Technologies** and offered by Raycast as free desktop
  wallpapers; Raycast has not published them under a redistribution license, so
  they are included here on the same "demo backdrop, rights reserved by the
  owner" basis as the Apple set. Marked `"provenance": "raycast"` in
  `manifest.json`. Remove them the same way (delete + re-source) if that
  provenance is a concern for your fork.

If redistributing Apple's wallpaper imagery in a public repository is a concern
for your fork, delete `macos/` + `thumbs/` and run `npm run wallpapers:assets`
locally — the pipeline re-sources them, and the CSS wallpapers (gradients,
metallics, solid colours, patterns) in `compositions/mac-wallpaper.html` remain
fully original and always available.

## CSS wallpapers

The gradient, metallic, solid-colour and pattern wallpapers are authored in this
repo (`tools/wallpapers/abstract-set.json`) and carry the repo's own license.
Names like "Hello" echo Apple's marketing set but the CSS is original.
