export * from './system.mjs';
import { createReactiveSystem } from './system.mjs';
const pauseStack = [];
const queuedEffects = [];
const { link, unlink, propagate, checkDirty, endTracking, startTracking, shallowPropagate, } = createReactiveSystem({
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
export let batchDepth = 0;
let notifyIndex = 0;
let queuedEffectsLength = 0;
let activeSub;
let activeScope;
export function getCurrentSub() {
    return activeSub;
}
export function setCurrentSub(sub) {
    const prevSub = activeSub;
    activeSub = sub;
    return prevSub;
}
export function getCurrentScope() {
    return activeScope;
}
export function setCurrentScope(scope) {
    const prevScope = activeScope;
    activeScope = scope;
    return prevScope;
}
export function startBatch() {
    ++batchDepth;
}
export function endBatch() {
    if (!--batchDepth) {
        flush();
    }
}
export function pauseTracking() {
    pauseStack.push(setCurrentSub(undefined));
}
export function resumeTracking() {
    setCurrentSub(pauseStack.pop());
}
export function signal(initialValue) {
    return signalOper.bind({
        previousValue: initialValue,
        value: initialValue,
        subs: undefined,
        subsTail: undefined,
        flags: 1,
    });
}
export function computed(getter) {
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
export function effect(fn) {
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
export function effectScope(fn) {
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
                if (!batchDepth) {
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
