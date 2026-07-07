/*
 * Backlot Interactions - scriptable, seek-deterministic UI actions for
 * HyperFrames demo videos.
 *
 * HyperFrames renders by SEEKING a paused GSAP timeline to each frame's time.
 * GSAP suppresses callbacks (onUpdate / onComplete) during seek, so every
 * visual must come from an interpolated PROPERTY (opacity, transform, left/top),
 * never from a callback. This helper turns high-level actions into
 * property-only tweens that scrub correctly.
 *
 * Usage:
 *   const tl = gsap.timeline({ paused: true });
 *   const ix = BacklotInteractions.create(tl, {
 *     root: document, cursor: ".demo-cursor", ring: ".demo-click-ring",
 *   });
 *   ix.type(".composer-input", "Summarize the Q2 deck", { at: 1.0, cps: 22 })
 *     .click(".send-button", { at: 4.0 })
 *     .send({ from: ".composer-input", into: ".thread", text: "...", at: 4.2 })
 *     .think(".thinking", { at: 4.6, dur: 0.9 })
 *     .stream(".ai-response", "Here are the takeaways...", { at: 5.6, cps: 48 });
 *   window.__timelines["my-demo"] = tl;
 *
 * Authoring notes:
 *   - type()/stream() fill an EMPTY target; use a separate placeholder element
 *     (hide() it) for placeholder text.
 *   - cursor moves read target centres once at build time (layout is static).
 */
(function () {
  function gsapLib() {
    if (!window.gsap) throw new Error("BacklotInteractions requires GSAP to be loaded first.");
    return window.gsap;
  }

  function resolveRoot(opts) {
    if (opts.root && opts.root.querySelector) return opts.root;
    if (typeof opts.root === "string") return document.querySelector(opts.root) || document;
    return document;
  }

  function centerOf(el, root) {
    const r = el.getBoundingClientRect();
    const base = root === document ? { left: 0, top: 0 } : root.getBoundingClientRect();
    return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
  }

  function create(tl, opts) {
    opts = opts || {};
    const gsap = gsapLib();
    const root = resolveRoot(opts);
    const q = (t) => (typeof t === "string" ? root.querySelector(t) : t);
    const cursor = opts.cursor ? q(opts.cursor) : null;
    const ring = opts.ring ? q(opts.ring) : null;
    const defaultCps = opts.cps || 24;

    function at(o) {
      return o && o.at != null ? o.at : tl.duration();
    }

    const ctx = {
      /** Glide the cursor to a target's centre. */
      moveTo(target, o) {
        o = o || {};
        const el = q(target);
        if (!cursor || !el) return ctx;
        const c = centerOf(el, root);
        tl.to(cursor, { left: c.x, top: c.y, duration: o.dur != null ? o.dur : 0.7, ease: o.ease || "power2.inOut" }, at(o));
        return ctx;
      },

      /** Move cursor to target (optional), pulse the ring, dip the target. */
      click(target, o) {
        o = o || {};
        const el = q(target);
        if (!el) return ctx;
        const t = at(o);
        if (cursor && o.move !== false) {
          const moveDur = o.moveDur != null ? o.moveDur : 0.6;
          ctx.moveTo(target, { at: Math.max(0, t - moveDur), dur: moveDur });
        }
        if (ring) {
          const c = centerOf(el, root);
          const rr = ring.getBoundingClientRect();
          const half = (rr.width || 44) / 2;
          tl.set(ring, { left: c.x - half, top: c.y - half }, t);
          tl.fromTo(ring, { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 1.5, duration: 0.45, ease: "sine.out" }, t);
        }
        if (o.press !== false) {
          tl.to(el, { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, t);
        }
        return ctx;
      },

      /** Reveal text one character at a time via per-character opacity stagger.
       *  Property-only so it renders correctly on seek. */
      type(target, text, o) {
        o = o || {};
        const el = q(target);
        if (!el) return ctx;
        const cps = o.cps || defaultCps;
        const t = at(o);
        const full = String(text);
        el.textContent = "";
        const spans = [];
        const unit = o.unit || "char";
        if (unit === "word") {
          // Reveal token-by-token (words keep their trailing space). More like a
          // real LLM stream than a per-character wipe. Whitespace is not animated
          // (it carries no ink) so it never pops.
          const tokens = full.split(/(\s+)/);
          for (let k = 0; k < tokens.length; k++) {
            const tok = tokens[k];
            if (tok === "") continue;
            if (/^\s+$/.test(tok)) {
              const parts = tok.split("\n");
              for (let j = 0; j < parts.length; j++) {
                if (j > 0) el.appendChild(document.createElement("br"));
                if (parts[j]) { const sp = document.createElement("span"); sp.style.whiteSpace = "pre"; sp.textContent = parts[j]; el.appendChild(sp); }
              }
              continue;
            }
            const s = document.createElement("span");
            s.className = "bl-word";
            s.textContent = tok;
            el.appendChild(s);
            spans.push(s);
          }
        } else {
          for (let i = 0; i < full.length; i++) {
            const ch = full[i];
            if (ch === "\n") { el.appendChild(document.createElement("br")); continue; }
            const s = document.createElement("span");
            s.className = "bl-char";
            if (ch === " ") s.style.whiteSpace = "pre";
            s.textContent = ch;
            el.appendChild(s);
            spans.push(s);
          }
        }
        // Keep the overall reveal time ~= text.length / cps regardless of unit.
        const each = unit === "word"
          ? (spans.length > 1 ? (full.length / cps) / spans.length : 0)
          : 1 / cps;
        const fromVars = { opacity: 0 };
        if (o.rise) fromVars.y = o.rise;
        if (o.blur) fromVars.filter = "blur(" + o.blur + "px)";
        gsap.set(spans, fromVars);
        const toVars = {
          opacity: 1,
          duration: o.fade != null ? o.fade : 0.12,
          ease: o.ease || "none",
          stagger: { each: each },
        };
        if (o.rise) toVars.y = 0;
        if (o.blur) toVars.filter = "blur(0px)";
        tl.to(spans, toVars, t);
        return ctx;
      },

      /** Like type() but tuned for AI output - faster, softer fade. Pass
       *  unit:"word" / rise / blur for a more realistic chat-reply reveal;
       *  defaults stay char-based so terminal streams are unchanged. */
      stream(target, text, o) {
        o = o || {};
        return ctx.type(target, text, {
          cps: o.cps || 52,
          at: o.at,
          fade: o.fade != null ? o.fade : 0.1,
          unit: o.unit,
          rise: o.rise,
          blur: o.blur,
          ease: o.ease,
        });
      },

      /** Lift text into a new chat bubble in a thread, and clear the composer.
       *  Bubble text is set at build time (DOM) and revealed via opacity, so it
       *  is seek-safe; the composer clears by fading its typed text out. */
      send(o) {
        o = o || {};
        const input = q(o.from);
        const thread = q(o.into);
        const t = at(o);
        const text = o.text != null ? o.text : input ? input.textContent : "";
        if (thread) {
          const bubble = document.createElement("div");
          bubble.className = "bl-bubble " + (o.bubble || "user");
          bubble.textContent = text;
          thread.appendChild(bubble);
          gsap.set(bubble, { opacity: 0 });
          tl.fromTo(bubble, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }, t);
        }
        if (input) {
          tl.to(input, { opacity: 0, duration: 0.16, ease: "power1.in" }, t);
        }
        return ctx;
      },

      /** Reveal an element (fade / slide in). */
      show(target, o) {
        o = o || {};
        const el = q(target);
        if (!el) return ctx;
        tl.fromTo(el, o.from || { opacity: 0, y: 8 }, { opacity: 1, y: 0, x: 0, scale: 1, duration: o.dur != null ? o.dur : 0.4, ease: o.ease || "power2.out" }, at(o));
        return ctx;
      },

      /** Hide an element (fade / slide out). */
      hide(target, o) {
        o = o || {};
        const el = q(target);
        if (!el) return ctx;
        tl.to(el, Object.assign({ opacity: 0, duration: o.dur != null ? o.dur : 0.3, ease: o.ease || "power2.in" }, o.to || {}), at(o));
        return ctx;
      },

      /** Show a "thinking" indicator between at and at+dur (property-only). */
      think(target, o) {
        o = o || {};
        const el = q(target);
        if (!el) return ctx;
        const t = at(o);
        const dur = o.dur != null ? o.dur : 0.8;
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t);
        tl.to(el, { opacity: 0, duration: 0.2 }, t + dur);
        return ctx;
      },

      /** Momentary press dip on a target (no cursor move). */
      press(target, o) {
        o = o || {};
        const el = q(target);
        if (!el) return ctx;
        tl.to(el, { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, at(o));
        return ctx;
      },

      /** Escape hatch: the underlying timeline. */
      timeline: tl,
    };

    return ctx;
  }

  window.BacklotInteractions = { create: create };
})();
