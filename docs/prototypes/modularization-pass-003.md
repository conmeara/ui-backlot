# Modularization Pass 003

Date: 2026-06-17

## Scope

This pass keeps the `claude-keynote-workflow` visuals and timing intact while
making the HyperFrames source easier to iterate on.

## Changed

- Moved static composition styles from `index.html` to
  `styles/workflow.css`.
- Kept the GSAP timeline inline in `index.html` because HyperFrames static lint
  requires visible `window.__timelines` registration in the composition file.
- Removed blank spacer lines from `index.html`, bringing it below the
  composition-size warning threshold.

## Current Source Layout

- `index.html`: composition markup plus inline GSAP timeline.
- `styles/workflow.css`: all visual styling for the workflow composition.
- `surfaces/claude-mac-finder.html`: standalone surface lab and Finder-only
  comparison mode.

## Verification

Passed after the split:

```bash
npm run hf:lint
npm run hf:inspect
npm run hf:validate
```

`hf:lint` now has one expected warning:

- `gsap_studio_edit_blocked`: the timeline intentionally owns moving primitives
  such as the cursor, drag chip, windows, progress rows, and final card.

## Remaining Notes

A later cleanup can split semantic chunks into sub-compositions if we need scene
reuse across multiple videos. For now, keeping one inline timeline is the most
compatible path with HyperFrames lint/render.
