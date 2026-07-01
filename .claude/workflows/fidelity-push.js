export const meta = {
  name: 'fidelity-push',
  description: 'Per-family design critique vs real-app references, tiered fix + adversarial judge + full gates',
  whenToUse: 'Run one full visual-fidelity pass over all ui-backlot surface families',
  phases: [
    { title: 'Critique', detail: 'Fable/Opus design critics per app family vs reference captures' },
    { title: 'Fix', detail: 'Sonnet implementers, file-scoped, capture-verify loops', model: 'sonnet' },
    { title: 'Judge', detail: 'Opus before/after adversarial judgment + Sonnet repair on regression', model: 'opus' },
    { title: 'Gate', detail: 'Full capture sweep + registry/catalog/lint/render gates', model: 'sonnet' },
  ],
}

const ROOT = '/Users/conmeara/Projects/ui-backlot'
const SCRATCH = '/private/tmp/claude-501/-Users-conmeara-Projects-ui-backlot/f48d5fee-5437-4f8f-9a6e-d14f0584f077/scratchpad'

const FAMILIES = [
  {
    key: 'claude', criticModel: 'fable',
    surfaces: [
      { id: 'claude-app', src: 'compositions/claude-app.html', cap: 'captures/surface-claude-app/target.png', script: 'capture:claude-app' },
      { id: 'claude-home', src: 'compositions/claude-home.html', cap: 'captures/surface-claude-home/target.png', script: 'capture:claude-home' },
      { id: 'claude-code-desktop', src: 'compositions/claude-code-desktop.html', cap: 'captures/surface-claude-code-desktop/target.png', script: 'capture:claude-code-desktop' },
    ],
    refs: 'reference/claude/images/current-app-2026-06-18/ — real-cowork-running-command.jpg and real-cowork-artifact-preview.jpg are REAL app captures (gold standard); official-cowork-how-*.png/webp are marketing shots (close but staged); official-claude-code-desktop.png is the reference for claude-code-desktop.',
    siblings: 'compositions/claude-sidebar.html, compositions/claude-composer.html, compositions/claude-conversation.html, compositions/claude-chat-shell.html, compositions/claude-chat-pane.html, compositions/claude-thread-core.html, compositions/claude-agent-rail.html, compositions/claude-prompt-stack.html, compositions/claude-home-launch.html',
  },
  {
    key: 'macos', criticModel: 'fable',
    surfaces: [
      { id: 'finder-window', src: 'compositions/finder-window.html', cap: 'captures/surface-finder-window-component/target.png', script: 'capture:finder-window' },
      { id: 'mac-menu-bar', src: 'compositions/mac-menu-bar.html', cap: 'captures/surface-mac-menu-bar/target.png', script: 'capture:mac-menu-bar' },
      { id: 'calendar-app', src: 'surfaces/calendar-app-surface.html', cap: 'captures/surface-calendar-app/target.png', script: 'capture:calendar' },
    ],
    refs: 'captures/finder-launch-deck/window.png and captures/finder-launch-deck/screen.png are REAL macOS Tahoe Finder captures (gold standard; screen.png includes the real menu bar). There is NO Calendar reference on disk — for calendar-app rely on macOS Tahoe Calendar product knowledge and only flag what you are certain of.',
    siblings: '',
  },
  {
    key: 'powerpoint', criticModel: 'opus',
    surfaces: [
      { id: 'presentation-editor', src: 'compositions/presentation-editor.html', cap: 'captures/surface-presentation-editor/target.png', script: 'capture:presentation-editor' },
    ],
    refs: 'reference/powerpoint/source-screenshots/ — mac-thumbnails-ribbon.png shows the real PowerPoint-for-Mac ribbon and thumbnail rail; other PNGs show panes and buttons. Note: pass 098 already simplified the ribbon to 6 groups with Fluent icons and made thumbnails miniature slide replicas — critique what REMAINS off, do not re-litigate those decisions.',
    siblings: '',
  },
  {
    key: 'word', criticModel: 'opus',
    surfaces: [
      { id: 'word-editor', src: 'compositions/word-editor.html', cap: 'captures/surface-word-editor/target.png', script: 'capture:word-editor' },
    ],
    refs: 'reference/word/screenshots/ — word-ribbon-tabs-groups-commands.png is the full ribbon reference; others show comment balloons, review pane, track-changes UI.',
    siblings: '',
  },
  {
    key: 'excel', criticModel: 'opus',
    surfaces: [
      { id: 'excel-workbook', src: 'compositions/excel-workbook.html', cap: 'captures/surface-excel-workbook/target.png', script: 'capture:excel-workbook' },
    ],
    refs: 'No dedicated Excel screenshots exist. Use reference/word/screenshots/ and reference/powerpoint/source-screenshots/ for the shared Office-for-Mac chrome idiom (titlebar, ribbon, hairlines) plus Excel-for-Mac product knowledge for the grid/formula bar. Be conservative: only flag what you are certain of.',
    siblings: '',
  },
  {
    key: 'figma', criticModel: 'opus',
    surfaces: [
      { id: 'figma-editor', src: 'compositions/figma-editor.html', cap: 'captures/surface-figma-editor/target.png', script: 'capture:figma-editor' },
      { id: 'figma-onboarding-editor', src: 'compositions/figma-onboarding-editor.html', cap: 'captures/surface-figma-onboarding-editor/target.png', script: 'capture:figma-onboarding-editor' },
    ],
    refs: 'reference/figma/actual-app/ — UI3 toolbar, left panel layers/pages, properties panel, full-editor shots.',
    siblings: '',
  },
  {
    key: 'codex', criticModel: 'opus',
    surfaces: [
      { id: 'codex-app', src: 'compositions/codex-app.html', cap: 'captures/surface-codex-app/target.png', script: 'capture:codex-app' },
      { id: 'codex-terminal', src: 'compositions/codex-terminal.html', cap: 'captures/surface-codex-terminal/target.png', script: 'capture:codex-terminal' },
    ],
    refs: 'reference/codex/app-screenshots/ — app-screenshot-light/dark.webp, integrated-terminal-light.webp, in-app-browser-light.webp and more (see README.md there).',
    siblings: '',
  },
  {
    key: 'browser', criticModel: 'opus',
    surfaces: [
      { id: 'browser-app', src: 'compositions/browser-app.html', cap: 'captures/surface-browser-app/target.png', script: 'capture:browser-app' },
    ],
    refs: 'No real screenshots on disk. Use Chrome-on-macOS product knowledge (tab geometry, omnibox, toolbar) and be conservative — only flag what you are certain of; prefer abstraction over invented detail.',
    siblings: '',
  },
  {
    key: 'premiere', criticModel: 'opus',
    surfaces: [
      { id: 'premiere-editor', src: 'compositions/premiere-editor.html', cap: 'captures/surface-premiere-editor/target.png', script: 'capture:premiere-editor' },
    ],
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

const GATE_SCHEMA = {
  type: 'object', required: ['captureFailures', 'registryOk', 'lintErrors', 'newLintErrors', 'catalogOk', 'renderOk', 'inventoryOk', 'notes'], additionalProperties: false,
  properties: {
    captureFailures: { type: 'array', items: { type: 'string' } },
    registryOk: { type: 'boolean' },
    lintErrors: { type: 'integer' },
    newLintErrors: { type: 'array', items: { type: 'string' } },
    catalogOk: { type: 'boolean' },
    renderOk: { type: 'boolean' },
    inventoryOk: { type: 'boolean' },
    notes: { type: 'string' },
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

function critiqueStage(f) {
  return agent(
    'Visual fidelity audit of the "' + f.key + '" family in ' + ROOT + ' (work from that root).\n' +
    'This repo is a studio backlot of hand-built HTML/CSS recreations of real apps, used to shoot agent-made demo videos. Any visual tell breaks the illusion. Your job: find what still reads as fake.\n\n' +
    'Surfaces to audit — Read each capture PNG visually:\n' + surfaceLines(f) + '\n\n' +
    'Ground-truth references: ' + f.refs + '\n' +
    'Read the actual reference images FIRST (the Read tool renders images). Then skim the composition source files to understand what is implemented.\n\n' +
    'Hunt specifically for: wrong font size/weight/family, wrong padding and spacing rhythm, wrong colors and hairlines, fake-looking icons, controls that do not exist in the real app, misaligned chrome (titlebar, traffic lights, tabs, sidebars), text or content that contradicts itself between panes, and anything that would flicker as "off" in a moving demo video.\n' +
    'HOUSE RULE — abstract before you approximate: when a control cannot be rendered at the right size/font/icon, the correct fix is to REMOVE it, not to shrink or fake it. Recommend removals freely.\n\n' +
    'For every gap give a concrete, directly implementable fix spec: exact px, hex, font-weight, element to delete, or symbol id to use. A Sonnet implementer will apply your specs verbatim — vague specs produce bad fixes.\n' +
    'Max 7 gaps, ranked most severe first (illusion-breaking, then noticeable, then polish). Only report gaps you are confident about. Where no reference image exists, flag only what you are certain of from product knowledge. In referenceQuality, note how strong your ground truth was.',
    { label: 'critique:' + f.key, phase: 'Critique', model: f.criticModel, effort: 'high', schema: CRITIQUE_SCHEMA }
  )
}

async function fixStage(crit, f) {
  if (!crit || !crit.gaps || crit.gaps.length === 0) {
    log('critique:' + f.key + ' found no confident gaps — skipping fix')
    return { crit: crit, fix: null }
  }
  log('critique:' + f.key + ' → ' + crit.gaps.length + ' gap(s); fixing')
  const beforeCmds = f.surfaces.map(s => 'cp ' + ROOT + '/' + s.cap + ' ' + SCRATCH + '/before-' + s.id + '.png').join(' && ')
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
  return { crit: crit, fix: fix }
}

async function judgeStage(prev, f) {
  if (!prev) return { family: f.key, crit: null, fix: null, judge: null }
  if (!prev.fix) return { family: f.key, crit: prev.crit, fix: null, judge: { verdict: 'no-change', regressions: [], remaining: [], summary: 'No confident gaps found; nothing changed.' } }
  const beforeList = f.surfaces.map(s => '- ' + s.id + ': BEFORE ' + SCRATCH + '/before-' + s.id + '.png | AFTER ' + ROOT + '/' + s.cap).join('\n')
  const judgePrompt =
    'Adversarial design judgment of a fidelity pass on the "' + f.key + '" family in ' + ROOT + '.\n' +
    'An implementer just applied these changes:\n' + JSON.stringify(prev.fix.applied, null, 1) + '\n\n' +
    'Read all three visual sources per surface — BEFORE snapshot, AFTER capture, and the real-app references (' + f.refs + '):\n' + beforeList + '\n\n' +
    'Decide for the whole family: is the AFTER genuinely closer to the real app than the BEFORE? Hunt for regressions the implementer missed: overlapping or clipped text, broken layout, elements that disappeared unintentionally, spacing that got worse, icons that render as empty boxes. Do NOT rubber-stamp — your default posture is skeptical.\n' +
    'verdict: "regressed" if anything is worse than before; "mixed" if real improvements plus minor new issues; "improved" only if strictly better.\n' +
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
      'Confirm each regression is resolved and the net result beats the BEFORE state. Return the final verdict for the family.',
      { label: 'rejudge:' + f.key, phase: 'Judge', model: 'opus', schema: JUDGE_SCHEMA }
    )
    if (recheck) judge = recheck
  }
  return { family: f.key, crit: prev.crit, fix: prev.fix, judge: judge }
}

const selected = (args && args.families) ? FAMILIES.filter(f => args.families.includes(f.key)) : FAMILIES
log('Fidelity push over ' + selected.length + ' families: ' + selected.map(f => f.key).join(', '))

const familyResults = await pipeline(selected, critiqueStage, fixStage, judgeStage)

phase('Gate')
const gate = await agent(
  'Run the full verification gate for ' + ROOT + ' (work from that root) and report deltas from baseline.\n' +
  'To avoid shell-quoting problems, write a bash script to ' + SCRATCH + '/run-gates.sh and execute it. Steps, sequential:\n' +
  '1. Full capture sweep: every npm script whose name starts with "capture:". List them by reading package.json. Run each with npm run <name>; record which fail.\n' +
  '2. npm run registry:check:captures — expect "51 surfaces, 32 components, 17 workflows, 51 ready captures".\n' +
  '3. npm run catalog:generate\n' +
  '4. npm run hf:lint — BASELINE is exactly 19 errors (pre-existing path/traversal issues documented in docs/prototypes/full-inventory-realism-audit-pass-097.md). Report the total and list any error lines that are NEW versus that baseline.\n' +
  '5. npm run example:quickstart:render — expect a ~14s video to render successfully.\n' +
  '6. npm run inventory:generate\n' +
  'Report: captureFailures (script names), registryOk, lintErrors (count), newLintErrors, catalogOk, renderOk, inventoryOk, notes.',
  { label: 'gates', phase: 'Gate', model: 'sonnet', effort: 'low', schema: GATE_SCHEMA }
)

const summary = familyResults.filter(Boolean).map(r => ({
  family: r.family,
  verdict: r.judge ? r.judge.verdict : 'unknown',
  gapsFound: r.crit && r.crit.gaps ? r.crit.gaps.length : 0,
  applied: r.fix ? r.fix.applied : [],
  skipped: r.fix ? r.fix.skipped : [],
  regressionsFlagged: r.judge ? r.judge.regressions : [],
  remaining: r.judge ? r.judge.remaining : [],
  judgeSummary: r.judge ? r.judge.summary : null,
  referenceQuality: r.crit ? r.crit.referenceQuality : null,
}))
return { families: summary, gate: gate }