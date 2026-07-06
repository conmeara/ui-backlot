# UI-recreation methods — research findings (2026-07-05)

Deep-research pass (adversarially verified, 24 surviving claims → 8
findings) into how AI agents best recreate real application UIs as
hand-authored, self-contained HTML/CSS. Companion to
[fidelity-metrics-upgrade-2026-07-05.md](fidelity-metrics-upgrade-2026-07-05.md)
(the measurement side).

## Headline: the dominant failure mode is OMISSION, not styling

DCGen's motivating study (FSE 2025): GPT-4o given a full-page screenshot
omitted **85.34% of 1,699 elements** and reproduced only 2.35% correctly;
misarrangement (12.71%) and distortion (2.56%) were secondary. Design2Code
(NAACL 2025) independently confirms models "lag in recalling visual
elements and generating correct layout."

**Implication for every builder prompt in this repo: the agent must be
handed an explicit element inventory and layout plan, and must verify each
inventory item exists after building. Pixels alone will not be recalled.**
(Numbers are 2024-era models; magnitudes likely smaller for 2026 frontier
models, but the taxonomy stands.)

## Verified method stack (maps almost 1:1 onto ui-backlot)

1. **Deterministic decomposition before generation** (DCGen, FSE '25 —
   3-0 verified). The divide step is a plain script: grayscale, scan for
   separator lines, recursive alternating horizontal/vertical splits into
   a tree. No LLM call. Then a Leaf-solver MLLM codes each segment and an
   Assembly MLLM merges bottom-up. Up to +15% visual similarity vs direct
   prompting; largest gains on large screenshots.
2. **Layout-as-Thought assembly choice** (LaTCoder, KDD '25). Per-block
   CoT generation, then TWO assembly strategies — absolute positioning vs
   MLLM semantic reflow — rendering both and keeping whichever scores
   closer. TreeBLEU +66.67% on the weakest backbone.
3. **Component-wise generation** (ComUICoder, preprint). Hybrid
   segmentation (MLLM semantic blocks × UIED detector boxes), then:
   mask all block regions → generate the page-level SHELL with
   placeholders first → group repeated blocks → generate ONE reusable
   component per group + per-instance parameterization. Cut code
   duplication ~57% → ~2%. This is exactly the atoms-mounted-into-shells
   architecture this repo consolidated into during passes 102-111 — now
   with literature backing, and a concrete ordering rule: **shell first,
   atoms second, instances parameterized**.
4. **Element inventory via detection + set-of-marks** (OmniParser et al.).
   A structured element parse (detector + captioner, OCR for text)
   lifted GPT-4V grounding from 70.5% → 93.8% element selection. For us:
   the Spec phase should output a numbered element checklist (we can
   derive it from measured DOM geometry — better than any detector),
   and the build verify-loop checks off every item.
5. **Iterate 3–5 rounds with ELEMENT-level diffs** (UI2Code^N,
   ComUICoder). Generate-render-compare loops beat single-pass, but only
   when feedback is localized/typed per element — whole-screenshot
   feedback plateaus after ~1 round. Matches the metrics-research
   finding; fidelity-score's planned typed-repair output is the feedback
   channel.
6. **Multi-agent role splits with structured change artifacts**
   (AI4UI, preprint — MEDIUM confidence). Planner/builder/verifier roles
   plus RFC-style structured change records and a component-reuse
   knowledge graph keep large replica libraries consistent. Our
   fidelity-push roles + registry.json + pass docs are this pattern;
   the marginal idea worth stealing: a per-change structured record of
   scope/impacted-components/acceptance (our pass docs, made per-change).

## What the literature could NOT answer (our differentiators)

Zero claims survived on three asked axes:

- **DOM/computed-style-driven rebuilding** (distilling clean stylesheets
  and tokens from getComputedStyle without copying CSS). No published
  method — ui-backlot's measurement-first pipeline is ahead of the
  literature here, not behind it. Treat tokens.json-first prompting as
  our own methodology and keep documenting it in pass docs.
- **Icon/font substitution** (open-set icon matching, metric-preserving
  font fallbacks, brand-mark legality). Practice-driven; our sprite
  manifest + asset policy remain the reference.
- **Demo-state staging** (hover/progress/streaming as deterministic
  states; film/TV "fantasy UI" kit practice). Practice-driven; our
  ?capture= beat-seeking timeline pattern remains the reference.

Refuted in verification: "expertise-driven architecture constraints alone
produce maintainable AI-generated UI code" — don't cite it.

## Practice addendum: `npx hyperframes capture` (user-contributed reference)

Not surfaced by the academic sweep: HyperFrames — this repo's own render
engine — ships a first-party capture command
(hyperframes.heygen.com/guides/website-to-video, v0.7.36 verified
installed). `npx hyperframes capture <url> --json` extracts scroll-depth
screenshots, pixel-sampled palettes (oklch/lab), font families + woff2
files, semantically named assets, DOM-ordered text, section structure,
CTA detection, and — uniquely — **animations via the Web Animations API**.

Two implications:

1. For `online-only` tier public pages it supersedes our plainer
   Playwright path (which stays for viewport-exact, selector-scoped
   captures). Cloudflare-fronted pages still time out; the no-bypass rule
   applies unchanged.
2. **Motion is a measurable fidelity axis we currently ignore.** The
   whole loop scores static frames while the product ships videos.
   Web-Animations extraction (durations, easings, keyframes from the real
   app) could seed measured motion specs the same way tokens.json seeds
   static specs — a candidate seventh subscore and a natural fit for the
   GSAP timelines the compositions already use. Filed as future work.

## Changes applied to the workflows from these findings

- onboard-app Build phase: element-inventory checklist requirement,
  shell-first-with-masked-regions ordering, deterministic region
  decomposition guidance, dual assembly strategies, omission
  verification pass, 3–5 round budget.
- Spec phase: spec must enumerate a NUMBERED element checklist (id,
  region, geometry) — the anti-omission artifact.
