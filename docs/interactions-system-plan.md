# Backlot Interactions — scriptable UI actions for HyperFrames demos

Goal: make the app surfaces *do things* on the timeline — type into inputs,
click buttons, send a chat, stream an AI reply, select a cell — so demo videos
look like a real person using the app. And make it fast to author: a few lines
per action, reusable across every composition.

## How HyperFrames renders (the constraint)

Each composition registers a **paused GSAP timeline** at
`window.__timelines[compositionId]`. HyperFrames renders by **seeking** that
timeline to each frame's time and screenshotting. So every visual must be a
**pure function of timeline time** — anything driven by `setTimeout`, CSS
keyframes, or live event handlers will not render deterministically. All
interaction state therefore lives in GSAP tweens (which re-evaluate on seek).

## The API — `runtime/backlot-interactions.js`

A tiny global helper. A composition builds its timeline, then scripts actions:

```js
const tl = gsap.timeline({ paused: true });
const ix = BacklotInteractions.create(tl, { root: document, cursor: ".demo-cursor" });

ix.moveTo(".composer-input", { at: 0.6 });                 // cursor glides to a target
ix.click(".composer-input", { at: 1.4 });                  // move + click ring + press dip
ix.type(".composer-input", "Summarize the Q2 launch deck", { at: 1.7, cps: 22 });
ix.click(".send-button", { at: 4.2 });
ix.send({ from: ".composer-input", into: ".thread", bubble: "user", at: 4.35 });
ix.think(".thinking", { at: 4.7, dur: 0.9 });
ix.stream(".ai-response", "Here are the three key takeaways…", { at: 5.6, cps: 46 });

window.__timelines["my-demo"] = tl;
```

### Actions (all return the interaction ctx for chaining)

| method | what it does |
| --- | --- |
| `moveTo(target, {at, dur})` | glide the cursor element to the target's centre |
| `click(target, {at, press})` | `moveTo` + a click-ring pulse + a brief scale-press on the target |
| `type(target, text, {at, cps, caret})` | typewriter-reveal `text` into the target (textContent), driven by a tweened counter so it's seek-deterministic; optional blinking caret |
| `stream(target, text, {at, cps})` | like `type` but for AI output — a soft fade-in per chunk, faster cps |
| `send({from, into, bubble, at})` | lift the typed text out of an input into a new chat bubble appended to a thread, clear the input |
| `think(target, {at, dur})` | reveal/pulse a "thinking" indicator between `at` and `at+dur` |
| `show(target, {at, dur, from})` / `hide(...)` | fade/slide an element in or out |
| `press(target, {at})` / `toggle(target, cls, {at})` | momentary press dip / state class flip (deterministic via paired sets) |

### Determinism rules baked in

- **Text reveal**: `tl.to(counter, {v: text.length, ease:"none", onUpdate})` where
  `onUpdate` sets `el.textContent = text.slice(0, Math.round(counter.v))`. Seeking
  re-runs `onUpdate` → correct partial text at any frame.
- **Cursor / rings / press**: interpolated transforms (left/top, scale, opacity) —
  inherently seek-safe. Target centres are read from `getBoundingClientRect()`
  relative to the interaction root at build time (layout is static).
- **State flips** (pressed, active): a pair of `tl.set()` calls at `t` and `t+ε`
  — GSAP applies sets by timeline position, so a seek between them shows the state.
- **Caret blink**: a yoyo tween (evaluates at any time), stopped with a `set` when
  typing ends.

## Rollout

1. `runtime/backlot-interactions.js` — the helper (this is the foundation).
2. Add scriptable hooks (stable class names, an empty `.thread`, a `.demo-cursor`)
   to the high-value surfaces, starting with the Claude composer→thread→response
   flow, then Excel (cell select + type + formula), Word/PowerPoint, browser,
   Finder, codex, figma.
3. One worked example per app in `examples/` so a user can copy-paste and retime.
4. A short authoring guide in the README.

The loop iterates surface-by-surface: add hooks → script a realistic action →
render a short clip → verify it reads as real → commit.
