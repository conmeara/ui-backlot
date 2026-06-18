# Terminal CLI Fidelity Pass 093

Date: 2026-06-18.

## Purpose

Improve the editable terminal and agent-CLI surfaces so Codex CLI, Claude Code,
approval prompts, diffs, streaming command output, status rows, and composed
Claude-plus-terminal workflows feel reusable for demo videos while remaining
hand-authored HTML/CSS.

## References

- Local Codex CLI:
  - `codex --version` -> `codex-cli 0.139.0`.
  - `codex --help` -> current command inventory includes `exec`, `review`,
    `mcp`, `plugin`, `app-server`, `remote-control`, `doctor`, `apply`,
    `resume`, `archive`, `unarchive`, `fork`, `cloud`, `exec-server`,
    `features`, and `help`.
- Local Claude Code CLI:
  - `claude --version` -> `2.1.117 (Claude Code)`.
  - `claude --help` -> current CLI supports modes and flags such as `--print`,
    `--permission-mode`, `--allowedTools`, `--tools`, `--model`, `--resume`,
    `--continue`, `--worktree`, `--tmux`, and plugin/MCP options.
- Current generated captures from this worktree:
  - `captures/surface-codex-terminal/target.png`.
  - `captures/surface-claude-code-terminal-session/target.png`.
  - `captures/surface-claude-codex-terminal-workflow/target.png`.
- Public docs used as product-behavior references, not copied assets:
  - OpenAI Codex CLI overview: https://developers.openai.com/codex/cli.
  - OpenAI Codex command reference: https://developers.openai.com/codex/cli/reference.
  - OpenAI Codex approvals and sandboxing: https://developers.openai.com/codex/agent-approvals-security.
  - Claude Code CLI reference: https://docs.anthropic.com/en/docs/claude-code/cli-reference.
  - Claude Code terminal configuration: https://docs.anthropic.com/en/docs/claude-code/terminal-config.
  - Claude Code interactive mode: https://docs.anthropic.com/en/docs/claude-code/interactive-mode.

## Before Deltas

1. `compositions/codex-terminal.html` titlebar named Codex but did not show the
   shell context, making it read less like a macOS Terminal tab.
2. Codex prompt used `danger-full-access` and `never`, which is useful for this
   run but poor demo grammar for approvals and sandboxing.
3. Codex command inventory was stale: it omitted `unarchive`, `exec-server`,
   `features`, and `help`.
4. Codex side panel was a generic patch checklist rather than a diff-like
   preview.
5. Codex terminal had no explicit approval row, despite approvals being a core
   agent-CLI visual state.
6. Codex transcript rows read like a static dashboard instead of a streaming
   terminal session.
7. Claude Code terminal showed stale `v2.1.42` instead of local `2.1.117`.
8. Claude Code terminal titlebar had oversized traffic lights and no tab/title
   metadata.
9. Claude Code terminal was locked to a public Figma workflow transcript rather
   than the terminal-refinement task requested in this thread.
10. Claude Code terminal did not show a permission/approval event, even though
    its CLI exposes permission modes and tool allow/deny controls.
11. Claude Code terminal had no inline diff preview state.
12. Claude-plus-Codex workflow placed the Claude pane over too much of the
    terminal prompt/output area, reducing terminal legibility in the hero frame.

## Changes

- Updated `compositions/codex-terminal.html`.
  - Added shell context to the titlebar.
  - Changed the session metadata to `workspace-write`, `approval on-request`,
    and `network gated` language.
  - Added a terminal approval row with an `approve once` action.
  - Converted the side panel from generic patch cards into a diff preview with
    context, add, and remove rows.
  - Updated command inventory to match the current local `codex --help`.
  - Tightened vertical spacing so the approval row and command output fit in the
    capture without losing the cursor state.
- Updated `compositions/claude-code-terminal-session.html`.
  - Updated visible Claude Code version to `2.1.117`.
  - Added macOS Terminal-style title metadata and a `plan` mode chip.
  - Reduced poster-sized type into denser terminal transcript rhythm.
  - Replaced the Figma-only transcript with terminal-specific read, bash,
    approval, edit, diff, and running-check states.
  - Added a bottom command prompt with cursor and keyboard-hint line.
- Updated `compositions/claude-codex-terminal-workflow.html`.
  - Repositioned and rescaled the Claude and Codex terminal components so both
    surfaces stay readable in the hero capture.
  - Adjusted cursor/click-ring coordinates to match the new layout.

## Asset Decision

No proprietary app code, product screenshots, private terminal transcripts,
account data, Claude/Codex app assets, or copied Terminal UI assets were added.
The pass uses live local CLI metadata, public documentation, and generated
captures as references while keeping the surfaces editable HTML/CSS.

## Capture Evidence

- `npm run capture:codex-terminal`
  - Passed and refreshed `captures/surface-codex-terminal/target.png`.
- `npm run capture:claude-code-terminal-session`
  - Passed and refreshed
    `captures/surface-claude-code-terminal-session/target.png`.
- `npm run capture:claude-codex-terminal-workflow`
  - Passed and refreshed
    `captures/surface-claude-codex-terminal-workflow/target.png`.

## Remaining Deltas

- A sanitized real interactive Codex TUI screenshot would still improve exact
  composer spacing, slash-command menu shape, and approval-button copy.
- A sanitized real Claude Code interactive screenshot would improve exact
  color, separator, and spinner rhythm.
- Future variants should split terminal states into reusable child components:
  prompt line, approval row, diff hunk, command stream, task list, and status
  footer.
- The workflow wrapper still freezes child component states through parent
  positioning instead of driving child timelines directly.
