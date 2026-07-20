# App icon attribution

macOS system app icons (finder.png, safari.png, notes.png, calendar.png,
terminal.png, messages.png) are from the macos-web project by Puru Vijay,
used under the MIT License:
https://github.com/PuruVJ/macos-web  (public/app-icons)

Other app icons (Claude, Office, Figma, Premiere) are sourced/recreated
separately; see the dock composition and per-file provenance.

`folder-generic.png` is Apple's own GenericFolderIcon, extracted directly
from this Mac's system resources (`sips -s format png
/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns`)
per the asset-sourcing ladder's "This Mac" rung
(docs/reference-and-asset-sourcing.md Part 2, step 3).

`folder-home.png` matches the real Claude Code CLI window chrome more
precisely: the reference (reference/claude/2026-07-20/cli-terminal-startup-dark
and cli-terminal-chat-dark) shows the macOS **Home** folder glyph — the
generic blue folder with a translucent house watermark, because the
terminal session's cwd is `~`. It is composited from two sourced elements
(no hand-drawn glyphs): the same GenericFolderIcon.icns base above, plus the
`house-fill` glyph from the f7 (Framework7/SF-Symbols-style) icon set via
`tools/find-icon.mjs house --sets f7`, rendered to a transparent PNG with
Playwright and blended on as a darkened, partially-transparent watermark to
match the reference's tonal relationship (house reads darker than the
surrounding folder blue). Used in
compositions/claude-code-terminal-session.html's titlebar folder glyph.
