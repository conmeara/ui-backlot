export const meta = {
  name: 'interaction-push',
  description: 'Motion-fidelity loop per interaction demo: author (if missing), render to video, frame-level motion judge with stranger-recording test, fix rounds, then ship GIF + README row',
  whenToUse: 'Run a full motion pass over the interaction demos (examples/*-interaction.html), or author canonical demos for surfaces that lack one. Args: {demos: ["figma", "excel", ...]} to scope; {skipRefresh: true} to skip motion-reference acquisition.',
  phases: [
    { title: 'Motion refs', detail: 'Per-family real-recording check; acquisition when missing (docs/reference-and-asset-sourcing.md Part 1.5)', model: 'sonnet' },
    { title: 'Author', detail: 'Sonnet authors canonical demos for surfaces that lack one, copying the structure of existing examples', model: 'sonnet' },
    { title: 'Render', detail: 'Draft video render + frame extraction for judging', model: 'haiku' },
    { title: 'Judge', detail: 'Opus motion judge reads the frame sequence: pacing, cursor believability, state coherence, stranger-recording test', model: 'opus' },
    { title: 'Fix', detail: 'Sonnet applies motion repairs, re-renders, re-judges (max 3 repair rounds)', model: 'sonnet' },
    { title: 'Ship', detail: 'Palette-GIF conversion into docs/media + README demo-table rows for passed demos', model: 'sonnet' },
  ],
}

const ROOT = '/Users/botbot/Projects/ui-backlot'
// Stable scratch dir (survives across sessions; agents mkdir -p it).
// Repo-local + gitignored so the review pages (npm run review) can see it.
const SCRATCH = ROOT + '/workspace/interactions'

// status 'existing': the demo ships today (example + GIF in the README table) —
// it gets re-rendered and judged, and only touched if the judge finds issues.
// status 'new': no example exists yet — the Author phase creates it from the
// listed composition, then it flows through the same render/judge/fix loop.
const DEMOS = [
  {
    id: 'claude-chat', status: 'existing',
    example: 'examples/claude-chat-interaction.html',
    gif: 'docs/media/claude-chat-interaction.gif',
    story: 'Type a prompt into the Claude composer, send it, a thinking indicator pulses, then the reply streams in.',
  },
  {
    id: 'cowork', status: 'existing',
    example: 'examples/cowork-interaction.html',
    gif: 'docs/media/cowork-interaction.gif',
    story: 'A prompt is sent, a tool card runs with progress steps, then a streamed reply summarizes the work.',
  },
  {
    id: 'excel', status: 'existing',
    example: 'examples/excel-interaction.html',
    gif: 'docs/media/excel-interaction.gif',
    story: 'Select a cell, type =SUM(C5:C7) into it, the result and status-bar sum reveal.',
  },
  {
    id: 'word', status: 'existing',
    example: 'examples/word-interaction.html',
    gif: 'docs/media/word-interaction.gif',
    story: 'The document title types in, body paragraphs stream, the word count ticks up.',
  },
  {
    id: 'powerpoint', status: 'existing',
    example: 'examples/powerpoint-interaction.html',
    gif: 'docs/media/powerpoint-interaction.gif',
    story: 'Click the slide title box, type the title, save.',
  },
  {
    id: 'browser', status: 'existing',
    example: 'examples/browser-interaction.html',
    gif: 'docs/media/browser-interaction.gif',
    story: 'Type a URL into the omnibox, a loading bar sweeps, the page content loads.',
  },
  {
    id: 'finder', status: 'existing',
    example: 'examples/finder-interaction.html',
    gif: 'docs/media/finder-interaction.gif',
    story: 'The real column-view Finder component — the cursor selects files column by column.',
  },
  {
    id: 'codex', status: 'existing',
    example: 'examples/codex-interaction.html',
    gif: 'docs/media/codex-interaction.gif',
    story: 'Type a command into the Codex terminal, the output streams in.',
  },
  {
    id: 'claude-code', status: 'existing',
    example: 'examples/claude-code-interaction.html',
    gif: 'docs/media/claude-code-interaction.gif',
    story: 'Type a command into the Claude Code CLI — tool calls and a summary stream in.',
  },
  {
    id: 'mac-multi-app-demo', status: 'existing',
    example: 'examples/mac-multi-app-demo.html',
    gif: 'docs/media/mac-multi-app-demo.gif',
    story: 'On the macOS desktop, the cursor pulls the Claude app up from the dock, then opens Excel on top of it.',
  },
  {
    id: 'figma', status: 'new',
    example: 'examples/figma-interaction.html',
    gif: 'docs/media/figma-interaction.gif',
    composition: 'compositions/figma-editor.html',
    story: 'Click a layer in the Figma layers panel — the canvas selection outline appears and the properties panel updates — then the cursor drags the frame a few pixels and the X/Y values tick.',
  },
  {
    id: 'premiere', status: 'new',
    example: 'examples/premiere-interaction.html',
    gif: 'docs/media/premiere-interaction.gif',
    composition: 'compositions/premiere-editor.html',
    story: 'Click a clip in the Premiere timeline to select it, then drag the playhead across it — the timecode readout ticks as it moves.',
  },
  {
    id: 'calendar', status: 'new',
    example: 'examples/calendar-interaction.html',
    gif: 'docs/media/calendar-interaction.gif',
    composition: 'compositions/calendar-app.html',
    story: 'Click an empty slot in the Calendar week view — a new event block appears and its title types in.',
  },
]

// App family per demo — motion references are shared per family
// (reference/<family>/motion/), several demos show the same app.
const DEMO_FAMILY = {
  'claude-chat': 'claude', cowork: 'claude', 'claude-code': 'claude',
  excel: 'excel', word: 'word', powerpoint: 'powerpoint',
  browser: 'browser', finder: 'macos', 'mac-multi-app-demo': 'macos', calendar: 'macos',
  codex: 'codex', figma: 'figma', premiere: 'premiere',
}

// family -> absolute frames dir of the best real interaction recording,
// populated by the Motion refs phase; judgePrompt reads it at call time.
const motionByFamily = {}

const MOTION_REF_SCHEMA = {
  type: 'object', required: ['found', 'framesDir', 'notes'], additionalProperties: false,
  properties: {
    found: { type: 'boolean' },
    framesDir: { type: ['string', 'null'] },
    frameCount: { type: ['integer', 'null'] },
    notes: { type: 'string' },
  },
}

const AUTHOR_SCHEMA = {
  type: 'object', required: ['authored', 'file', 'actions', 'durationSeconds', 'notes'], additionalProperties: false,
  properties: {
    authored: { type: 'boolean' },
    file: { type: 'string' },
    actions: { type: 'array', items: { type: 'string' } },
    durationSeconds: { type: ['number', 'null'] },
    hooksAdded: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const RENDER_SCHEMA = {
  type: 'object', required: ['renderOk', 'videoPath', 'framesDir', 'frameCount', 'notes'], additionalProperties: false,
  properties: {
    renderOk: { type: 'boolean' },
    videoPath: { type: 'string' },
    framesDir: { type: 'string' },
    frameCount: { type: 'integer' },
    notes: { type: 'string' },
  },
}

const JUDGE_SCHEMA = {
  type: 'object', required: ['verdict', 'motionIssues', 'pacing', 'strangerRead', 'summary'], additionalProperties: false,
  properties: {
    verdict: { enum: ['pass', 'fix', 'unusable'] },
    motionIssues: {
      type: 'array', maxItems: 7,
      items: {
        type: 'object', required: ['atSeconds', 'target', 'issue', 'fix', 'severity'], additionalProperties: false,
        properties: {
          atSeconds: { type: 'number' },
          target: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
          severity: { enum: ['illusion-breaking', 'noticeable', 'polish'] },
        },
      },
    },
    pacing: { type: 'string' },
    strangerRead: {
      type: 'object', required: ['readsAsRecording', 'tells'], additionalProperties: false,
      properties: {
        readsAsRecording: { type: 'boolean' },
        tells: { type: 'array', items: { type: 'string' } },
      },
    },
    summary: { type: 'string' },
  },
}

const FIX_SCHEMA = {
  type: 'object', required: ['applied', 'skipped', 'reRendered', 'notes'], additionalProperties: false,
  properties: {
    applied: { type: 'array', items: { type: 'object', required: ['file', 'change'], additionalProperties: false, properties: { file: { type: 'string' }, change: { type: 'string' } } } },
    skipped: { type: 'array', items: { type: 'object', required: ['issue', 'reason'], additionalProperties: false, properties: { issue: { type: 'string' }, reason: { type: 'string' } } } },
    reRendered: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const SHIP_SCHEMA = {
  type: 'object', required: ['shipped', 'readmeRowsAdded', 'failures', 'notes'], additionalProperties: false,
  properties: {
    shipped: { type: 'array', items: { type: 'string' } },
    readmeRowsAdded: { type: 'array', items: { type: 'string' } },
    failures: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

// Determinism + house rules for anyone editing an example. HyperFrames renders
// by SEEKING a paused GSAP timeline, so these are hard constraints, not style.
const GOTCHAS = [
  '1. SEEK-DETERMINISM: HyperFrames renders by seeking the paused GSAP timeline registered at window.__timelines["<data-composition-id>"] and screenshotting each frame. Every visual must be a pure function of timeline time. Never use setTimeout, CSS keyframe animations, transition:, live event handlers, or tl.call() — none of them evaluate on seek.',
  '2. USE THE LIBRARY: script actions through BacklotInteractions (runtime/backlot-interactions.js): moveTo, click, type, stream, send, show, hide, think, press, toggle. Text targets must start EMPTY in the markup (use a separate placeholder element and hide() it if layout needs it). State flips use paired tl.set(el, {attr:{class}}) calls, never .call().',
  '3. STRUCTURE: copy the structure of an existing example exactly — a stage div with data-composition-id/data-width="1280"/data-height="800"/data-duration, a .demo-cursor and .demo-click-ring element, gsap 3.14.2 + ../runtime/backlot-interactions.js (and ../runtime/backlot-component-loader.js when mounting a composition) loaded the same way. Read 2-3 neighbors in examples/ before writing anything.',
  '4. HUMAN PACING: the recording must read as a real person using the app. Cursor GLIDES to a target before clicking (never teleports), a 0.3-0.8s beat separates actions, typing runs ~15-25 cps, AI streaming ~40-55 cps, and the demo starts at rest and ends settled for ~1s. Total duration 6-14 seconds.',
  '5. SCOPE: edit only the example file for your demo. If a mounted composition lacks a stable hook class you genuinely need, you may add the class attribute (no visual change) — then run its capture script (npm run capture:<basename>) and confirm the PNG is visually unchanged. Never edit runtime/, tools/, or styles/backlot-foundation.css.',
  '6. FIDELITY: any element you add must match the surface idiom — real fonts, real glyphs (assets/icons/source-authentic/ sprites or node tools/find-icon.mjs), no hand-drawn icons, no invented UI. If an interaction needs a control the surface lacks, pick a different interaction. INTERACTION RESPONSES are part of fidelity too: how a control reacts to a press, how typed text appears and commits, and the app\'s own animation durations/easings must copy the REAL app (check reference/<family>/motion/ frames when they exist) — never invent a reaction the app does not have.',
  '7. Do NOT run any git commands (no commit, stash, checkout, restore). The orchestrator handles version control.',
].join('\n')

function renderCmds(d) {
  const video = 'renders/' + d.id + '-interaction-push.mp4'
  const frames = SCRATCH + '/frames-' + d.id
  return {
    video: video,
    frames: frames,
    script:
      'cd ' + ROOT + '\n' +
      'npx hyperframes render --composition ' + d.example + ' --quality draft --low-memory-mode --output ' + video + '\n' +
      'rm -rf ' + frames + ' && mkdir -p ' + frames + '\n' +
      'ffmpeg -y -v error -i ' + video + ' -vf fps=2 ' + frames + '/f-%03d.png',
  }
}

function authorStage(d) {
  if (d.status !== 'new') return Promise.resolve({ authored: false, file: d.example, actions: [], durationSeconds: null, notes: 'existing demo — skipped authoring' })
  return agent(
    'Author a new interaction demo in ' + ROOT + ' (work from that root): ' + d.example + '\n\n' +
    'STORY (the canonical ~10s demo for this surface): ' + d.story + '\n' +
    'SURFACE: the demo shows ' + d.composition + '. Decide whether to mount it with runtime/backlot-component-loader.js (how examples/finder-interaction.html does it) or to build a faithful simplified window inline (how examples/excel-interaction.html does it) — mount the real composition when its layout survives at 1280x800, otherwise inline. State which you chose and why in notes.\n\n' +
    'FIRST read the authoring guide ("Scriptable interactions" section of README.md) and docs/interactions-system-plan.md, then Read examples/finder-interaction.html and examples/excel-interaction.html end to end, plus ' + d.composition + ' to learn its structure and class names.\n\n' +
    'RULES:\n' + GOTCHAS + '\n\n' +
    'VERIFY before finishing: render it — npx hyperframes render --composition ' + d.example + ' --quality draft --low-memory-mode --output renders/' + d.id + '-interaction-push.mp4 — and confirm the command exits cleanly. If the render errors, fix the example until it renders.\n' +
    'Return: authored=true, file, actions (the ix.* calls used, in order), durationSeconds, hooksAdded (class hooks added to the composition, if any), notes.',
    { label: 'author:' + d.id, phase: 'Author', model: 'sonnet', schema: AUTHOR_SCHEMA }
  )
}

function renderStage(prev, d) {
  const c = renderCmds(d)
  return agent(
    'Render an interaction demo and extract judging frames (mechanical). In ' + ROOT + ', write this to ' + SCRATCH + '/render-' + d.id + '.sh and execute it with bash:\n' +
    'mkdir -p ' + SCRATCH + '\n' + c.script + '\n\n' +
    'Then: ls ' + c.frames + ' | wc -l for frameCount, and confirm the mp4 exists and is non-trivial (>50KB). renderOk=false if the render errored or produced no frames — put the exact error in notes.\n' +
    'Return: renderOk, videoPath=' + c.video + ', framesDir=' + c.frames + ', frameCount, notes.',
    { label: 'render:' + d.id, phase: 'Render', model: 'haiku', effort: 'low', schema: RENDER_SCHEMA }
  ).then(r => ({ author: prev, render: r }))
}

function motionBlock(d) {
  const dir = motionByFamily[DEMO_FAMILY[d.id]]
  if (!dir) return ''
  return '\nREAL-MOTION CALIBRATION: a real recording of this app exists. BEFORE judging, Read 5-10 frames from ' + dir + ' (0.5s apart, same cadence as the demo frames) to calibrate how the real APP RESPONDS to interaction — control press states, how typed text appears and commits, the duration/easing of its native animations (selections, loading bars, transitions), and beat length between actions. Hold the demo to that bar, and where its app responses or pacing deviate from the real idiom, cite the reference frame in the issue.\n'
}

function judgePrompt(d, framesDir, round) {
  return 'Motion judgment of an interaction demo recording, "' + d.id + '", in ' + ROOT + (round > 1 ? ' (re-judge after repair round ' + (round - 1) + ' — verify the earlier issues are actually gone before anything else)' : '') + '.\n' +
    'This repo renders scripted UI demos that must read as REAL screen recordings of a person using the app. You are judging the motion, not the static pixels — static fidelity has its own loop.\n\n' +
    'STORY the demo must tell: ' + d.story + '\n' +
    motionBlock(d) + '\n' +
    'EVIDENCE — Read ALL frames in ' + framesDir + ' IN ORDER (f-001.png, f-002.png, ...; they are 0.5s apart), then Read the timeline source ' + d.example + ' to check scripted timings against what the frames show.\n\n' +
    'JUDGE, in priority order:\n' +
    '1. APP-RESPONSE FIDELITY (the top concern): every way the APP reacts to an interaction must be 1:1 with the real app — how a control visually responds to a press (highlight, depress, focus ring, active state), how typing appears (caret idiom, cell-edit vs field-edit behavior, where the text commits), and how the app\'s own animations run (selection outlines, loading/progress bars, panel and state transitions, streaming reveals) at the right duration and easing. Flag BOTH invented reactions the real app does not have AND real-app reactions that are missing. Judge this against the real recording frames when they exist; otherwise flag only what you are certain of.\n' +
    '2. STATE COHERENCE: every frame must be a plausible instant of the story — nothing appears before its cause (reply before send, result before typing finishes), nothing pops in fully-formed without motion, no frame shows contradictory state.\n' +
    '3. PACING: typing reads at human speed (~15-25 cps), streaming reads as AI output (~40-55 cps), actions are separated by natural beats, the demo starts at rest and ends settled. Flag rushed or dead stretches with timestamps.\n' +
    '4. VISUAL INTEGRITY IN MOTION: no clipped/overlapping text mid-reveal, no empty icon boxes, no layout shift that reads as a glitch.\n' +
    '5. CURSOR MECHANICS (the cursor rig is a shared global — do not re-litigate its styling per demo): flag only real defects — teleports between frames, click ring firing before arrival, cursor missing when an action happens.\n' +
    '6. STRANGER-RECORDING TEST: forget the context; flip through the frames as a stranger. Would you accept this as a screen recording of the real app? Record readsAsRecording and the concrete tells if not.\n\n' +
    'For every issue: atSeconds (frame number x 0.5), target (element/selector), issue, and a directly implementable fix (exact ix.* call to change, at/dur/cps value, or element to fix) — a Sonnet implementer applies your specs verbatim. Max 7, most severe first. Only report issues you are confident about.\n' +
    'verdict: "pass" if the recording is believable with at most polish-level issues; "fix" if repairable issues remain; "unusable" only if the demo fundamentally cannot tell its story (wrong interaction, broken render).'
}

// 3 rounds, not 2: the excel smoke test (wf_ff0959b7) hit a 2-round cap with a
// one-line judge-specified fix still open — the extra round only runs on "fix".
const MAX_REPAIR_ROUNDS = 3

async function judgeFixLoop(prev, d) {
  if (!prev || !prev.render) return { demo: d.id, status: d.status, verdict: 'render-failed', author: prev ? prev.author : null, rounds: [], judge: null }
  if (!prev.render.renderOk) return { demo: d.id, status: d.status, verdict: 'render-failed', author: prev.author, rounds: [], judge: { summary: prev.render.notes } }
  const c = renderCmds(d)

  let judge = await agent(judgePrompt(d, prev.render.framesDir, 1), { label: 'judge:' + d.id, phase: 'Judge', model: 'opus', effort: 'high', schema: JUDGE_SCHEMA })
  const rounds = []

  for (let round = 1; round <= MAX_REPAIR_ROUNDS; round += 1) {
    if (!judge || judge.verdict === 'pass' || judge.verdict === 'unusable') break
    const fixable = (judge.motionIssues || []).filter(i => i.severity !== 'polish')
    if (fixable.length === 0) break
    const fix = await agent(
      'Repair motion issues in an interaction demo, round ' + round + ' of up to ' + MAX_REPAIR_ROUNDS + '. Work in ' + ROOT + '.\n' +
      'FILE: ' + d.example + ' (this is your scope — see rule 5 for the one exception).\n\n' +
      'ISSUES from the motion judge (fix every non-polish one; specs are implementable verbatim):\n' + JSON.stringify(judge.motionIssues, null, 1) + '\n' +
      'Judge pacing notes: ' + (judge.pacing || 'none') + '\n' +
      (judge.strangerRead && !judge.strangerRead.readsAsRecording ? 'Stranger tells to eliminate: ' + JSON.stringify(judge.strangerRead.tells) + '\n' : '') + '\n' +
      'RULES:\n' + GOTCHAS + '\n\n' +
      'VERIFY: after your edits, re-render and re-extract frames by running this as bash:\n' + c.script + '\n' +
      'Then Read a few frames around each issue timestamp (frame ≈ atSeconds x 2, files are 0.5s apart) and confirm the issue is gone. If a spec cannot be implemented cleanly, skip it with a reason — never force a change that breaks determinism rules.\n' +
      'Return: applied, skipped, reRendered, notes.',
      { label: 'fix:' + d.id + ':r' + round, phase: 'Fix', model: 'sonnet', schema: FIX_SCHEMA }
    )
    rounds.push({ round: round, applied: fix ? (fix.applied || []).length : 0, skipped: fix ? (fix.skipped || []).length : 0 })
    if (!fix || !fix.reRendered) { log('fix:' + d.id + ' round ' + round + ' did not re-render — stopping loop'); break }
    judge = await agent(judgePrompt(d, c.frames, round + 1), { label: 'rejudge:' + d.id + ':r' + round, phase: 'Fix', model: 'opus', effort: 'high', schema: JUDGE_SCHEMA })
    log('fix:' + d.id + ' round ' + round + ' → verdict ' + (judge ? judge.verdict : 'none'))
  }

  return { demo: d.id, status: d.status, verdict: judge ? judge.verdict : 'unknown', author: prev.author, rounds: rounds, judge: judge }
}

// args may arrive as an object OR a JSON string — parse defensively (same
// guard as fidelity-push; a silently-unmatched filter would run everything).
let argv = args
if (typeof argv === 'string') { try { argv = JSON.parse(argv) } catch { argv = undefined } }
const wantDemos = argv && Array.isArray(argv.demos) ? argv.demos : null
const skipRefresh = !!(argv && argv.skipRefresh)
const selected = wantDemos ? DEMOS.filter(d => wantDemos.includes(d.id)) : DEMOS
if (wantDemos && selected.length === 0) throw new Error('No demos matched ' + JSON.stringify(wantDemos) + ' — valid ids: ' + DEMOS.map(d => d.id).join(', '))
log('Interaction push over ' + selected.length + ' demo(s): ' + selected.map(d => d.id + (d.status === 'new' ? ' (new)' : '')).join(', '))

// Motion ground truth, deduped per app family (several demos share one app).
// Static screenshots can't ground pacing — the judge calibrates cursor speed,
// easing, and beat length against frames of a REAL recording when one exists.
if (!skipRefresh) {
  phase('Motion refs')
  const families = Array.from(new Set(selected.map(d => DEMO_FAMILY[d.id]).filter(Boolean)))
  const checks = await parallel(families.map(fam => () =>
    agent(
      'Motion-reference check for the "' + fam + '" app family in ' + ROOT + ' (work from that root; READ-ONLY).\n' +
      'Look for extracted real-recording frames: ls -d reference/' + fam + '/motion/2*/*/frames 2>/dev/null. If several, read the sibling manifest.json files and pick the newest label that shows real UI interaction footage.\n' +
      'Return found, framesDir (ABSOLUTE path to the frames dir, or null), frameCount (PNG count in it), notes.',
      { label: 'motion-check:' + fam, phase: 'Motion refs', model: 'haiku', effort: 'low', schema: MOTION_REF_SCHEMA }
    ).then(r => ({ fam: fam, check: r }))
  ))
  for (const c of checks.filter(Boolean)) {
    if (c.check && c.check.found && c.check.framesDir) motionByFamily[c.fam] = c.check.framesDir
  }
  const misses = families.filter(fam => !motionByFamily[fam])
  if (misses.length) {
    log('Motion refs missing for: ' + misses.join(', ') + ' — acquiring')
    const acqs = await parallel(misses.map(fam => () => {
      const stories = selected.filter(d => DEMO_FAMILY[d.id] === fam).map(d => d.story).join(' | ')
      return agent(
        'Acquire MOTION ground truth for the "' + fam + '" app family in ' + ROOT + ' (work from that root). No real interaction recording exists on disk yet.\n' +
        'Read docs/reference-and-asset-sourcing.md Part 1.5 and reference/sources.json (this family\'s tier), then work the motion ladder: record the real local app with screencapture -v, record the web app in the user\'s Chrome, or cut a clip from an official vendor video (yt-dlp + ffmpeg; brew install yt-dlp if missing).\n' +
        'The demos needing calibration tell these stories: ' + stories + ' — footage of the SAME kind of interaction is ideal; any real footage of the app in use beats nothing. What matters most in the clip is the APP\'S RESPONSE: press/active states on controls, how typed text appears and commits, native animation durations and easing (selections, loading, transitions).\n' +
        'File as reference/' + fam + '/motion/$(date +%F)/<label>/ with clip.mp4, frames/ extracted at fps=2 (ffmpeg -i clip.mp4 -vf fps=2 frames/f-%03d.png), and manifest.json {source, interaction, note}. Clips/frames are gitignored (local-only) — expected.\n' +
        'Budget: ONE good 5-15s clip is enough. If no rung works without logging in or heavy setup, return found=false and list what you tried in notes. HARD RULES: never log in, never touch bot checks, no git commands.\n' +
        'Return found, framesDir (ABSOLUTE), frameCount, notes.',
        { label: 'motion-acquire:' + fam, phase: 'Motion refs', model: 'sonnet', schema: MOTION_REF_SCHEMA }
      ).then(r => ({ fam: fam, acq: r }))
    }))
    for (const a of acqs.filter(Boolean)) {
      if (a.acq && a.acq.found && a.acq.framesDir) motionByFamily[a.fam] = a.acq.framesDir
    }
  }
  log('Motion refs ready for: ' + (Object.keys(motionByFamily).join(', ') || 'none'))
}

phase('Author')
const results = await pipeline(selected, authorStage, renderStage, judgeFixLoop)

// Barrier is deliberate: one ship agent handles every passed demo so the
// README demo table is edited exactly once.
phase('Ship')
const passed = results.filter(Boolean).filter(r => r.verdict === 'pass')
let ship = null
if (passed.length === 0) {
  log('No demo reached a pass verdict — nothing to ship')
} else {
  const lines = passed.map(r => {
    const d = DEMOS.find(x => x.id === r.demo)
    return '- ' + r.demo + ' (' + r.status + '): mp4 renders/' + r.demo + '-interaction-push.mp4 → gif ' + d.gif + ' | example ' + d.example + ' | story: ' + d.story
  }).join('\n')
  ship = await agent(
    'Ship passed interaction demos in ' + ROOT + ' (work from that root).\n\n' +
    'DEMOS (all passed an adversarial motion judge):\n' + lines + '\n\n' +
    'For EACH demo:\n' +
    '1. Convert mp4 → GIF with the repo recipe (two-pass palette, ~16.7fps to match the existing GIFs):\n' +
    '   ffmpeg -y -v error -i <mp4> -vf "fps=50/3,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" <gif>\n' +
    '2. Verify with ffprobe: the GIF exists, matches the mp4 dimensions, and is under 25MB (GitHub renders up to that; if larger, drop fps to 12 and retry).\n' +
    '3. For demos marked (new): add a row to the "App interactions" table in README.md following the existing cell format exactly (bold app name, img with alt text, one-line <sub> caption from the story). Keep the table two columns; fill the empty cell in the last row before opening a new row. Do NOT touch rows of existing demos.\n' +
    'Then run npm run hf:lint and confirm no NEW lint errors mention the example files listed above.\n' +
    'Return: shipped (demo ids with a verified GIF), readmeRowsAdded, failures, notes.\n\n' +
    'Do NOT run any git commands.',
    { label: 'ship', phase: 'Ship', model: 'sonnet', schema: SHIP_SCHEMA }
  )
}

const summary = results.filter(Boolean).map(r => ({
  demo: r.demo,
  status: r.status,
  verdict: r.verdict,
  authored: r.author ? r.author.authored : false,
  repairRounds: r.rounds,
  motionIssues: r.judge && r.judge.motionIssues ? r.judge.motionIssues : [],
  strangerRead: r.judge ? r.judge.strangerRead : null,
  judgeSummary: r.judge ? r.judge.summary : null,
}))
return { demos: summary, ship: ship }
