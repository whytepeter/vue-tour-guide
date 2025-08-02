"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateInlineTsAsts = void 0;
exports.computedSfc = computedSfc;
const alien_signals_1 = require("alien-signals");
const parseCssClassNames_1 = require("../utils/parseCssClassNames");
const parseCssImports_1 = require("../utils/parseCssImports");
const parseCssVars_1 = require("../utils/parseCssVars");
const signals_1 = require("../utils/signals");
exports.templateInlineTsAsts = new WeakMap();
function computedSfc(ts, plugins, fileName, getSnapshot, getParseResult) {
    const getUntrackedSnapshot = () => {
        const pausedSub = (0, alien_signals_1.setCurrentSub)(undefined);
        const res = getSnapshot();
        (0, alien_signals_1.setCurrentSub)(pausedSub);
        return res;
    };
    const getContent = (0, alien_signals_1.computed)(() => {
        return getSnapshot().getText(0, getSnapshot().getLength());
    });
    const getComments = (0, alien_signals_1.computed)(oldValue => {
        const newValue = getParseResult()?.descriptor.comments ?? [];
        if (oldValue?.length === newValue.length
            && oldValue?.every((v, i) => v === newValue[i])) {
            return oldValue;
        }
        return newValue;
    });
    const getTemplate = computedNullableSfcBlock('template', 'html', (0, alien_signals_1.computed)(() => getParseResult()?.descriptor.template ?? undefined), (_block, base) => {
        const compiledAst = computedTemplateAst(base);
        return mergeObject(base, {
            get ast() {
                return compiledAst()?.ast;
            },
            get errors() {
                return compiledAst()?.errors;
            },
            get warnings() {
                return compiledAst()?.warnings;
            },
        });
    });
    const getScript = computedNullableSfcBlock('script', 'js', (0, alien_signals_1.computed)(() => getParseResult()?.descriptor.script ?? undefined), (block, base) => {
        const getSrc = computedAttrValue('__src', base, block);
        const getAst = (0, alien_signals_1.computed)(() => {
            for (const plugin of plugins) {
                const ast = plugin.compileSFCScript?.(base.lang, base.content);
                if (ast) {
                    return ast;
                }
            }
            return ts.createSourceFile(fileName + '.' + base.lang, '', 99);
        });
        return mergeObject(base, {
            get src() {
                return getSrc();
            },
            get ast() {
                return getAst();
            },
        });
    });
    const getOriginalScriptSetup = computedNullableSfcBlock('scriptSetup', 'js', (0, alien_signals_1.computed)(() => getParseResult()?.descriptor.scriptSetup ?? undefined), (block, base) => {
        const getGeneric = computedAttrValue('__generic', base, block);
        const getAst = (0, alien_signals_1.computed)(() => {
            for (const plugin of plugins) {
                const ast = plugin.compileSFCScript?.(base.lang, base.content);
                if (ast) {
                    return ast;
                }
            }
            return ts.createSourceFile(fileName + '.' + base.lang, '', 99);
        });
        return mergeObject(base, {
            get generic() {
                return getGeneric();
            },
            get ast() {
                return getAst();
            },
        });
    });
    const hasScript = (0, alien_signals_1.computed)(() => !!getParseResult()?.descriptor.script);
    const hasScriptSetup = (0, alien_signals_1.computed)(() => !!getParseResult()?.descriptor.scriptSetup);
    const getScriptSetup = (0, alien_signals_1.computed)(() => {
        if (!hasScript() && !hasScriptSetup()) {
            // #region monkey fix: https://github.com/vuejs/language-tools/pull/2113
            return {
                content: '',
                lang: 'ts',
                name: '',
                start: 0,
                end: 0,
                startTagEnd: 0,
                endTagStart: 0,
                generic: undefined,
                genericOffset: 0,
                attrs: {},
                ast: ts.createSourceFile('', '', 99, false, ts.ScriptKind.TS),
            };
        }
        return getOriginalScriptSetup();
    });
    const styles = (0, signals_1.computedArray)((0, alien_signals_1.computed)(() => getParseResult()?.descriptor.styles ?? []), (getBlock, i) => {
        const base = computedSfcBlock('style_' + i, 'css', getBlock);
        const getSrc = computedAttrValue('__src', base, getBlock);
        const getModule = computedAttrValue('__module', base, getBlock);
        const getScoped = (0, alien_signals_1.computed)(() => !!getBlock().scoped);
        const getImports = (0, signals_1.computedItems)(() => [...(0, parseCssImports_1.parseCssImports)(base.content)], (oldItem, newItem) => oldItem.text === newItem.text && oldItem.offset === newItem.offset);
        const getCssVars = (0, signals_1.computedItems)(() => [...(0, parseCssVars_1.parseCssVars)(base.content)], (oldItem, newItem) => oldItem.text === newItem.text && oldItem.offset === newItem.offset);
        const getClassNames = (0, signals_1.computedItems)(() => [...(0, parseCssClassNames_1.parseCssClassNames)(base.content)], (oldItem, newItem) => oldItem.text === newItem.text && oldItem.offset === newItem.offset);
        return () => mergeObject(base, {
            get src() {
                return getSrc();
            },
            get module() {
                return getModule();
            },
            get scoped() {
                return getScoped();
            },
            get imports() {
                return getImports();
            },
            get cssVars() {
                return getCssVars();
            },
            get classNames() {
                return getClassNames();
            },
        });
    });
    const customBlocks = (0, signals_1.computedArray)((0, alien_signals_1.computed)(() => getParseResult()?.descriptor.customBlocks ?? []), (getBlock, i) => {
        const base = computedSfcBlock('custom_block_' + i, 'txt', getBlock);
        const getType = (0, alien_signals_1.computed)(() => getBlock().type);
        return () => mergeObject(base, {
            get type() {
                return getType();
            },
        });
    });
    return {
        get content() {
            return getContent();
        },
        get comments() {
            return getComments();
        },
        get template() {
            return getTemplate();
        },
        get script() {
            return getScript();
        },
        get scriptSetup() {
            return getScriptSetup();
        },
        get styles() {
            return styles;
        },
        get customBlocks() {
            return customBlocks;
        },
    };
    function computedTemplateAst(base) {
        let cache;
        let inlineTsAsts;
        function updateInlineTsAsts(newAst, oldAst) {
            let newTsAsts = exports.templateInlineTsAsts.get(newAst);
            if (!newTsAsts) {
                exports.templateInlineTsAsts.set(newAst, newTsAsts = new Map());
            }
            const oldTsAsts = oldAst && exports.templateInlineTsAsts.get(oldAst) || inlineTsAsts;
            if (oldTsAsts) {
                for (const [text, ast] of oldTsAsts) {
                    if (!ast.__volar_used) {
                        oldTsAsts.delete(text);
                    }
                    else {
                        newTsAsts.set(text, ast);
                        ast.__volar_used = false;
                    }
                }
            }
            inlineTsAsts = new Map(newTsAsts);
        }
        return (0, alien_signals_1.computed)(() => {
            if (cache?.template === base.content) {
                return {
                    errors: [],
                    warnings: [],
                    ast: cache.result.ast,
                };
            }
            // incremental update
            if (cache?.plugin.updateSFCTemplate) {
                const change = getUntrackedSnapshot().getChangeRange(cache.snapshot);
                if (change) {
                    const pausedSub = (0, alien_signals_1.setCurrentSub)(undefined);
                    const templateOffset = base.startTagEnd;
                    (0, alien_signals_1.setCurrentSub)(pausedSub);
                    const newText = getUntrackedSnapshot().getText(change.span.start, change.span.start + change.newLength);
                    const newResult = cache.plugin.updateSFCTemplate(cache.result, {
                        start: change.span.start - templateOffset,
                        end: change.span.start + change.span.length - templateOffset,
                        newText,
                    });
                    if (newResult) {
                        updateInlineTsAsts(newResult.ast, cache.result.ast);
                        cache.template = base.content;
                        cache.snapshot = getUntrackedSnapshot();
                        cache.result = newResult;
                        return {
                            errors: [],
                            warnings: [],
                            ast: newResult.ast,
                        };
                    }
                }
            }
            const errors = [];
            const warnings = [];
            let options = {
                onError: (err) => errors.push(err),
                onWarn: (err) => warnings.push(err),
                expressionPlugins: ['typescript'],
            };
            for (const plugin of plugins) {
                if (plugin.resolveTemplateCompilerOptions) {
                    options = plugin.resolveTemplateCompilerOptions(options);
                }
            }
            for (const plugin of plugins) {
                let result;
                try {
                    result = plugin.compileSFCTemplate?.(base.lang, base.content, options);
                    if (result) {
                        updateInlineTsAsts(result.ast, cache?.result.ast);
                    }
                }
                catch (e) {
                    const err = e;
                    errors.push(err);
                }
                if (result || errors.length) {
                    if (result && !errors.length && !warnings.length) {
                        cache = {
                            template: base.content,
                            snapshot: getUntrackedSnapshot(),
                            result: result,
                            plugin,
                        };
                    }
                    else {
                        cache = undefined;
                    }
                    return {
                        errors,
                        warnings,
                        ast: result?.ast,
                    };
                }
            }
            return {
                errors,
                warnings,
                ast: undefined,
            };
        });
    }
    function computedNullableSfcBlock(name, defaultLang, getBlock, resolve) {
        const hasBlock = (0, alien_signals_1.computed)(() => !!getBlock());
        return (0, alien_signals_1.computed)(() => {
            if (!hasBlock()) {
                return;
            }
            const _block = (0, alien_signals_1.computed)(() => getBlock());
            return resolve(_block, computedSfcBlock(name, defaultLang, _block));
        });
    }
    function computedSfcBlock(name, defaultLang, getBlock) {
        const getLang = (0, alien_signals_1.computed)(() => getBlock().lang ?? defaultLang);
        const getAttrs = (0, alien_signals_1.computed)(() => getBlock().attrs); // TODO: computed it
        const getContent = (0, alien_signals_1.computed)(() => getBlock().content);
        const getStartTagEnd = (0, alien_signals_1.computed)(() => getBlock().loc.start.offset);
        const getEndTagStart = (0, alien_signals_1.computed)(() => getBlock().loc.end.offset);
        const getStart = (0, alien_signals_1.computed)(() => getUntrackedSnapshot().getText(0, getStartTagEnd()).lastIndexOf('<' + getBlock().type));
        const getEnd = (0, alien_signals_1.computed)(() => getEndTagStart()
            + getUntrackedSnapshot().getText(getEndTagStart(), getUntrackedSnapshot().getLength()).indexOf('>') + 1);
        return {
            name,
            get lang() {
                return getLang();
            },
            get attrs() {
                return getAttrs();
            },
            get content() {
                return getContent();
            },
            get startTagEnd() {
                return getStartTagEnd();
            },
            get endTagStart() {
                return getEndTagStart();
            },
            get start() {
                return getStart();
            },
            get end() {
                return getEnd();
            },
        };
    }
    function computedAttrValue(key, base, getBlock) {
        return (0, alien_signals_1.computed)(() => {
            const val = getBlock()[key];
            if (typeof val === 'object') {
                return {
                    ...val,
                    offset: base.start + val.offset,
                };
            }
            return val;
        });
    }
}
function mergeObject(a, b) {
    return Object.defineProperties(a, Object.getOwnPropertyDescriptors(b));
}
//# sourceMappingURL=computedSfc.js.map