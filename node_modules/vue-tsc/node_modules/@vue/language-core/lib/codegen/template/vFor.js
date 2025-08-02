"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVFor = generateVFor;
exports.parseVForNode = parseVForNode;
const CompilerDOM = require("@vue/compiler-dom");
const collectBindings_1 = require("../../utils/collectBindings");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const elementChildren_1 = require("./elementChildren");
const interpolation_1 = require("./interpolation");
function* generateVFor(options, ctx, node) {
    const { source } = node.parseResult;
    const { leftExpressionRange, leftExpressionText } = parseVForNode(node);
    const forBlockVars = [];
    yield `for (const [`;
    if (leftExpressionRange && leftExpressionText) {
        const collectAst = (0, utils_1.createTsAst)(options.ts, ctx.inlineTsAsts, `const [${leftExpressionText}]`);
        forBlockVars.push(...(0, collectBindings_1.collectBindingNames)(options.ts, collectAst, collectAst));
        yield [
            leftExpressionText,
            'template',
            leftExpressionRange.start,
            codeFeatures_1.codeFeatures.all,
        ];
    }
    yield `] of `;
    if (source.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        yield `__VLS_getVForSourceType(`;
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.all, source.content, source.loc.start.offset, `(`, `)`);
        yield `!)`; // #3102
    }
    else {
        yield `{} as any`;
    }
    yield `) {${utils_1.newLine}`;
    for (const varName of forBlockVars) {
        ctx.addLocalVariable(varName);
    }
    let isFragment = true;
    for (const argument of node.codegenNode?.children.arguments ?? []) {
        if (argument.type === CompilerDOM.NodeTypes.JS_FUNCTION_EXPRESSION
            && argument.returns?.type === CompilerDOM.NodeTypes.VNODE_CALL
            && argument.returns?.props?.type === CompilerDOM.NodeTypes.JS_OBJECT_EXPRESSION) {
            if (argument.returns.tag !== CompilerDOM.FRAGMENT) {
                isFragment = false;
                continue;
            }
            for (const prop of argument.returns.props.properties) {
                if (prop.value.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION
                    && !prop.value.isStatic) {
                    yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.all, prop.value.content, prop.value.loc.start.offset, `(`, `)`);
                    yield utils_1.endOfLine;
                }
            }
        }
    }
    const { inVFor } = ctx;
    ctx.inVFor = true;
    yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node.children, isFragment);
    ctx.inVFor = inVFor;
    for (const varName of forBlockVars) {
        ctx.removeLocalVariable(varName);
    }
    yield `}${utils_1.newLine}`;
}
function parseVForNode(node) {
    const { value, key, index } = node.parseResult;
    const leftExpressionRange = (value || key || index)
        ? {
            start: (value ?? key ?? index).loc.start.offset,
            end: (index ?? key ?? value).loc.end.offset,
        }
        : undefined;
    const leftExpressionText = leftExpressionRange
        ? node.loc.source.slice(leftExpressionRange.start - node.loc.start.offset, leftExpressionRange.end - node.loc.start.offset)
        : undefined;
    return {
        leftExpressionRange,
        leftExpressionText,
    };
}
//# sourceMappingURL=vFor.js.map