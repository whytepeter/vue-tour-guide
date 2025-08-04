import { defineComponent as ce, useCssVars as Te, computed as T, createElementBlock as w, createCommentVNode as M, openBlock as g, normalizeStyle as W, normalizeClass as X, createElementVNode as Y, renderSlot as C, toDisplayString as K, Fragment as ae, createTextVNode as Le, renderList as $e, reactive as Pe, onMounted as fe, readonly as se, ref as y, onUnmounted as xe, watch as te, nextTick as q, createBlock as Be, Teleport as Ae, createVNode as Ie, createSlots as He, withCtx as N, normalizeProps as F, guardReactiveProps as V } from "vue";
const Ge = {
  class: "relative space-y-2",
  style: { padding: "0" }
}, Oe = {
  key: 0,
  class: "font-medium leading-tight flex-1 min-w-0"
}, Me = {
  key: 1,
  class: "flex items-center flex-1"
}, We = { class: "flex items-center gap-1 pr-2 py-1 rounded-full" }, Ee = { class: "flex items-center gap-1.5 flex-shrink-0" }, Re = /* @__PURE__ */ ce({
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
    arrowOffset: { default: 0 },
    backgroundColor: { default: "#101828" },
    textColor: { default: "#ffffff" },
    borderRadius: { default: "0.75rem" },
    padding: { default: "0.75rem" },
    maxWidth: { default: "20rem" },
    minWidth: { default: "16rem" },
    boxShadow: { default: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
    buttonBackgroundColor: { default: "#374151" },
    buttonTextColor: { default: "#ffffff" },
    buttonHoverColor: { default: "#4B5563" },
    skipButtonColor: { default: "#ffffff" },
    skipButtonHoverColor: { default: "rgba(255, 255, 255, 0.8)" },
    progressActiveColor: { default: "#60A5FA" },
    progressInactiveColor: { default: "rgba(255, 255, 255, 0.3)" },
    tooltipClass: {},
    headerClass: {},
    contentClass: {},
    actionsClass: {}
  },
  emits: ["close", "next", "previous"],
  setup(x) {
    Te((o) => ({
      f7aa20b4: s.skipButtonHoverColor,
      "5862ab07": s.buttonHoverColor
    }));
    const s = x, B = T(() => s.currentStep >= s.totalSteps), v = T(() => (o) => {
      const p = o <= s.currentStep, n = Math.abs(o - s.currentStep);
      if (p)
        return {
          backgroundColor: s.progressActiveColor,
          opacity: 1
        };
      {
        const i = Math.max(0.2, 1 - n * 0.3);
        return {
          backgroundColor: s.progressInactiveColor,
          opacity: i
        };
      }
    }), E = T(() => {
      const o = Math.max(
        (s.title?.length || 0) * 7 + 50,
        // title width + padding
        (s.content?.length || 0) * 5 + 50,
        // content width + padding
        250
        // minimum width
      ), p = Math.min(o, 350), n = {};
      return s.backgroundColor?.includes("gradient") ? n.background = s.backgroundColor : n.backgroundColor = s.backgroundColor, {
        ...n,
        color: s.textColor,
        borderRadius: s.borderRadius,
        padding: s.padding,
        width: `${p}px`,
        minWidth: s.minWidth,
        maxWidth: s.maxWidth,
        boxShadow: s.boxShadow
      };
    }), I = T(() => {
      switch (s.direction) {
        case "top":
          return "arrow-top";
        case "bottom":
          return "arrow-bottom";
        case "left":
          return "arrow-left";
        case "right":
          return "arrow-right";
        default:
          return "arrow-bottom";
      }
    }), k = T(() => {
      const o = {};
      if (s.backgroundColor?.includes("gradient") ? o.background = s.backgroundColor : o.backgroundColor = s.backgroundColor, s.direction === "top" || s.direction === "bottom") {
        if (s.arrowOffset !== 0) {
          const p = Math.max(-50, Math.min(50, s.arrowOffset));
          o.transform = `translateX(calc(-50% + ${p}px)) rotate(45deg)`;
        }
      } else if ((s.direction === "left" || s.direction === "right") && s.arrowOffset !== 0) {
        const p = Math.max(-50, Math.min(50, s.arrowOffset));
        o.transform = `translateY(calc(-50% + ${p}px)) rotate(45deg)`;
      }
      return o;
    }), H = T(() => ({
      backgroundColor: s.buttonBackgroundColor,
      color: s.buttonTextColor,
      "--hover-bg": s.buttonHoverColor
    })), f = T(() => ({
      color: s.skipButtonColor,
      "--hover-color": s.skipButtonHoverColor
    }));
    return (o, p) => o.visible ? (g(), w("div", {
      key: 0,
      class: X([
        "relative z-50 text-sm",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        s.tooltipClass
      ]),
      style: W(E.value)
    }, [
      Y("div", {
        class: X(["arrow-base", I.value]),
        style: W(k.value)
      }, null, 6),
      Y("div", Ge, [
        Y("div", {
          class: X(["flex items-start justify-between gap-3 ", s.headerClass])
        }, [
          C(o.$slots, "header", {
            title: o.title,
            currentStep: o.currentStep,
            totalSteps: o.totalSteps
          }, () => [
            o.title ? (g(), w("h3", Oe, K(o.title), 1)) : M("", !0)
          ], !0),
          C(o.$slots, "skip-button", {
            skipLabel: o.skipLabel,
            onClose: () => o.$emit("close")
          }, () => [
            o.showClose || o.currentStep === 1 ? (g(), w("button", {
              key: 0,
              type: "button",
              onClick: p[0] || (p[0] = (n) => o.$emit("close")),
              class: "underline text-sm transition-colors flex-shrink-0 custom-skip-btn",
              style: W(f.value)
            }, K(o.skipLabel), 5)) : M("", !0)
          ], !0)
        ], 2),
        o.content || o.$slots.default ? (g(), w("div", {
          key: 0,
          class: X([
            "opacity-90 font-thin leading-4 break-words",
            s.contentClass
          ])
        }, [
          o.$slots.default ? C(o.$slots, "default", {
            key: 0,
            content: o.content,
            currentStep: o.currentStep,
            totalSteps: o.totalSteps
          }, void 0, !0) : (g(), w(ae, { key: 1 }, [
            Le(K(o.content), 1)
          ], 64))
        ], 2)) : M("", !0),
        o.showActions ? (g(), w("div", {
          key: 1,
          class: X(["flex items-center justify-between gap-2", s.actionsClass])
        }, [
          o.$slots.progress ? C(o.$slots, "progress", {
            key: 0,
            currentStep: o.currentStep,
            totalSteps: o.totalSteps
          }, void 0, !0) : (g(), w("div", Me, [
            Y("div", We, [
              (g(!0), w(ae, null, $e(o.totalSteps, (n) => (g(), w("div", {
                key: n,
                class: X(["w-1.5 h-1.5 rounded-full transition-all duration-300"]),
                style: W(v.value(n))
              }, null, 4))), 128))
            ])
          ])),
          Y("div", Ee, [
            o.$slots.actions ? C(o.$slots, "actions", {
              key: 0,
              showPrevious: o.showPrevious,
              isLastStep: B.value,
              prevLabel: o.prevLabel,
              nextLabel: o.nextLabel,
              finishLabel: o.finishLabel,
              onPrevious: () => o.$emit("previous"),
              onNext: () => o.$emit("next")
            }, void 0, !0) : (g(), w(ae, { key: 1 }, [
              o.showPrevious ? (g(), w("button", {
                key: 0,
                type: "button",
                onClick: p[1] || (p[1] = (n) => o.$emit("previous")),
                class: "text-xs px-2 py-1 rounded-md transition-colors flex-shrink-0 custom-action-btn whitespace-nowrap",
                style: W(H.value)
              }, K(o.prevLabel), 5)) : M("", !0),
              Y("button", {
                type: "button",
                onClick: p[2] || (p[2] = (n) => o.$emit("next")),
                class: "text-xs px-2 py-1 rounded-md transition-colors flex-shrink-0 custom-action-btn whitespace-nowrap",
                style: W(H.value)
              }, K(B.value ? o.finishLabel : o.nextLabel), 5)
            ], 64))
          ])
        ], 2)) : M("", !0)
      ])
    ], 6)) : M("", !0);
  }
}), ze = (x, s) => {
  const B = x.__vccOpts || x;
  for (const [v, E] of s)
    B[v] = E;
  return B;
}, Ne = /* @__PURE__ */ ze(Re, [["__scopeId", "data-v-d62e1b15"]]), c = Pe({
  isActive: !1,
  currentStep: 0,
  completedSteps: [],
  hasSeenTourGuide: !1
}), Fe = () => {
  const x = () => {
    if (typeof window < "u") {
      const f = localStorage.getItem("tour-guide-state");
      if (f) {
        const o = JSON.parse(f);
        Object.assign(c, o);
      }
    }
  }, s = () => {
    typeof window < "u" && localStorage.setItem("tour-guide-state", JSON.stringify(c));
  }, B = (f) => {
    c.isActive = !0, c.currentStep = 0, c.completedSteps = [], s();
  }, v = (f) => {
    c.completedSteps.includes(f) || (c.completedSteps.push(f), s());
  }, E = (f) => {
    c.currentStep = f, s();
  }, I = () => {
    c.isActive = !1, c.hasSeenTourGuide = !0, s();
  }, k = () => {
    c.isActive = !1, c.currentStep = 0, c.completedSteps = [], c.hasSeenTourGuide = !1, s();
  }, H = (f) => c.completedSteps.includes(f);
  return fe(() => {
    x();
  }), {
    // State
    tourGuideState: se(c),
    // Actions
    startTourGuide: B,
    completeStep: v,
    updateCurrentStep: E,
    finishTourGuide: I,
    resetTourGuide: k,
    isStepCompleted: H,
    // Helpers
    loadTourGuideState: x,
    saveTourGuideState: s
  };
}, Xe = /* @__PURE__ */ ce({
  __name: "TourManager",
  props: {
    steps: {},
    autoStart: { type: Boolean, default: !1 },
    showOverlay: { type: Boolean, default: !0 },
    allowSkip: { type: Boolean, default: !0 },
    highlightPadding: { default: 4 },
    labels: {},
    allowInteractions: { type: Boolean, default: !1 },
    viewportMargin: { default: 16 },
    scrollToView: { type: Boolean, default: !0 }
  },
  emits: ["start", "complete", "skip", "step-change"],
  setup(x, { expose: s, emit: B }) {
    const v = x, E = {
      skip: "Skip",
      next: "Next",
      previous: "Previous",
      finish: "Finish"
    }, I = T(() => ({
      ...E,
      ...v.labels
    })), k = B, {
      completeStep: H,
      finishTourGuide: f,
      startTourGuide: o,
      updateCurrentStep: p
    } = Fe(), n = y(!1), i = y(0), r = y(null), L = y(null), m = y(), R = y(null), D = y(null), S = y({
      width: 0,
      height: 0
    }), re = y("bottom"), ie = y(0), j = y(null), J = y(null), G = y(null), t = T(() => v.steps[i.value]), he = T(() => {
      if (!r.value || !t.value || !R.value)
        return {};
      const e = R.value, l = v.highlightPadding, a = t.value.radius ?? 8, u = e.top - l, b = e.left - l, A = e.width + l * 2, d = e.height + l * 2;
      return {
        top: `${u}px`,
        left: `${b}px`,
        width: `${A}px`,
        height: `${d}px`,
        borderRadius: `${a}px`,
        zIndex: 9998,
        // Massive box-shadow creates the dimming overlay around the cut-out
        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)"
      };
    }), ge = (e) => {
      const l = {
        width: window.innerWidth,
        height: window.innerHeight
      }, a = v.viewportMargin;
      return {
        top: e.top - a,
        bottom: l.height - e.bottom - a,
        left: e.left - a,
        right: l.width - e.right - a
      };
    }, we = (e, l, a) => {
      const u = ge(e);
      if (a && {
        top: u.top >= l.height,
        bottom: u.bottom >= l.height,
        left: u.left >= l.width,
        right: u.right >= l.width
      }[a])
        return a;
      const b = [
        {
          name: "bottom",
          space: u.bottom,
          needed: l.height
        },
        { name: "top", space: u.top, needed: l.height },
        { name: "right", space: u.right, needed: l.width },
        { name: "left", space: u.left, needed: l.width }
      ], A = b.filter((d) => d.space >= d.needed);
      return A.length > 0 ? A.sort((d, z) => z.space - d.space)[0].name : b.sort((d, z) => z.space - d.space)[0].name;
    }, me = (e, l, a) => {
      if (a === "top" || a === "bottom") {
        const u = e.left + e.width / 2, b = l.left + l.width / 2;
        return u - b;
      } else {
        const u = e.top + e.height / 2, b = l.top + l.height / 2;
        return u - b;
      }
    }, be = T(() => {
      if (!t.value) return {};
      const e = L.value || r.value, l = D.value || R.value;
      if (!e || !l) return {};
      const a = l, u = t.value.direction, b = t.value.offsetX || 0, A = t.value.offsetY || 0, d = S.value.width > 0 ? S.value : { width: 320, height: 200 }, z = we(
        a,
        d,
        u
      );
      re.value = z;
      let $ = 0, P = 0;
      const _ = 12;
      switch (z) {
        case "top":
          $ = a.top - d.height - _ + A, P = a.left + a.width / 2 - d.width / 2 + b;
          break;
        case "bottom":
          $ = a.bottom + _ + A, P = a.left + a.width / 2 - d.width / 2 + b;
          break;
        case "left":
          $ = a.top + a.height / 2 - d.height / 2 + A, P = a.left - d.width - _ + b;
          break;
        case "right":
          $ = a.top + a.height / 2 - d.height / 2 + A, P = a.right + _ + b;
          break;
      }
      const ee = {
        width: window.innerWidth,
        height: window.innerHeight
      }, O = v.viewportMargin;
      P < O ? P = O : P + d.width > ee.width - O && (P = ee.width - d.width - O), $ < O ? $ = O : $ + d.height > ee.height - O && ($ = ee.height - d.height - O);
      const ke = {
        left: P,
        top: $,
        width: d.width,
        height: d.height
      };
      return ie.value = me(
        a,
        ke,
        z
      ), {
        top: `${$}px`,
        left: `${P}px`,
        zIndex: 9999,
        transform: "none"
        // We handle positioning directly now
      };
    }), h = () => {
      if (r.value) {
        const e = r.value.getBoundingClientRect(), l = R.value;
        (!l || l.top !== e.top || l.left !== e.left || l.width !== e.width || l.height !== e.height) && (R.value = e);
      }
      if (L.value) {
        const e = L.value.getBoundingClientRect(), l = D.value;
        (!l || l.top !== e.top || l.left !== e.left || l.width !== e.width || l.height !== e.height) && (D.value = e);
      }
      if (m.value) {
        const e = {
          width: m.value.offsetWidth,
          height: m.value.offsetHeight
        };
        (S.value.width !== e.width || S.value.height !== e.height) && (S.value = e);
      }
    }, ye = () => {
      const e = () => {
        n.value && r.value && (h(), j.value = requestAnimationFrame(e));
      };
      j.value = requestAnimationFrame(e);
    }, Se = () => {
      j.value && (cancelAnimationFrame(j.value), j.value = null);
    }, ne = (e) => {
      const l = [];
      let a = e.parentElement;
      for (; a && a !== document.body; ) {
        const u = window.getComputedStyle(a);
        (u.overflow === "auto" || u.overflow === "scroll" || u.overflowY === "auto" || u.overflowY === "scroll" || u.overflowX === "auto" || u.overflowX === "scroll") && l.push(a), a = a.parentElement;
      }
      return l;
    }, ue = () => {
      if (!r.value) return;
      window.addEventListener("scroll", h, { passive: !0 }), document.addEventListener("scroll", h, { passive: !0 }), window.addEventListener("resize", h, { passive: !0 }), ne(r.value).forEach((l) => {
        l.addEventListener("scroll", h, { passive: !0 });
      }), ye(), J.value = new MutationObserver(() => {
        h();
      }), J.value.observe(document.body, {
        childList: !0,
        // Child element additions/removals
        subtree: !0,
        // Monitor entire document tree
        attributes: !0,
        // Attribute changes
        attributeFilter: ["style", "class"]
        // Focus on styling changes
      }), typeof ResizeObserver < "u" && (G.value = new ResizeObserver(() => {
        h();
      }), G.value.observe(r.value), m.value && G.value.observe(m.value));
    }, Q = () => {
      window.removeEventListener("scroll", h), document.removeEventListener("scroll", h), window.removeEventListener("resize", h), r.value && ne(r.value).forEach((l) => {
        l.removeEventListener("scroll", h);
      }), Se(), J.value && (J.value.disconnect(), J.value = null), G.value && (G.value.disconnect(), G.value = null);
    }, de = (e) => {
      let l = document.querySelector(e);
      return l || (l = document.querySelector(
        `[data-tour-guide="${e}"]`
      )), l;
    }, U = async () => {
      if (t.value) {
        if (r.value && (r.value.style.removeProperty("z-index"), r.value.style.removeProperty("position"), r.value.style.removeProperty("border-radius"), r.value.style.removeProperty("pointer-events"), r.value.style.removeProperty("isolation"), r.value.removeAttribute("data-tour-guide-interactive")), r.value = de(t.value.target), !r.value) {
          console.warn(
            `Tour Guide: Target element "${t.value.target}" not found`
          );
          return;
        }
        t.value.tooltipTarget ? (L.value = de(
          t.value.tooltipTarget
        ), L.value || (console.warn(
          `Tour Guide: Tooltip target element "${t.value.tooltipTarget}" not found, falling back to main target`
        ), L.value = null)) : L.value = null, v.scrollToView && (r.value.scrollIntoView({
          behavior: "smooth",
          // Smooth animation
          block: "center",
          // Center vertically in viewport
          inline: "nearest"
          // Minimal horizontal scrolling
        }), await new Promise((e) => setTimeout(e, 500))), r.value.style.position = "relative", r.value.style.zIndex = "9997", r.value.style.borderRadius = "8px", r.value.style.isolation = "isolate", r.value.setAttribute("data-tour-guide-interactive", "true"), h(), await q(), m.value ? S.value = {
          width: m.value.offsetWidth || 320,
          // fallback width
          height: m.value.offsetHeight || 200
          // fallback height
        } : S.value = { width: 320, height: 200 }, h();
      }
    }, ve = async () => {
      v.steps.length !== 0 && (n.value = !0, i.value = 0, o(), v.allowInteractions || document.body.classList.add("tour-guide-active"), await q(), await U(), S.value = { width: 320, height: 200 }, ue(), await new Promise((e) => setTimeout(e, 100)), m.value && (S.value = {
        width: m.value.offsetWidth || 320,
        height: m.value.offsetHeight || 200
      }), t.value?.beforeShow && await t.value.beforeShow(), k("start"), k("step-change", t.value, i.value), t.value?.afterShow && t.value.afterShow());
    }, oe = async () => {
      t.value && H(t.value.id), t.value?.beforeHide && await t.value.beforeHide(), i.value < v.steps.length - 1 ? (i.value++, p(i.value), await q(), await U(), t.value?.beforeShow && await t.value.beforeShow(), k("step-change", t.value, i.value), t.value?.afterShow && t.value.afterShow()) : pe();
    }, le = async () => {
      i.value > 0 && (t.value?.beforeHide && await t.value.beforeHide(), i.value--, p(i.value), await q(), await U(), t.value?.beforeShow && await t.value.beforeShow(), k("step-change", t.value, i.value), t.value?.afterShow && t.value.afterShow());
    }, Z = () => {
      r.value && (r.value.style.removeProperty("z-index"), r.value.style.removeProperty("position"), r.value.style.removeProperty("border-radius"), r.value.style.removeProperty("pointer-events"), r.value.style.removeProperty("isolation"), r.value.removeAttribute("data-tour-guide-interactive")), Q(), v.allowInteractions || document.body.classList.remove("tour-guide-active"), n.value = !1, r.value = null, L.value = null, R.value = null, D.value = null, S.value = { width: 0, height: 0 }, f(), k("skip");
    }, pe = () => {
      t.value && H(t.value.id), r.value && (r.value.style.removeProperty("z-index"), r.value.style.removeProperty("position"), r.value.style.removeProperty("border-radius"), r.value.style.removeProperty("pointer-events"), r.value.style.removeProperty("isolation"), r.value.removeAttribute("data-tour-guide-interactive")), Q(), v.allowInteractions || document.body.classList.remove("tour-guide-active"), n.value = !1, r.value = null, L.value = null, R.value = null, D.value = null, S.value = { width: 0, height: 0 }, f(), k("complete");
    }, Ce = async (e) => {
      if (e >= 0 && e < v.steps.length) {
        for (let l = 0; l <= e; l++) {
          const a = v.steps[l];
          a && H(a.id);
        }
        i.value = e, p(i.value), await q(), await U(), t.value?.beforeShow && await t.value.beforeShow(), k("step-change", t.value, i.value), t.value?.afterShow && t.value.afterShow();
      }
    };
    return fe(() => {
      v.autoStart && ve();
    }), xe(() => {
      n.value && (Q(), v.allowInteractions || document.body.classList.remove("tour-guide-active"));
    }), te(
      () => i.value,
      async () => {
        n.value && await U();
      }
    ), te(r, (e, l) => {
      l && Q(), e && n.value && (h(), ue());
    }), te(L, () => {
      n.value && h();
    }), te(
      m,
      (e) => {
        e && n.value && q(() => {
          S.value = {
            width: e.offsetWidth || 320,
            height: e.offsetHeight || 200
          }, G.value && G.value.observe(e);
        });
      },
      { immediate: !0 }
    ), s({
      startTourGuide: ve,
      skipTourGuide: Z,
      completeTourGuide: pe,
      nextStep: oe,
      previousStep: le,
      goToStep: Ce,
      isActive: se(n),
      currentStepIndex: se(i)
    }), (e, l) => (g(), w("div", null, [
      n.value && r.value ? (g(), w("div", {
        key: 0,
        style: W(he.value),
        class: "fixed pointer-events-none"
      }, null, 4)) : M("", !0),
      (g(), Be(Ae, { to: "body" }, [
        n.value && r.value ? (g(), w("div", {
          key: 0,
          ref_key: "tooltipRef",
          ref: m,
          style: W(be.value),
          class: "fixed",
          "data-tour-guide-interactive": "true"
        }, [
          Ie(Ne, {
            visible: n.value,
            title: t.value?.title,
            content: t.value?.content,
            direction: re.value,
            "current-step": i.value + 1,
            "total-steps": e.steps.length,
            "show-previous": i.value > 0,
            "show-close": e.allowSkip,
            "show-actions": t.value?.showAction,
            "arrow-offset": ie.value,
            onNext: oe,
            onPrevious: le,
            onClose: Z,
            skipLabel: t.value?.skipLabel || I.value.skip,
            nextLabel: t.value?.nextLabel || I.value.next,
            prevLabel: t.value?.prevLabel || I.value.previous,
            finishLabel: t.value?.finishLabel || I.value.finish,
            backgroundColor: t.value?.tooltip?.backgroundColor,
            textColor: t.value?.tooltip?.textColor,
            borderRadius: t.value?.tooltip?.borderRadius,
            padding: t.value?.tooltip?.padding,
            maxWidth: t.value?.tooltip?.maxWidth,
            boxShadow: t.value?.tooltip?.boxShadow,
            buttonBackgroundColor: t.value?.tooltip?.buttonBackgroundColor,
            buttonTextColor: t.value?.tooltip?.buttonTextColor,
            buttonHoverColor: t.value?.tooltip?.buttonHoverColor,
            skipButtonColor: t.value?.tooltip?.skipButtonColor,
            skipButtonHoverColor: t.value?.tooltip?.skipButtonHoverColor,
            progressActiveColor: t.value?.tooltip?.progressActiveColor,
            progressInactiveColor: t.value?.tooltip?.progressInactiveColor,
            tooltipClass: t.value?.tooltip?.tooltipClass,
            headerClass: t.value?.tooltip?.headerClass,
            contentClass: t.value?.tooltip?.contentClass,
            actionsClass: t.value?.tooltip?.actionsClass
          }, He({ _: 2 }, [
            e.$slots.default ? {
              name: "default",
              fn: N((a) => [
                C(e.$slots, "default", F(V({
                  ...a,
                  step: t.value,
                  stepIndex: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length
                })))
              ]),
              key: "0"
            } : void 0,
            e.$slots.header ? {
              name: "header",
              fn: N((a) => [
                C(e.$slots, "header", F(V({
                  ...a,
                  step: t.value,
                  stepIndex: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length
                })))
              ]),
              key: "1"
            } : void 0,
            e.$slots.content ? {
              name: "content",
              fn: N((a) => [
                C(e.$slots, "content", F(V({
                  ...a,
                  step: t.value,
                  stepIndex: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length
                })))
              ]),
              key: "2"
            } : void 0,
            e.$slots["skip-button"] ? {
              name: "skip-button",
              fn: N((a) => [
                C(e.$slots, "skip-button", F(V({
                  ...a,
                  step: t.value,
                  stepIndex: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length,
                  onSkip: Z
                })))
              ]),
              key: "3"
            } : void 0,
            e.$slots.progress ? {
              name: "progress",
              fn: N((a) => [
                C(e.$slots, "progress", F(V({
                  ...a,
                  step: t.value,
                  stepIndex: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length
                })))
              ]),
              key: "4"
            } : void 0,
            e.$slots.actions ? {
              name: "actions",
              fn: N((a) => [
                C(e.$slots, "actions", F(V({
                  ...a,
                  step: t.value,
                  stepIndex: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length,
                  onNext: oe,
                  onPrevious: le,
                  onSkip: Z
                })))
              ]),
              key: "5"
            } : void 0,
            e.$slots["step-content"] ? {
              name: "step-content",
              fn: N((a) => [
                C(e.$slots, "step-content", F(V({
                  ...a,
                  step: t.value,
                  index: i.value,
                  currentStep: i.value + 1,
                  totalSteps: e.steps.length
                })))
              ]),
              key: "6"
            } : void 0
          ]), 1032, ["visible", "title", "content", "direction", "current-step", "total-steps", "show-previous", "show-close", "show-actions", "arrow-offset", "skipLabel", "nextLabel", "prevLabel", "finishLabel", "backgroundColor", "textColor", "borderRadius", "padding", "maxWidth", "boxShadow", "buttonBackgroundColor", "buttonTextColor", "buttonHoverColor", "skipButtonColor", "skipButtonHoverColor", "progressActiveColor", "progressInactiveColor", "tooltipClass", "headerClass", "contentClass", "actionsClass"])
        ], 4)) : M("", !0)
      ]))
    ]));
  }
});
export {
  Xe as TourGuideManager,
  Ne as TourGuideTooltip,
  Fe as useTourGuide
};
