# OSS tooling scan — capture/scoring/building/asset upgrades (2026-07-05)

Input: 34 candidates from 5 parallel scanners, deduped and sanity-checked
against what ui-backlot actually runs today (`tools/capture-web-ui.mjs`,
`tools/fidelity-score.mjs`, `tools/sync-inline-icons.mjs`,
`.claude/workflows/fidelity-push.js`, `npx hyperframes capture`). Ranked by
(value × low adoption effort). Dropped items and why are at the bottom.

## Top 10

### 1. odiff — ADOPT-NOW
**What:** Rust/SIMD native image-diff CLI+lib (SSE2/AVX2/AVX512/NEON), returns pixel diff masks/overlays, anti-aliasing-aware.
**Integration:** Directly replaces the `pixelDiff()` function in `tools/fidelity-score.mjs` (line 542) — which currently **launches a full Playwright/Chromium browser** just to draw two PNGs onto a `<canvas>` and loop per-channel abs-delta with a flat `>30` threshold and no anti-aliasing tolerance. `odiff-bin` (npm) is a drop-in Node call: no browser boot, has an AA-detection mode that would stop hairline/subpixel-rendering differences from being misread as regressions in the fidelity-push judge loop.
**Effort:** ~2-4 hours (swap one function, keep the same `meanAbsError`/`pctPixelsChanged` output shape so the rest of `fidelity-score.mjs` and the report format don't change).
**First step:** `npm i -D odiff-bin`, write a thin `pixelDiffOdiff(oursPng, theirsPng)` returning the same shape as today's `pixelDiff`, A/B it against 3-4 existing capture pairs in `captures/`, then swap the call site.

### 2. designlang — ADOPT-NOW
**What:** Headless-Chromium CLI that points at a live URL and extracts computed styles into W3C DTCG design tokens (primitive/semantic/composite), plus dark-mode pair extraction and CSS health auditing.
**Integration:** ui-backlot's biggest recurring pain (per `ui-backlot-fidelity-pass-gotchas`) is manual live-app token extraction — the 2026-07-05 session hand-rolled `tools/extract-ui-tokens.js` + a Chrome-extension inject/dump/slice/reassemble workflow specifically to work around this. designlang's live-URL → DTCG-token pipeline is the same job, pre-built, and its dark-mode pair extraction maps directly onto the `.theme-dark` mechanism from pass 101. Use it for web-based ground truth (claude.ai) where Cloudflare/CDP timeouts aren't in play; keep the Chrome-injection path for cases designlang can't reach.
**Effort:** ~half a day to pilot against claude.ai or app.figma.com and diff its token output against `tools/extract-ui-tokens.js` payloads for the same page.
**First step:** Run designlang against one already-captured live reference (e.g. Figma, since `ui-backlot-design-directives` notes Figma has drifted and a redesign is queued) and compare its token JSON to the current manual capture in `reference/figma/`.

### 3. Iconify icon-sets (JSON data, not the runtime API) — ADOPT-NOW
**What:** Static JSON export of 200k+ icons across 200+ open sets (Lucide, Fluent, Material, etc.), searchable by name/prefix.
**Integration:** `tools/sync-inline-icons.mjs` already vendors Lucide/Fluent/Framework7/Simple Icons symbols from `assets/icons/sprite-manifest.json` and keeps per-file inline `<symbol>` blocks in sync — but finding the *right* canonical icon when a real app's glyph doesn't have an obvious Lucide/Fluent name match is still manual. Vendoring the Iconify JSON dataset (not calling their live API — asset policy wants no live network deps in a file:// tool) gives a local, offline, greppable index to search across all curated sets at once when mapping a captured icon to an OSS equivalent, before running `sync-inline-icons.mjs --write`.
**Effort:** ~1-2 hours — `npm i -D @iconify/json` (the offline data package) and a 20-line lookup script.
**First step:** `npm i -D @iconify/json`, write `tools/find-icon.mjs <query>` that greps the bundled JSON for candidate icon names/prefixes and prints SVG preview paths, wired as a helper for the next icon-fidelity pass (mac-shell Control Center glyph gap is already flagged as open in pass 100 notes).

### 4. css-analyzer (Project Wallace)
**What:** Node lib producing 150+ CSS stats — selector complexity, specificity, color/font/z-index/shadow inventories, custom-property usage.
**Integration:** Complements rather than replaces `fidelity-score.mjs`'s element-level color/font scoring (CIEDE2000, Dice bigrams) — use it as a *cheap pre-flight* signal in `fidelity-push.js`: run before the critique/fix/judge loop to flag which composition files have drifted furthest in raw CSS surface area (new colors/fonts not in `styles/backlot-foundation.css` tokens), directing the per-family critique agents at the highest-drift files first instead of sweeping all 9 families blind.
**Effort:** ~half a day (library call + a small drift-vs-token-registry diff script).
**First step:** Run `css-analyzer` over `compositions/claude-composed-app.html` and `styles/backlot-foundation.css`, compare its color list against the canonical `--claude-*` tokens to sanity-check the tool before wiring it into the workflow.

### 5. looks-same
**What:** Pure-Node perceptual PNG diff; ignores anti-aliasing and text-caret rendering by default, adjustable tolerance, diff clustering (which regions changed).
**Integration:** A second candidate for the `pixelDiff()` slot in `fidelity-score.mjs`, complementary to odiff rather than redundant — its diff-clustering output (which screen *regions* changed) would let the judge loop in `fidelity-push.js` report "the composer toolbar drifted" instead of only a whole-frame percentage, which is exactly the missing-localization gap already called out in `docs/research/fidelity-metrics-upgrade-2026-07-05.md`. Pick odiff if raw speed matters more (SIMD, batch scoring across ~80 captures); pick looks-same if region attribution in judge feedback matters more. Reasonable to add both since they're both pure/lightweight.
**Effort:** ~2-3 hours once odiff integration (#1) establishes the call-site pattern.
**First step:** After #1 lands, add `looks-same`'s `createDiffImage`/clusters call as an optional second pass in the same function, gated behind a flag, and check its cluster boxes against a known-bad capture (e.g. the presentation-editor dead-CSS case in pass 099 notes).

### 6. Ultralytics YOLO (fine-tuned on UI chrome, not pretrained COCO classes)
**What:** Trainable real-time object-detection framework; can be fine-tuned on a custom small dataset of UI element boxes (buttons, panes, toolbars).
**Integration:** ui-backlot already gets element `rect` + computed styles for free via the Playwright/extract-ui-tokens capture path when it controls both sides (own compositions + live app via injected script) — so YOLO's value-add is narrow: only useful for the case where a reference is a flat image with no accessible DOM (e.g. a marketing screenshot or a screen-recording frame where computer-use screenshots are the only reference, per the pass-100 gotcha about Claude desktop not opening windows programmatically). Lower priority than DOM-based capture upgrades, but the one candidate that helps when DOM access is truly unavailable.
**Effort:** 1-2 days (needs a labeled training set even if small — highest effort item on this list that's still worth listing).
**First step:** Defer until a concrete "screenshot-only, no DOM" reference case blocks a fidelity pass; don't pre-build.

### 7. style-dictionary
**What:** Token build system (JSON in, CSS vars/Swift/XML/JS/docs out), Category/Type/Item hierarchy, alias/reference resolution.
**Integration:** Not a capture upgrade — a packaging one. `styles/backlot-foundation.css` is hand-maintained canonical tokens (light + `.theme-dark`); if designlang (#2) starts producing DTCG token JSON from live captures, style-dictionary is the natural next stage to turn that JSON into the actual CSS custom-property block, rather than hand-transcribing hex/px values into fix prompts (current workflow, per the fidelity-pass-gotchas notes on "encode observations as px/hex specs").
**Effort:** ~1 day to wire a one-way build step; only worth it once #2 is in place to feed it.
**First step:** Prototype only after designlang is adopted — feed one designlang token export through style-dictionary and diff the generated CSS vars against the hand-authored ones in `styles/backlot-foundation.css`.

### 8. extract-css-core (Project Wallace)
**What:** Chromium-driven CSS extractor that consolidates linked stylesheets, inline `<style>`, and CSS-in-JS into one string/categorized set, independent of Playwright.
**Integration:** A fallback/cross-check path for `tools/capture-web-ui.mjs` on targets where computed-style extraction via Playwright already works fine (this repo's own compositions) but could validate CSS-in-JS-heavy live targets (e.g. if Figma's or claude.ai's frontend moves more logic into runtime-injected styles) without needing a second full Playwright context.
**Effort:** ~half a day to pilot as a secondary source, not a replacement.
**First step:** Low urgency — revisit only if a live-reference capture starts missing styles that computed-style extraction should have caught (no evidence of this yet).

### 9. SSIM.js
**What:** Structural Similarity Index metric (0-1, perceptual), TypeScript, Node+browser.
**Integration:** A third scoring lens to layer alongside odiff (#1)/looks-same (#5) in `fidelity-score.mjs` — per the existing `fidelity-metrics-upgrade-2026-07-05.md` research doc, single-metric pixel scoring already has known blind spots (MAE disqualified as a sole signal); SSIM as a second number in the same report gives a "pixel-diff + SSIM consensus" cross-check cheaply since it's pure JS with no native build step.
**Effort:** ~2 hours, purely additive (one more field in the score report).
**First step:** Add as a third field next to `meanAbsError`/`pctPixelsChanged` in the same `pixelDiff` rewrite from #1, no separate integration effort needed if sequenced right after it.

### 10. PaddleOCR (PP-StructureV3, offline mode)
**What:** OCR + layout-structure extraction with bounding-box output, runs offline/CPU.
**Integration:** Only relevant for the narrow case in #6 (screenshot-only references with no DOM access) where text labels need bounding boxes for element-matching — e.g. validating text content/position in a computer-use screenshot of the live Claude desktop app when DOM capture isn't possible. Same caveat as YOLO: capture already gets text + geometry for free when DOM access exists, which is true for the large majority of ui-backlot's targets.
**Effort:** 1 day (offline model download + a thin CLI wrapper).
**First step:** Defer alongside #6 until a specific screenshot-only reference gap is blocking a pass.

## Dropped (didn't survive dedupe/sanity-check)

- **SingleFile, monolith, node-website-scraper, ArchiveBox, Firecrawl, Browsertrix** — all solve "save a faithful copy of a webpage," which is exactly what the repo's asset policy forbids (no copied product code/assets, measurements only) and what `npx hyperframes capture` / `capture-web-ui.mjs` already do for the *measurement* use case. Firecrawl and Browsertrix add cloud/Docker infra ui-backlot's local file://-first workflow doesn't need.
- **CSSSteal** — functionally superseded by the repo's own Playwright capture pipeline, which already extracts computed styles plus tokens/geometry; adds nothing extract-ui-tokens.js doesn't already do.
- **screenshot-to-code, OpenUI, Design2Code (model+dataset), VLM_WebSight, DCGen, Make Real, ScreenCoder** — all are screenshot→code *generation* tools/models. ui-backlot's HTML is hand-authored and deterministic by design (no LLM-generated markup in the shipped surfaces); these belong to a different pipeline stage than what was asked for (capture/scoring/building/assets), and several (Make Real: archived; VLM_WebSight, DCGen, ScreenCoder: niche/unmaintained research code) carry real integration risk for low payback here. Design2Code's *benchmark/metric* ideas are already captured and being adopted via `docs/research/fidelity-metrics-upgrade-2026-07-05.md` — no need to re-adopt via this list.
- **Resemble.js** — same slot as odiff/looks-same but older, canvas-based, slower, "maintenance mode." odiff and looks-same both cover its use cases with better performance; redundant to add all three.
- **Argos, BackstopJS** — full visual-regression *platforms* (GitHub-App/Docker/CI-oriented) when ui-backlot needs a scoring *function*, not a new orchestration layer on top of the existing `fidelity-push.js` workflow. BackstopJS's use of Resemble.js internally is superseded by adopting odiff/looks-same directly.
- **cssstats** — near-duplicate of css-analyzer with a browser-extension-first UX; css-analyzer's Node API is the better fit for scripted pipelines.
- **specificity-graph, constyble** — flagged "stale" by the scanners themselves (constyble) or unmaintained (specificity-graph); marginal value (CSS architecture linting) for a repo where the CSS is hand-authored per-surface, not a growing app codebase.
- **diffDOM** — real capability (structural DOM diff) but no current workflow step compares two DOM trees; `fidelity-score.mjs` already operates on flattened element/token payloads, not live DOM diffing. Would require a new capture mode to feed it; not a low-effort add.
- **OmniParser, UIED** — general screen-parsing/element-detection models aimed at *agentic* screen control (click targets, interactability prediction), not fidelity measurement. UIED is also flagged stale. Overlaps with YOLO (#6) for the narrow no-DOM case but heavier to stand up.
- **Image Similarity Detection (ResNet+FAISS icon matcher)** — maturity "unknown," looks like a generic tutorial repo rather than a maintained tool; the Iconify JSON dataset (#3) solves the same "find the matching OSS icon" problem with a maintained, structured data source instead of a bespoke embedding pipeline.

## Not ranked but worth a note

**Iconify's live API** (as opposed to the static JSON package ranked above) was explicitly *not* recommended — a file://-renderable, deterministic repo shouldn't grow a live-network dependency for icon lookup. Vendor the JSON, don't call the API.
