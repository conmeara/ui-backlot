# Fidelity metrics & loop upgrades — research findings (2026-07-05)

Deep-research pass (23 sources fetched, 114 claims extracted, 3-vote
adversarial verification, 21 confirmed / 4 refuted) into how the
screenshot-to-code literature measures and maximizes UI-replication
fidelity, mapped onto ui-backlot's current system
(`tools/fidelity-score.mjs` + fidelity-push judge loop).

## Verdict on the current system

The three-loop architecture (dated ground truth → scored critique/fix →
adversarial judge with a hard bar) matches the literature's shape. The
weak parts are the **metric internals** and the **feedback format**:
frequency-weighted token diffs are role-aware but position-blind, pixel
MAE has canonical disqualifying failure modes, and whole-screenshot
critique is exactly the feedback style shown to plateau after one round.

## Confirmed findings → concrete upgrades

1. **Element-matching suite (Design2Code recipe)** — HIGH confidence.
   The de-facto standard: align visual blocks via Jonker-Volgenant
   assignment (scipy `linear_sum_assignment`; open-sourced), then score
   block-match area ratio, Sørensen-Dice text overlap, CIEDE2000 color
   difference, block-center position. Adopted by Design2Code (NAACL '25),
   WebCode2M (WWW '25), ComUICoder.
   → *Upgrade*: we already capture per-element `rect` + styles on BOTH
   sides (extract-ui-tokens payloads). Implement element-level matching in
   fidelity-score: positional color/typography scoring instead of
   frequency tables; CIEDE2000 instead of RGB Euclidean.
   Sources: salt-nlp.github.io/Design2Code, arXiv 2404.06369, 2602.19276.

2. **Structural axis (TreeBLEU)** — HIGH. Proportion of 1-height DOM
   subtrees matched in ground truth; models' weakest axis is element
   hierarchy (GPT-4V TreeBLEU 0.10–0.12) — the axis token diffs miss
   entirely. → *Upgrade*: add parent links to extract-ui-tokens elements;
   score geometry-tree recall as a separate subscore.
   Source: arXiv 2404.06369 (WebCode2M).

3. **Pixel MAE alone is disqualified** — HIGH. Equal-weighted pixel error
   assigns identical scores to visually different degradations (Wang &
   Bovik); SSIM over-penalizes sub-pixel shifts humans can't see. BUT
   MAE is not useless: LaTCoder found MAE (+NEMD) align with human
   preference on webpage similarity when paired with a semantic metric.
   → *Upgrade*: composite pixel score. Published recipes:
   LaTCoder Verify = ½·(1−MAE/255) + ½·CLIP-cosine;
   ComUICoder block-level = 0.15·SSIM + 0.85·(1−LPIPS), threshold 0.5.
   DreamSim is the most promising perceptual upgrade (degrades gradually
   where SSIM/PSNR/LPIPS saturate) but transfer to flat UI screenshots is
   untested (MEDIUM). Refuted in verification (0-3): "LPIPS always
   correlates best with human judgment" — do not over-weight LPIPS on
   authority.
   Sources: arXiv 2508.03560, 2602.19276, 2306.09344, 2506.12563.

4. **Absolute MLLM rubric judging is unreliable; comparative judging
   works** — HIGH. LaTCoder tried MLLM-as-judge and reverted to automatic
   metrics; MLLM judges hit only ~53–60% accuracy on close human-preference
   pairs (2024-vintage judges). But UI2Code^N's VLM verifier beats CLIP
   reward decisively (74.6 vs 62.0) when made COMPARATIVE: joint-query
   comparator calibration and round-robin pairwise ranking.
   → *Upgrade*: keep the deterministic score as the only absolute bar
   (already true); restructure judge verdicts as pairwise comparisons
   (BEFORE vs AFTER vs reference: "which is closer?"), and run the
   stranger test as round-robin across candidate variants rather than a
   single pair. Our stranger test is already pairwise — the right
   instinct, now with literature backing.
   Sources: arXiv 2508.03560, 2510.08783, 2511.08195.

5. **Whole-screenshot self-refine plateaus ~1 round; typed element-wise
   feedback converges** — HIGH. The failure mechanism is error
   localization: MLLMs can't find what to fix in two full screenshots.
   ComUICoder's typed instructions (add/delete/move/resize/update per
   element) reach 0.9301 block-match vs 0.7509 for coarse feedback.
   → *Upgrade*: fidelity-score should EMIT typed repair instructions from
   element matching ("element `.composer-pill`: move +4px y, recolor
   #dad8d3→#e0e0df") — machine-generated fix lists for the fix agents,
   replacing eyeballed critique as the primary driver.
   Source: arXiv 2602.19276.

6. **Budget 3–5 polish rounds with early stop** — HIGH. UI2Code^N
   test-time scaling on real screenshots: 66→68→70→73→74% across 5 rounds
   (diminishing +2,+2,+3,+1); synthetic saturates by round 3.
   → *Upgrade*: fidelity-push loops until score delta < epsilon or 5
   rounds, whichever first (currently 1–2 fixed rounds).
   Source: arXiv 2511.08195.

7. **Layout decomposition before generation** — HIGH (peer-reviewed,
   KDD '25). LaTCoder's Layout-as-Thought: segment the reference into
   grid blocks (dividing-line detection with OCR guards), generate per
   block, assemble with absolute positioning: +66.67% TreeBLEU, −38% MAE,
   preferred by humans in 79.7% of cases vs DCGen; gains largest for
   weaker models — decomposition substitutes for model capability.
   → *Upgrade*: onboard-app's Build phase should decompose the reference
   screenshot into regions and build region-by-region (helps Sonnet
   builders most).
   Source: arXiv 2508.03560.

## Practical prerequisite

Element-level text matching needs reference-side text. Tracked slim
payloads exclude it by privacy policy — keep a LOCAL-ONLY full payload
(`elements.json`, gitignored like screenshots) alongside the tracked slim
tokens.json in each dated set; the scorer prefers it when present.

## Unanswered (needs a separate pass — zero claims survived verification)

- Production visual-regression tooling details (odiff/pixelmatch AA
  tolerance, masking, layout-shift detection) vs academic metrics.
- Computed-style/token-diff correlation with human fidelity judgment and
  optimal token/perceptual/structural weighting.
- Legitimate weekly-capture patterns for logged-in apps (CDP attach to
  the user's real Chrome, connectOverCDP, extension capture) and baseline
  stability. (Engineering judgment until researched: the claude-in-chrome
  extension path already is a CDP attach to the real browser.)

## Refuted during verification (do not cite)

- "GPT-4V webpages judged interchangeable with reference 49% / better
  64%" (1-2).
- DreamSim attribute-profile and render-quality-in-practice claims (1-2).
- "LPIPS achieves highest human correlation across IQA databases" (0-3).

Stats: 5 angles, 23 sources, 114 claims → 25 verified (21 confirmed,
4 killed), synthesized to 10 findings. Peer-reviewed anchors:
Design2Code (NAACL '25), WebCode2M (WWW '25), LaTCoder (KDD '25);
UI2Code^N, ComUICoder, MLLM-as-UI-Judge are recent preprints.
