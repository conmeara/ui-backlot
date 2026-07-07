# UI Backlot Vision

UI Backlot is a production backlot for agent-era software demos: a code-native
studio where product-workflow videos are planned, rebuilt, animated, rendered,
and revised — without depending on perfect live screen recordings.

The core bet is simple: the best instructional and launch demos will not be
recorded one fragile take at a time. They will be assembled from editable
software sets.

## North Star

A creator describes a workflow, provides or captures a few real app states, and
generates a polished demo video from reusable UI surfaces: Claude, Codex,
Finder, browsers, Office apps, Figma, Premiere, terminals — whatever software
the story requires.

The result feels like a real product demo because every surface is rebuilt from
real applications. But it edits like a motion-graphics project: text, cursor
moves, windows, files, tool calls, progress states, and before/after changes
are all scripted and refined in code.

Eventually the repo should feel like a reusable studio lot for software: the
Finder street, the Claude office, the PowerPoint conference room, the browser
storefront, the terminal basement. Each set is editable, lightable, scriptable,
and ready for another scene.

## Why This Exists

Live screen recordings put the expensive work in the wrong place. A human
operator becomes responsible for timing, cursor precision, clean data, window
layout, app state, and retakes — and changing one line of copy can mean
re-recording the whole demo.

UI Backlot moves that work into code. We capture the truth of real software,
rebuild the parts that need to be editable, and let agents produce many takes
quickly. The human becomes the director and taste filter instead of the person
performing a perfect take.

## The System

- **Surfaces** — a library of high-fidelity, editable app surfaces, each with
  an agent-readable registry entry, capture commands, and validation hooks.
- **Primitives** — reusable building blocks for cursors, typing, clicking,
  dragging, tool calls, progress rows, app switching, and before/after reveals.
- **Capture** — a pipeline that turns real app screenshots, DOM, accessibility
  trees, and design references into rebuildable components. Open-source UI
  projects and local apps serve as donors for real fonts, icons, and
  measurements, with provenance kept explicit.
- **Render** — a HyperFrames pipeline with repeatable preview, lint, validate,
  inspect, snapshot, and video-output commands.
- **Fidelity loop** — every surface is scored against real app captures and
  reference material, not vibes. Improvements are verifiable through snapshots,
  side-by-side comparisons, and render gates.

## Self-Improving by Design

Real apps keep changing, so the backlot is built to maintain and grow itself
through multi-agent workflows rather than manual upkeep:

- **Fidelity push** — a recurring pass over every surface family: re-score
  against freshly captured ground truth, critique the measured deltas, apply
  tiered fixes, and hold the result to an adversarial judge and a stranger
  test before it lands. When the real app ships a redesign, the backlot
  follows.
- **App onboarding** — adding a new app is a workflow, not a project. Agents
  research official references, capture dated ground truth, write a measured
  visual spec, build the surface with real fonts and icons, then score, judge,
  and register it. Anyone should be able to bring their own app to the lot the
  same way.
- **Interaction push** — static fidelity is not enough; motion has its own
  loop. For each surface, agents script a canonical interaction demo with the
  primitive library, render it, and hold the recording to a motion judge —
  timing, easing, cursor believability, and a stranger test — before it ships
  as a worked example.

The loops are as much the product as the surfaces are: every pass leaves
behind dated captures, scores, and specs that make the next pass cheaper and
the next surface easier.

## Operating Principles

1. Build editable surfaces, not screenshots.
2. Real app state is the source of truth; reference videos set taste and
   pacing, never appear as assets.
3. Prefer small reusable primitives over one-off animation tricks.
4. Make every improvement verifiable — preview, snapshot, inspect, render, or
   side-by-side comparison.
5. Keep the repo agent-first: a surface should carry enough metadata and
   evidence for an agent to pick it up without reading the history.
6. Keep private data, raw donor clones, generated renders, and bulky working
   captures out of product source.

## Quality Bar

UI Backlot is working when a demo can be changed materially without a new
manual screen recording. Concretely:

- The preview opens locally with one command.
- Compositions render a 12–20 second draft video reliably.
- App surfaces are editable HTML/CSS/HyperFrames, not flattened screenshots.
- Lint, validation, inspect, and render gates pass, or carry documented
  intentional warnings.
- Snapshot and comparison evidence shows fidelity against real app captures.
- Docs explain what is source-captured, hand-rebuilt, donor-informed, and what
  still needs fidelity work.

## Non-Goals

UI Backlot is not a website builder, a screen recorder, or a pile of static
mockups. It does not ship private screenshots, raw reference videos, or donor
repos as product assets, and it does not clone fictional apps unless they teach
a reusable surface pattern.

The aim is a practical creative-production system: faithful enough to teach
real workflows, structured enough for agents to operate, and editable enough
that iteration is cheap.
