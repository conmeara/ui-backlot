// Publish configuration for the HyperFrames registry export
// (tools/generate-hyperframes-registry.mjs → registry/).
//
// Blocks are derived from surfaces/registry.json automatically (every
// non-deprecated surface). This file holds what cannot be derived: the shared
// infrastructure items, the vendored example set, and registry identity.

export const REGISTRY_NAME = "ui-backlot";
export const HOMEPAGE = "https://github.com/conmeara/ui-backlot";
export const REGISTRY_URL = "https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry";

// Shared infrastructure published as hyperframes:component items so blocks can
// reference them via registryDependencies instead of duplicating files.
// Every path doubles as the install target (root-relative in the consumer
// project), which keeps the compositions' rewritten references resolving.
export const SHARED_COMPONENTS = [
  {
    name: "backlot-foundation",
    title: "Backlot Foundation Styles",
    description: "Shared foundation stylesheet and brand fonts used by every UI Backlot surface. Installs to styles/ and assets/fonts/.",
    tags: ["infrastructure", "css", "fonts"],
    files: [
      "styles/backlot-foundation.css",
      "assets/fonts/AnthropicSans-Romans-Variable-25x258.ttf",
      "assets/fonts/AnthropicSans-Italics-Variable-25x258.ttf",
      "assets/fonts/AnthropicSerif-Romans-Variable-25x258.ttf",
      "assets/fonts/AnthropicSerif-Italics-Variable-25x258.ttf",
    ],
  },
  {
    name: "backlot-runtime",
    title: "Backlot Runtime",
    description: "backlot-component-loader.js (mounts surfaces via data-backlot-mount-src) and backlot-interactions.js (scriptable cursor/typing/streaming actions on the HyperFrames timeline).",
    tags: ["infrastructure", "runtime", "interactions"],
    files: [
      "runtime/backlot-component-loader.js",
      "runtime/backlot-interactions.js",
    ],
  },
  {
    name: "backlot-cursors",
    title: "macOS Cursor Set",
    description: "Recreated macOS pointer SVGs (normal, link, text, move) used by the demo cursor element.",
    tags: ["infrastructure", "cursor", "macos"],
    files: [
      "assets/cursors/normal-select.svg",
      "assets/cursors/link-select.svg",
      "assets/cursors/text-select.svg",
      "assets/cursors/move.svg",
    ],
  },
];

// Fully-vendored starter projects (hyperframes:example). The CLI's
// `init --example` only reads the official registry, so these install via:
//   npx degit conmeara/ui-backlot/registry/examples/<name> my-video
export const EXAMPLES = [
  { name: "mac-multi-app", source: "examples/mac-multi-app-demo.html", description: "macOS desktop scene: the cursor opens the Claude app from the Dock, then Excel on top — menu bar, dock, and two app surfaces composed." },
  { name: "quickstart", source: "examples/quickstart-demo.html", description: "The 14-second starter scene: macOS menu bar, browser surface, and Claude chat pane composed into one renderable demo." },
  { name: "claude-chat-interaction", source: "examples/claude-chat-interaction.html", description: "Claude chat demo: type a prompt, send, thinking, streamed reply." },
  { name: "cowork-interaction", source: "examples/cowork-interaction.html", description: "Claude cowork demo: prompt, tool card with progress steps, streamed reply." },
  { name: "excel-interaction", source: "examples/excel-interaction.html", description: "Excel demo: select a range, type =SUM(C5:C7), the result reveals." },
  { name: "word-interaction", source: "examples/word-interaction.html", description: "Word demo: the title types, body paragraphs stream, word count ticks up." },
  { name: "powerpoint-interaction", source: "examples/powerpoint-interaction.html", description: "PowerPoint demo: click the title box, type the slide title, save." },
  { name: "browser-interaction", source: "examples/browser-interaction.html", description: "Browser demo: type a URL, a loading bar sweeps, the page loads." },
  { name: "finder-interaction", source: "examples/finder-interaction.html", description: "Finder demo: the column-view Finder component with scripted file selection." },
  { name: "codex-interaction", source: "examples/codex-interaction.html", description: "Codex CLI demo: type a command, stream the terminal output." },
  { name: "claude-code-interaction", source: "examples/claude-code-interaction.html", description: "Claude Code CLI demo: type a command — tool calls and a summary stream in." },
];
