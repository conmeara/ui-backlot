# Donor Repo Dock Fidelity Pass 010

Date: 2026-06-17

## Scope

This pass turns the open-source donor-repo lane into concrete local reference
material, then applies the first donor-informed UI refinement to the Mac Dock
primitive.

## Donor Repos Pulled

- `reference/open-source/macos-web`
  - Source: https://github.com/PuruVJ/macos-web
  - Commit: `f0d4d4db147a1e5706bd3262e5aec5a08cef4026`
  - License: MIT
  - Used as reference for Dock glass, app wrappers, open-app dots, separators,
    and active app behavior.
- `reference/open-source/AppKit-on-the-Web`
  - Source: https://github.com/andrewmcwattersandco/AppKit-on-the-Web
  - Commit: `7407236851a2a0a20636c7fbb010e5b5f843f7a1`
  - License: GPLv2
  - Reference-only unless GPL obligations are explicitly accepted.

Provenance note: `reference/open-source/README.md`.

## Built

- Added explicit Dock app wrappers in `index.html` and
  `surfaces/claude-mac-finder.html`.
- Added open-app indicator dots under Finder, Claude, and PowerPoint.
- Added a Dock divider between the Claude/Finder cluster and presentation app
  cluster.
- Tuned Dock glass with subtler opacity, inset highlight, blur/saturation, and
  a slightly lower radius inspired by `macos-web`'s Dock component.
- Kept all code hand-authored in UI Backlot; no donor repo component was
  imported directly.

## Evidence

- Full composition contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet:
  `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Dock-visible frame: `snapshots/frame-02-at-5.4s.png`
- Standalone Mac/Finder surface capture:
  `captures/surface-claude-mac-finder/target.png`
- Finder comparison sheet: `snapshots/finder-source-vs-surface.jpg`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`
- MP4 size: `2256265` bytes from `ffprobe`
- Preview server check: `http://localhost:3017` returned `preview-ok`

## Verification

Passed:

```bash
npm run capture:surface
npm run hf:lint
npm run hf:inspect
npm run hf:validate
npm run hf:snapshot
npm run compare:sheets
npm run hf:render
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4
curl -fsS http://localhost:3017 >/dev/null && echo preview-ok || echo preview-not-responding
npm run capture:finder
npm run compare:finder
```

`hf:lint` reports two expected `gsap_studio_edit_blocked` warnings because the
main workflow and presentation sub-composition intentionally use registered GSAP
timelines.

## Remaining Gaps

- Dock icons are still text-based approximations, not macOS app icon artwork or
  reusable SVG/icon primitives.
- Dock magnification and bounce are not implemented yet; `macos-web` has useful
  behavior references for a later interactive surface pass.
- Claude and Finder remain in the host `index.html`; extracting them into
  sub-compositions is still a likely next structural step.
