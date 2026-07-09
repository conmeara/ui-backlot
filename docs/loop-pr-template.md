# Loop PR Template

The PR body format for every automated improvement-loop PR (fidelity-push,
interaction-push, and future loops). The reviewer reads these ON A PHONE —
the format is optimized for one-thumb scrolling, and PR agents follow it
EXACTLY. Deviating (tables, bare URLs, detail-first prose) has already failed
review once; don't improvise.

## Hard rules

1. **Images and GIFs must use markdown image syntax**: `![label](absolute-raw-url)`.
   A bare URL renders as a LINK on GitHub, not media — this is the #1 failure.
   Raw URLs look like `https://raw.githubusercontent.com/conmeara/ui-backlot/<ref>/<path>`.
2. **Never put media in tables.** Stack everything vertically: label line, then
   the image on its own line. Tables render as microscopic side-by-side cells
   on mobile.
3. **TL;DR first.** 3–6 plain-English bullets a human can skim in 10 seconds:
   what they will SEE changed. No scores, no selectors, no file paths in the
   TL;DR.
4. **Details go in `<details>` blocks.** Scores, per-file change lists,
   skipped-repair reasoning, judge notes — all collapsed. The open body is
   summary + media only.
5. **One section per surface/demo**, `###` heading, ordered most-changed first.
6. **WIP is labeled.** Anything committed to the branch that did NOT pass its
   judge goes under a `## Not shipped (work in progress)` section naming each
   file and why it's included.

## Skeleton — fidelity pass

```markdown
## TL;DR
- <plain-English visible change, e.g. "Claude surfaces: warmer cream replaced with the app's real neutral paper color">
- <3–6 bullets total, most noticeable first>

## <surface-id> — <one-line what changed>
**Before**

![before](https://raw.githubusercontent.com/conmeara/ui-backlot/<branch>/reports/fidelity/pr-media/<branch>/<id>-before.png)

**After**

![after](https://raw.githubusercontent.com/conmeara/ui-backlot/<branch>/reports/fidelity/pr-media/<branch>/<id>-after.png)

<details><summary>Details: verdict, scores, full change list</summary>

- Verdict: <improved/mixed> · tokenOverall <a> → <b>
- <each applied change, one bullet>
- Skipped: <issue — reason> (if any)
</details>

## Remaining for a future pass
- <short list>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Skeleton — interaction (motion) pass

```markdown
## TL;DR
- <plain-English motion change, e.g. "Excel: removed an invented cell-pulse the real app doesn't have">
- <3–6 bullets, most noticeable first>

## <demo-id> — pass (<n> repair round<s>)
<one or two sentences: WHAT CHANGED in this demo's motion, from the applied fixes — not the story restated>

**Before**

![before](https://raw.githubusercontent.com/conmeara/ui-backlot/main/docs/media/<demo>.gif)

**After**

![after](https://raw.githubusercontent.com/conmeara/ui-backlot/<branch>/docs/media/<demo>.gif)

▶ [Full-quality MP4](https://raw.githubusercontent.com/conmeara/ui-backlot/<branch>/reports/interactions/pr-media/<branch>/<demo>.mp4)

<details><summary>Details: judge notes, remaining polish</summary>
- <judge issues fixed / remaining polish items>
</details>

## Not shipped (work in progress)
- `<file>` — <why it's on the branch, e.g. "hit the 3-round repair cap at verdict 'fix'; needs a targeted follow-up pass">

## Remaining for a future pass
- <short list>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Notes for PR agents:

- New demos have no before GIF: write `_(new demo — no before)_` instead of the
  Before block.
- MP4s: copy each shipped demo's draft render (`renders/<demo>-interaction-push.mp4`,
  gitignored) to `reports/interactions/pr-media/<branch>/<demo>.mp4` and commit —
  raw MP4 links open the phone's native player (GitHub's inline video player is
  drag-and-drop-only, no API — GIFs are the only automatable inline motion).
- Keep the PR title short: `Fidelity pass: <families> (<date>)` /
  `Interaction pass: <demos> (<date>)`.
