# docs/

Map of the documentation tree — what's durable reference vs dated working notes.

## Durable guides & reference

| Doc | What it covers |
|---|---|
| [catalog.md](catalog.md) | **Generated** surface catalog (`npm run catalog:generate`) — don't edit by hand |
| [design-language.md](design-language.md) | Visual identity: palette, typography, motion rules |
| [guides/build-hyperframes-demo.md](guides/build-hyperframes-demo.md) | Composing a demo from tracked components |
| [interactions-system-plan.md](interactions-system-plan.md) | The scriptable-interactions runtime design and determinism rules |
| [reference/primitives.md](reference/primitives.md) | The `data-primitive` motion/surface primitive catalog |
| [workflows/](workflows/) | Reusable capture/reconstruction workflow guides |
| [fidelity-loop-plan-2026-07-05.md](fidelity-loop-plan-2026-07-05.md) | The ground-truth capture / drift / rebuild loop design |

## Dated working notes

| Location | What it holds |
|---|---|
| [prototypes/](prototypes/) | One note per numbered improvement pass (`*-pass-NNN.md`) — the project's iteration changelog. Registry `prototypeNote` fields point here; keep them. |
| [research/](research/) | Dated research sweeps (reference videos, donor repos, tooling scans) |
| `specs/` | Measured visual specs, written by the onboard-app workflow when a new family is added |
| [demos/](demos/) | Script/storyboard working docs for specific produced videos |
| [media/](media/) | The rendered demo GIFs embedded in the README |

Root-level docs: [README](../README.md) (humans), [CLAUDE.md](../CLAUDE.md) /
[AGENTS.md](../AGENTS.md) (agents), [VISION.md](../VISION.md) (north star),
[CONTRIBUTING.md](../CONTRIBUTING.md), [RESOURCES.md](../RESOURCES.md)
(attribution & licensing), [llms.txt](../llms.txt) (external-consumer entry).
