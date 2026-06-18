# Claude Current Reference Fidelity Pass 093

Date: 2026-06-18

## Reference Sources

This pass used public/reference material only. No Claude product code, private assets, or live user content were copied.

1. Anthropic Claude Code product page, opened 2026-06-18: `https://claude.com/product/claude-code`
   - Useful cues: desktop app positioning, Claude Code on desktop image alt text, multiple parallel sessions, review/diff/server/PR workflow language, and current desktop availability.
2. Simon Willison Cowork write-up, opened 2026-06-18: `https://simonwillison.net/2026/Jan/12/claude-cowork/`
   - Useful cues: Cowork tab layout, Progress / Artifacts / Context / Connectors / Working files rail, running-command card, request JSON, bottom model selector, and Opus 4.5 state.
3. Anthropic Projects announcement, opened 2026-06-18: `https://www.anthropic.com/news/projects`
   - Useful cues: Projects in the left-side panel, Artifacts appearing beside the conversation, and side-by-side chat plus artifact composition.
4. Claude Help Center Artifacts article, opened 2026-06-18: `https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them`
   - Useful cues: artifacts in a dedicated right-side window, artifact sidebar access, edit/iterate semantics, and plan availability.
5. Anthropic Opus 4.5 announcement, opened 2026-06-18: `https://www.anthropic.com/news/claude-opus-4-5`
   - Useful cues: Claude Code available in desktop app, parallel local/remote sessions, and Opus 4.5 product state.

Local `reference/claude/` contains only a README in this worktree, so the source evidence for this pass is public web/reference material plus fresh local captures.

## Baseline Captures

- `captures/surface-claude-app/target.png`
- `captures/surface-claude-composed-app/target.png`
- `captures/surface-claude-chat-shell/target.png`

## Concrete Deltas Found

1. The right context rail in `claude-app` was too faint, narrow, and low-contrast compared with Cowork screenshots.
2. The rail title used generic `Task`; public Cowork references label the right column as progress-oriented state.
3. The central assistant response was oversized and poster-like, especially in `claude-chat-shell`, making the surface feel like a marketing still rather than a working app.
4. Running/action cards were labeled as abstract reasoning and local plan preview instead of visible command/request/response states.
5. The command response payload was hidden in the main `claude-app` capture, losing an important Cowork-style working trace.
6. The composer was too tall and large relative to the desktop references.
7. The full app and componentized app used `Claude Sonnet 4.6`; current public Cowork/desktop references point this scenario toward `Opus 4.5`.
8. The composed wrapper gave the right rail too little width after mounting, which weakened the Progress / Artifacts / Context hierarchy.
9. The top-level app window radius and shadow were more stylized than native desktop app surfaces.
10. The active step copy said `Prepare slides`; public Cowork references read better as direct task progress, so the visible step needed to become a concrete operation.
11. The standalone composer component did not inherit the tighter scale needed by the composed app shell.
12. The chat shell had large empty-space typography and a very tall composer that reduced its value as a reusable production surface.

## Addressed In This Pass

- Made the right rail more legible and representative: wider in `claude-app`, stronger contrast, `Progress` heading, clearer working status, tighter progress circles, and more direct active-step copy.
- Shifted the thread from oversized answer copy toward a denser Cowork working state with smaller serif response type.
- Replaced abstract `Reading the selected context` / `Local plan preview` labels with `Running command`, `Request JSON`, and `Response` states.
- Restored visible command output in the full app capture.
- Updated visible model chips in touched Claude surfaces to `Opus 4.5`.
- Tightened composer height, placeholder size, control size, and composed-app slot scale.
- Adjusted `claude-composed-app` slot geometry so modular `sidebar`, `thread-core`, `composer`, and `agent-rail` stay balanced when imported together.
- Reduced the plain chat shell's oversized reply/composer treatment while preserving the reusable shell.

## After Captures

- `npm run capture:claude-app`
- `npm run capture:claude-composed-app`
- `npm run capture:claude-chat-shell`
- `npm run capture:claude-thread-core`
- `npm run capture:claude-composer`
- `npm run capture:claude-agent-rail`

## Remaining Deltas

1. The full app still lacks a true artifact-preview split pane; it represents artifact metadata in the rail, not an editable artifact window.
2. Sidebar density is closer, but the exact current Claude desktop IA may differ by account, plan, and enabled features.
3. The command/request card is hand-rebuilt and representative, not copied from live product DOM.
4. The monolithic `claude-app` and modular `claude-thread-core` still duplicate some markup and CSS; a later pass should consider a shared primitive source if this repo moves beyond standalone HTML.
5. The capture set does not include sanitized live-app inspection because this worktree had no safe live Claude capture provided.
6. The home surfaces were not materially changed in this pass; they should get their own current-home fidelity pass against fresh references.
