# Fidelity-Push Workflow Pass (Pass 099)

Date: 2026-07-01. Follows pass 098.

## Method

First pass run through the reusable `fidelity-push` multi-agent workflow
(`.claude/workflows/fidelity-push.js`). Per app family: a design critic
(Fable for claude/macos, Opus elsewhere) compares current captures against
real-app references and emits concrete fix specs; a Sonnet implementer
applies them file-scoped with capture-verify loops; an Opus judge compares
before/after/reference adversarially and dispatches Sonnet repairs plus an
Opus re-check on any regression; a final gate agent runs the full sweep and
repo checks. 34 agents total; all 9 families ended "improved" with zero
unresolved regressions.

## Changes by family

- **claude**: assistant sunburst avatar gutter removed (real Cowork replies
  are flush-left) in `claude-app` and propagated to `claude-thread-core`;
  Connectors/Working-files merged into the Context card with header chevrons
  (and mirrored in `claude-agent-rail`); Progress stepper rebuilt as blue
  circle markers; `claude-home` marketing hero replaced with a real composer
  (typed prompt, folder icon, model selector, square send button) and
  left-aligned serif greeting; `claude-code-desktop` got a bottom thread
  composer, workspace row moved to the sidebar bottom with lucide icons,
  and "Recents" sentence-case labels.
- **macos**: menu bar is now transparent with a Help menu (matching the real
  `screen.png`); Finder group-by/gallery toolbar glyphs corrected and the
  truncated filename no longer double-ellipsizes; Calendar lost its invented
  event arrows, sidebar counts/dots/footer, and the now-line pill became
  plain red time text.
- **powerpoint**: title slide de-cluttered (ghost chart + dollar labels +
  alignment crosshairs removed); selection marquee re-fit to hug the title
  placeholder; pressed toggles are neutral gray, not coral-underlined.
- **word**: fabricated floating Track-Changes toolbar deleted (it occluded
  the lede paragraph); Track Changes dropdown selection corrected to "Just
  Mine"; invented "A11y" proofing field and non-native titlebar app icon
  removed; active comment card matches the on-page anchor color.
- **excel**: workbook made internally consistent — formula bar sums to the
  active-cell value, Delta column is a single percentage type, status bar
  recomputed (Average 5.3 / Sum 42 / Count 8), number format General,
  Aptos Narrow default, AutoSave moved before the filename.
- **figma**: duplicated navigation rail removed (UI3 shows in-panel tabs OR
  a rail, never both); bottom toolbar rebuilt with split-button chevrons and
  a separated Dev-mode pill; properties panel gained the object-type row;
  onboarding W/H matches the 390x844 selection chip; blank align strip and
  phantom second fill removed.
- **codex**: real VS Code ribbon logo, Lucide hand/zap glyphs for the
  composer chips, neutral diff text with colored change-bars (matching the
  official plates); terminal user turns are plain text, footer hints dim
  gray, splash box rounded.
- **browser**: invented "private" omnibox pill and split toolbar button
  deleted; close X on active tab only; favicons as clean color chips;
  traffic lights re-centered.
- **premiere**: duplicate Export CTA and invented Generative-Extend tool and
  workspace icon row removed; source/program/properties labels now agree
  with the timeline selection; accent blue desaturated to Premiere's tone.

## Notable meta-findings

- `browser-app` captures load `surfaces/browser-app-surface.html`, not
  `compositions/browser-app.html` — the two are near-duplicates and must be
  edited in sync (the judge caught a stale capture and the repair synced
  the surface file).
- `presentation-editor.html` carries a large non-winning "source-grounded"
  override cascade (~lines 1508-2365 pre-pass) plus dead rules for elements
  this pass removed; two design intents coexist in the file. Worth a
  dedicated dead-CSS prune with capture diffs to confirm nothing shifts.

## Verification

Gate agent: 54/54 real capture scripts pass (`capture:hf`/`capture:web`
are argless base wrappers, not surfaces); registry 51 surfaces / 32
components / 17 workflows / 51 ready captures; catalog regenerated;
hf:lint exactly at the 19-error pre-existing baseline with zero new
errors; quickstart demo renders (1.4 MB, 14.0s); inventory sheet
regenerated.

## Remaining (queued for a future pass)

- Claude Progress stepper: real app uses check/empty circles without
  numerals; markers render 16px vs the intended ~24px.
- claude-agent-rail Web-search connector tile lacks the globe glyph that
  claude-app received.
- Finder gallery-view glyph is approximate; truncated filename should keep
  a longer head (`hyperframes-...`).
- PowerPoint thumbnail 1 still shows ghost mini-bars its slide no longer
  has; dead CSS prune (see meta-findings).
- Premiere lost its (accurate) top-right share/Export affordance when the
  duplicate was removed — consider restoring one.
- No on-disk references yet for Excel, Chrome, Premiere, Codex CLI TUI, or
  Calendar; sourcing sanitized captures would upgrade those critics from
  product knowledge to pixel ground truth.
