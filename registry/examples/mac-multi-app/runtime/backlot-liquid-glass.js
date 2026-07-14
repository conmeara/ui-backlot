/*
 * Backlot Liquid Glass — Apple-style optical refraction as a reusable material.
 *
 * Turns any element into "liquid glass": a real backdrop lens that bends and
 * chromatically fringes the content behind it at the rim, not just a blur.
 * Built for HyperFrames surfaces — deterministic (no animation loop, no mouse
 * tracking), so it captures and renders identically every frame.
 *
 * USAGE
 *   Markup (auto-applied on load):
 *     <div class="dock" data-liquid-glass
 *          data-lg-displacement="60" data-lg-aberration="2.2"
 *          data-lg-blur="7" data-lg-saturation="1.7" data-lg-brightness="1.05">
 *   Script:
 *     <script src="../runtime/backlot-liquid-glass.js"></script>
 *   Or drive it manually:
 *     BacklotLiquidGlass.apply(el, { displacement: 60, aberration: 2.2 });
 *     BacklotLiquidGlass.init(rootEl);   // (re)scan a subtree after mounting
 *
 * ALWAYS pair the attribute with a CSS fallback on the same element, e.g.
 *   backdrop-filter: blur(7px) saturate(1.7);
 * The refraction needs `backdrop-filter: url()`, which today is Chromium-only
 * (our capture/render pipeline is Chromium, so renders get the full effect).
 * On Safari/Firefox — and when the backlot loader strips this script from a
 * mounted component — the CSS fallback is what shows: clean frosted glass.
 *
 * PROVENANCE
 *   The displacement generator and the edge-masked chromatic-aberration filter
 *   graph are adapted from rdev/liquid-glass-react (MIT), whose generator is in
 *   turn adapted from shuding/liquid-glass (MIT). The React shell (hover
 *   springs, pointer tracking, element management) is intentionally dropped —
 *   only the physics and the SVG filter are kept. See runtime/NOTICE.md.
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var XLINK_NS = "http://www.w3.org/1999/xlink";
  // Chromium is the only engine that honours `backdrop-filter: url(#svg)`.
  var isChromium =
    typeof navigator !== "undefined" && /Chrome\//.test(navigator.userAgent);
  var counter = 0;

  /* ---------- lens profile: flat centre, hard bend at the rounded edge ---------- */
  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }
  function roundedRectSDF(x, y, w, h, r) {
    var qx = Math.abs(x) - w + r;
    var qy = Math.abs(y) - h + r;
    return (
      Math.min(Math.max(qx, qy), 0) +
      Math.sqrt(Math.max(qx, 0) * Math.max(qx, 0) + Math.max(qy, 0) * Math.max(qy, 0)) -
      r
    );
  }
  function fragment(uvx, uvy) {
    var ix = uvx - 0.5;
    var iy = uvy - 0.5;
    var d = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
    var scaled = smoothStep(0, 1, smoothStep(0.8, 0, d - 0.15));
    return { x: ix * scaled + 0.5, y: iy * scaled + 0.5 };
  }

  /* ---------- build the displacement map (Canvas 2D → data URI) ---------- */
  function buildDisplacementMap(width, height) {
    var w = Math.max(1, Math.round(width));
    var h = Math.max(1, Math.round(height));
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");

    var maxScale = 0;
    var raw = new Float32Array(w * h * 2);
    var i = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var pos = fragment(x / w, y / h);
        var dx = pos.x * w - x;
        var dy = pos.y * h - y;
        if (Math.abs(dx) > maxScale) maxScale = Math.abs(dx);
        if (Math.abs(dy) > maxScale) maxScale = Math.abs(dy);
        raw[i++] = dx;
        raw[i++] = dy;
      }
    }
    maxScale = Math.max(maxScale, 1);

    var img = ctx.createImageData(w, h);
    var data = img.data;
    var r = 0;
    for (var yy = 0; yy < h; yy++) {
      for (var xx = 0; xx < w; xx++) {
        var vdx = raw[r++];
        var vdy = raw[r++];
        // soften a 2px rim band to kill hard map-boundary artifacts
        var edge = Math.min(xx, yy, w - xx - 1, h - yy - 1);
        var f = Math.min(1, edge / 2);
        var red = (vdx * f) / maxScale + 0.5;
        var grn = (vdy * f) / maxScale + 0.5;
        var p = (yy * w + xx) * 4;
        data[p] = Math.max(0, Math.min(255, red * 255)); // X displacement (R)
        data[p + 1] = Math.max(0, Math.min(255, grn * 255)); // Y displacement (G)
        data[p + 2] = Math.max(0, Math.min(255, grn * 255)); // Y again (B selector)
        data[p + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
  }

  /* ---------- SVG filter: 3-pass RGB displacement, aberration masked to the rim ---------- */
  function buildFilterSvg(id, displacement, aberration, mapUrl) {
    var s = displacement;
    var maskStop = Math.max(30, 80 - aberration * 2);
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("data-backlot-liquid-glass", id);
    svg.style.cssText = "position:absolute;width:0;height:0;pointer-events:none;";
    svg.innerHTML =
      '<defs>' +
      '<radialGradient id="' + id + '-edge" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="black" stop-opacity="0"/>' +
      '<stop offset="' + maskStop + '%" stop-color="black" stop-opacity="0"/>' +
      '<stop offset="100%" stop-color="white" stop-opacity="1"/>' +
      '</radialGradient>' +
      '<filter id="' + id + '" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">' +
      '<feImage x="0" y="0" width="100%" height="100%" result="MAP" preserveAspectRatio="xMidYMid slice" href="' + mapUrl + '"/>' +
      '<feColorMatrix in="MAP" type="matrix" values="0.3 0.3 0.3 0 0  0.3 0.3 0.3 0 0  0.3 0.3 0.3 0 0  0 0 0 1 0" result="EDGE_I"/>' +
      '<feComponentTransfer in="EDGE_I" result="EDGE_MASK"><feFuncA type="discrete" tableValues="0 ' + aberration * 0.05 + ' 1"/></feComponentTransfer>' +
      '<feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_SRC"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="' + s + '" xChannelSelector="R" yChannelSelector="B" result="DR"/>' +
      '<feColorMatrix in="DR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="RED"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="' + (s - aberration * 0.05) + '" xChannelSelector="R" yChannelSelector="B" result="DG"/>' +
      '<feColorMatrix in="DG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="GRN"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="' + (s - aberration * 0.1) + '" xChannelSelector="R" yChannelSelector="B" result="DB"/>' +
      '<feColorMatrix in="DB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="BLU"/>' +
      '<feBlend in="GRN" in2="BLU" mode="screen" result="GB"/>' +
      '<feBlend in="RED" in2="GB" mode="screen" result="RGB"/>' +
      '<feGaussianBlur in="RGB" stdDeviation="' + Math.max(0.1, 0.5 - aberration * 0.1) + '" result="ABERR"/>' +
      '<feComposite in="ABERR" in2="EDGE_MASK" operator="in" result="EDGE_ABERR"/>' +
      '<feComponentTransfer in="EDGE_MASK" result="INV"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer>' +
      '<feComposite in="CENTER_SRC" in2="INV" operator="in" result="CENTER"/>' +
      '<feComposite in="EDGE_ABERR" in2="CENTER" operator="over"/>' +
      '</filter>' +
      '</defs>';
    // feImage href needs the xlink form too for some Chromium builds
    var feImage = svg.querySelector("feImage");
    if (feImage) feImage.setAttributeNS(XLINK_NS, "xlink:href", mapUrl);
    return svg;
  }

  function num(el, attr, fallback) {
    var v = parseFloat(el.getAttribute(attr));
    return isNaN(v) ? fallback : v;
  }

  function readOptions(el) {
    return {
      width: num(el, "data-lg-width", 0) || undefined,
      height: num(el, "data-lg-height", 0) || undefined,
      displacement: num(el, "data-lg-displacement", 60),
      aberration: num(el, "data-lg-aberration", 2.2),
      blur: num(el, "data-lg-blur", 7),
      saturation: num(el, "data-lg-saturation", 1.7),
      brightness: num(el, "data-lg-brightness", 1.05),
    };
  }

  /* ---------- public API ---------- */
  function apply(el, opts) {
    opts = opts || {};
    var rect = el.getBoundingClientRect();
    var width = Math.round(opts.width || rect.width);
    var height = Math.round(opts.height || rect.height);
    if (!width || !height) return null;

    var blur = opts.blur != null ? opts.blur : 7;
    var saturation = opts.saturation != null ? opts.saturation : 1.7;
    var brightness = opts.brightness != null ? opts.brightness : 1.05;

    // Non-Chromium: leave the element's CSS backdrop-filter fallback in place.
    if (!isChromium) {
      return { id: null, isActive: false, destroy: function () {} };
    }

    var id = opts.id || "backlot-lg-" + ++counter;
    var mapUrl = buildDisplacementMap(width, height);
    var svg = buildFilterSvg(
      id,
      opts.displacement != null ? opts.displacement : 60,
      opts.aberration != null ? opts.aberration : 2.2,
      mapUrl
    );
    document.body.appendChild(svg);

    var value =
      "url(#" + id + ") blur(" + blur + "px) saturate(" + saturation + ") brightness(" + brightness + ")";
    el.style.backdropFilter = value;
    el.style.setProperty("-webkit-backdrop-filter", value);
    el.setAttribute("data-lg-active", "");

    return {
      id: id,
      isActive: true,
      destroy: function () {
        svg.remove();
        el.style.backdropFilter = "";
        el.style.removeProperty("-webkit-backdrop-filter");
        el.removeAttribute("data-lg-active");
        delete el.__backlotLiquidGlass;
      },
    };
  }

  function init(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var nodes = scope.querySelectorAll("[data-liquid-glass]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.__backlotLiquidGlass) continue;
      el.__backlotLiquidGlass = apply(el, readOptions(el)) || true;
    }
  }

  window.BacklotLiquidGlass = { apply: apply, init: init, isChromium: isChromium };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }
})();
