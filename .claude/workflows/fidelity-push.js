export const meta = {
  name: 'fidelity-push',
  description: 'Per-family design critique vs measured ground truth: score + critique, tiered fix, adversarial judge with hard score bar + stranger test, full gates',
  whenToUse: 'Run one full visual-fidelity pass over all ui-backlot surface families',
  phases: [
    { title: 'Score', detail: 'Deterministic fidelity-score baselines vs dated reference sets', model: 'haiku' },
    { title: 'Critique', detail: 'Fable/Opus design critics per app family vs references + measured deltas' },
    { title: 'Fix', detail: 'Sonnet implementers, file-scoped, capture-verify loops', model: 'sonnet' },
    { title: 'Judge', detail: 'Re-score + Opus before/after adversarial judgment + stranger test + Sonnet repair on regression', model: 'opus' },
    { title: 'Gate', detail: 'Full capture sweep + registry/catalog/lint/render gates', model: 'haiku' },
  ],
}

const ROOT = '/Users/conmeara/Projects/ui-backlot'
// Stable scratch dir (survives across sessions; fix agents mkdir -p it).
const SCRATCH = '/private/tmp/ui-backlot-fidelity'

// scoreRef names a label inside the NEWEST dated dir under reference/<family>/
// (created by tools/capture-live-reference.mjs / import-reference.mjs).
// Surfaces without scoreRef are critiqued from reference images only.
const FAMILIES = [
  {
    key: 'claude', criticModel: 'fable',
    surfaces: [
      { id: 'claude-composed-app', src: 'compositions/claude-composed-app.html', cap: 'captures/surface-claude-composed-app/target.png', json: 'captures/surface-claude-composed-app/capture.json', script: 'capture:claude-composed-app', scoreRef: 'web-app-chat-light' },
      { id: 'claude-home', src: 'compositions/claude-home.html', cap: 'captures/surface-claude-home/target.png', json: 'captures/surface-claude-home/capture.json', script: 'capture:claude-home', scoreRef: 'web-app-home-light' },
    ],
    refDir: 'reference/claude',
    refs: 'PRIMARY: reference/claude/<newest dated dir>/ — dated ground-truth sets measured from live claude.ai (tokens.json = computed styles; manifest.json = provenance; screenshot.png present when pixels could be captured). Known measured facts (2026-07-05): paper rgb(248,248,246), ink rgb(11,11,11), font weights 430/550, dominant control radius 9px, hairlines ~10%-alpha black (composite ≈ #e0e0df), icon glyphs from an "Anthropicons-Variable" font. SECONDARY: reference/claude/images/current-app-2026-06-18/ real-cowork-*.jpg (older real captures), official-* marketing shots (staged).',
    siblings: 'compositions/claude-sidebar.html, compositions/claude-thread-core.html, compositions/claude-composer.html, compositions/claude-agent-rail.html, compositions/claude-chat-pane.html, compositions/claude-conversation.html, compositions/claude-prompt-stack.html, compositions/claude-home-launch.html',
  },
  {
    key: 'macos', criticModel: 'fable',
    surfaces: [
      { id: 'finder-window', src: 'compositions/finder-window.html', cap: 'captures/surface-finder-window-component/target.png', script: 'capture:finder-window' },
      { id: 'mac-menu-bar', src: 'compositions/mac-menu-bar.html', cap: 'captures/surface-mac-menu-bar/target.png', script: 'capture:mac-menu-bar' },
      { id: 'calendar-app', src: 'compositions/calendar-app.html', cap: 'captures/surface-calendar-app/target.png', script: 'capture:calendar' },
    ],
    refDir: 'reference/macos',
    refs: 'captures/finder-launch-deck/window.png and captures/finder-launch-deck/screen.png are REAL macOS Tahoe Finder captures (gold standard; screen.png includes the real menu bar). Check reference/macos/<dated>/ for newer sets. No Calendar reference on disk — rely on macOS Tahoe Calendar product knowledge and only flag what you are certain of.',
    siblings: '',
  },
  {
    key: 'powerpoint', criticModel: 'opus',
    surfaces: [
      { id: 'presentation-editor', src: 'compositions/presentation-editor.html', cap: 'captures/surface-presentation-editor/target.png', script: 'capture:presentation-editor' },
    ],
    refDir: 'reference/powerpoint',
    refs: 'reference/powerpoint/source-screenshots/ — mac-thumbnails-ribbon.png shows the real PowerPoint-for-Mac ribbon and thumbnail rail; other PNGs show panes and buttons. Note: pass 098 already simplified the ribbon to 6 groups with Fluent icons and made thumbnails miniature slide replicas — critique what REMAINS off, do not re-litigate those decisions.',
    siblings: '',
  },
  {
    key: 'word', criticModel: 'opus',
    surfaces: [
      { id: 'word-editor', src: 'compositions/word-editor.html', cap: 'captures/surface-word-editor/target.png', script: 'capture:word-editor' },
    ],
    refDir: 'reference/word',
    refs: 'reference/word/screenshots/ — word-ribbon-tabs-groups-commands.png is the full ribbon reference; others show comment balloons, review pane, track-changes UI.',
    siblings: '',
  },
  {
    key: 'excel', criticModel: 'opus',
    surfaces: [
      { id: 'excel-workbook', src: 'compositions/excel-workbook.html', cap: 'captures/surface-excel-workbook/target.png', script: 'capture:excel-workbook' },
    ],
    refDir: 'reference/excel',
    refs: 'No dedicated Excel screenshots exist. Use reference/word/screenshots/ and reference/powerpoint/source-screenshots/ for the shared Office-for-Mac chrome idiom (titlebar, ribbon, hairlines) plus Excel-for-Mac product knowledge for the grid/formula bar. Be conservative: only flag what you are certain of.',
    siblings: '',
  },
  {
    key: 'figma', criticModel: 'opus',
    surfaces: [
      { id: 'figma-editor', src: 'compositions/figma-editor.html', cap: 'captures/surface-figma-editor/target.png', script: 'capture:figma-editor' },
      { id: 'figma-onboarding-editor', src: 'compositions/figma-editor.html', cap: 'captures/surface-figma-onboarding-editor/target.png', script: 'capture:figma-onboarding-editor' },
    ],
    refDir: 'reference/figma',
    refs: 'reference/figma/actual-app/ — UI3 toolbar, left panel layers/pages, properties panel, full-editor shots (see source-index.json). The onboarding variant renders from figma-editor.html?page=onboarding — both surfaces share the one source file.',
    siblings: '',
  },
  {
    key: 'codex', criticModel: 'opus',
    surfaces: [
      { id: 'codex-app', src: 'compositions/codex-app.html', cap: 'captures/surface-codex-app/target.png', script: 'capture:codex-app' },
      { id: 'codex-terminal', src: 'compositions/codex-terminal.html', cap: 'captures/surface-codex-terminal/target.png', script: 'capture:codex-terminal' },
    ],
    refDir: 'reference/codex',
    refs: 'reference/codex/app-screenshots/ — app-screenshot-light/dark.webp, integrated-terminal-light.webp, in-app-browser-light.webp and more (see README.md there). Check reference/codex/<dated>/ for newer measured sets.',
    siblings: '',
  },
  {
    key: 'browser', criticModel: 'opus',
    surfaces: [
      { id: 'browser-app', src: 'compositions/browser-app.html', cap: 'captures/surface-browser-app/target.png', script: 'capture:browser-app' },
    ],
    refDir: 'reference/browser',
    refs: 'Check reference/browser/<dated>/ for measured sets. Otherwise use Chrome-on-macOS product knowledge (tab geometry, omnibox, toolbar) and be conservative — only flag what you are certain of; prefer abstraction over invented detail.',
    siblings: '',
  },
  {
    key: 'premiere', criticModel: 'opus',
    surfaces: [
      { id: 'premiere-editor', src: 'compositions/premiere-editor.html', cap: 'captures/surface-premiere-editor/target.png', script: 'capture:premiere-editor' },
    ],
    refDir: 'reference/premiere',
    refs: 'No real screenshots on disk. Use Adobe Premiere Pro product knowledge (dark theme, panel chrome, timeline idiom) and be conservative — only flag what you are certain of; prefer abstraction over invented detail.',
    siblings: '',
  },
]

const CRITIQUE_SCHEMA = {
  type: 'object', required: ['gaps'], additionalProperties: false,
  properties: {
    gaps: {
      type: 'array', maxItems: 7,
      items: {
        type: 'object', required: ['surface', 'file', 'severity', 'issue', 'fix'], additionalProperties: false,
        properties: {
          surface: { type: 'string' },
          file: { type: 'string' },
          severity: { enum: ['illusion-breaking', 'noticeable', 'polish'] },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
    referenceQuality: { type: 'string' },
  },
}

const FIX_SCHEMA = {
  type: 'object', required: ['applied', 'skipped', 'capturesVerified', 'notes'], additionalProperties: false,
  properties: {
    applied: { type: 'array', items: { type: 'object', required: ['surface', 'file', 'change'], additionalProperties: false, properties: { surface: { type: 'string' }, file: { type: 'string' }, change: { type: 'string' } } } },
    skipped: { type: 'array', items: { type: 'object', required: ['issue', 'reason'], additionalProperties: false, properties: { issue: { type: 'string' }, reason: { type: 'string' } } } },
    capturesVerified: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const JUDGE_SCHEMA = {
  type: 'object', required: ['verdict', 'regressions', 'remaining', 'summary'], additionalProperties: false,
  properties: {
    verdict: { enum: ['improved', 'mixed', 'regressed', 'no-change'] },
    regressions: { type: 'array', items: { type: 'string' } },
    remaining: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}

const SCORE_SCHEMA = {
  type: 'object', required: ['scores', 'notes'], additionalProperties: false,
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object', required: ['surface', 'tokenOverall', 'topDeltas'], additionalProperties: false,
        properties: {
          surface: { type: 'string' },
          tokenOverall: { type: ['number', 'null'] },
          colors: { type: ['number', 'null'] },
          typography: { type: ['number', 'null'] },
          radii: { type: ['number', 'null'] },
          spacing: { type: ['number', 'null'] },
          shadows: { type: ['number', 'null'] },
          topDeltas: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    notes: { type: 'string' },
  },
}

const STRANGER_SCHEMA = {
  type: 'object', required: ['pairs'], additionalProperties: false,
  properties: {
    pairs: {
      type: 'array',
      items: {
        type: 'object', required: ['surface', 'imagesFound', 'pickedReal', 'confidence', 'tells'], additionalProperties: false,
        properties: {
          surface: { type: 'string' },
          imagesFound: { type: 'boolean' },
          pickedReal: { enum: ['A', 'B', 'unsure'] },
          confidence: { enum: ['low', 'medium', 'high'] },
          tells: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
}

function surfaceLines(f) {
  return f.surfaces.map(s => '- ' + s.id + ': current capture at ' + s.cap + ' | source ' + s.src + ' | recapture with: npm run ' + s.script).join('\n')
}

const GOTCHAS = [
  '1. CASCADE TRAP: the big composition files contain LATER style blocks that re-style the same selectors as earlier blocks — the LAST rule wins. Before editing any rule, grep the file for ALL occurrences of the selector and edit the effective (last) one, or your change silently does nothing.',
  '2. ICONS: never hand-draw glyphs or use Unicode symbols as icons. Copy real <symbol> elements from assets/icons/source-authentic/ (curated MIT/ISC sprites, see assets/icons/sprite-manifest.json) into the composition hidden <svg style="display:none"> block and reference them with <svg class="backlot-icon"><use href="#symbol-id"/></svg>. Office apps use fluent-* symbols, macOS uses f7-*, claude/browser use lucide-*.',
  '3. ASSET POLICY: hand-authored CSS/SVG only. Never add binary images, fonts, or screenshots to the repo. Never edit styles/backlot-foundation.css, tools/, runtime/, or files outside your scope list.',
  '4. PATHS: captures load compositions via file:// so keep each file existing relative asset-path convention exactly as-is. Keep the foundation @import in the OUTER style block (outside <template>) where that pattern exists.',
  '5. MOUNTING: compositions are mounted into workflow wrappers by runtime/backlot-component-loader.js, which strips <script> tags and inherits parent fonts — do not rely on scripts for visual state; keep styles inside the template.',
  '6. ABSTRACTION PRINCIPLE (house rule): if a control cannot be rendered at the right size, font, and icon, REMOVE it rather than squeeze it. Fewer correct controls read as the real app.',
  '7. Do NOT run any git commands (no commit, stash, checkout, restore). The orchestrator handles version control.',
].join('\n')

const REF_RESOLVE = 'REF=$(ls -d ROOTDIR/FAMDIR/2*/ 2>/dev/null | sort | tail -1)'

function scoreScript(f, tag) {
  const scored = f.surfaces.filter(s => s.scoreRef)
  const resolve = REF_RESOLVE.replace('ROOTDIR', ROOT).replace('FAMDIR', f.refDir)
  const cmds = scored.map(s =>
    'node tools/fidelity-score.mjs --label ' + s.id + '-' + tag +
    ' --ours ' + s.json + ' --theirs "${REF}' + s.scoreRef + '/tokens.json"' +
    ' --out ' + SCRATCH + '/score-' + s.id + '-' + tag + '.json'
  )
  return 'mkdir -p ' + SCRATCH + ' && cd ' + ROOT + ' && ' + resolve + '\n' + cmds.join('\n')
}

function scoreStage(f, tag, phaseTitle) {
  const scored = f.surfaces.filter(s => s.scoreRef)
  if (scored.length === 0) return Promise.resolve(null)
  return agent(
    'Run deterministic fidelity scoring for the "' + f.key + '" family in ' + ROOT + ' (work from that root).\n' +
    'Execute exactly this (as a bash script; $REF is the newest dated ground-truth dir):\n' + scoreScript(f, tag) + '\n\n' +
    'If $REF is empty or a tokens.json is missing, skip that surface and explain in notes.\n' +
    'Then Read each produced ' + SCRATCH + '/score-*-' + tag + '.json report and return per surface: tokenOverall, colors, typography, radii, spacing, shadows (null where the report says null), and topDeltas = the first 8 delta "detail" strings.',
    { label: 'score:' + f.key + ':' + tag, phase: phaseTitle, model: 'haiku', effort: 'low', schema: SCORE_SCHEMA }
  )
}

function critiqueStage(preScore, f) {
  const scoreBlock = preScore && preScore.scores && preScore.scores.length
    ? '\nMEASURED SCORECARD (deterministic, from tools/fidelity-score.mjs vs live-app computed styles — treat these deltas as ground truth and turn them into fixes FIRST, before anything eyeballed):\n' + JSON.stringify(preScore.scores, null, 1) + '\n'
    : ''
  return agent(
    'Visual fidelity audit of the "' + f.key + '" family in ' + ROOT + ' (work from that root).\n' +
    'This repo is a studio backlot of hand-built HTML/CSS recreations of real apps, used to shoot agent-made demo videos. Any visual tell breaks the illusion. Your job: find what still reads as fake.\n\n' +
    'Surfaces to audit — Read each capture PNG visually:\n' + surfaceLines(f) + '\n\n' +
    'Ground-truth references: ' + f.refs + '\n' +
    'Read the actual reference images FIRST (the Read tool renders images). Then skim the composition source files to understand what is implemented.\n' +
    scoreBlock + '\n' +
    'Hunt specifically for: wrong font size/weight/family, wrong padding and spacing rhythm, wrong colors and hairlines, fake-looking icons, controls that do not exist in the real app, misaligned chrome (titlebar, traffic lights, tabs, sidebars), text or content that contradicts itself between panes, and anything that would flicker as "off" in a moving demo video.\n' +
    'HOUSE RULE — abstract before you approximate: when a control cannot be rendered at the right size/font/icon, the correct fix is to REMOVE it, not to shrink or fake it. Recommend removals freely.\n\n' +
    'For every gap give a concrete, directly implementable fix spec: exact px, hex, font-weight, element to delete, or symbol id to use. A Sonnet implementer will apply your specs verbatim — vague specs produce bad fixes.\n' +
    'Max 7 gaps, ranked most severe first (illusion-breaking, then noticeable, then polish). Only report gaps you are confident about. Where no reference exists, flag only what you are certain of from product knowledge. In referenceQuality, note how strong your ground truth was.',
    { label: 'critique:' + f.key, phase: 'Critique', model: f.criticModel, effort: 'high', schema: CRITIQUE_SCHEMA }
  ).then(crit => ({ preScore: preScore, crit: crit }))
}

async function fixStage(prev, f) {
  const crit = prev ? prev.crit : null
  if (!crit || !crit.gaps || crit.gaps.length === 0) {
    log('critique:' + f.key + ' found no confident gaps — skipping fix')
    return { preScore: prev ? prev.preScore : null, crit: crit, fix: null }
  }
  log('critique:' + f.key + ' → ' + crit.gaps.length + ' gap(s); fixing')
  const beforeCmds = 'mkdir -p ' + SCRATCH + ' && ' + f.surfaces.map(s => 'cp ' + ROOT + '/' + s.cap + ' ' + SCRATCH + '/before-' + s.id + '.png').join(' && ')
  const fix = await agent(
    'Implement visual-fidelity fixes in ' + ROOT + ' (work from that root).\n\n' +
    'SCOPE — you may edit ONLY these files:\n' + f.surfaces.map(s => '- ' + s.src).join('\n') + '\n' +
    (f.siblings ? 'You may ALSO propagate a shared visual fix (same element styled the same way) into these sibling components, re-capturing each one you touch (capture script = capture:<file basename without .html>):\n' + f.siblings + '\n' : '') +
    '\nFIRST, before any edit, snapshot the current captures:\n' + beforeCmds + '\n\n' +
    'FIX SPECS from the design critic — implement in order, most severe first:\n' + JSON.stringify(crit.gaps, null, 1) + '\n\n' +
    'RULES:\n' + GOTCHAS + '\n\n' +
    'VERIFY LOOP: after your edits, run the capture script for each surface you changed (npm run <script> from the repo root), Read the produced PNG visually, and compare against the reference images (' + f.refs + '). Iterate up to 3 rounds until it reads right. A capture that errors means your edit broke the template — fix it before finishing. If a spec cannot be implemented cleanly, skip it with a reason (do not force a bad approximation).\n' +
    'Return: applied (surface/file/what changed), skipped (issue/reason), capturesVerified, notes.',
    { label: 'fix:' + f.key, phase: 'Fix', model: 'sonnet', schema: FIX_SCHEMA }
  )
  return { preScore: prev.preScore, crit: crit, fix: fix }
}

function scoreBar(preScore, postScore) {
  // Hard bar: no scored surface may regress (tolerance 0.005); "improved"
  // additionally needs at least one score to move up.
  if (!preScore || !postScore) return { applicable: false, regressed: [], improvedAny: false }
  const before = {}
  for (const s of preScore.scores || []) before[s.surface] = s.tokenOverall
  const regressed = []
  let improvedAny = false
  for (const s of postScore.scores || []) {
    const b = before[s.surface]
    if (typeof b !== 'number' || typeof s.tokenOverall !== 'number') continue
    if (s.tokenOverall < b - 0.005) regressed.push(s.surface + ': tokenOverall ' + b.toFixed(3) + ' → ' + s.tokenOverall.toFixed(3))
    if (s.tokenOverall > b + 0.005) improvedAny = true
  }
  return { applicable: true, regressed: regressed, improvedAny: improvedAny }
}

async function strangerStage(f, idx) {
  const scored = f.surfaces.filter(s => s.scoreRef)
  if (scored.length === 0) return null
  const resolve = REF_RESOLVE.replace('ROOTDIR', ROOT).replace('FAMDIR', f.refDir)
  // Stage pairs under neutral names so the judge cannot read provenance from
  // paths. Parity (surface index) decides which side is real — recorded here,
  // never shown to the stranger.
  const prep = scored.map((s, i) => {
    const real = '"${REF}' + s.scoreRef + '/screenshot.png"'
    const ours = ROOT + '/' + s.cap
    const a = (idx + i) % 2 === 0 ? real : ours
    const b = (idx + i) % 2 === 0 ? ours : real
    return 'cp ' + a + ' ' + SCRATCH + '/stranger-' + s.id + '-A.png 2>/dev/null; cp ' + b + ' ' + SCRATCH + '/stranger-' + s.id + '-B.png 2>/dev/null'
  }).join('\n')
  await agent(
    'Stage image pairs (mechanical, no judgment). Run as bash:\nmkdir -p ' + SCRATCH + ' && cd ' + ROOT + ' && ' + resolve + '\n' + prep + '\nReturn applied=[], skipped=[], capturesVerified=true, notes listing which stranger-*.png files now exist (ls ' + SCRATCH + '/stranger-*.png).',
    { label: 'stage-pairs:' + f.key, phase: 'Judge', model: 'haiku', effort: 'low', schema: FIX_SCHEMA }
  )
  const stranger = await agent(
    'You are a fresh-eyes UI screenshot examiner. For each pair below, image A and image B show the same application view. ONE is a screenshot of the real application; the other is an HTML/CSS recreation. You have NO other context — judge only the pixels.\n\n' +
    scored.map(s => '- surface "' + s.id + '": A=' + SCRATCH + '/stranger-' + s.id + '-A.png  B=' + SCRATCH + '/stranger-' + s.id + '-B.png').join('\n') + '\n\n' +
    'For each pair: if either file is missing (Read fails), set imagesFound=false and skip. Otherwise Read both images carefully and decide which is the REAL app (A, B, or unsure), your confidence, and the concrete visual tells that exposed the fake (font rendering, spacing rhythm, icon weight, hairline color, shadow softness, content plausibility). The tells are the deliverable — be specific enough that an implementer can act on each one.',
    { label: 'stranger:' + f.key, phase: 'Judge', model: f.criticModel, effort: 'high', schema: STRANGER_SCHEMA }
  )
  if (!stranger || !stranger.pairs) return null
  const evaluated = stranger.pairs.map(p => {
    const i = scored.findIndex(s => s.id === p.surface)
    const realIs = i >= 0 && (idx + i) % 2 === 0 ? 'A' : 'B'
    return { ...p, realIs: realIs, fooled: p.imagesFound && p.pickedReal !== 'unsure' && p.pickedReal !== realIs }
  })
  return { pairs: evaluated }
}

async function judgeStage(prev, f, idx) {
  if (!prev) return { family: f.key, crit: null, fix: null, judge: null, scores: null, stranger: null }
  if (!prev.fix) return { family: f.key, crit: prev.crit, fix: null, judge: { verdict: 'no-change', regressions: [], remaining: [], summary: 'No confident gaps found; nothing changed.' }, scores: { before: prev.preScore, after: null, bar: null }, stranger: null }

  const postScore = await scoreStage(f, 'after', 'Judge')
  const bar = scoreBar(prev.preScore, postScore)
  const barBlock = bar.applicable
    ? '\nHARD SCORE BAR (deterministic, not yours to overrule): before vs after tokenOverall per surface —\nBEFORE: ' + JSON.stringify((prev.preScore.scores || []).map(s => ({ surface: s.surface, tokenOverall: s.tokenOverall }))) + '\nAFTER: ' + JSON.stringify((postScore.scores || []).map(s => ({ surface: s.surface, tokenOverall: s.tokenOverall }))) + '\n' +
      (bar.regressed.length ? 'SCORE REGRESSIONS (verdict cannot be better than "regressed" unless you show the number is misleading AND name why): ' + bar.regressed.join('; ') + '\n' : 'No score regressions.\n') +
      'Rule: "improved" requires no score regression AND (a score increase OR visually decisive evidence).\n'
    : ''

  const beforeList = f.surfaces.map(s => '- ' + s.id + ': BEFORE ' + SCRATCH + '/before-' + s.id + '.png | AFTER ' + ROOT + '/' + s.cap).join('\n')
  const judgePrompt =
    'Adversarial design judgment of a fidelity pass on the "' + f.key + '" family in ' + ROOT + '.\n' +
    'An implementer just applied these changes:\n' + JSON.stringify(prev.fix.applied, null, 1) + '\n\n' +
    'Read all three visual sources per surface — BEFORE snapshot, AFTER capture, and the real-app references (' + f.refs + '):\n' + beforeList + '\n' +
    barBlock + '\n' +
    'Decide for the whole family: is the AFTER genuinely closer to the real app than the BEFORE? Hunt for regressions the implementer missed: overlapping or clipped text, broken layout, elements that disappeared unintentionally, spacing that got worse, icons that render as empty boxes. Do NOT rubber-stamp — your default posture is skeptical.\n' +
    'verdict: "regressed" if anything is worse than before (including the hard score bar); "mixed" if real improvements plus minor new issues; "improved" only if strictly better AND the score bar allows it.\n' +
    'regressions: each precise enough for a repair agent to act on (file, element/selector, what broke).\n' +
    'remaining: gaps worth a future pass (including critic specs that were skipped, if they still matter).'
  let judge = await agent(judgePrompt, { label: 'judge:' + f.key, phase: 'Judge', model: 'opus', effort: 'high', schema: JUDGE_SCHEMA })

  if (judge && judge.regressions && judge.regressions.length > 0) {
    log('judge:' + f.key + ' flagged ' + judge.regressions.length + ' regression(s) — dispatching repair')
    await agent(
      'Repair regressions introduced by a fidelity pass in ' + ROOT + ' (work from that root).\n' +
      'SCOPE — only these files:\n' + f.surfaces.map(s => '- ' + s.src).join('\n') + (f.siblings ? '\nand if the regression is in a sibling: ' + f.siblings : '') + '\n\n' +
      'REGRESSIONS (from an adversarial design judge — fix every one):\n' + JSON.stringify(judge.regressions, null, 1) + '\n\n' +
      'RULES:\n' + GOTCHAS + '\n\n' +
      'After fixing, re-run the capture script for each touched surface (' + f.surfaces.map(s => 'npm run ' + s.script).join(', ') + '), Read the PNGs, and confirm each regression is gone. Restoring the BEFORE state of a broken element is acceptable when a clean fix is not obvious — never leave it worse than before.',
      { label: 'repair:' + f.key, phase: 'Judge', model: 'sonnet', schema: FIX_SCHEMA }
    )
    const recheck = await agent(
      'Re-check after repair, family "' + f.key + '" in ' + ROOT + '. The following regressions were reported and a repair agent claims to have fixed them:\n' + JSON.stringify(judge.regressions, null, 1) + '\n\n' +
      'Read the current AFTER captures:\n' + f.surfaces.map(s => '- ' + ROOT + '/' + s.cap).join('\n') + '\n' +
      'and the BEFORE snapshots in ' + SCRATCH + ' (before-<surface-id>.png), plus references (' + f.refs + ').\n' +
      barBlock +
      'Confirm each regression is resolved and the net result beats the BEFORE state. Return the final verdict for the family.',
      { label: 'rejudge:' + f.key, phase: 'Judge', model: 'opus', schema: JUDGE_SCHEMA }
    )
    if (recheck) judge = recheck
  }

  const stranger = await strangerStage(f, idx)
  if (stranger && judge) {
    const tells = stranger.pairs.filter(p => p.imagesFound && !p.fooled).flatMap(p => (p.tells || []).map(t => '[stranger:' + p.surface + '] ' + t))
    judge.remaining = (judge.remaining || []).concat(tells)
  }

  return { family: f.key, crit: prev.crit, fix: prev.fix, judge: judge, scores: { before: prev.preScore, after: postScore, bar: bar }, stranger: stranger }
}

const selected = (args && args.families) ? FAMILIES.filter(f => args.families.includes(f.key)) : FAMILIES
log('Fidelity push over ' + selected.length + ' families: ' + selected.map(f => f.key).join(', '))

phase('Score')
const familyResults = await pipeline(
  selected,
  f => scoreStage(f, 'before', 'Score'),
  critiqueStage,
  fixStage,
  judgeStage
)

phase('Gate')
const gate = await agent(
  'Run the full verification gate for ' + ROOT + ' (work from that root) and report deltas from baseline.\n' +
  'To avoid shell-quoting problems, write a bash script to ' + SCRATCH + '/run-gates.sh and execute it. Steps, sequential:\n' +
  '1. Full capture sweep: every npm script whose name starts with "capture:" EXCEPT the argless wrappers capture:hf and capture:web. List them by reading package.json. Run each with npm run <name>; record which fail.\n' +
  '2. npm run registry:check:captures — report its counts; registryOk=false only on hard errors, not count drift (counts changed in the pass-102-111 consolidation).\n' +
  '3. npm run catalog:generate\n' +
  '4. npm run hf:lint — BASELINE is 19 pre-existing errors (docs/prototypes/full-inventory-realism-audit-pass-097.md). Report the total and list any error lines that are NEW versus that baseline.\n' +
  '5. npm run example:quickstart:render — expect a ~14s video to render successfully.\n' +
  '6. npm run inventory:generate\n' +
  'Report: captureFailures (script names), registryOk, lintErrors (count), newLintErrors, catalogOk, renderOk, inventoryOk, notes.',
  { label: 'gates', phase: 'Gate', model: 'haiku', effort: 'low', schema: GATE_SCHEMA }
)

const summary = familyResults.filter(Boolean).map(r => ({
  family: r.family,
  verdict: r.judge ? r.judge.verdict : 'unknown',
  gapsFound: r.crit && r.crit.gaps ? r.crit.gaps.length : 0,
  scoreBefore: r.scores && r.scores.before ? (r.scores.before.scores || []).map(s => ({ surface: s.surface, tokenOverall: s.tokenOverall })) : null,
  scoreAfter: r.scores && r.scores.after ? (r.scores.after.scores || []).map(s => ({ surface: s.surface, tokenOverall: s.tokenOverall })) : null,
  strangerFooled: r.stranger ? r.stranger.pairs.filter(p => p.fooled).map(p => p.surface) : null,
  strangerCaught: r.stranger ? r.stranger.pairs.filter(p => p.imagesFound && !p.fooled).map(p => p.surface) : null,
  applied: r.fix ? r.fix.applied : [],
  skipped: r.fix ? r.fix.skipped : [],
  regressionsFlagged: r.judge ? r.judge.regressions : [],
  remaining: r.judge ? r.judge.remaining : [],
  judgeSummary: r.judge ? r.judge.summary : null,
  referenceQuality: r.crit ? r.crit.referenceQuality : null,
}))
return { families: summary, gate: gate }
