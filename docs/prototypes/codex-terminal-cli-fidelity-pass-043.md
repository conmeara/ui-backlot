# Codex Terminal CLI Fidelity Pass 043

Date: 2026-06-18

## Purpose

Refine the reusable Codex terminal component so it reads less like a dashboard
inside a terminal window and more like an actual CLI-driven agent workflow.
The surface should be useful when a HyperFrames video needs Codex/Codex CLI,
test runs, diffs, tool calls, or verification status without importing Claude,
Finder, browser, or Office-style app surfaces.

## Evidence Used

- `captures/surface-codex-terminal/target.png`
  - Used as the current visual quality gate.
- `codex --version`
  - Confirms local CLI version `codex-cli 0.139.0`.
- `codex --help`
  - Used as safe local reference for visible command vocabulary:
    `exec`, `review`, `login`, `mcp`, `plugin`, `app`, `doctor`, `apply`,
    `resume`, and `cloud`.
- `/Applications/Codex.app/Contents/Info.plist`
  - Used for safe local app metadata only, including display name, bundle
    identifier, document types, and version `26.611.62324`.
- `/System/Applications/Utilities/Terminal.app/Contents/Info.plist`
  - Used for safe local Terminal metadata only, including version `2.15`.
- `DESIGN.md`
  - Used for quiet Mac backlot palette, code/status typography, and no copied
    product-asset constraints.

## Changes

- Updated `compositions/codex-terminal.html`.
  - Reworked the surface from a large hero-card/dashboard layout into a more
    terminal-native Codex CLI session.
  - Added a realistic command prompt: `codex -C . --model gpt-5`.
  - Added local CLI version badge `0.139.0`.
  - Added compact session metadata chips for cwd, sandbox, and approval policy.
  - Added a transcript block with user/assistant-like terminal rows.
  - Updated tool-call rows to show local version and Terminal metadata checks.
  - Replaced the right-side workspace diff with a patch preview, reference
    metadata block, and verification queue.
  - Added a visible `codex --help` command snippet and diff output block.
  - Increased the component height from 1120x700 to 1120x840 so the command
    output remains visible in standalone captures.
- Updated `package.json`.
  - Increased `capture:codex-terminal` viewport to `1240x940`.
- Updated `surfaces/registry.json`.
  - Set Codex terminal dimensions to `1120x840`.
  - Pointed the surface to this prototype note.
  - Added safe local Codex CLI/app metadata to source evidence.
- Updated `SURFACES.md` and `surfaces/README.md`.
  - Documented the CLI-fidelity direction and asset decision.

## Asset Decision

No Apple Terminal assets, OpenAI/Codex app assets, screenshots, app code,
private thread contents, private credentials, or copied product CSS were added
to the repo. Local CLI help/version output and app metadata were used only as
safe reference evidence. The surface remains hand-authored editable HTML/CSS.

## Verification

- Passed: `npm run capture:codex-terminal`
  - Refreshed `captures/surface-codex-terminal/target.png`.
- Passed: visual inspection of `captures/surface-codex-terminal/target.png`
  - Confirmed the taller component preserves the command/output block.
- Passed: `npm run registry:check`
  - `Surface registry OK: 18 surfaces, 13 components, 3 workflows, 18 ready captures.`
- Passed: JSON parse checks for `package.json` and `surfaces/registry.json`
- Passed: `npm run hf:lint`
  - `0 error(s), 17 warning(s), 11 info(s)`
  - Warnings are expected GSAP-owned editability and pointer-events notes.
- Passed: `npm run hf:validate`
  - No console errors.
- Passed: `npm run hf:inspect`
  - Zero issues across 9 sampled frames.
- Passed: `npm run hf:snapshot`
  - Refreshed 7 root timeline snapshots and `snapshots/contact-sheet.jpg`.
- Passed: `npm run hf:render`
  - Wrote `renders/claude-keynote-workflow-draft.mp4`.
- Passed: `ffprobe` on `renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2649866`
- Passed: `git diff --check`

## Remaining Gaps

- A sanitized live Codex CLI session capture would still help calibrate exact
  transcript rhythm, cursor treatment, and status wording.
- This surface models one successful work session. Future variants should cover
  command approval prompts, failed tests, successful test output, MCP/plugin
  configuration, and cloud-task application.
- A separate Codex desktop-app component is still needed for videos that show
  the Codex app rather than the CLI.
