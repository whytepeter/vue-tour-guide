export var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags[ReactiveFlags["None"] = 0] = "None";
    ReactiveFlags[ReactiveFlags["Mutable"] = 1] = "Mutable";
    ReactiveFlags[ReactiveFlags["Watching"] = 2] = "Watching";
    ReactiveFlags[ReactiveFlags["RecursedCheck"] = 4] = "RecursedCheck";
    ReactiveFlags[ReactiveFlags["Recursed"] = 8] = "Recursed";
    ReactiveFlags[ReactiveFlags["Dirty"] = 16] = "Dirty";
    ReactiveFlags[ReactiveFlags["Pending"] = 32] = "Pending";
})(ReactiveFlags || (ReactiveFlags = {}));
export function createReactiveSystem({ update, notify, unwatched, }) {
    let version = 0;
    return {
        link,
        unlink,
        propagate,
        checkDirty,
        endTracking,
        startTracking,
        shallowPropagate,
    };
    function link(dep, sub) {
        const prevDep = sub.depsTail;
        if (prevDep !== undefined && prevDep.dep === dep) {
            return;
        }
        let nextDep;
        if (sub.flags & 4) {
            nextDep = prevDep !== undefined ? prevDep.nextDep : sub.deps;
            if (nextDep !== undefined && nextDep.dep === dep) {
                nextDep.version = version;
                sub.depsTail = nextDep;
                return;
            }
        }
        const prevSub = dep.subsTail;
        if (prevSub !== undefined && prevSub.version === version && prevSub.sub === sub) {
            return;
        }
        const newLink = sub.depsTail
            = dep.subsTail
                = {
                    version,
                    dep,
                    sub,
                    prevDep,
                    nextDep,
                    prevSub,
                    nextSub: undefined,
                };
        if (nextDep !== undefined) {
            nextDep.prevDep = newLink;
        }
        if (prevDep !== undefined) {
            prevDep.nextDep = newLink;
        }
        else {
            sub.deps = newLink;
        }
        if (prevSub !== undefined) {
            prevSub.nextSub = newLink;
        }
        else {
            dep.subs = newLink;
        }
    }
    function unlink(link, sub = link.sub) {
        const dep = link.dep;
        const prevDep = link.prevDep;
        const nextDep = link.nextDep;
        const nextSub = link.nextSub;
        const prevSub = link.prevSub;
        if (nextDep !== undefined) {
            nextDep.prevDep = prevDep;
        }
        else {
            sub.depsTail = prevDep;
        }
        if (prevDep !== undefined) {
            prevDep.nextDep = nextDep;
        }
        else {
            sub.deps = nextDep;
        }
        if (nextSub !== undefined) {
            nextSub.prevSub = prevSub;
        }
        else {
            dep.subsTail = prevSub;
        }
        if (prevSub !== undefined) {
            prevSub.nextSub = nextSub;
        }
        else if ((dep.subs = nextSub) === undefined) {
            unwatched(dep);
        }
        return nextDep;
    }
    function propagate(link) {
        let next = link.nextSub;
        let stack;
        top: do {
            const sub = link.sub;
            let flags = sub.flags;
            if (flags & 3) {
                if (!(flags & 60)) {
                    sub.flags = flags | 32;
                }
                else if (!(flags & 12)) {
                    flags = 0;
                }
                else if (!(flags & 4)) {
                    sub.flags = (flags & ~8) | 32;
                }
                else if (!(flags & 48) && isValidLink(link, sub)) {
                    sub.flags = flags | 40;
                    flags &= 1;
                }
                else {
                    flags = 0;
                }
                if (flags & 2) {
                    notify(sub);
                }
                if (flags & 1) {
                    const subSubs = sub.subs;
                    if (subSubs !== undefined) {
                        link = subSubs;
                        if (subSubs.nextSub !== undefined) {
                            stack = { value: next, prev: stack };
                            next = link.nextSub;
                        }
                        continue;
                    }
                }
            }
            if ((link = next) !== undefined) {
                next = link.nextSub;
                continue;
            }
            while (stack !== undefined) {
                link = stack.value;
                stack = stack.prev;
                if (link !== undefined) {
                    next = link.nextSub;
                    continue top;
                }
            }
            break;
        } while (true);
    }
    function startTracking(sub) {
        ++version;
        sub.depsTail = undefined;
        sub.flags = (sub.flags & ~56) | 4;
    }
    function endTracking(sub) {
        const depsTail = sub.depsTail;
        let toRemove = depsTail !== undefined ? depsTail.nextDep : sub.deps;
        while (toRemove !== undefined) {
            toRemove = unlink(toRemove, sub);
        }
        sub.flags &= ~4;
    }
    function checkDirty(link, sub) {
        let stack;
        let checkDepth = 0;
        top: do {
            const dep = link.dep;
            const depFlags = dep.flags;
            let dirty = false;
            if (sub.flags & 16) {
                dirty = true;
            }
            else if ((depFlags & 17) === 17) {
                if (update(dep)) {
                    const subs = dep.subs;
                    if (subs.nextSub !== undefined) {
                        shallowPropagate(subs);
                    }
                    dirty = true;
                }
            }
            else if ((depFlags & 33) === 33) {
                if (link.nextSub !== undefined || link.prevSub !== undefined) {
                    stack = { value: link, prev: stack };
                }
                link = dep.deps;
                sub = dep;
                ++checkDepth;
                continue;
            }
            if (!dirty && link.nextDep !== undefined) {
                link = link.nextDep;
                continue;
            }
            while (checkDepth) {
                --checkDepth;
                const firstSub = sub.subs;
                const hasMultipleSubs = firstSub.nextSub !== undefined;
                if (hasMultipleSubs) {
                    link = stack.value;
                    stack = stack.prev;
                }
                else {
                    link = firstSub;
                }
                if (dirty) {
                    if (update(sub)) {
                        if (hasMultipleSubs) {
                            shallowPropagate(firstSub);
                        }
                        sub = link.sub;
                        continue;
                    }
                }
                else {
                    sub.flags &= ~32;
                }
                sub = link.sub;
                if (link.nextDep !== undefined) {
                    link = link.nextDep;
                    continue top;
                }
                dirty = false;
            }
            return dirty;
        } while (true);
    }
    function shallowPropagate(link) {
        do {
            const sub = link.sub;
            const nextSub = link.nextSub;
            const subFlags = sub.flags;
            if ((subFlags & 48) === 32) {
                sub.flags = subFlags | 16;
                if (subFlags & 2) {
                    notify(sub);
                }
            }
            link = nextSub;
        } while (link !== undefined);
    }
    function isValidLink(checkLink, sub) {
        const depsTail = sub.depsTail;
        if (depsTail !== undefined) {
            let link = sub.deps;
            do {
                if (link === checkLink) {
                    return true;
                }
                if (link === depsTail) {
                    break;
                }
                link = link.nextDep;
            } while (link !== undefined);
        }
        return false;
    }
}
