# Codex CLI Public Screenshot Fidelity Pass 094

Date: 2026-06-18.

## Purpose

The previous Codex terminal component still looked like an invented agent
dashboard. This pass reshapes it around public Codex CLI screenshots and leaves
the Claude Code terminal session largely intact because its light Claude Code
reference direction already reads well.

## Public References

- Official `openai/codex` README screenshot:
  - https://github.com/openai/codex/raw/main/.github/codex-cli-splash.png
  - Used as the main Codex visual source: light macOS titlebar, single dark TUI,
    bordered OpenAI Codex header, model/directory rows, grey prompt band,
    bullet transcript, cyan command/link accents, and bottom composer shortcuts.
- OpenAI Codex CLI features:
  - https://developers.openai.com/codex/cli/features
  - Used for behavior states: interactive full-screen TUI, inline approvals,
    diffs, slash commands, screenshots in composer, copy/history shortcuts.
- Public Claude Code terminal screenshot in Product Talk:
  - https://www.producttalk.org/claude-code-what-it-is-how-its-different/
  - Used as a broad Claude Code terminal reference; no assets copied.
- Public Claude Code terminal overview screenshot in Tw93:
  - https://tw93.fun/en/2026-03-12/claude.html
  - Used to confirm the current light Claude Code terminal panel is plausible:
    titlebar, Claude Code version header, onboarding/tips, command output, and
    context/tool lists.

## Current-Capture Deltas

1. Codex previously had a right-side dashboard pane; public Codex screenshots
   show a single full-screen terminal TUI.
2. Codex previously used card UI and pill chips; public screenshots use plain
   bordered terminal regions and text rows.
3. Codex titlebar previously looked like a custom app tab strip; the reference
   uses a light macOS terminal titlebar with traffic lights and folder/title.
4. Codex splash header previously used a decorative mark; the reference uses
   `>_ OpenAI Codex (v...)` text inside a bordered box.
5. Codex metadata previously used pill chips; the reference uses simple
   `model:` and `directory:` rows.
6. Codex prompt previously looked like a shell command line; the reference uses
   a full-width grey prompt band.
7. Codex transcript previously used sections such as `Plan`, `Tool Calls`, and
   `Verification`; the reference uses bullet-led transcript blocks.
8. Codex previously showed diff/approval as side cards; this pass moves them
   into inline TUI rows.
9. Codex previously overused warm clay/orange accents; the reference strongly
   uses cyan accents for commands, links, and shortcuts.
10. Codex previously lacked bottom composer chrome; the reference shows an
    input/composer row plus shortcut hints and token/context status.
11. Codex workflow wrapper inherited the prior dashboard look; after this pass
    the mounted child now reads as a real Codex TUI behind Claude.
12. Claude Code terminal still has exact-product gaps, but public screenshots
    support keeping the current light terminal direction as a plausible
    reference-backed surface.

## Changes

- Replaced the Codex terminal dashboard layout with a full-screen TUI layout in
  `compositions/codex-terminal.html`.
- Added a light macOS terminal titlebar matching the official Codex screenshot
  proportions more closely.
- Added a bordered OpenAI Codex splash/header block with model and directory
  rows.
- Added the grey prompt band, bullet transcript rows, updated-plan block,
  explored command tree, inline approval row, inline diff row, running status,
  and bottom composer/shortcut/status footer.
- Preserved editable HTML/CSS primitives for future extraction into reusable
  prompt, approval, diff, transcript, and composer components.

## Asset Decision

No public screenshot pixels, proprietary product assets, app source code,
private transcript content, account information, or copied Terminal UI assets
were added. The implementation is hand-authored HTML/CSS informed by public
screenshots and public docs.

## Verification

To run after this pass:

- `npm run capture:codex-terminal`
- `npm run capture:claude-codex-terminal-workflow`
- `npm run capture:claude-code-terminal-session`
- `npm run registry:check`
- `git diff --check`

## Remaining Deltas

- A real current Codex CLI screenshot from this user’s preferred theme would
  still improve exact type scale, line spacing, and composer copy.
- The official screenshot uses a purple marketing background outside the
  terminal; the component intentionally captures only the editable terminal
  window.
- Approval and diff rows remain representative because public docs describe
  inline approvals/diffs but the strongest available official screenshot is the
  splash/transcript state.
