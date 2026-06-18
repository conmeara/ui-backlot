# Codex App Screenshot References

Date sourced: 2026-06-18.

These files are official OpenAI Codex app screenshots downloaded from
`developers.openai.com` for visual reference only. They must not be copied into
editable surfaces as product pixels, CSS, icons, or app assets. Use them as
reference plates for hand-authored HTML/CSS reconstruction.

## Sources

| File | Size | Source page | Original URL | Fidelity use |
| --- | ---: | --- | --- | --- |
| `app-screenshot-light.webp` | 3600x2026 | [Codex app](https://developers.openai.com/codex/app) | `https://developers.openai.com/images/codex/app/app-screenshot-light.webp` | Primary light-mode shell: sidebar, active thread, review pane, top chrome, spacing, typography, icon scale. |
| `app-screenshot-dark.webp` | 3598x2024 | [Codex app](https://developers.openai.com/codex/app) | `https://developers.openai.com/images/codex/app/app-screenshot-dark.webp` | Primary dark-mode shell: dark theme values, contrast, density, active pane hierarchy. |
| `multitask-light.webp` | 1172x660 | [Codex app features](https://developers.openai.com/codex/app/features#multitask-across-projects) | `https://developers.openai.com/images/codex/app/multitask-light.webp` | Project sidebar and multiple-thread density. |
| `modes-light.webp` | 1156x650 | [Codex app features](https://developers.openai.com/codex/app/features#modes) | `https://developers.openai.com/images/codex/app/modes-light.webp` | New-thread composer and Local/Worktree/Cloud mode controls. |
| `git-commit-light.webp` | 2172x1222 | [Codex app features](https://developers.openai.com/codex/app/features#built-in-git-tools) | `https://developers.openai.com/images/codex/app/git-commit-light.webp` | Review pane, diff rows, staging/commit controls, Git action hierarchy. |
| `worktree-light.webp` | 1424x802 | [Codex app features](https://developers.openai.com/codex/app/features#worktree-support) and [Worktrees](https://developers.openai.com/codex/app/worktrees) | `https://developers.openai.com/images/codex/app/worktree-light.webp` | Worktree thread header, branch actions, worktree details, handoff mental model. |
| `integrated-terminal-light.webp` | 1962x1104 | [Codex app features](https://developers.openai.com/codex/app/features#integrated-terminal) | `https://developers.openai.com/images/codex/app/integrated-terminal-light.webp` | Terminal drawer proportions and top-right terminal affordance. |
| `computer-use-approval-light.webp` | 3984x2696 | [Codex app features](https://developers.openai.com/codex/app/features#computer-use) | `https://developers.openai.com/images/codex/app/computer-use-approval-light.webp` | Permission/approval card structure and button style. |
| `artifact-viewer-light.webp` | 3984x2696 | [Codex app features](https://developers.openai.com/codex/app/features#richer-outputs-and-artifacts) | `https://developers.openai.com/images/codex/app/artifact-viewer-light.webp` | Sidebar/artifact preview and generated-file panel treatment. |
| `in-app-browser-light.webp` | 3976x2688 | [Codex app features](https://developers.openai.com/codex/app/features#in-app-browser) | `https://developers.openai.com/images/codex/app/in-app-browser-light.webp` | In-app browser layout and comment affordances for future variants. |

## Immediate Visual Corrections For `codex-app`

1. Replace the current dark left rail with the official light shell if the target
   clip is light-mode app UI.
2. Rebuild iconography from primitive strokes closer to Codex's real sidebar and
   toolbar icons; avoid letter-in-square stand-ins except where the screenshot
   shows an avatar.
3. Tighten typography to match the app screenshots: smaller labels, lower
   heading weight, denser rows, and less marketing-like emphasis.
4. Rebalance layout proportions against the primary screenshot: sidebar width,
   central thread width, review pane width, and top chrome heights should be
   measured from the reference plates.
5. Make the review pane closer to `git-commit-light.webp`: file rows, hunk
   background, commit controls, and action buttons need a full visual pass.
6. Make the new-thread/composer controls closer to `modes-light.webp`, especially
   mode selector placement, pill shape, placeholder scale, and send controls.
7. Use `worktree-light.webp` for branch/worktree controls instead of generic
   "Worktree" pills.
8. Keep Appshots, terminal, browser, approval, and artifact states as separate
   variants after the main shell matches the primary screenshots.
