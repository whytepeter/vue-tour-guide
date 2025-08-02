"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
exports.generateComponentSetupReturns = generateComponentSetupReturns;
exports.generateEmitsOption = generateEmitsOption;
exports.generatePropsOption = generatePropsOption;
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const merge_1 = require("../utils/merge");
function* generateComponent(options, ctx, scriptSetup, scriptSetupRanges) {
    if (options.sfc.script && options.scriptRanges?.exportDefault
        && options.scriptRanges.exportDefault.expression.start !== options.scriptRanges.exportDefault.args.start) {
        // use defineComponent() from user space code if it exist
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, options.scriptRanges.exportDefault.expression.start, options.scriptRanges.exportDefault.args.start, codeFeatures_1.codeFeatures.all);
        yield `{${utils_1.newLine}`;
    }
    else {
        yield `(await import('${options.vueCompilerOptions.lib}')).defineComponent({${utils_1.newLine}`;
    }
    yield `setup() {${utils_1.newLine}`;
    const returns = [];
    if (ctx.bypassDefineComponent) {
        yield* `const __VLS_returns = {${utils_1.newLine}`;
        yield* generateComponentSetupReturns(scriptSetupRanges);
        yield `}${utils_1.endOfLine}`;
        returns.push(`typeof __VLS_returns`);
    }
    if (scriptSetupRanges.defineExpose) {
        returns.push(`typeof __VLS_exposed`);
    }
    if (returns.length) {
        yield `return {} as `;
        yield* (0, merge_1.generateIntersectMerge)(returns);
        yield utils_1.endOfLine;
    }
    yield `},${utils_1.newLine}`;
    if (!ctx.bypassDefineComponent) {
        const emitOptionCodes = [...generateEmitsOption(options, scriptSetupRanges)];
        yield* emitOptionCodes;
        yield* generatePropsOption(options, ctx, scriptSetup, scriptSetupRanges, !!emitOptionCodes.length, true);
    }
    if (options.vueCompilerOptions.target >= 3.5
        && options.vueCompilerOptions.inferComponentDollarRefs
        && options.templateCodegen?.templateRefs.size) {
        yield `__typeRefs: {} as __VLS_TemplateRefs,${utils_1.newLine}`;
    }
    if (options.vueCompilerOptions.target >= 3.5
        && options.vueCompilerOptions.inferComponentDollarEl
        && options.templateCodegen?.singleRootElTypes.length) {
        yield `__typeEl: {} as __VLS_RootEl,${utils_1.newLine}`;
    }
    if (options.sfc.script && options.scriptRanges?.exportDefault?.args) {
        const { args } = options.scriptRanges.exportDefault;
        yield (0, utils_1.generateSfcBlockSection)(options.sfc.script, args.start + 1, args.end - 1, codeFeatures_1.codeFeatures.all);
    }
    yield `})`;
}
function* generateComponentSetupReturns(scriptSetupRanges) {
    // fill $props
    if (scriptSetupRanges.defineProps) {
        // NOTE: defineProps is inaccurate for $props
        yield `$props: __VLS_makeOptional(${scriptSetupRanges.defineProps.name ?? `__VLS_props`}),${utils_1.newLine}`;
        yield `...${scriptSetupRanges.defineProps.name ?? `__VLS_props`},${utils_1.newLine}`;
    }
    // fill $emit
    if (scriptSetupRanges.defineEmits) {
        yield `$emit: ${scriptSetupRanges.defineEmits.name ?? '__VLS_emit'},${utils_1.newLine}`;
    }
}
function* generateEmitsOption(options, scriptSetupRanges) {
    const optionCodes = [];
    const typeOptionCodes = [];
    if (scriptSetupRanges.defineModel.length) {
        optionCodes.push(`{} as __VLS_NormalizeEmits<typeof __VLS_modelEmit>`);
        typeOptionCodes.push(`__VLS_ModelEmit`);
    }
    if (scriptSetupRanges.defineEmits) {
        const { name, typeArg, hasUnionTypeArg } = scriptSetupRanges.defineEmits;
        optionCodes.push(`{} as __VLS_NormalizeEmits<typeof ${name ?? '__VLS_emit'}>`);
        if (typeArg && !hasUnionTypeArg) {
            typeOptionCodes.push(`__VLS_Emit`);
        }
        else {
            typeOptionCodes.length = 0;
        }
    }
    if (options.vueCompilerOptions.target >= 3.5 && typeOptionCodes.length) {
        yield `__typeEmits: {} as `;
        yield* (0, merge_1.generateIntersectMerge)(typeOptionCodes);
        yield `,${utils_1.newLine}`;
    }
    else if (optionCodes.length) {
        yield `emits: `;
        yield* (0, merge_1.generateSpreadMerge)(optionCodes);
        yield `,${utils_1.newLine}`;
    }
}
function* generatePropsOption(options, ctx, scriptSetup, scriptSetupRanges, hasEmitsOption, inheritAttrs) {
    const getOptionCodes = [];
    const typeOptionCodes = [];
    if (inheritAttrs && options.templateCodegen?.inheritedAttrVars.size) {
        let attrsType = `Partial<__VLS_InheritedAttrs>`;
        if (hasEmitsOption) {
            attrsType = `Omit<${attrsType}, \`on\${string}\`>`;
        }
        getOptionCodes.push(() => {
            const propsType = `__VLS_PickNotAny<${ctx.localTypes.OmitIndexSignature}<${attrsType}>, {}>`;
            const optionType = `${ctx.localTypes.TypePropsToOption}<${propsType}>`;
            return `{} as ${optionType}`;
        });
        typeOptionCodes.push(`{} as ${attrsType}`);
    }
    if (ctx.generatedPropsType) {
        if (options.vueCompilerOptions.target < 3.6) {
            getOptionCodes.push(() => {
                const propsType = `${ctx.localTypes.TypePropsToOption}<__VLS_PublicProps>`;
                return `{} as ` + (scriptSetupRanges.withDefaults?.arg
                    ? `${ctx.localTypes.WithDefaults}<${propsType}, typeof __VLS_withDefaultsArg>`
                    : propsType);
            });
        }
        typeOptionCodes.push(`{} as __VLS_PublicProps`);
    }
    if (scriptSetupRanges.defineProps?.arg) {
        const { arg } = scriptSetupRanges.defineProps;
        getOptionCodes.push(() => (0, utils_1.generateSfcBlockSection)(scriptSetup, arg.start, arg.end, codeFeatures_1.codeFeatures.navigation));
        typeOptionCodes.length = 0;
    }
    const useTypeOption = options.vueCompilerOptions.target >= 3.5 && typeOptionCodes.length;
    const useOption = (!useTypeOption || scriptSetupRanges.withDefaults) && getOptionCodes.length;
    if (useTypeOption) {
        if (options.vueCompilerOptions.target >= 3.6
            && scriptSetupRanges.withDefaults?.arg) {
            yield `__defaults: __VLS_withDefaultsArg,${utils_1.newLine}`;
        }
        yield `__typeProps: `;
        yield* (0, merge_1.generateSpreadMerge)(typeOptionCodes);
        yield `,${utils_1.newLine}`;
    }
    if (useOption) {
        yield `props: `;
        yield* (0, merge_1.generateSpreadMerge)(getOptionCodes.map(fn => fn()));
        yield `,${utils_1.newLine}`;
    }
}
//# sourceMappingURL=component.js.map