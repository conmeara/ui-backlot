# UI Backlot Sonnet 4.6 Scene Lab Design

Reference:

- `reference/claude/videos/2026-02-17-claude-sonnet-4-6-launch.mp4`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `docs/research/open-source-ui-donor-repos.md`

## Style Prompt

Quiet editorial AI interface on a real Mac backlot. The canvas can borrow
Claude's warm off-white product language for narration and transitions, but the
main reusable assets should be high-fidelity editable reconstructions of actual
Claude, Finder, and PowerPoint UI. Reference videos guide pacing and taste; live
apps, screenshots, DOM/CSS, accessibility trees, and relevant open-source UI
repos guide the UI.

Open-source projects are allowed as reference material and component donors,
especially for macOS/Finder/Dock, Claude-like chat/composer behavior, browser
chrome, and Office-like ribbons. Verify licenses before copying code or assets;
prefer extracting patterns, measurements, and component structure.

## Palette

- Canvas: `#F7F5EF`
- Ink: `#16120F`
- Muted ink: `#5D5750`
- Hairline: `#E7E0D7`
- Panel shadow: `rgba(72, 52, 39, 0.12)`
- Claude red: `#C65B47`
- Claude red dark: `#A84535`
- Sage field: `#BDD4C7`
- Coral field: `#CD6E57`
- Deep app navy: `#111326`
- Slide blue: `#1D86E8`
- Success green: `#43B875`

## Typography

- Editorial voice: `Anthropic Serif` from the installed Claude app when
  available; otherwise use a comparable warm serif.
- Product UI: `Anthropic Sans` from the installed Claude app when available;
  otherwise use the platform UI font.
- Code/status labels: `SFMono-Regular`, `Menlo`, `Monaco`, monospace.

Use serif text for Claude narration and launch/title language. Use clean sans
inside app surfaces. Avoid tiny web UI text except where it is decorative
background texture. Important readable text must be 20px or larger.

## Motion Rules

- The camera is mostly locked. Motion comes from cursor movement, UI panels,
  typing reveals, status rows, and soft focus/slide transitions.
- Use entrance offsets between 0.1s and 0.3s. No element should pop in at t=0.
- Transitions are gentle: blur crossfade, panel slide, focus pull, and slow
  surface drift.
- The Claude starburst can rotate or pulse, but it must feel calm, not like a
  loading arcade spinner.
- Cursor movement should be precise and slightly eased, with click rings where
  useful.

## UI Motifs To Match

- Pale paper background with soft sage/coral blocks.
- Large black serif Claude response text.
- Starburst icon near Claude text, often below or beside the response.
- Rounded white composer card with plus icon and red send button.
- Mac app windows shown as convincing, source-captured editable surfaces.
- Todo panel with checked and unchecked tasks.
- Muted opacity background app manipulation, with a single clear focal change.

## What Not To Do

- Do not use purple/blue gradient tech styling.
- Do not spend time cloning fake apps from reference videos, such as StoreDesk.
- Do not flatten real apps into screenshots when the surface needs to be edited
  or animated. Rebuild the important controls in HTML/CSS.
- Do not treat open-source donor repos as drop-in products unless the license,
  attribution, bundle size, and styling control are all acceptable.
- Do not use the downloaded Claude videos as visible assets in the composition.
- Do not add explanatory labels that would not be present in a launch clip.
- Do not make the scene feel like a web landing page.
