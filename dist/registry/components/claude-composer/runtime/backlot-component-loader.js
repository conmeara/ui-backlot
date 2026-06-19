(() => {
  const mounts = Array.from(document.querySelectorAll("[data-backlot-mount-src]"));

  if (mounts.length === 0) {
    window.__backlotComponentsState = "ready";
    window.__backlotComponentsReady = Promise.resolve(true);
    return;
  }

  window.__backlotComponentsState = "loading";

  const rootFromDocument = (doc, selector, src) => {
    const animatedInlineProperties = [
      "opacity",
      "visibility",
      "transform",
      "translate",
      "rotate",
      "scale",
      "filter",
      "will-change"
    ];

    const sanitizeAnimatedInlineStyles = (root) => {
      const styledElements = [];
      if (root.matches && root.matches("[style]")) {
        styledElements.push(root);
      }
      if (root.querySelectorAll) {
        styledElements.push(...root.querySelectorAll("[style]"));
      }

      styledElements.forEach((element) => {
        animatedInlineProperties.forEach((property) => {
          element.style.removeProperty(property);
        });
        if (!element.getAttribute("style").trim()) {
          element.removeAttribute("style");
        }
      });
    };

    const sanitizeCompositionMetadata = (root) => {
      const compositionElements = [];
      if (root.matches && root.matches("[data-composition-id]")) {
        compositionElements.push(root);
      }
      if (root.querySelectorAll) {
        compositionElements.push(...root.querySelectorAll("[data-composition-id]"));
      }

      compositionElements.forEach((element) => {
        [
          "data-composition-id",
          "data-start",
          "data-duration",
          "data-width",
          "data-height"
        ].forEach((attribute) => element.removeAttribute(attribute));
      });
    };

    const template = doc.querySelector("template");
    let sourceRoot;

    if (template) {
      const fragment = template.content.cloneNode(true);
      fragment.querySelectorAll("script").forEach((script) => script.remove());
      sanitizeAnimatedInlineStyles(fragment);
      sourceRoot = selector ? fragment.querySelector(selector) : fragment.firstElementChild;
    } else {
      doc.querySelectorAll("script").forEach((script) => script.remove());
      sanitizeAnimatedInlineStyles(doc);
      sourceRoot = selector ? doc.querySelector(selector) : doc.body.firstElementChild;
    }

    if (!sourceRoot) {
      throw new Error(`Could not find ${selector || "component root"} in ${src}`);
    }

    const component = sourceRoot.cloneNode(true);
    sanitizeCompositionMetadata(component);
    return component;
  };

  const loadWithFetch = async (src, selector) => {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Could not load ${src}: ${response.status}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return rootFromDocument(doc, selector, src);
  };

  const loadWithFrame = (src, selector) => new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.position = "absolute";
    frame.style.width = "1px";
    frame.style.height = "1px";
    frame.style.left = "-9999px";
    frame.style.top = "-9999px";
    frame.style.opacity = "0";
    frame.style.pointerEvents = "none";

    const cleanUp = () => frame.remove();

    frame.addEventListener("load", () => {
      try {
        const doc = frame.contentDocument;
        if (!doc) {
          throw new Error(`Could not access ${src}`);
        }
        const component = rootFromDocument(doc, selector, src);
        cleanUp();
        resolve(component);
      } catch (error) {
        cleanUp();
        reject(error);
      }
    }, { once: true });

    frame.addEventListener("error", () => {
      cleanUp();
      reject(new Error(`Could not load ${src}`));
    }, { once: true });

    frame.src = src;
    document.body.appendChild(frame);
  });

  const mountComponent = async (mount) => {
    if (mount.getAttribute("data-backlot-mounted") === "ready") {
      return;
    }

    mount.setAttribute("data-backlot-mounted", "loading");

    const src = mount.getAttribute("data-backlot-mount-src");
    const selector = mount.getAttribute("data-backlot-mount-selector");
    let component;

    try {
      component = await loadWithFetch(src, selector);
    } catch {
      component = await loadWithFrame(src, selector);
    }

    component.setAttribute("data-backlot-mounted-component", "");
    mount.replaceChildren(component);
    await Promise.all(Array.from(
      mount.querySelectorAll("[data-backlot-mount-src]")
    ).map(mountComponent));
    mount.setAttribute("data-backlot-mounted", "ready");
  };

  window.__backlotComponentsReady = Promise.all(mounts.map(mountComponent))
    .then(() => {
      window.__backlotComponentsState = "ready";
      document.documentElement.setAttribute("data-backlot-components", "ready");
      return true;
    })
    .catch((error) => {
      window.__backlotComponentsState = "error";
      window.__backlotComponentsError = error.message;
      console.error(error);
      throw error;
    });
})();
