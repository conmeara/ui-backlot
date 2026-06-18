# Codex Terminal Surface Pass 020

Date: 2026-06-18

## Purpose

Add the first reusable Codex CLI and macOS Terminal style surface so future
videos can show command-line agent workflows without importing the full
Claude/Finder/PowerPoint composition.

This is a component expansion pass. It establishes a direct-capturable terminal
surface and does not claim pixel parity with a live Terminal/Codex session yet.

## Evidence Used

- `DESIGN.md`
  - Used for palette, motion constraints, and code/status typography direction.
- `/System/Applications/Utilities/Terminal.app`
  - Confirms the local macOS Terminal app is available as future capture
    reference.
- Current UI Backlot workflow state
  - Used as the terminal transcript content: component splitting, capture
    scripts, and HyperFrames verification gates.

## Changes

- Added `compositions/codex-terminal.html`.
  - Defines `data-composition-id="codex-terminal-surface"`.
  - Provides a direct-preview fallback so the same file can be captured as a
    standalone terminal surface.
  - Uses local `Anthropic Sans` plus HyperFrames' bundled `JetBrains Mono`
    target for deterministic render typography.
  - Contains a scoped GSAP timeline for the terminal entrance, prompt/card
    reveal, plan rows, tool-call rows, workspace diff panel, progress fill,
    finite spinners, and cursor blink.
- Added `npm run capture:codex-terminal`.
- Updated `PRIMITIVES.md`, `SURFACES.md`, and `surfaces/README.md` to list the
  Codex terminal component boundary.
- Pruned obsolete root Claude internals from `styles/workflow.css` now that the
  host workflow mounts `compositions/claude-app.html`.

## Asset Decision

No Apple Terminal or OpenAI/Codex assets were copied. The window chrome,
terminal content, Codex mark, diff panel, and verification rows are hand-built
editable HTML/CSS. The local Terminal app path is reference context only.

## Verification

- `npm run capture:codex-terminal` refreshed
  `captures/surface-codex-terminal/target.png`.
- `npm run hf:lint` passed with `0 error(s), 5 warning(s), 3 info(s)`.
  The warnings are Studio editability warnings for GSAP-controlled elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,654,750 bytes.
- `git diff --check` passed.

## Remaining Gaps

- Capture a live Terminal/Codex session for exact macOS Terminal titlebar,
  padding, font metrics, and Codex CLI transcript shape.
- Mount the Codex terminal into a future scene once a Claude-plus-terminal or
  Codex-only video storyboard exists.
- Add alternate terminal states: install/run error, successful test run,
  command approval prompt, and compact split-pane logs.
