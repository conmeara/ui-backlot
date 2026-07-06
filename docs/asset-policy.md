# Asset Policy

UI Backlot is fidelity-first. The goal is to recreate real application surfaces
as closely as possible. Match the real fonts, icons, logos, colors, spacing, and
UI details exactly — there is no public-safe, trademark, or licensing posture to
work around. If tracking a real font, glyph, logo, or UI asset makes a surface
look more like the real thing, track it.

There is exactly one practical default, and it exists to protect the repo owner,
not for licensing reasons:

**Keep your own private data out of git.** Captures of the live apps taken from
a logged-in session contain real personal content — actual chat history,
account names, calendar entries, customer or project data. Those stay local
(the `.gitignore` covers session screenshots and `elements.json` reference
dumps). Recreate the *look* faithfully with synthetic demo content in the
tracked surfaces; leave the real personal captures on disk as local reference.

## What that means in practice

- Track: real fonts, icon sets, brand marks, and any asset that improves how
  close a surface looks to the real app. Provenance notes in
  `surfaces/registry.json` (`sourceEvidence` / `assetDecision`) are helpful for
  future contributors but optional.
- Build surfaces as editable HTML/CSS/SVG — not because of any asset rule, but
  because the medium requires it: surfaces must be scriptable, re-themeable, and
  animatable for video. A pasted screenshot can't be animated; a recreated
  component can.
- Keep out of git: your own private/logged-in captures, downloaded product
  videos, extracted frames, large raw app bundles, donor-repo clones, and
  generated captures/renders — for size and privacy, not licensing.
