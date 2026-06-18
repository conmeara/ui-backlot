# HyperFrames References

The upstream HyperFrames repositories are intentionally stored outside this
project at:

`/Users/conmeara/Projects/ui-backlot-references/hyperframes/repositories`

HyperFrames Studio scans project folders for compositions. Keeping cloned
reference repos outside `/Users/conmeara/Projects/ui-backlot` prevents the
preview server from treating their demo HTML as part of UI Backlot and emitting
irrelevant missing-asset warnings.
