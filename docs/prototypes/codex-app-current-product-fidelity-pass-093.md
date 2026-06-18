# Codex App Current Product Fidelity Pass 093

Date: 2026-06-18.

## Purpose

Refine the reusable `codex-app` surface so it represents the current Codex app
product family more accurately for instructional videos. Pass 061 created a
metadata-informed desktop workbench; this pass moves the component toward the
official Codex app model: project sidebar, active thread, review pane, worktree
modes, approvals, Git diff controls, composer context, and session metadata.

## Current References

1. Official OpenAI Codex app docs: the app is described as a desktop experience
   for parallel Codex threads with worktree support, automations, and Git
   functionality, and the page includes screenshot alt text for a project
   sidebar, active thread, and review pane
   ([Codex app](https://developers.openai.com/codex/app)).
2. Official app feature docs: used for multitask project sidebar, Skills,
   Automations, Local/Worktree/Cloud modes, built-in Git tools, integrated
   terminal access, approval/sandbox controls, task sidebar/artifacts, MCP, web
   search, and image input details
   ([Codex app features](https://developers.openai.com/codex/app/features)).
3. Official review docs: used for review-pane behavior, diff scopes, staged and
   unstaged states, inline comments, PR feedback, and per-file/per-hunk staging
   or revert actions ([Review](https://developers.openai.com/codex/app/review)).
4. Official worktree docs: used for Local vs Worktree terminology, Handoff,
   Codex-managed worktree expectations, branch actions, and background task
   isolation ([Worktrees](https://developers.openai.com/codex/app/worktrees)).
5. Official Appshots docs: used for Mac appshot attachment language and the
   frontmost-window context model ([Appshots](https://developers.openai.com/codex/appshots)).
6. Official CLI reference plus local CLI help: used for current command language
   around `codex app`, `codex cloud`, app launch behavior, cloud tasks, and
   applying diffs
   ([CLI reference](https://developers.openai.com/codex/cli/reference#command-overview)).
7. Local metadata: `codex-cli 0.139.0`, `/Applications/Codex.app` bundle id
   `com.openai.codex`, app version `26.611.62324`, build `4028`.
8. Local Computer Use attempt: `mcp__computer_use.get_app_state` is still
   blocked for `com.openai.codex` by safety policy, so no live private app
   screenshot, accessibility tree, account data, or app asset was used.
9. Current Backlot before capture: `npm run capture:codex-app` was run before
   editing and showed the older warm three-column workbench with generic
   Threads/Cloud tasks/Reviews/Plugins navigation and a patch-preview inspector.

## Before-To-After Deltas

1. Shell layout changed from warm generic workbench to a darker Codex-style
   project sidebar plus light active-thread center and review pane.
2. Sidebar changed from flat navigation categories to project rows, today's
   thread rows, per-thread status dots, and an account row.
3. Thread language changed from "New task" workbench copy to "New thread" and
   active thread/project structure.
4. Top metadata changed from simple GPT-5/Agent/share pills to breadcrumbs,
   Running state, Worktree mode, GPT-5-Codex model, and sandbox metadata.
5. Conversation structure now includes user attachments for the current file and
   project, matching appshot/file-context style rather than a plain bubble.
6. Plan rows now reflect goal definition, official reference gathering, patch,
   and verification states rather than the older app-creation checklist.
7. Tool activity now cites official Codex docs and local CLI evidence rather
   than only local app metadata.
8. Added a scoped approval card with approve-once/session controls.
9. Composer now includes Local/Worktree/Cloud mode controls plus Appshot and
   Auto context chips.
10. Right inspector changed into a review pane with diff-scope tabs, summary
    cards, file rows, hunk lines, and inline-comment target state.
11. Session metadata now shows Mode, Sandbox, Approvals, and Codex app version
    in the review pane.
12. Verification state now separates before capture, surface patch, and capture
    plus registry gates.
13. Color and typography moved from a one-note warm clay palette to neutral app
    chrome with dark sidebar, blue, green, amber, and violet status accents.
14. Large assistant headline was reduced to product-scale thread text so the
    frame reads more like an operational app than a landing-page card.

## Changes

- Rebuilt `compositions/codex-app.html`.
  - Added a dark project/thread sidebar with project rows, active worktree
    thread, completed thread, waiting thread, and account identity.
  - Added a current active-thread header with breadcrumbs, mode/model/sandbox
    pills, terminal and menu icon buttons.
  - Added user context attachments and a grounded assistant response stack.
  - Reworked plan, tool, and approval cards around current Codex product
    concepts.
  - Added a mode-aware composer with Local, Worktree, Cloud, Appshot, and Auto
    context controls.
  - Replaced the old inspector with a review pane showing scopes, summary
    metrics, file-level diffs, inline-comment cue, session metadata, and
    verification status.
  - Preserved the standalone `codex-app-surface` HyperFrames timeline.
- Updated `surfaces/registry.json`.
  - Pointed `codex-app` to this note.
  - Expanded source evidence to official OpenAI docs, local CLI metadata, app
    metadata, and the local before/after capture path.
  - Tightened the asset decision to keep official screenshots/assets out of the
    repo.
- Updated `SURFACES.md`.
  - Reframed the component as a Codex app command-center surface rather than a
    generic desktop workbench.

## Asset Decision

No OpenAI/Codex product code, screenshots, CSS, app bundle assets, icon files,
private sessions, credentials, account data, or proprietary product assets were
copied. The visible mark is hand-authored text. Official documentation and
screenshot alt text guided structure only; local CLI/app metadata was used as
safe factual evidence.

## Verification

- `npm run capture:codex-app`
  - Ran before editing to inspect the previous surface.
  - Ran after editing and refreshed `captures/surface-codex-app/target.png`.
  - Visual inspection passed: project sidebar, active thread, review pane,
    composer mode controls, approval card, and verification state are all
    visible without incoherent overlap in the 1380x900 capture.
- `npm run registry:check`
  - Passed after restoring the local generated capture cache required by the
    registry checker in this clean worktree.
  - `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`

## Remaining Deltas

- A sanitized live Codex app capture would still be needed before claiming
  pixel-level fidelity.
- The official docs expose screenshot alt text and feature structure, but this
  pass did not copy official screenshot pixels or inspect private app DOM.
- Future variants should separately model completion, failed-check, PR feedback,
  Cloud task, Handoff dialog, appshot attachment, artifact preview, and
  integrated terminal drawer states.
