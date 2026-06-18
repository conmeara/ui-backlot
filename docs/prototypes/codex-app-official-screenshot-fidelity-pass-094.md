# Codex App Official Screenshot Fidelity Pass 094

Date: 2026-06-18.

## Purpose

Move `compositions/codex-app.html` from a feature-correct but visually generic
Codex surface toward the actual OpenAI Codex app screenshot plates. The previous
pass had the right concepts but the wrong font weight, dark sidebar, icon
language, layout density, composer shape, and review-pane feel.

## Reference Plates

Official screenshots were sourced into `reference/codex/app-screenshots/` and
documented in `reference/codex/app-screenshots/README.md`. The primary visual
targets for this pass were:

- `app-screenshot-light.webp`: primary shell, sidebar, thread, composer, toolbar,
  and review pane.
- `git-commit-light.webp`: Git/review pane structure, hunk colors, file rows,
  and action controls.
- `modes-light.webp`: composer mode/permission controls and prompt-entry density.
- `worktree-light.webp`: worktree/thread footer and branch metadata direction.

These images were used as reference plates only. No screenshot pixels, official
icons, product CSS, app code, or private account data were copied into the
editable surface.

## Screenshot-To-Surface Deltas

1. Reference sidebar is pale blue; previous surface used a heavy dark sidebar.
2. Reference sidebar starts with traffic lights plus sidebar/back/forward icons;
   previous surface jumped directly into brand and thread controls.
3. Reference does not show a large Codex brand row in the sidebar; previous
   surface did.
4. Reference primary actions are New chat, Search, Plugins, Automations;
   previous surface used Threads, Worktrees, Automations, Skills.
5. Reference row icons are small thin strokes; previous surface used larger
   chunky glyphs and colored dots.
6. Reference has Pinned, Projects, and Chats groups; previous surface used
   Projects and Today thread cards.
7. Reference selected sidebar rows are very subtle gray-blue fills; previous
   selected rows were high-contrast dark pills.
8. Reference project rows use folder icons and no colored status dots; previous
   rows used colored circles.
9. Reference titlebar has a single app toolbar across thread and review panes;
   previous surface had separate center header and review header.
10. Reference topbar title is small and sentence-like, with the project name as
    secondary text; previous title was oversized and hero-like.
11. Reference toolbar uses compact icon buttons, VS Code selector, Commit
    control, terminal icon, diff count, and layout toggle; previous toolbar was
    generic terminal/menu buttons.
12. Reference central prompt is a compact right-aligned gray pill; previous user
    prompt was a large card with avatar and attachments.
13. Reference shows "previous messages" as a simple link; previous surface had
    none.
14. Reference assistant response is plain text with inline links/code; previous
    response contained agent cards and status dashboards.
15. Reference change summary is a flat gray list near the bottom; previous
    surface used Plan/Tool/Approval cards as primary content.
16. Reference composer is a large rounded input with bottom controls; previous
    composer used segmented Local/Worktree/Cloud chips and Appshot/Auto context.
17. Reference composer controls are Default permissions, model, effort, mic,
    send; previous controls were more speculative and not screenshot-matched.
18. Reference footer shows Work locally and branch; previous footer had no
    low-density local/branch row.
19. Reference review pane starts with compact Review heading and tool icons;
    previous review pane started with large "3 files changed" and summary cards.
20. Reference review scope is "Unstaged 4" with tiny dropdown/menu controls;
    previous surface used tab buttons.
21. Reference diff view is code-first with line numbers, fold rows, and red/green
    hunk backgrounds; previous surface used simplified file cards.
22. Reference hunk text uses a smaller monospace scale and denser line rhythm;
    previous code rows were looser and more dashboard-like.
23. Reference review actions float at bottom right as Revert all / Stage all;
    previous Stage all was a large header button.
24. Reference color is mostly neutral white, blue-gray, soft green/red, and black
    text; previous surface used high-saturation status colors and dark contrast.
25. Reference overall density is higher with smaller type and lower shadows;
    previous surface had larger cards, heavier shadows, and more whitespace.

## Changes

- Rebuilt `compositions/codex-app.html` around the official light-mode shell.
  - Light blue sidebar with traffic lights, back/forward controls, New chat,
    Search, Plugins, Automations, Pinned, Projects, Chats, and Settings.
  - Single topbar across active thread and review pane.
  - Compact active thread title, project name, toolbar controls, VS Code pill,
    Commit selector, terminal icon, diff count, and layout toggle.
  - Screenshot-like central thread with prompt bubble, previous-message link,
    plain assistant text, inline links/code, change summary card, composer, and
    work-local/branch footer.
  - Screenshot-like Review pane with Review header, Unstaged scope, code hunk
    rows, red/green diff backgrounds, fold rows, and floating Revert all/Stage
    all actions.
  - Replaced colored status-dot UI with thin CSS icons and denser app-like row
    styling.
- Updated `surfaces/registry.json` so `codex-app` points to this pass and lists
  the official screenshot references.
- Updated `SURFACES.md` to describe the current screenshot-informed direction.

## Before / Reference / After

- Before this fidelity pass: `captures/surface-codex-app-before/target.png`
  showed the older dark-sidebar Codex reconstruction.
- Reference: `reference/codex/app-screenshots/app-screenshot-light.webp` and
  `reference/codex/app-screenshots/git-commit-light.webp`.
- After this pass: `captures/surface-codex-app/target.png` shows the new
  editable light-mode reconstruction.

## Verification

- `npm run capture:codex-app`
  - Passed and refreshed `captures/surface-codex-app/target.png`.
  - Visual inspection confirmed the surface now uses the light screenshot shell,
    review pane, composer, toolbar, and sidebar structure without incoherent
    overlap in the 1380x900 capture.
- `npm run registry:check`
  - Passed.
  - `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`

## Remaining Deltas

- Icons are still CSS approximations rather than exact vector matches.
- Exact SF Pro metrics, antialiasing, and line-height cannot be guaranteed in
  the browser capture without system font parity.
- The official screenshot content is synthetic and not this user's live account;
  a private sanitized capture would still be needed for exact local project
  state, live installed version, and account-specific UI.
- Dark mode, artifact viewer, computer-use approval, browser, integrated
  terminal, and worktree-specific variants should become separate states rather
  than overloading this primary light-mode shell.
