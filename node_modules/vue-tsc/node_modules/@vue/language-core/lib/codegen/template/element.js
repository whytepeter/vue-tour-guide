"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
exports.generateElement = generateElement;
const CompilerDOM = require("@vue/compiler-dom");
const shared_1 = require("@vue/shared");
const shared_2 = require("../../utils/shared");
const codeFeatures_1 = require("../codeFeatures");
const inlayHints_1 = require("../inlayHints");
const utils_1 = require("../utils");
const camelized_1 = require("../utils/camelized");
const wrapWith_1 = require("../utils/wrapWith");
const elementChildren_1 = require("./elementChildren");
const elementDirectives_1 = require("./elementDirectives");
const elementEvents_1 = require("./elementEvents");
const elementProps_1 = require("./elementProps");
const interpolation_1 = require("./interpolation");
const propertyAccess_1 = require("./propertyAccess");
const styleScopedClasses_1 = require("./styleScopedClasses");
const vSlot_1 = require("./vSlot");
const colonReg = /:/g;
function* generateComponent(options, ctx, node) {
    const tagOffsets = [node.loc.start.offset + options.template.content.slice(node.loc.start.offset).indexOf(node.tag)];
    if (!node.isSelfClosing && options.template.lang === 'html') {
        const endTagOffset = node.loc.start.offset + node.loc.source.lastIndexOf(node.tag);
        if (endTagOffset > tagOffsets[0]) {
            tagOffsets.push(endTagOffset);
        }
    }
    const failedPropExps = [];
    const possibleOriginalNames = getPossibleOriginalComponentNames(node.tag, true);
    const matchImportName = possibleOriginalNames.find(name => options.scriptSetupImportComponentNames.has(name));
    const componentOriginalVar = matchImportName ?? ctx.getInternalVariable();
    const componentFunctionalVar = ctx.getInternalVariable();
    const componentVNodeVar = ctx.getInternalVariable();
    const componentCtxVar = ctx.getInternalVariable();
    const isComponentTag = node.tag.toLowerCase() === 'component';
    ctx.currentComponent = {
        ctxVar: componentCtxVar,
        used: false,
    };
    let props = node.props;
    let dynamicTagInfo;
    if (isComponentTag) {
        for (const prop of node.props) {
            if (prop.type === CompilerDOM.NodeTypes.DIRECTIVE
                && prop.name === 'bind'
                && prop.arg?.loc.source === 'is'
                && prop.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
                if (prop.arg.loc.end.offset === prop.exp.loc.end.offset) {
                    ctx.inlayHints.push((0, inlayHints_1.createVBindShorthandInlayHintInfo)(prop.exp.loc, 'is'));
                }
                dynamicTagInfo = {
                    tag: prop.exp.content,
                    offsets: [prop.exp.loc.start.offset],
                };
                props = props.filter(p => p !== prop);
                break;
            }
        }
    }
    else if (node.tag.includes('.')) {
        // namespace tag
        dynamicTagInfo = {
            tag: node.tag,
            offsets: tagOffsets,
        };
    }
    if (matchImportName) {
        // navigation support
        yield `/** @type {[`;
        for (const tagOffset of tagOffsets) {
            yield `typeof `;
            if (componentOriginalVar === node.tag) {
                yield [
                    componentOriginalVar,
                    'template',
                    tagOffset,
                    codeFeatures_1.codeFeatures.withoutHighlightAndCompletion,
                ];
            }
            else {
                const shouldCapitalize = matchImportName[0].toUpperCase() === matchImportName[0];
                yield* (0, camelized_1.generateCamelized)(shouldCapitalize ? (0, shared_1.capitalize)(node.tag) : node.tag, 'template', tagOffset, codeFeatures_1.codeFeatures.withoutHighlightAndCompletion);
            }
            yield `, `;
        }
        yield `]} */${utils_1.endOfLine}`;
    }
    else if (dynamicTagInfo) {
        yield `const ${componentOriginalVar} = (`;
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.all, dynamicTagInfo.tag, dynamicTagInfo.offsets[0], `(`, `)`);
        if (dynamicTagInfo.offsets[1] !== undefined) {
            yield `,`;
            yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.withoutCompletion, dynamicTagInfo.tag, dynamicTagInfo.offsets[1], `(`, `)`);
        }
        yield `)${utils_1.endOfLine}`;
    }
    else {
        yield `const ${componentOriginalVar} = ({} as __VLS_WithComponent<'${getCanonicalComponentName(node.tag)}', __VLS_LocalComponents, `;
        if (options.selfComponentName && possibleOriginalNames.includes(options.selfComponentName)) {
            yield `typeof __VLS_self & (new () => { `
                + (0, shared_2.getSlotsPropertyName)(options.vueCompilerOptions.target)
                + `: __VLS_Slots }), `;
        }
        else {
            yield `void, `;
        }
        yield getPossibleOriginalComponentNames(node.tag, false)
            .map(name => `'${name}'`)
            .join(`, `);
        yield `>).`;
        yield* generateCanonicalComponentName(node.tag, tagOffsets[0], {
            ...codeFeatures_1.codeFeatures.semanticWithoutHighlight,
            ...options.vueCompilerOptions.checkUnknownComponents
                ? codeFeatures_1.codeFeatures.verification
                : codeFeatures_1.codeFeatures.doNotReportTs2339AndTs2551,
        });
        yield `${utils_1.endOfLine}`;
        const camelizedTag = (0, shared_1.camelize)(node.tag);
        if (utils_1.identifierRegex.test(camelizedTag)) {
            // navigation support
            yield `/** @type {[`;
            for (const tagOffset of tagOffsets) {
                for (const shouldCapitalize of (node.tag[0] === node.tag[0].toUpperCase() ? [false] : [true, false])) {
                    yield `typeof __VLS_components.`;
                    yield* (0, camelized_1.generateCamelized)(shouldCapitalize ? (0, shared_1.capitalize)(node.tag) : node.tag, 'template', tagOffset, codeFeatures_1.codeFeatures.navigation);
                    yield `, `;
                }
            }
            yield `]} */${utils_1.endOfLine}`;
            // auto import support
            yield `// @ts-ignore${utils_1.newLine}`; // #2304
            yield* (0, camelized_1.generateCamelized)((0, shared_1.capitalize)(node.tag), 'template', tagOffsets[0], {
                completion: {
                    isAdditional: true,
                    onlyImport: true,
                },
            });
            yield `${utils_1.endOfLine}`;
        }
    }
    yield `// @ts-ignore${utils_1.newLine}`;
    yield `const ${componentFunctionalVar} = __VLS_asFunctionalComponent(${componentOriginalVar}, new ${componentOriginalVar}({${utils_1.newLine}`;
    yield* (0, elementProps_1.generateElementProps)(options, ctx, node, props, options.vueCompilerOptions.checkUnknownProps, false);
    yield `}))${utils_1.endOfLine}`;
    yield `const `;
    yield* (0, wrapWith_1.wrapWith)(node.loc.start.offset, node.loc.end.offset, codeFeatures_1.codeFeatures.doNotReportTs6133, componentVNodeVar);
    yield ` = ${componentFunctionalVar}`;
    yield* generateComponentGeneric(ctx);
    yield `(`;
    yield* (0, wrapWith_1.wrapWith)(tagOffsets[0], tagOffsets[0] + node.tag.length, codeFeatures_1.codeFeatures.verification, `{${utils_1.newLine}`, ...(0, elementProps_1.generateElementProps)(options, ctx, node, props, options.vueCompilerOptions.checkUnknownProps, true, failedPropExps), `}`);
    yield `, ...__VLS_functionalComponentArgsRest(${componentFunctionalVar}))${utils_1.endOfLine}`;
    yield* generateFailedPropExps(options, ctx, failedPropExps);
    yield* (0, elementEvents_1.generateElementEvents)(options, ctx, node, componentOriginalVar, componentFunctionalVar, componentVNodeVar, componentCtxVar);
    yield* (0, elementDirectives_1.generateElementDirectives)(options, ctx, node);
    const [refName, offset] = yield* generateElementReference(options, ctx, node);
    const tag = (0, shared_2.hyphenateTag)(node.tag);
    const isRootNode = ctx.singleRootNodes.has(node)
        && !options.vueCompilerOptions.fallthroughComponentNames.includes(tag);
    if (refName || isRootNode) {
        const componentInstanceVar = ctx.getInternalVariable();
        ctx.currentComponent.used = true;
        yield `var ${componentInstanceVar} = {} as (Parameters<NonNullable<typeof ${componentCtxVar}['expose']>>[0] | null)`;
        if (ctx.inVFor) {
            yield `[]`;
        }
        yield `${utils_1.endOfLine}`;
        if (refName && offset) {
            ctx.addTemplateRef(refName, `typeof ${ctx.getHoistVariable(componentInstanceVar)}`, offset);
        }
        if (isRootNode) {
            ctx.singleRootElTypes.push(`NonNullable<typeof ${componentInstanceVar}>['$el']`);
        }
    }
    if (hasVBindAttrs(options, ctx, node)) {
        const attrsVar = ctx.getInternalVariable();
        yield `var ${attrsVar}!: Parameters<typeof ${componentFunctionalVar}>[0]${utils_1.endOfLine}`;
        ctx.inheritedAttrVars.add(attrsVar);
    }
    (0, styleScopedClasses_1.collectStyleScopedClassReferences)(options, ctx, node);
    const slotDir = node.props.find(p => p.type === CompilerDOM.NodeTypes.DIRECTIVE && p.name === 'slot');
    yield* (0, vSlot_1.generateVSlot)(options, ctx, node, slotDir);
    if (ctx.currentComponent.used) {
        yield `var ${componentCtxVar}!: __VLS_FunctionalComponentCtx<typeof ${componentOriginalVar}, typeof ${componentVNodeVar}>${utils_1.endOfLine}`;
    }
}
function* generateElement(options, ctx, node) {
    const startTagOffset = node.loc.start.offset
        + options.template.content.slice(node.loc.start.offset).indexOf(node.tag);
    const endTagOffset = !node.isSelfClosing && options.template.lang === 'html'
        ? node.loc.start.offset + node.loc.source.lastIndexOf(node.tag)
        : undefined;
    const failedPropExps = [];
    const features = {
        ...codeFeatures_1.codeFeatures.semanticWithoutHighlight,
        ...codeFeatures_1.codeFeatures.navigationWithoutHighlight,
    };
    yield `__VLS_asFunctionalElement(__VLS_elements`;
    yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, node.tag, startTagOffset, features);
    if (endTagOffset !== undefined) {
        yield `, __VLS_elements`;
        yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, node.tag, endTagOffset, features);
    }
    yield `)(`;
    yield* (0, wrapWith_1.wrapWith)(startTagOffset, startTagOffset + node.tag.length, codeFeatures_1.codeFeatures.verification, `{${utils_1.newLine}`, ...(0, elementProps_1.generateElementProps)(options, ctx, node, node.props, options.vueCompilerOptions.checkUnknownProps, true, failedPropExps), `}`);
    yield `)${utils_1.endOfLine}`;
    yield* generateFailedPropExps(options, ctx, failedPropExps);
    yield* (0, elementDirectives_1.generateElementDirectives)(options, ctx, node);
    const [refName, offset] = yield* generateElementReference(options, ctx, node);
    if (refName && offset) {
        let typeExp = `__VLS_NativeElements['${node.tag}']`;
        if (ctx.inVFor) {
            typeExp += `[]`;
        }
        ctx.addTemplateRef(refName, typeExp, offset);
    }
    if (ctx.singleRootNodes.has(node)) {
        ctx.singleRootElTypes.push(`__VLS_NativeElements['${node.tag}']`);
    }
    if (hasVBindAttrs(options, ctx, node)) {
        ctx.inheritedAttrVars.add(`__VLS_elements.${node.tag}`);
    }
    (0, styleScopedClasses_1.collectStyleScopedClassReferences)(options, ctx, node);
    const { currentComponent } = ctx;
    ctx.currentComponent = undefined;
    yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node.children);
    ctx.currentComponent = currentComponent;
}
function* generateFailedPropExps(options, ctx, failedPropExps) {
    for (const failedExp of failedPropExps) {
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.all, failedExp.node.loc.source, failedExp.node.loc.start.offset, failedExp.prefix, failedExp.suffix);
        yield utils_1.endOfLine;
    }
}
function getCanonicalComponentName(tagText) {
    return utils_1.identifierRegex.test(tagText)
        ? tagText
        : (0, shared_1.capitalize)((0, shared_1.camelize)(tagText.replace(colonReg, '-')));
}
function getPossibleOriginalComponentNames(tagText, deduplicate) {
    const name1 = (0, shared_1.capitalize)((0, shared_1.camelize)(tagText));
    const name2 = (0, shared_1.camelize)(tagText);
    const name3 = tagText;
    const names = [name1];
    if (!deduplicate || name2 !== name1) {
        names.push(name2);
    }
    if (!deduplicate || name3 !== name2) {
        names.push(name3);
    }
    return names;
}
function* generateCanonicalComponentName(tagText, offset, features) {
    if (utils_1.identifierRegex.test(tagText)) {
        yield [tagText, 'template', offset, features];
    }
    else {
        yield* (0, camelized_1.generateCamelized)((0, shared_1.capitalize)(tagText.replace(colonReg, '-')), 'template', offset, features);
    }
}
function* generateComponentGeneric(ctx) {
    if (ctx.currentInfo.generic) {
        const { content, offset } = ctx.currentInfo.generic;
        yield* (0, wrapWith_1.wrapWith)(offset, offset + content.length, codeFeatures_1.codeFeatures.verification, `<`, [
            content,
            'template',
            offset,
            codeFeatures_1.codeFeatures.all,
        ], `>`);
    }
}
function* generateElementReference(options, ctx, node) {
    for (const prop of node.props) {
        if (prop.type === CompilerDOM.NodeTypes.ATTRIBUTE
            && prop.name === 'ref'
            && prop.value) {
            const [content, startOffset] = (0, utils_1.normalizeAttributeValue)(prop.value);
            // navigation support for `const foo = ref()`
            yield `/** @type {typeof __VLS_ctx`;
            yield* (0, propertyAccess_1.generatePropertyAccess)(options, ctx, content, startOffset, codeFeatures_1.codeFeatures.navigation);
            yield `} */${utils_1.endOfLine}`;
            if (utils_1.identifierRegex.test(content) && !options.templateRefNames.has(content)) {
                ctx.accessExternalVariable(content, startOffset);
            }
            return [content, startOffset];
        }
    }
    return [];
}
function hasVBindAttrs(options, ctx, node) {
    return options.vueCompilerOptions.fallthroughAttributes && ((options.inheritAttrs && ctx.singleRootNodes.has(node))
        || node.props.some(prop => prop.type === CompilerDOM.NodeTypes.DIRECTIVE
            && prop.name === 'bind'
            && prop.exp?.loc.source === '$attrs'));
}
//# sourceMappingURL=element.js.map