# UI Backlot

UI Backlot is a workspace for scripted product-demo videos. The core idea is to
rebuild the software surfaces we want to teach as deterministic React/HTML
scenes, then render those scenes with Remotion or HyperFrames instead of relying
on fragile live screen recordings.

The project is capture-first: reference videos set the taste bar, but live apps,
DOM/CSS, screenshots, and accessibility trees are the preferred source of truth
for rebuilding editable UI surfaces.

Open-source UI projects are now an explicit refinement lane. Use them as
reference material and component donors for macOS, Claude/chat, browser, and
Office-like surfaces, with license checks before copying code or assets.

The canonical working goal is tracked in [GOAL.md](GOAL.md). It includes the
donor-repo mandate and the current Claude + Finder + PowerPoint vertical slice.

The focused target is a Claude-on-Mac demo environment:

- A Claude assistant surface.
- A macOS desktop and Finder shell.
- A PowerPoint-like presentation editor surface, with exact PowerPoint capture
  still pending.
- Reusable motion primitives for typing, cursor movement, drag/drop, file
  selection, tool calls, agent progress, and app switching.

Current editable surface:

- [index.html](index.html) - current 16 second HyperFrames composition.
- [styles/workflow.css](styles/workflow.css) - visual styling for the current
  composition.
- [compositions/presentation-editor.html](compositions/presentation-editor.html)
  - mounted PowerPoint-like editor sub-composition.
- [compositions/browser-app.html](compositions/browser-app.html)
  - mounted browser/app sub-composition derived from the standalone browser lab.
- [assets](assets) - local asset notes. Font binaries copied from installed apps
  are intentionally local-only and ignored by git.
- [reference/open-source](reference/open-source) - local donor-repo clone area.
  Restore ignored donor clones with `tools/clone-reference-repos.sh`.
- [reference/claude](reference/claude) - local-only Claude launch media notes.
  Downloaded videos, screenshots, and extracted frames are ignored by git.
- [surfaces/claude-mac-finder.html](surfaces/claude-mac-finder.html)
- [surfaces/browser-app-surface.html](surfaces/browser-app-surface.html)
- [surfaces/README.md](surfaces/README.md)
- [PRIMITIVES.md](PRIMITIVES.md)

Research starts in:

- [docs/research/claude-release-video-references.md](docs/research/claude-release-video-references.md)
- [docs/research/hyperframes-website-workflow.md](docs/research/hyperframes-website-workflow.md)
- [docs/research/open-source-ui-donor-repos.md](docs/research/open-source-ui-donor-repos.md)
- [docs/workflows/capture-first-ui-reconstruction.md](docs/workflows/capture-first-ui-reconstruction.md)
- [docs/workflows/target-surface-inventory.md](docs/workflows/target-surface-inventory.md)

Useful commands:

```bash
npm run capture:web -- <url-or-local-file> --slug <name> [--selector "main"]
npm run capture:surface
npm run capture:finder
npm run capture:browser-app
npm run compare:finder
npm run compare:sheets
npm run hf:lint
npm run hf:validate
npm run hf:inspect
npm run hf:snapshot
npm run hf:render
```

Current render artifact:

- `renders/claude-keynote-workflow-draft.mp4`

The render filename is historical; the current composition content is focused on
Claude, Finder, a browser/app background surface, and a PowerPoint-like
presentation editor.
