# Claude Release Video References

Last researched: 2026-06-17.

## Why these references matter

Anthropic and Claude's recent launch clips are useful because they show a
repeatable product-video pattern: rebuild the product UI as a controlled scene,
animate a scripted workflow, and publish the result as a short social video. For
UI Backlot, we should use the clips as motion and structure references, not as
assets to ship.

Official context:

- Claude release notes list the recent launch sequence: Fable 5 on 2026-06-09,
  Fable/Mythos access suspension on 2026-06-12, Opus 4.8 on 2026-05-28, Claude
  Design on 2026-04-17, and computer use in Cowork/Claude Code on 2026-03-23.
  Source: https://support.claude.com/en/articles/12138966-release-notes
- Claude Design launched as a visual creation product for designs, prototypes,
  slides, one-pagers, and related visual work. It supports import from files,
  websites, codebases, brand systems, direct editing, exports, and handoff to
  Claude Code. Source:
  https://www.anthropic.com/news/claude-design-anthropic-labs
- Dynamic workflows in Claude Code were announced on 2026-05-28. The product
  page describes orchestration scripts, tens to hundreds of parallel subagents,
  resumable long-running work, and the current `ultracode` entry point. Source:
  https://claude.com/blog/introducing-dynamic-workflows-in-claude-code

## High-value social references

Metadata below was pulled from public X post metadata. Keep the X post URL as
the durable source handle. Direct media URLs are for inspection only and should
not be vendored unless we have explicit rights.

| Date | Account | Topic | Format | Duration | Source |
| --- | --- | --- | --- | ---: | --- |
| 2026-06-17 | @claudeai | Claude Design beta: brand systems, direct canvas edits, Claude Code sync, tool connections | Image, 3840x2160 | n/a | https://x.com/claudeai/status/2067325887909884315 |
| 2026-05-28 | @ClaudeDevs | Claude Code dynamic workflows research preview | Image, 3840x2160 | n/a | https://x.com/ClaudeDevs/status/2060044853279617150 |
| 2026-04-17 | @claudeai | Introducing Claude Design | Video, 1920x1080 | 81.5s | https://x.com/claudeai/status/2045156267690213649 |
| 2026-04-14 | @claudeai | Redesigned Claude Code desktop with multi-session sidebar | Video, 3840x2160 source, 2560x1440 mp4 variant | 37.116s | https://x.com/claudeai/status/2044131493966909862 |
| 2026-03-23 | @claudeai | Computer use in Claude Cowork and Claude Code on macOS | Video, 3840x2160 source, 1920x1080 mp4 variant | 73.333s | https://x.com/claudeai/status/2036195789601374705 |
| 2026-02-18 | @claudeai | Push Claude Code prototype into Figma through MCP | Video, 3840x2160 source, 1920x1080 mp4 variant | 30s | https://x.com/claudeai/status/2024148286844649887 |
| 2026-02-17 | @claudeai | Claude Sonnet 4.6 launch | Video, 1280x720 source, 1920x1080 mp4 variant | 89.166s | https://x.com/claudeai/status/2023817132581208353 |
| 2025-06-18 | @AnthropicAI | Claude Code remote MCP servers | Video, 2160x2160 source, 1080x1080 mp4 variant | 20s | https://x.com/AnthropicAI/status/1935367951542280239 |
| 2025-05-22 | @AnthropicAI | Claude Code general availability | Video, 1920x1080 | 28.995s | https://x.com/AnthropicAI/status/1925591519882555814 |
| 2025-02-24 | @AnthropicAI | Claude 3.7 Sonnet and Claude Code | Video, 1920x1080 | 39.866s | https://x.com/AnthropicAI/status/1894092430560965029 |

Direct media handles for frame study:

- Claude Design launch:
  https://video.twimg.com/amplify_video/2045155754038935553/vid/avc1/1920x1080/X8tXHs1RLlKGlJJS.mp4?tag=21
- Claude Code desktop redesign:
  https://video.twimg.com/amplify_video/2044127347616407552/vid/avc1/2560x1440/KRnAlP4drTrKYDYo.mp4?tag=21
- Computer use:
  https://video.twimg.com/amplify_video/2036187400414830594/vid/avc1/1920x1080/TZcHG66FFn4n6Qyn.mp4?tag=21
- Claude Code to Figma:
  https://video.twimg.com/amplify_video/2024146563333758976/vid/avc1/1920x1080/zEiHWB5QAmfOABqe.mp4?tag=21
- Sonnet 4.6 launch:
  https://video.twimg.com/amplify_video/2023814057418219520/vid/avc1/1920x1080/UNjYoVpWA7Bw3jZ-.mp4?tag=21
- Remote MCP servers:
  https://video.twimg.com/amplify_video/1935366858342854656/vid/avc1/1080x1080/-4-ZKZuEtuCEJI_f.mp4?tag=21
- Claude Code GA:
  https://video.twimg.com/amplify_video/1925590661543399424/vid/avc1/1920x1080/WLjhyaNgc0rO6xxk.mp4?tag=21
- Claude 3.7 Sonnet and Claude Code:
  https://video.twimg.com/ext_tw_video/1894085955373408256/pu/vid/avc1/1920x1080/yuYTzv9e50tafq5V.mp4?tag=14

Local reference copies:

- `reference/claude/videos/2026-04-17-claude-design-launch.mp4`
- `reference/claude/videos/2026-04-14-claude-code-desktop-redesign.mp4`
- `reference/claude/videos/2026-03-23-claude-computer-use.mp4`
- `reference/claude/videos/2026-02-18-claude-code-to-figma.mp4`
- `reference/claude/videos/2026-02-17-claude-sonnet-4-6-launch.mp4`
- `reference/claude/videos/2025-06-18-claude-code-remote-mcp.mp4`
- `reference/claude/videos/2025-05-22-claude-code-ga.mp4`
- `reference/claude/videos/2025-02-24-claude-3-7-sonnet-code.mp4`
- `reference/claude/images/2026-06-17-claude-design-beta.jpg`
- `reference/claude/images/2026-05-28-claude-code-dynamic-workflows.png`

## Creative pattern observed

The strongest clips are not ordinary screen captures. They look like scripted UI
reconstructions:

- Crisp, stable browser or app chrome with no accidental cursor drift.
- Only the needed UI is modeled; background OS details are simplified.
- Short task arc: prompt, agent progress, app switch or external tool, result.
- Large, readable UI states at social-video sizes.
- Camera remains mostly locked; motion comes from panels, cursors, typing,
  progress rows, previews, and subtle zoom/crop changes.
- Copy is spare. The UI itself carries most of the story.

## Recommended UI Backlot approach

Build a layered scene system rather than one-off screen recordings:

1. `Stage`: aspect ratio, background, virtual camera, and social-safe crop
   guides.
2. `MacShell`: desktop wallpaper, menu bar, dock, window chrome, Finder window,
   file picker, notifications, and app switcher.
3. `AppSurfaces`: Claude, Codex, browser, Finder, PowerPoint, Airtable, Figma,
   and Premiere-like panels as composable React views.
4. `WorkflowScript`: JSON/TS timelines for typing, clicks, drags, app switches,
   tool calls, progress updates, and generated artifacts.
5. `Renderer`: Remotion or HyperFrames composition that maps workflow events to
   deterministic animation.
6. `Inspector`: a local browser preview to pause at any frame, inspect text fit,
   and export stills for review.

For the first vertical slice, recreate the Claude Code desktop redesign clip:

- It is short enough at 37s.
- It is mostly one app surface.
- The sidebar, multi-session layout, terminal-like content, and progress rows
  are reusable for future Claude/Codex videos.
- It lets us prove the agent-video pipeline before adding Finder, PowerPoint,
  browser apps, Figma, or Premiere.

## Rebuild strategy for app UIs

Use three levels of fidelity:

- Code-native surfaces for apps we will demo repeatedly: Claude/Codex, Finder,
  browser shell, file picker, PowerPoint-like slides, Figma-like canvas.
- Screenshot plates for complex third-party app interiors when exact fidelity
  matters and interaction is minimal.
- Hybrid plates for expensive apps like Premiere: static panel screenshots with
  code-rendered overlays for cursor, selection boxes, progress, captions, and
  exported media.

The rule of thumb: if we need to change content, animate state, or reuse the
workflow often, rebuild it in React. If we only need a believable background,
use a screenshot plate and put code on top.

## Immediate next build tasks

1. Scaffold a React + Remotion project.
2. Build a `MacShell` component with menu bar, dock, and resizable app window.
3. Build a `ClaudeDesktop` component with left session rail, main transcript,
   composer, agent-progress rows, and terminal/code preview blocks.
4. Add a workflow timeline format with typed text, cursor movement, click
   targets, panel transitions, and generated output.
5. Render a 10-15 second proof clip inspired by the Claude Code desktop
   redesign reference.
