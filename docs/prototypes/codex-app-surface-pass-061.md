# Codex App Surface Pass 061

Date: 2026-06-18.

## Purpose

Add the first reusable Codex desktop/app-style component. UI Backlot already had
a Codex CLI/Terminal surface, but future videos also need a desktop workbench
surface for showing Codex planning, reading evidence, editing files, previewing
patches, and tracking verification without framing the whole product as a
terminal session.

This pass creates a separate editable component so a video can import Codex
Desktop-style UI without Terminal, Claude, Finder, browser, Office, Figma, or
Premiere surfaces.

## Evidence Used

- `codex --version`
  - Current local result: `codex-cli 0.139.0`.
- `codex --help`
  - Used for current top-level command vocabulary, including `exec`, `review`,
    `app`, `cloud`, `plugin`, and `mcp`.
- `codex app --help`
  - Used for the desktop-app launch behavior and workspace-path argument.
- `codex review --help`
  - Used for the code-review task lane and `--uncommitted`, `--base`, and
    `--commit` workflow language.
- `/Applications/Codex.app/Contents/Info.plist`
  - Used for local app identity and version `26.611.62324`.
- `/Applications/CodexBar.app/Contents/Info.plist`
  - Used for local CodexBar identity and version `0.32.2`.
- `mcp__computer_use.get_app_state`
  - Attempted for structural reference, but access to `com.openai.codex` was
    blocked for safety. No app screenshot or accessibility tree was used.
- `DESIGN.md`
  - Used for warm backlot palette, typography, editable UI constraints, and
    no-copied-product-assets guidance.

## Changes

- Added `compositions/codex-app.html`.
  - Defines `data-composition-id="codex-app-surface"`.
  - Provides a 1280x820 editable desktop workbench with sidebar navigation,
    recent work list, topbar, conversation message, plan card, tool/evidence
    card, composer, current-goal inspector, files, patch preview, local
    metadata, and verification state.
  - Registers a scoped GSAP timeline for window entrance, sidebar/topbar
    reveal, message/card reveal, inspector reveal, composer reveal, progress,
    and active verification pulse.
- Updated `package.json`.
  - Added `npm run capture:codex-app`.
- Updated `surfaces/registry.json`.
  - Added `codex-app` as a component distinct from `codex-terminal`.

## Asset Decision

No OpenAI/Codex app assets, screenshots, app code, icon files, private session
transcripts, auth state, account data, or copied app bundle assets were used.
The visible `Cx` mark is hand-authored text, not the official app icon. The
surface remains hand-authored editable HTML/CSS/GSAP using safe local CLI/app
metadata as reference context.

## Capture

- `npm run capture:codex-app`
- Output: `captures/surface-codex-app/target.png`

## Verification

- `npm run capture:codex-app`
  - Wrote `captures/surface-codex-app/target.png`.
  - Visual inspection passed: the standalone workbench window is readable,
    cropped correctly, and has no visible overlap in the 1380x900 capture.
- `npm run registry:check`
  - `Surface registry OK: 27 surfaces, 14 components, 11 workflows, 27 ready captures.`
- JSON parse check
  - `package.json` and `surfaces/registry.json` parsed successfully.
- `git diff --check`
  - Passed before and after HyperFrames verification.
- `npm run hf:lint`
  - Passed with `0 error(s), 24 warning(s), 18 info(s)`.
  - The new `codex-app` warning is the expected GSAP write-back limitation for
    animated elements in a registered timeline.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with `errorCount: 0`, `warningCount: 0`, `issueCount: 0`.
- `npm run hf:snapshot`
  - Saved 7 snapshots plus `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Completed draft render to `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2739639`

## Remaining Gaps

- A sanitized live Codex desktop capture would still be needed before claiming
  pixel-level app fidelity.
- The Computer Use path could not provide current app structure because Codex
  app access is blocked for safety.
- Future wrappers should pair `codex-app` with Claude once we want a
  Claude-plus-Codex-desktop workflow distinct from the existing
  Claude-plus-Codex-terminal workflow.
