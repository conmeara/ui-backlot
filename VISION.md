# UI Backlot Vision

UI Backlot should become the production backlot for agent-era software demos:
a code-native studio where Claude, Codex, and related workflow videos can be
planned, rebuilt, animated, rendered, revised, and shipped without depending on
perfect live screen recordings.

The core bet is simple: the best instructional and launch demos will not be
recorded one fragile take at a time. They will be assembled from editable
software sets.

## North Star

A creator should be able to describe a workflow, provide or capture a few real
app states, and generate a polished demo video from reusable UI surfaces:
Claude, Codex, Finder, browser apps, PowerPoint, Figma, Premiere, terminals,
documents, spreadsheets, and whatever other software the story requires.

The result should feel like a real product demo because the surfaces are based
on real applications, but it should be as editable as a motion-graphics project:
text, cursor moves, windows, files, tool calls, progress states, slides,
browser content, and before/after changes can all be scripted and refined.

## Why This Exists

Live screen recordings are expensive in the wrong places. They make the human
operator responsible for timing, cursor precision, clean data, window layout,
network behavior, app state, narration, and retakes. They also make iteration
painful: changing one line of copy or one UI state can require recording the
whole demo again.

UI Backlot moves that work into code. We capture the truth of real software,
rebuild the parts that need to be editable, and let agents produce many takes
quickly. The human becomes the director and taste filter instead of the person
trying to perform a perfect screen recording.

## Product Shape

At maturity, UI Backlot should include:

- A library of high-fidelity editable app surfaces.
- A primitive system for cursors, typing, dragging, clicking, tool calls,
  progress rows, app switching, focus pulls, and before/after changes.
- A capture pipeline for turning real app screenshots, DOM, accessibility
  trees, video frames, and design references into rebuildable UI components.
- A donor-repo research lane for mining open-source UI projects as reference
  material and component inspiration.
- A scene/story system that lets one workflow drive both a video render and
  optional real artifacts such as files, slides, docs, or datasets.
- A render pipeline using HyperFrames, Remotion, or both, with repeatable
  preview, lint, inspect, snapshot, and video output commands.
- A quality loop that compares prototypes against reference videos and real app
  captures instead of relying on vibes.

## First Vertical Slice

The first production-quality workflow is Claude on a Mac helping with a
PowerPoint-style presentation update.

That slice needs convincing editable versions of:

- macOS desktop, menu bar, Dock, Finder, and cursor behavior.
- Claude desktop or web app shell, including chat, composer, attachments,
  reasoning/tool states, and completion summaries.
- PowerPoint editing chrome, slide thumbnails, ribbon controls, slide canvas,
  selected objects, comments, notes, and inspector panes.
- A browser/app surface that can later branch into Airtable, Figma web,
  internal dashboards, or other SaaS scenes.

This first slice is the proving ground. Once it works, the same capture,
rebuild, primitive, and render patterns should generalize to many demo types.

## Operating Principles

1. Build editable surfaces, not screenshots.
2. Use real app state as the source of truth whenever possible.
3. Use reference videos for taste, pacing, and quality, not as visible assets.
4. Prefer small reusable primitives over one-off animation tricks.
5. Treat open-source UI projects as reference material and component donors,
   with license checks before copying code or assets.
6. Keep local-only assets local: downloaded videos, copied fonts, generated
   renders, frame studies, and private captures should not become product
   source.
7. Make every improvement verifiable through preview, snapshot, inspect, render,
   or side-by-side comparison.
8. Optimize for future demo volume: once a surface is rebuilt, agents should be
   able to reuse it across many stories.

## Quality Bar

UI Backlot is working when a demo can be changed materially without a new manual
screen recording.

A strong demo kit should prove:

- The preview opens locally with one command.
- The composition renders a 12-20 second draft video reliably.
- At least eight reusable UI or motion primitives are present.
- Important app surfaces are editable HTML/CSS/React/HyperFrames, not flattened
  screenshots.
- Snapshot/contact-sheet evidence shows progress against reference videos or
  real app captures.
- Lint, validation, visual inspect, and render gates pass or have documented
  intentional warnings.
- The project docs explain what is source-captured, what is hand-rebuilt, what
  is donor-informed, and what still needs fidelity work.

## Long-Term System

The long-term system should let an agent move through this loop:

1. Read a workflow brief.
2. Identify the apps and surfaces needed.
3. Capture or inspect real app state.
4. Rebuild editable UI components.
5. Script motion and state changes.
6. Render a draft video.
7. Compare against references.
8. Refine until the demo is believable.
9. Reuse the new primitives in the next workflow.

Eventually, UI Backlot should feel like a reusable studio lot for software:
the Finder street, the Claude office, the PowerPoint conference room, the
browser storefront, the Figma workshop, the terminal basement. Each set is
editable, lightable, scriptable, and ready for another scene.

## Non-Goals

UI Backlot is not trying to become a generic website builder, a screen recorder,
or a pile of static mockups. It should not ship third-party reference media as
product assets. It should not clone fictional apps from reference videos unless
they teach a reusable surface pattern.

The aim is a practical creative-production system: faithful enough to teach
real workflows, structured enough for agents to operate, and editable enough
that iteration becomes cheap.

