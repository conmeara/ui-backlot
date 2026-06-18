# Claude Keynote Workflow Pass 002

Date: 2026-06-17

Superseded direction: pass 004 narrows the active prototype to Claude, Finder,
and a PowerPoint-like presentation editor. This file remains as historical
evidence for the earlier broader render.

## Scope

This pass moves the focused surface kit into the main HyperFrames render target.
It replaces the older fictional app workflow in `index.html` with a 16 second
Claude-on-macOS workflow centered on Finder, Claude, Keynote, a website preview,
todo/progress states, cursor motion, and before-after UI changes.

PowerPoint remains the preferred final presentation target. Keynote is the
current local stand-in because PowerPoint was not available during inventory.

## Built

- Replaced `index.html` with the `claude-keynote-workflow` HyperFrames
  composition.
- Added 14 reusable `data-primitive` markers, documented in `PRIMITIVES.md`.
- Updated snapshot and render scripts in `package.json`.
- Brought the website/app preview forward in the timeline so it is visible in
  the contact sheet.
- Kept the source-captured Finder primitive and the focused standalone surface
  in `surfaces/claude-mac-finder.html`.

## Evidence

- Snapshot contact sheet: `snapshots/contact-sheet.jpg`
- Reference comparison sheet: `snapshots/reference-vs-prototype-contact-sheet.jpg`
- Finder source comparison: `snapshots/finder-source-vs-surface.jpg`
- Draft render: `renders/claude-keynote-workflow-draft.mp4`
- MP4 duration: `16.000000` seconds from `ffprobe`

## Verification

Passed:

```bash
npm run hf:lint
npm run hf:inspect
npm run hf:validate
npm run hf:snapshot
npm run hf:render
```

`hf:lint` still reports expected warnings:

- `gsap_studio_edit_blocked`: the animation timeline intentionally owns moving
  primitives.
- `composition_file_too_large`: the main file should be split into
  sub-compositions in a later cleanup pass.

## Techniques Tried

- Source-captured Finder reconstruction from a clean synthetic local folder.
- Hand-built Claude shell with safe placeholder content to avoid private chat
  capture.
- Retina-scale Playwright captures for Finder comparison.
- HyperFrames snapshots at narrative beats instead of generic browser
  screenshots.
- GSAP-driven state changes for drag, typing, progress, todo completion, slide
  title replacement, chart updates, and website reveal.
- `data-layout-allow-occlusion` on the website surface where the active app
  intentionally floats above background windows.

## Remaining Visual Gaps

- Finder needs a dedicated icon pass and better native vibrancy.
- Claude needs a sanitized live-app capture pass for geometry and current
  product details.
- Keynote should be replaced by PowerPoint once PowerPoint is available.
- The final card is functional but less close to the Claude release-video
  typography and pacing than the app workflow frames.
- The 16 second animation is still a prototype sequence, not a polished launch
  edit.
