# Claude App Subcomposition Pass 019

Date: 2026-06-18

## Purpose

Create and mount the first reusable Claude-only HyperFrames component so future
videos can use Claude without also importing Finder, desktop chrome, browser
surfaces, or the presentation editor.

This is a modularization pass and a small fidelity pass. It does not claim the
Claude UI is final; it creates the component boundary needed for repeated
Claude-plus-one-app videos.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for Claude launch-video tone: warm paper, serif assistant copy,
    centered composer, restrained red send/action treatment, and starburst
    emphasis.
- `/Applications/Claude.app/Contents/Info.plist`
  - Confirms local installed Claude desktop version `1.12603.1`.
- `/Applications/Claude.app/Contents/Resources/ion-dist/images/claude_app_icon.png`
  - Used as local reference only for the ten-rib Claude mark geometry. The app
    asset is not copied into the repo.
- Existing `assistant-ui`-informed host Claude shell from pass 011.
  - Reused the safe demo content and grouped thinking/tool-call structure.

## Changes

- Added `compositions/claude-app.html`.
  - Defines `data-composition-id="claude-app-surface"`.
  - Provides a direct-preview fallback so the same file can be captured as a
    standalone Claude surface. The fallback strips template scripts before
    mounting so direct captures do not pull CDN scripts or interfere with
    HyperFrames navigation.
  - Uses local Anthropic fonts only, avoiding system font fallback errors in
    HyperFrames renders.
  - Contains its own scoped GSAP timeline for window entrance, user/assistant
    message entrance, assistant text reveal, thinking/tool-card entrance,
    active tool spinner, and running send-control pulse.
- Added `npm run capture:claude-app`.
- Replaced the host workflow's embedded Claude markup with a mounted
  `#claude-app-clip` wrapper that loads `compositions/claude-app.html`.
- Updated `PRIMITIVES.md`, `SURFACES.md`, and `surfaces/README.md` to list the
  new mounted Claude-only component boundary.

## Asset Decision

No Claude app assets were copied. The installed app icon was viewed only as
reference for rebuilding the starburst mark in CSS. The component remains
editable HTML/CSS with local project fonts.

## Verification

- `npm run capture:claude-app` refreshed
  `captures/surface-claude-app/target.png`.
- `npm run hf:lint` passed with `0 error(s), 4 warning(s), 2 info(s)`.
  The warnings are Studio editability warnings for GSAP-controlled elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the latest draft render is 16.000 seconds and 2,654,750 bytes.
- `git diff --check` passed.

## Remaining Gaps

- The host workflow now mounts `compositions/claude-app.html`, and the obsolete
  root Claude CSS rules have been pruned from `styles/workflow.css`.
- The Claude app still needs a sanitized live new-chat capture to verify exact
  current spacing, chrome, icons, and sidebar layout.
- The direct-preview fallback is a convenience for captures; future component
  tooling could generate standalone lab pages from composition files instead of
  relying on inline fallback script.
