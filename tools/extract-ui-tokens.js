/*
 * Browser-injectable UI token + geometry extractor.
 *
 * Single source of truth for measuring a rendered UI — ours or the real
 * app's. Runs in any page context:
 *   - Playwright: tools/capture-live-reference.mjs evaluates this file, then
 *     calls extractUiTokens(selector).
 *   - claude-in-chrome MCP: paste this file via javascript_tool against the
 *     user's logged-in tab, save the returned JSON with
 *     tools/import-reference.mjs --tokens.
 *
 * The payload shape matches captures/<slug>/capture.json (produced by
 * tools/capture-web-ui.mjs) so tools/fidelity-score.mjs can diff either side
 * symmetrically. Additions over capture-web-ui: padding/gap in per-element
 * style and a spacing frequency table.
 *
 * Plain script (no module syntax) so it can be evaluated verbatim in a page.
 */

function extractUiTokens(selector, options) {
  const opts = options || {};
  const maxElements = opts.maxElements || 600;
  // slim: omit the elements array (and with it all page text) from the return
  // value. Used when extracting from a logged-in session via the browser MCP:
  // keeps the payload small enough for a tool result and free of personal
  // content, so the tokens.json can live in the open-source repo.
  const slim = opts.slim === true;
  const targetRoot = selector ? document.querySelector(selector) : document.body;
  const rootEl = targetRoot || document.body;
  const rootRect = rootEl.getBoundingClientRect();
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  function isVisible(el, rect, style) {
    if (!rect || rect.width < 1 || rect.height < 1) return false;
    if (style.visibility === "hidden" || style.display === "none") return false;
    if (Number.parseFloat(style.opacity || "1") < 0.03) return false;
    return true;
  }

  function textOf(el) {
    const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
    return text.slice(0, 240);
  }

  function compactRect(rect) {
    return {
      x: Math.round(rect.x * 10) / 10,
      y: Math.round(rect.y * 10) / 10,
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10
    };
  }

  function styleOf(el, computed) {
    return {
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      borderColor: computed.borderColor,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      opacity: computed.opacity,
      display: computed.display,
      position: computed.position,
      zIndex: computed.zIndex,
      padding: computed.padding,
      gap: computed.gap
    };
  }

  const elements = Array.from(rootEl.querySelectorAll("*"))
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      if (!isVisible(el, rect, computed)) return null;
      const text = textOf(el);
      const role =
        el.getAttribute("role") ||
        (el instanceof HTMLButtonElement ? "button" : "") ||
        (el instanceof HTMLInputElement ? "input" : "") ||
        (el instanceof HTMLAnchorElement ? "link" : "");
      const testId =
        el.getAttribute("data-testid") ||
        el.getAttribute("data-test") ||
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        "";
      return {
        tag: el.tagName.toLowerCase(),
        role,
        id: el.id || "",
        className: typeof el.className === "string" ? el.className.slice(0, 180) : "",
        label: testId.slice(0, 160),
        text,
        rect: compactRect(rect),
        style: styleOf(el, computed)
      };
    })
    .filter(Boolean)
    .filter((el) => el.text || el.role || el.label || el.style.backgroundColor !== "rgba(0, 0, 0, 0)")
    .sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x)
    .slice(0, maxElements);

  const colors = new Map();
  const fonts = new Map();
  const radii = new Map();
  const shadows = new Map();
  const spacing = new Map();
  // Role-split color tables (text vs background vs border) — a role-blind
  // palette can't distinguish a dark theme from a light one, since dark text
  // colors sit near light backgrounds. fidelity-score prefers these when the
  // elements array is absent (slim payloads).
  const colorRoles = { text: new Map(), background: new Map(), border: new Map() };

  for (const item of elements) {
    for (const color of [item.style.color, item.style.backgroundColor, item.style.borderColor]) {
      if (color && color !== "rgba(0, 0, 0, 0)") colors.set(color, (colors.get(color) || 0) + 1);
    }
    const bump = (map, value) => {
      if (value && value !== "rgba(0, 0, 0, 0)") map.set(value, (map.get(value) || 0) + 1);
    };
    if (item.text) bump(colorRoles.text, item.style.color);
    bump(colorRoles.background, item.style.backgroundColor);
    bump(colorRoles.border, item.style.borderColor);
    if (item.style.fontFamily) {
      const fontKey = `${item.style.fontFamily} / ${item.style.fontSize} / ${item.style.fontWeight}`;
      fonts.set(fontKey, (fonts.get(fontKey) || 0) + 1);
    }
    if (item.style.borderRadius && item.style.borderRadius !== "0px") {
      radii.set(item.style.borderRadius, (radii.get(item.style.borderRadius) || 0) + 1);
    }
    if (item.style.boxShadow && item.style.boxShadow !== "none") {
      shadows.set(item.style.boxShadow, (shadows.get(item.style.boxShadow) || 0) + 1);
    }
    for (const space of [item.style.padding, item.style.gap]) {
      if (space && space !== "0px" && space !== "normal") {
        spacing.set(space, (spacing.get(space) || 0) + 1);
      }
    }
  }

  const topEntries = (map) => Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([value, count]) => ({ value, count }));

  // The page's actual paper color — the compositing base fidelity-score uses
  // for translucent hairlines. Frequency tables can't recover this reliably.
  let pageBackground = "rgb(255, 255, 255)";
  for (const el of [rootEl, document.body, document.documentElement]) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      pageBackground = bg;
      break;
    }
  }

  const payload = {
    url: slim ? location.origin : location.href,
    title: slim ? "" : document.title,
    capturedAt: new Date().toISOString(),
    selector: selector || null,
    viewport,
    pageBackground,
    targetRect: compactRect(rootRect),
    tokens: {
      colors: topEntries(colors),
      fonts: topEntries(fonts),
      radii: topEntries(radii),
      shadows: topEntries(shadows),
      spacing: topEntries(spacing),
      colorRoles: {
        text: topEntries(colorRoles.text),
        background: topEntries(colorRoles.background),
        border: topEntries(colorRoles.border)
      }
    }
  };
  if (!slim) payload.elements = elements;
  return payload;
}

/* Node-side consumers read this file's text and evaluate it in a page; the
 * conditional export keeps it importable for tests without breaking
 * in-browser evaluation. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { extractUiTokens };
}
