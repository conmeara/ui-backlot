# Assistant UI Claude Refinement Pass 011

Date: 2026-06-18.

## Purpose

This pass makes the donor-repo lane concrete for the Claude surface. The goal
was not to import `assistant-ui`, but to use it as a structural reference for a
more believable editable Claude thread: grouped message parts, tool-call state,
composer attachments, action controls, and running-state affordances.

## Donor Repo

- Source: https://github.com/assistant-ui/assistant-ui
- Local clone: `reference/open-source/assistant-ui`
- Commit: `bca6ebe3c5a5d12a1f654cd4b2eeb635c2baec72`
- License: MIT

Inspected files:

- `examples/with-chain-of-thought/app/MyThread.tsx`
- `templates/minimal/components/assistant-ui/thread.tsx`
- `templates/minimal/components/assistant-ui/attachment.tsx`
- `templates/minimal/components/assistant-ui/tool-fallback.tsx`

## Adapted Patterns

- Grouped assistant message parts: `Thinking`, `Reasoning`, `Sources`, and
  `Taking action`.
- Tool-call rows with completion, ready, active/running states and a visible
  elapsed duration.
- Composer attachment/dropzone structure with an attachment count.
- Composer action rail with add attachment, mode chips, voice control, and a
  running-state stop button.
- Assistant message action dots for copy/retry/more controls.

All implementation stayed hand-authored in `index.html`, `styles/workflow.css`,
and `surfaces/claude-mac-finder.html`; no donor component or CSS file was
vendored into the composition.

## Verification

- `npm run hf:lint`
  - Passed with the expected `gsap_studio_edit_blocked` warnings for timeline
    controlled elements and pointer-events info.
- `npm run capture:surface`
  - Updated `captures/surface-claude-mac-finder/target.png`.
- `npm run hf:validate`
  - Passed; no console errors.
- `npm run hf:inspect`
  - Passed with `ok: true`, `errorCount: 0`, `warningCount: 0`.
- `npm run hf:snapshot`
  - Updated `snapshots/contact-sheet.jpg`.
- `npm run compare:sheets`
  - Updated `snapshots/reference-vs-prototype-contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
  - `ffprobe`: duration `16.000000`, size `2330660`.
- `npm run capture:finder && npm run compare:finder`
  - Refreshed `snapshots/finder-source-vs-surface.jpg` after editing the shared
    standalone surface file.
- Preview server check:
  - `curl -fsS http://localhost:3017` returned `preview-ok`.

## Visual Result

The refreshed `snapshots/frame-02-at-5.4s.png`,
`snapshots/frame-04-at-10.1s.png`, and
`captures/surface-claude-mac-finder/target.png` show the richer Claude surface:
the assistant response now feels like an agent controller UI with source-backed
reasoning and actions, rather than a simple chat bubble plus progress list.

## Remaining Gaps

- The Claude shell is still a safe approximation; it needs a sanitized live
  Claude new-chat capture for exact spacing, icons, and current app chrome.
- The grouped reasoning UI is static. A later motion pass should animate group
  expansion, tool duration, spinner state, and send-to-stop control transitions.
- The PowerPoint-like editor remains code-native; exact PowerPoint source
  capture is still pending.
