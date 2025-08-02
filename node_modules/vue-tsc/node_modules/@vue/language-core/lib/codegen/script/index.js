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
exports.generateScript = generateScript;
exports.generateScriptSectionPartiallyEnding = generateScriptSectionPartiallyEnding;
const path = require("path-browserify");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const componentSelf_1 = require("./componentSelf");
const scriptSetup_1 = require("./scriptSetup");
const src_1 = require("./src");
const template_1 = require("./template");
__exportStar(require("./context"), exports);
function* generateScript(options, ctx) {
    yield* generateGlobalTypesPath(options);
    if (options.sfc.script?.src) {
        yield* (0, src_1.generateSrc)(options.sfc.script.src);
    }
    if (options.sfc.scriptSetup && options.scriptSetupRanges) {
        yield* (0, scriptSetup_1.generateScriptSetupImports)(options.sfc.scriptSetup, options.scriptSetupRanges);
    }
    if (options.sfc.script && options.scriptRanges) {
        const { exportDefault, classBlockEnd } = options.scriptRanges;
        const isExportRawObject = exportDefault
            && options.sfc.script.content[exportDefault.expression.start] === '{';
        if (options.sfc.scriptSetup && options.scriptSetupRanges) {
            if (exportDefault) {
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, exportDefault.expression.start, codeFeatures_1.codeFeatures.all);
                yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, exportDefault.expression.end, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
            }
            else {
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
                yield* generateScriptSectionPartiallyEnding(options.sfc.script.name, options.sfc.script.content.length, '#3632/both.vue');
                yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
            }
        }
        else if (exportDefault && isExportRawObject && options.vueCompilerOptions.optionsWrapper.length) {
            ctx.inlayHints.push({
                blockName: options.sfc.script.name,
                offset: exportDefault.expression.start,
                setting: 'vue.inlayHints.optionsWrapper',
                label: options.vueCompilerOptions.optionsWrapper.length
                    ? options.vueCompilerOptions.optionsWrapper[0]
                    : '[Missing optionsWrapper[0]]',
                tooltip: [
                    'This is virtual code that is automatically wrapped for type support, it does not affect your runtime behavior, you can customize it via `vueCompilerOptions.optionsWrapper` option in tsconfig / jsconfig.',
                    'To hide it, you can set `"vue.inlayHints.optionsWrapper": false` in IDE settings.',
                ].join('\n\n'),
            }, {
                blockName: options.sfc.script.name,
                offset: exportDefault.expression.end,
                setting: 'vue.inlayHints.optionsWrapper',
                label: options.vueCompilerOptions.optionsWrapper.length >= 2
                    ? options.vueCompilerOptions.optionsWrapper[1]
                    : '[Missing optionsWrapper[1]]',
            });
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, exportDefault.expression.start, codeFeatures_1.codeFeatures.all);
            yield options.vueCompilerOptions.optionsWrapper[0];
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, exportDefault.expression.start, exportDefault.expression.end, codeFeatures_1.codeFeatures.all);
            yield options.vueCompilerOptions.optionsWrapper[1];
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, exportDefault.expression.end, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
        }
        else if (classBlockEnd !== undefined) {
            if (options.vueCompilerOptions.skipTemplateCodegen) {
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
            }
            else {
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, classBlockEnd, codeFeatures_1.codeFeatures.all);
                yield `__VLS_template = () => {${utils_1.newLine}`;
                const templateCodegenCtx = yield* (0, template_1.generateTemplate)(options, ctx);
                yield* (0, componentSelf_1.generateComponentSelf)(options, ctx, templateCodegenCtx);
                yield `}${utils_1.endOfLine}`;
                yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, classBlockEnd, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
            }
        }
        else {
            yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, 0, options.sfc.script.content.length, codeFeatures_1.codeFeatures.all);
            yield* generateScriptSectionPartiallyEnding(options.sfc.script.name, options.sfc.script.content.length, '#3632/script.vue');
        }
    }
    else if (options.sfc.scriptSetup && options.scriptSetupRanges) {
        yield* (0, scriptSetup_1.generateScriptSetup)(options, ctx, options.sfc.scriptSetup, options.scriptSetupRanges);
    }
    if (options.sfc.scriptSetup) {
        yield* generateScriptSectionPartiallyEnding(options.sfc.scriptSetup.name, options.sfc.scriptSetup.content.length, '#4569/main.vue', ';');
    }
    if (!ctx.generatedTemplate) {
        const templateCodegenCtx = yield* (0, template_1.generateTemplate)(options, ctx);
        yield* (0, componentSelf_1.generateComponentSelf)(options, ctx, templateCodegenCtx);
    }
    yield* ctx.localTypes.generate([...ctx.localTypes.getUsedNames()]);
    if (options.sfc.scriptSetup) {
        yield ['', 'scriptSetup', options.sfc.scriptSetup.content.length, codeFeatures_1.codeFeatures.verification];
    }
}
function* generateGlobalTypesPath(options) {
    const globalTypesPath = options.vueCompilerOptions.globalTypesPath(options.fileName);
    if (!globalTypesPath) {
        yield `/* placeholder */${utils_1.newLine}`;
    }
    else if (path.isAbsolute(globalTypesPath)) {
        let relativePath = path.relative(path.dirname(options.fileName), globalTypesPath);
        if (relativePath !== globalTypesPath
            && !relativePath.startsWith('./')
            && !relativePath.startsWith('../')) {
            relativePath = './' + relativePath;
        }
        yield `/// <reference types="${relativePath}" />${utils_1.newLine}`;
    }
    else {
        yield `/// <reference types="${globalTypesPath}" />${utils_1.newLine}`;
    }
}
function* generateScriptSectionPartiallyEnding(source, end, mark, delimiter = 'debugger') {
    yield delimiter;
    yield ['', source, end, codeFeatures_1.codeFeatures.verification];
    yield `/* PartiallyEnd: ${mark} */${utils_1.newLine}`;
}
//# sourceMappingURL=index.js.map