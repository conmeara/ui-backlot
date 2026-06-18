# HyperFrames Website Workflow

Last researched: 2026-06-17.

## Public Sources

Main repo:

- https://github.com/heygen-com/hyperframes
- Local sparse clone, kept outside this project so HyperFrames Studio does not
  scan it as a composition:
  `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/hyperframes`
- Checked commit: `2980906`

Demo repo:

- https://github.com/heygen-com/website-to-hyperframes-demo
- Local clone, also kept outside the project scan path:
  `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/website-to-hyperframes-demo`
- Checked commit: `b308aa0`

Docs:

- Website-to-video guide:
  https://hyperframes.heygen.com/guides/website-to-video
- CLI quick reference:
  https://github.com/heygen-com/hyperframes/blob/main/docs/guides/video-editor-cheatsheet.mdx

## What Exists Upstream

Yes: the workflow the user remembered exists.

Current upstream naming is `/website-to-video`. The older launch/demo repo calls
it `website-to-hyperframes`, but it is the same conceptual lane: give an agent a
URL and creative direction; the agent captures the website, extracts design
tokens/assets, writes planning artifacts, builds HTML/GSAP compositions, previews,
validates, and renders.

The current upstream skill lives at:

- `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/hyperframes/skills/website-to-video/SKILL.md`

The demo launch video source lives at:

- `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/website-to-hyperframes-demo/index.html`
- `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/website-to-hyperframes-demo/SCRIPT.md`
- `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/website-to-hyperframes-demo/STORYBOARD.md`
- `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/website-to-hyperframes-demo/compositions/`

## The Pipeline Shape

The upstream guide describes this pipeline:

1. Capture website into `capture/`.
2. Write `DESIGN.md`.
3. Write `SCRIPT.md`.
4. Write `STORYBOARD.md`.
5. Generate voiceover and `transcript.json`.
6. Build `compositions/*.html`.
7. Validate with lint, runtime checks, snapshots, preview, and optional render.

The manual capture command is:

```bash
npx hyperframes capture https://example.com
```

Important captured materials:

- Scroll screenshots.
- Dominant/computed colors.
- Fonts and downloadable font files.
- Images, SVGs, Lottie animations, and video previews.
- Visible text.
- Web animations and scroll-triggered motion.
- Page sections and CTAs.

For UI Backlot, this maps directly to the thing we need: an agent-friendly way to
turn real software/web UIs into structured source material, then rebuild the
video as deterministic HTML instead of live screen recording.

## Relevance To UI Backlot

We should not copy the website-to-video workflow wholesale as the only
architecture. It is built for "turn a URL into a promotional/site video." UI
Backlot needs "turn an app workflow into a repeatable instructional demo."

But we should reuse the operating pattern:

- Capture first, then generate a structured design/reference artifact.
- Preserve a `DESIGN.md`-style truth source for every recreated app surface.
- Keep `SCRIPT.md` and `STORYBOARD.md` as separate gates.
- Build HTML scene compositions that can be previewed, snapshotted, linted, and
  rendered.
- Treat screenshots/videos as source plates, not as the final production surface.

## Pieces To Reuse Or Adapt

From `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/hyperframes`:

- `skills/website-to-video/references/step-0-capture.md` for capture discipline.
- `skills/website-to-video/references/step-1-design.md` for brand/design-token
  extraction.
- `skills/website-to-video/references/step-5-build.md` for composition build
  gates.
- `skills/website-to-video/scripts/w2h-verify.mjs` for validation ideas.
- `docs/guides/video-editor-cheatsheet.mdx` for CLI/timeline primitives.
- `skills/hyperframes-animation/` for animation blueprints and reusable motion
  patterns.
- `skills/hyperframes-media/` for media handling and overlay workflows.

From `/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories/website-to-hyperframes-demo`:

- `index.html` as a compact example of a root composition with audio, nested
  scenes, and clips.
- `compositions/act-1-cold-open.html` as a good reference for terminal/agent
  typing animation.
- `compositions/act-3-clips/` as a reference for using captured website/video
  plates in a deterministic timeline.
- `SCRIPT.md` and `STORYBOARD.md` as examples of how much planning structure is
  enough for an agent-built launch video.

## Local Environment Check

Current machine has the core prerequisites:

- Node.js: `v24.5.0`
- FFmpeg: `8.0.1`

That satisfies the upstream demo requirements of Node.js 22+ and FFmpeg.

## Recommendation

For UI Backlot, make a new skill/workflow that is parallel to `/website-to-video`
rather than pretending websites and desktop workflows are the same:

```text
/app-workflow-to-hyperframes
```

First version:

1. Intake: describe the app workflow and target audience.
2. Capture: screenshots/video references for the app surface.
3. Surface spec: `SURFACES.md` for Claude/Codex, macOS shell, Finder, browser,
   PowerPoint, Airtable, Figma, etc.
4. Script: instructional narration and on-screen beats.
5. Storyboard: app state per beat, cursor movement, typed text, tool progress,
   generated files, and app switches.
6. Build: HyperFrames HTML compositions using reusable UI components.
7. Validate: lint, snapshot, visual review, then render.

This gives us the same agent-friendly production loop, but tuned for
instructional agent workflow videos instead of generic website promos.
