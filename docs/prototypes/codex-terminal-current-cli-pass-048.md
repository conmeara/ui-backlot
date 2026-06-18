# Codex Terminal Current CLI Pass 048

Date: 2026-06-18.

## Purpose

This pass refreshes the reusable Codex terminal component against the current
local Codex CLI instead of leaving it as an older dashboard-like mock. The goal
is for future HyperFrames videos to show Codex/Codex CLI work with a believable
terminal prompt, current command inventory, and enough side context to make
agent workflow status editable without becoming a generic dashboard.

## Evidence Used

- `captures/surface-codex-terminal/target.png`
  - Used as the before/after visual quality gate.
- `codex --version`
  - Current local result: `codex-cli 0.139.0`.
- `codex --help`
  - Used for current command names and options including `exec`, `review`,
    `login`, `logout`, `mcp`, `plugin`, `mcp-server`, `app-server`,
    `remote-control`, `app`, `completion`, `update`, `doctor`, `sandbox`,
    `debug`, `apply`, `resume`, `archive`, `fork`, `cloud`, `--cd`,
    `--sandbox`, `--ask-for-approval`, `--model`, `--image`, `--search`, and
    `--no-alt-screen`.
- Codex app metadata
  - Local app version: `26.611.62324`.
- Terminal app metadata
  - Local Terminal version: `2.15`.
- `DESIGN.md`
  - Used for warm backlot palette, terminal typography constraints, and
    no-copied-assets guidance.

## Changes

- Updated `compositions/codex-terminal.html`.
  - Changed the titlebar/prompt to represent a `codex --no-alt-screen` CLI
    workflow.
  - Replaced stale command inventory with the current local `codex --help`
    command list.
  - Added current options from local help output: `--cd`, `--sandbox`,
    `--ask-for-approval`, `--model`, `--image`, `--search`, and
    `--no-alt-screen`.
  - Updated the Codex app reference version to `26.611.62324`.
  - Tightened prompt-line behavior so the cwd and command truncate like a real
    terminal instead of wrapping awkwardly.
  - Shortened the terminal output block so it no longer clips at the bottom of
    the capture.

## Asset Decision

No Apple Terminal assets, OpenAI/Codex app assets, screenshots, app code,
private session transcripts, auth state, or account data were copied. The
surface remains hand-authored HTML/CSS/GSAP using safe local CLI/app metadata
as reference context.

## Capture

- `npm run capture:codex-terminal`
- Output: `captures/surface-codex-terminal/target.png`

## Verification

- `npm run capture:codex-terminal`
  - Refreshed `captures/surface-codex-terminal/target.png`.
  - Visual inspection passed: prompt stays on one line with terminal-style
    truncation, output no longer clips, and the side reference shows current
    Codex/Terminal metadata.
- `npm run registry:check`
  - Passed: `18 surfaces, 13 components, 3 workflows, 18 ready captures`.
- JSON parse check for `surfaces/registry.json` and `package.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors. Existing warnings are GSAP Studio write-back/pointer
    and font advisories for the broader composition set.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with 0 issues.
- `npm run hf:snapshot`
  - Refreshed the 7-frame workflow snapshot set and
    `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2768317`
- `git diff --check`
  - Passed.

## Remaining Gaps

- A sanitized live Codex CLI interactive-session capture would still help
  calibrate exact prompt spacing, inline mode behavior, and command transcript
  rhythm.
- The surface is intentionally code-native and editable rather than a screenshot
  of a real terminal session.
- Future variants should show `codex exec`, `codex review`, and Codex Cloud
  apply flows as separate terminal states if those demos become common.
