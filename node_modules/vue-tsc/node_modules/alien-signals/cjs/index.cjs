"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDepth = void 0;
exports.getCurrentSub = getCurrentSub;
exports.setCurrentSub = setCurrentSub;
exports.getCurrentScope = getCurrentScope;
exports.setCurrentScope = setCurrentScope;
exports.startBatch = startBatch;
exports.endBatch = endBatch;
exports.pauseTracking = pauseTracking;
exports.resumeTracking = resumeTracking;
exports.signal = signal;
exports.computed = computed;
exports.effect = effect;
exports.effectScope = effectScope;
__exportStar(require("./system.cjs"), exports);
const system_js_1 = require("./system.cjs");
const pauseStack = [];
const queuedEffects = [];
const { link, unlink, propagate, checkDirty, endTracking, startTracking, shallowPropagate, } = (0, system_js_1.createReactiveSystem)({
    update(signal) {
        if ('getter' in signal) {
            return updateComputed(signal);
        }
        else {
            return updateSignal(signal, signal.value);
        }
    },
    notify,
    unwatched(node) {
        if ('getter' in node) {
            let toRemove = node.deps;
            if (toRemove !== undefined) {
                node.flags = 17;
                do {
                    toRemove = unlink(toRemove, node);
                } while (toRemove !== undefined);
            }
        }
        else if (!('previousValue' in node)) {
            effectOper.call(node);
        }
    },
});
exports.batchDepth = 0;
let notifyIndex = 0;
let queuedEffectsLength = 0;
let activeSub;
let activeScope;
function getCurrentSub() {
    return activeSub;
}
function setCurrentSub(sub) {
    const prevSub = activeSub;
    activeSub = sub;
    return prevSub;
}
function getCurrentScope() {
    return activeScope;
}
function setCurrentScope(scope) {
    const prevScope = activeScope;
    activeScope = scope;
    return prevScope;
}
function startBatch() {
    ++exports.batchDepth;
}
function endBatch() {
    if (!--exports.batchDepth) {
        flush();
    }
}
function pauseTracking() {
    pauseStack.push(setCurrentSub(undefined));
}
function resumeTracking() {
    setCurrentSub(pauseStack.pop());
}
function signal(initialValue) {
    return signalOper.bind({
        previousValue: initialValue,
        value: initialValue,
        subs: undefined,
        subsTail: undefined,
        flags: 1,
    });
}
function computed(getter) {
    return computedOper.bind({
        value: undefined,
        subs: undefined,
        subsTail: undefined,
        deps: undefined,
        depsTail: undefined,
        flags: 17,
        getter: getter,
    });
}
function effect(fn) {
    const e = {
        fn,
        subs: undefined,
        subsTail: undefined,
        deps: undefined,
        depsTail: undefined,
        flags: 2,
    };
    if (activeSub !== undefined) {
        link(e, activeSub);
    }
    else if (activeScope !== undefined) {
        link(e, activeScope);
    }
    const prev = setCurrentSub(e);
    try {
        e.fn();
    }
    finally {
        setCurrentSub(prev);
    }
    return effectOper.bind(e);
}
function effectScope(fn) {
    const e = {
        deps: undefined,
        depsTail: undefined,
        subs: undefined,
        subsTail: undefined,
        flags: 0,
    };
    if (activeScope !== undefined) {
        link(e, activeScope);
    }
    const prevSub = setCurrentSub(undefined);
    const prevScope = setCurrentScope(e);
    try {
        fn();
    }
    finally {
        setCurrentScope(prevScope);
        setCurrentSub(prevSub);
    }
    return effectOper.bind(e);
}
function updateComputed(c) {
    const prevSub = setCurrentSub(c);
    startTracking(c);
    try {
        const oldValue = c.value;
        return oldValue !== (c.value = c.getter(oldValue));
    }
    finally {
        setCurrentSub(prevSub);
        endTracking(c);
    }
}
function updateSignal(s, value) {
    s.flags = 1;
    return s.previousValue !== (s.previousValue = value);
}
function notify(e) {
    const flags = e.flags;
    if (!(flags & 64)) {
        e.flags = flags | 64;
        const subs = e.subs;
        if (subs !== undefined) {
            notify(subs.sub);
        }
        else {
            queuedEffects[queuedEffectsLength++] = e;
        }
    }
}
function run(e, flags) {
    if (flags & 16
        || (flags & 32 && checkDirty(e.deps, e))) {
        const prev = setCurrentSub(e);
        startTracking(e);
        try {
            e.fn();
        }
        finally {
            setCurrentSub(prev);
            endTracking(e);
        }
        return;
    }
    else if (flags & 32) {
        e.flags = flags & ~32;
    }
    let link = e.deps;
    while (link !== undefined) {
        const dep = link.dep;
        const depFlags = dep.flags;
        if (depFlags & 64) {
            run(dep, dep.flags = depFlags & ~64);
        }
        link = link.nextDep;
    }
}
function flush() {
    while (notifyIndex < queuedEffectsLength) {
        const effect = queuedEffects[notifyIndex];
        queuedEffects[notifyIndex++] = undefined;
        run(effect, effect.flags &= ~64);
    }
    notifyIndex = 0;
    queuedEffectsLength = 0;
}
function computedOper() {
    const flags = this.flags;
    if (flags & 16
        || (flags & 32 && checkDirty(this.deps, this))) {
        if (updateComputed(this)) {
            const subs = this.subs;
            if (subs !== undefined) {
                shallowPropagate(subs);
            }
        }
    }
    else if (flags & 32) {
        this.flags = flags & ~32;
    }
    if (activeSub !== undefined) {
        link(this, activeSub);
    }
    else if (activeScope !== undefined) {
        link(this, activeScope);
    }
    return this.value;
}
function signalOper(...value) {
    if (value.length) {
        const newValue = value[0];
        if (this.value !== (this.value = newValue)) {
            this.flags = 17;
            const subs = this.subs;
            if (subs !== undefined) {
                propagate(subs);
                if (!exports.batchDepth) {
                    flush();
                }
            }
        }
    }
    else {
        const value = this.value;
        if (this.flags & 16) {
            if (updateSignal(this, value)) {
                const subs = this.subs;
                if (subs !== undefined) {
                    shallowPropagate(subs);
                }
            }
        }
        if (activeSub !== undefined) {
            link(this, activeSub);
        }
        return value;
    }
}
function effectOper() {
    let dep = this.deps;
    while (dep !== undefined) {
        dep = unlink(dep, this);
    }
    const sub = this.subs;
    if (sub !== undefined) {
        unlink(sub);
    }
    this.flags = 0;
}
