import { defineComponent as Q, useCssVars as ae, computed as v, createElementBlock as g, createCommentVNode as L, openBlock as f, normalizeStyle as x, normalizeClass as G, createElementVNode as E, renderSlot as R, toDisplayString as z, Fragment as K, createTextVNode as re, renderList as se, ref as T, onMounted as Z, onUnmounted as ne, watch as O, readonly as V, createBlock as ie, Teleport as ue, createVNode as ve, createSlots as ce, withCtx as de, nextTick as W, reactive as pe } from "vue";
const fe = {
  class: "relative space-y-2",
  style: { padding: "0" }
}, be = {
  key: 0,
  class: "font-medium leading-tight"
}, he = { class: "flex items-center gap-2" }, ge = { class: "flex items-center gap-2" }, me = /* @__PURE__ */ Q({
  __name: "TourGuideTooltip",
  props: {
    visible: { type: Boolean, default: !0 },
    title: {},
    content: {},
    direction: { default: "bottom" },
    showClose: { type: Boolean, default: !0 },
    showActions: { type: Boolean, default: !1 },
    showPrevious: { type: Boolean, default: !1 },
    currentStep: { default: 1 },
    totalSteps: { default: 1 },
    offsetX: { default: 0 },
    offsetY: { default: 0 },
    skipLabel: { default: "Skip" },
    nextLabel: { default: "Next" },
    prevLabel: { default: "Previous" },
    finishLabel: { default: "Finish" },
    backgroundColor: { default: "#101828" },
    textColor: { default: "#ffffff" },
    borderRadius: { default: "0.75rem" },
    padding: { default: "0.75rem" },
    maxWidth: { default: "18rem" },
    boxShadow: { default: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
    buttonBackgroundColor: { default: "#374151" },
    buttonTextColor: { default: "#ffffff" },
    buttonHoverColor: { default: "#4B5563" },
    skipButtonColor: { default: "#ffffff" },
    skipButtonHoverColor: { default: "rgba(255, 255, 255, 0.8)" },
    progressActiveColor: { default: "#60A5FA" },
    progressInactiveColor: { default: "rgba(255, 255, 255, 0.2)" },
    tooltipClass: {},
    headerClass: {},
    contentClass: {},
    actionsClass: {}
  },
  emits: ["close", "next", "previous"],
  setup(y) {
    ae((t) => ({
      "8d8bf0a4": l.skipButtonHoverColor,
      "728f070f": l.buttonHoverColor
    }));
    const l = y, S = v(() => l.currentStep >= l.totalSteps), u = v(() => ({
      backgroundColor: l.backgroundColor,
      color: l.textColor,
      borderRadius: l.borderRadius,
      padding: l.padding,
      maxWidth: l.maxWidth,
      boxShadow: l.boxShadow
    })), P = v(() => ({
      backgroundColor: l.backgroundColor
    })), C = v(() => ({
      backgroundColor: l.buttonBackgroundColor,
      color: l.buttonTextColor,
      "--hover-bg": l.buttonHoverColor
    })), m = v(() => ({
      color: l.skipButtonColor,
      "--hover-color": l.skipButtonHoverColor
    })), n = v(() => ({
      backgroundColor: l.progressActiveColor
    })), i = v(() => ({
      backgroundColor: l.progressInactiveColor
    })), o = v(() => {
      switch (l.direction) {
        case "top":
          return "bottom-full mb-3";
        case "bottom":
          return "top-full mt-3";
        case "left":
          return "right-full mr-3 top-1/2 -translate-y-1/2";
        case "right":
          return "left-full ml-3 top-1/2 -translate-y-1/2";
        default:
          return "top-full mt-3";
      }
    }), b = v(() => {
      switch (l.direction) {
        case "top":
          return "top-full left-1/2 -translate-x-1/2 -mt-1.5";
        case "bottom":
          return "bottom-full left-1/2 -translate-x-1/2 -mb-1.5";
        case "left":
          return "left-full top-1/2 -translate-y-1/2 -ml-1.5";
        case "right":
          return "right-full top-1/2 -translate-y-1/2 -mr-1.5";
        default:
          return "bottom-full left-1/2 -translate-x-1/2 -mb-1.5";
      }
    }), F = v(() => {
      const t = {};
      return l.offsetX !== 0 && (t.left = `${l.offsetX}px`), l.offsetY !== 0 && (t.top = `${l.offsetY}px`), t;
    }), k = v(() => (l.title?.length || 0) + (l.content?.length || 0) > 30 ? l.maxWidth : `max-w-[${l.maxWidth}]`);
    return (t, h) => t.visible ? (f(), g("div", {
      key: 0,
      class: G([
        "absolute z-50 text-sm",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        o.value,
        k.value,
        l.tooltipClass
      ]),
      style: x({ ...F.value, ...u.value })
    }, [
      E("div", {
        class: G(["absolute w-3 h-3 rotate-45", b.value]),
        style: x(P.value)
      }, null, 6),
      E("div", fe, [
        E("div", {
          class: G(["flex items-start justify-between gap-4", l.headerClass])
        }, [
          R(t.$slots, "header", {
            title: t.title,
            currentStep: t.currentStep,
            totalSteps: t.totalSteps
          }, () => [
            t.title ? (f(), g("h3", be, z(t.title), 1)) : L("", !0)
          ], !0),
          R(t.$slots, "skip-button", {
            skipLabel: t.skipLabel,
            onClose: () => t.$emit("close")
          }, () => [
            t.showClose || t.currentStep === 1 ? (f(), g("button", {
              key: 0,
              type: "button",
              onClick: h[0] || (h[0] = (w) => t.$emit("close")),
              class: "underline text-sm transition-colors flex-shrink-0 custom-skip-btn",
              style: x(m.value)
            }, z(t.skipLabel), 5)) : L("", !0)
          ], !0)
        ], 2),
        t.content || t.$slots.default || t.$slots.content ? (f(), g("div", {
          key: 0,
          class: G([
            "opacity-90 font-thin leading-4 break-words",
            l.contentClass
          ])
        }, [
          R(t.$slots, "content", {
            content: t.content,
            currentStep: t.currentStep,
            totalSteps: t.totalSteps
          }, () => [
            t.$slots.default ? R(t.$slots, "default", { key: 0 }, void 0, !0) : (f(), g(K, { key: 1 }, [
              re(z(t.content), 1)
            ], 64))
          ], !0)
        ], 2)) : L("", !0),
        t.showActions ? (f(), g("div", {
          key: 1,
          class: G([
            "flex items-center justify-between gap-3 pt-3",
            l.actionsClass
          ])
        }, [
          R(t.$slots, "progress", {
            currentStep: t.currentStep,
            totalSteps: t.totalSteps
          }, () => [
            E("div", he, [
              (f(!0), g(K, null, se(t.totalSteps, (w) => (f(), g("div", {
                key: w,
                class: G(["w-2 h-2 rounded-full transition-colors"]),
                style: x(
                  w <= t.currentStep ? n.value : i.value
                )
              }, null, 4))), 128))
            ])
          ], !0),
          R(t.$slots, "actions", {
            showPrevious: t.showPrevious,
            isLastStep: S.value,
            prevLabel: t.prevLabel,
            nextLabel: t.nextLabel,
            finishLabel: t.finishLabel,
            onPrevious: () => t.$emit("previous"),
            onNext: () => t.$emit("next")
          }, () => [
            E("div", ge, [
              t.showPrevious ? (f(), g("button", {
                key: 0,
                type: "button",
                onClick: h[1] || (h[1] = (w) => t.$emit("previous")),
                class: "text-xs px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0 custom-action-btn",
                style: x(C.value)
              }, z(t.prevLabel), 5)) : L("", !0),
              E("button", {
                type: "button",
                onClick: h[2] || (h[2] = (w) => t.$emit("next")),
                class: "text-xs px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0 custom-action-btn",
                style: x(C.value)
              }, z(S.value ? t.finishLabel : t.nextLabel), 5)
            ])
          ], !0)
        ], 2)) : L("", !0)
      ])
    ], 6)) : L("", !0);
  }
}), we = (y, l) => {
  const S = y.__vccOpts || y;
  for (const [u, P] of l)
    S[u] = P;
  return S;
}, ye = /* @__PURE__ */ we(me, [["__scopeId", "data-v-009a70ab"]]), Ce = /* @__PURE__ */ Q({
  __name: "TourManager",
  props: {
    steps: {},
    autoStart: { type: Boolean, default: !1 },
    showOverlay: { type: Boolean, default: !0 },
    allowSkip: { type: Boolean, default: !0 },
    highlightPadding: { default: 4 },
    labels: {},
    allowInteractions: { type: Boolean, default: !1 }
  },
  emits: ["start", "complete", "skip", "step-change"],
  setup(y, { expose: l, emit: S }) {
    const u = y, P = {
      skip: "Skip",
      next: "Next",
      previous: "Previous",
      finish: "Finish"
    }, C = v(() => ({
      ...P,
      ...u.labels
    })), m = S, n = T(!1), i = T(0), o = T(null), b = T(null), F = T(), k = T(null), t = T(null), h = T(null), w = T(null), e = v(() => u.steps[i.value]), _ = v(() => {
      if (!o.value || !e.value || !k.value)
        return {};
      const a = k.value, r = u.highlightPadding, s = e.value.radius ?? 8, p = a.top - r, $ = a.left - r, B = a.width + r * 2, A = a.height + r * 2;
      return {
        top: `${p}px`,
        left: `${$}px`,
        width: `${B}px`,
        height: `${A}px`,
        borderRadius: `${s}px`,
        // Massive box-shadow creates the dimming overlay around the cut-out
        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)"
      };
    }), ee = v(() => {
      if (!e.value) return {};
      const a = b.value || o.value, r = t.value || k.value;
      if (!a || !r) return {};
      const s = r, p = e.value.direction || "bottom", $ = e.value.offsetX || 0, B = e.value.offsetY || 0;
      e.value.tooltipTarget && process.env.NODE_ENV === "development" && console.log("Tooltip positioning debug:", {
        stepId: e.value.id,
        direction: p,
        tooltipTarget: e.value.tooltipTarget,
        rect: {
          top: s.top,
          left: s.left,
          width: s.width,
          height: s.height
        },
        offsetX: $,
        offsetY: B
      });
      let A = 0, H = 0;
      switch (p) {
        case "top":
          A = s.top - 12 + B, H = (e.value.tooltipTarget ? s.left : s.left + s.width / 2) + $;
          break;
        case "bottom":
          A = s.bottom + 12 + B, H = (e.value.tooltipTarget ? s.left : s.left + s.width / 2) + $;
          break;
        case "left":
          A = s.top + s.height / 2 + B, H = s.left - 12 + $;
          break;
        case "right":
          A = s.top + s.height / 2 + B, H = s.right + 12 + $;
          break;
      }
      return {
        top: `${A}px`,
        left: `${H}px`,
        // Apply centering transform based on direction and whether we have a tooltip target
        transform: p === "left" || p === "right" ? "translateY(-50%)" : e.value.tooltipTarget ? "none" : "translateX(-50%)"
        // Center horizontally for top/bottom when no tooltip target
      };
    }), d = () => {
      if (o.value) {
        const a = o.value.getBoundingClientRect(), r = k.value;
        (!r || r.top !== a.top || r.left !== a.left || r.width !== a.width || r.height !== a.height) && (k.value = a);
      }
      if (b.value) {
        const a = b.value.getBoundingClientRect(), r = t.value;
        (!r || r.top !== a.top || r.left !== a.left || r.width !== a.width || r.height !== a.height) && (t.value = a);
      }
    }, te = () => {
      const a = () => {
        n.value && o.value && (d(), h.value = requestAnimationFrame(a));
      };
      h.value = requestAnimationFrame(a);
    }, oe = () => {
      h.value && (cancelAnimationFrame(h.value), h.value = null);
    }, X = (a) => {
      const r = [];
      let s = a.parentElement;
      for (; s && s !== document.body; ) {
        const p = window.getComputedStyle(s);
        (p.overflow === "auto" || p.overflow === "scroll" || p.overflowY === "auto" || p.overflowY === "scroll" || p.overflowX === "auto" || p.overflowX === "scroll") && r.push(s), s = s.parentElement;
      }
      return r;
    }, Y = () => {
      if (!o.value) return;
      window.addEventListener("scroll", d, { passive: !0 }), document.addEventListener("scroll", d, { passive: !0 }), window.addEventListener("resize", d, { passive: !0 }), X(o.value).forEach((r) => {
        r.addEventListener("scroll", d, { passive: !0 });
      }), te(), w.value = new MutationObserver(() => {
        d();
      }), w.value.observe(document.body, {
        childList: !0,
        // Child element additions/removals
        subtree: !0,
        // Monitor entire document tree
        attributes: !0,
        // Attribute changes
        attributeFilter: ["style", "class"]
        // Focus on styling changes
      });
    }, N = () => {
      window.removeEventListener("scroll", d), document.removeEventListener("scroll", d), window.removeEventListener("resize", d), o.value && X(o.value).forEach((r) => {
        r.removeEventListener("scroll", d);
      }), oe(), w.value && (w.value.disconnect(), w.value = null);
    }, M = (a) => {
      let r = document.querySelector(a);
      return r || (r = document.querySelector(
        `[data-tour-guide="${a}"]`
      )), r;
    }, I = async () => {
      if (e.value) {
        if (o.value && (o.value.style.removeProperty("z-index"), o.value.style.removeProperty("position"), o.value.style.removeProperty("border-radius"), o.value.style.removeProperty("pointer-events"), o.value.style.removeProperty("isolation"), o.value.removeAttribute("data-tour-guide-interactive")), o.value = M(e.value.target), !o.value) {
          console.warn(
            `Tour Guide: Target element "${e.value.target}" not found`
          );
          return;
        }
        e.value.tooltipTarget ? (b.value = M(
          e.value.tooltipTarget
        ), b.value || (console.warn(
          `Tour Guide: Tooltip target element "${e.value.tooltipTarget}" not found, falling back to main target`
        ), b.value = null)) : b.value = null, e.value.scrollToView && (o.value.scrollIntoView({
          behavior: "smooth",
          // Smooth animation
          block: "center",
          // Center vertically in viewport
          inline: "nearest"
          // Minimal horizontal scrolling
        }), await new Promise((a) => setTimeout(a, 500))), o.value.style.position = "relative", o.value.style.zIndex = "60", o.value.style.borderRadius = "8px", o.value.style.isolation = "isolate", o.value.setAttribute("data-tour-guide-interactive", "true"), d();
      }
    }, q = async () => {
      u.steps.length !== 0 && (n.value = !0, i.value = 0, u.allowInteractions || document.body.classList.add("tour-guide-active"), await W(), await I(), Y(), e.value?.beforeShow && await e.value.beforeShow(), m("start"), m("step-change", e.value, i.value), e.value?.afterShow && e.value.afterShow());
    }, j = async () => {
      e.value?.beforeHide && await e.value.beforeHide(), i.value < u.steps.length - 1 ? (i.value++, await W(), await I(), e.value?.beforeShow && await e.value.beforeShow(), m("step-change", e.value, i.value), e.value?.afterShow && e.value.afterShow()) : U();
    }, D = async () => {
      i.value > 0 && (e.value?.beforeHide && await e.value.beforeHide(), i.value--, await W(), await I(), e.value?.beforeShow && await e.value.beforeShow(), m("step-change", e.value, i.value), e.value?.afterShow && e.value.afterShow());
    }, J = () => {
      o.value && (o.value.style.removeProperty("z-index"), o.value.style.removeProperty("position"), o.value.style.removeProperty("border-radius"), o.value.style.removeProperty("pointer-events"), o.value.style.removeProperty("isolation"), o.value.removeAttribute("data-tour-guide-interactive")), N(), u.allowInteractions || document.body.classList.remove("tour-guide-active"), n.value = !1, o.value = null, b.value = null, k.value = null, t.value = null, m("skip");
    }, U = () => {
      o.value && (o.value.style.removeProperty("z-index"), o.value.style.removeProperty("position"), o.value.style.removeProperty("border-radius"), o.value.style.removeProperty("pointer-events"), o.value.style.removeProperty("isolation"), o.value.removeAttribute("data-tour-guide-interactive")), N(), u.allowInteractions || document.body.classList.remove("tour-guide-active"), n.value = !1, o.value = null, b.value = null, k.value = null, t.value = null, m("complete");
    }, le = async (a) => {
      a >= 0 && a < u.steps.length && (i.value = a, await W(), await I(), e.value?.beforeShow && await e.value.beforeShow(), m("step-change", e.value, i.value), e.value?.afterShow && e.value.afterShow());
    };
    return Z(() => {
      u.autoStart && q();
    }), ne(() => {
      n.value && (N(), u.allowInteractions || document.body.classList.remove("tour-guide-active"));
    }), O(
      () => i.value,
      async () => {
        n.value && await I();
      }
    ), O(o, (a, r) => {
      r && N(), a && n.value && (d(), Y());
    }), O(b, () => {
      n.value && d();
    }), l({
      startTourGuide: q,
      skipTourGuide: J,
      completeTourGuide: U,
      nextStep: j,
      previousStep: D,
      goToStep: le,
      isActive: V(n),
      currentStepIndex: V(i)
    }), (a, r) => (f(), g("div", null, [
      n.value && o.value ? (f(), g("div", {
        key: 0,
        style: x(_.value),
        class: "fixed z-[35] pointer-events-none"
      }, null, 4)) : L("", !0),
      (f(), ie(ue, { to: "body" }, [
        n.value && o.value ? (f(), g("div", {
          key: 0,
          ref_key: "tooltipRef",
          ref: F,
          style: x(ee.value),
          class: "fixed z-[70]",
          "data-tour-guide-interactive": "true"
        }, [
          ve(ye, {
            visible: n.value,
            title: e.value?.title,
            content: e.value?.content,
            direction: e.value?.direction || "bottom",
            "current-step": i.value + 1,
            "total-steps": a.steps.length,
            "show-previous": i.value > 0,
            "show-close": a.allowSkip,
            "show-actions": e.value?.showAction,
            onNext: j,
            onPrevious: D,
            onClose: J,
            skipLabel: e.value?.skipLabel || C.value.skip,
            nextLabel: e.value?.nextLabel || C.value.next,
            prevLabel: e.value?.prevLabel || C.value.previous,
            finishLabel: e.value?.finishLabel || C.value.finish,
            backgroundColor: e.value?.backgroundColor,
            textColor: e.value?.textColor,
            borderRadius: e.value?.borderRadius,
            padding: e.value?.padding,
            maxWidth: e.value?.maxWidth,
            boxShadow: e.value?.boxShadow,
            buttonBackgroundColor: e.value?.buttonBackgroundColor,
            buttonTextColor: e.value?.buttonTextColor,
            buttonHoverColor: e.value?.buttonHoverColor,
            skipButtonColor: e.value?.skipButtonColor,
            skipButtonHoverColor: e.value?.skipButtonHoverColor,
            progressActiveColor: e.value?.progressActiveColor,
            progressInactiveColor: e.value?.progressInactiveColor,
            tooltipClass: e.value?.tooltipClass,
            headerClass: e.value?.headerClass,
            contentClass: e.value?.contentClass,
            actionsClass: e.value?.actionsClass
          }, ce({ _: 2 }, [
            a.$slots["step-content"] ? {
              name: "default",
              fn: de(() => [
                R(a.$slots, "step-content", {
                  step: e.value,
                  index: i.value
                })
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["visible", "title", "content", "direction", "current-step", "total-steps", "show-previous", "show-close", "show-actions", "skipLabel", "nextLabel", "prevLabel", "finishLabel", "backgroundColor", "textColor", "borderRadius", "padding", "maxWidth", "boxShadow", "buttonBackgroundColor", "buttonTextColor", "buttonHoverColor", "skipButtonColor", "skipButtonHoverColor", "progressActiveColor", "progressInactiveColor", "tooltipClass", "headerClass", "contentClass", "actionsClass"])
        ], 4)) : L("", !0)
      ]))
    ]));
  }
}), c = pe({
  isActive: !1,
  currentStep: 0,
  completedSteps: [],
  hasSeenTourGuide: !1
}), ke = () => {
  const y = () => {
    if (typeof window < "u") {
      const n = localStorage.getItem("tour-guide-state");
      if (n) {
        const i = JSON.parse(n);
        Object.assign(c, i);
      }
    }
  }, l = () => {
    typeof window < "u" && localStorage.setItem("tour-guide-state", JSON.stringify(c));
  }, S = (n) => {
    c.isActive = !0, c.currentStep = 0, l();
  }, u = (n) => {
    c.completedSteps.includes(n) || (c.completedSteps.push(n), l());
  }, P = () => {
    c.isActive = !1, c.hasSeenTourGuide = !0, l();
  }, C = () => {
    c.isActive = !1, c.currentStep = 0, c.completedSteps = [], c.hasSeenTourGuide = !1, l();
  }, m = (n) => c.completedSteps.includes(n);
  return Z(() => {
    y();
  }), {
    // State
    tourGuideState: V(c),
    // Actions
    startTourGuide: S,
    completeStep: u,
    finishTourGuide: P,
    resetTourGuide: C,
    isStepCompleted: m,
    // Helpers
    loadTourGuideState: y,
    saveTourGuideState: l
  };
};
export {
  Ce as TourGuideManager,
  ye as TourGuideTooltip,
  ke as useTourGuide
};
