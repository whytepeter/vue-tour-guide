"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInterpolation = generateInterpolation;
const shared_1 = require("@vue/shared");
const collectBindings_1 = require("../../utils/collectBindings");
const shared_2 = require("../../utils/shared");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
// https://github.com/vuejs/core/blob/fb0c3ca519f1fccf52049cd6b8db3a67a669afe9/packages/compiler-core/src/transforms/transformExpression.ts#L47
const isLiteralWhitelisted = /*@__PURE__*/ (0, shared_1.makeMap)('true,false,null,this');
function* generateInterpolation(options, ctx, source, data, code, start, prefix = '', suffix = '') {
    const { ts, destructuredPropNames, templateRefNames, } = options;
    for (let [section, offset, type] of forEachInterpolationSegment(ts, ctx.inlineTsAsts, destructuredPropNames, templateRefNames, ctx, code, start, prefix, suffix)) {
        if (offset === undefined) {
            yield section;
        }
        else {
            offset -= prefix.length;
            let addSuffix = '';
            const overLength = offset + section.length - code.length;
            if (overLength > 0) {
                addSuffix = section.slice(section.length - overLength);
                section = section.slice(0, -overLength);
            }
            if (offset < 0) {
                yield section.slice(0, -offset);
                section = section.slice(-offset);
                offset = 0;
            }
            const shouldSkip = section.length === 0 && (type === 'startText' || type === 'endText');
            if (!shouldSkip) {
                if (start !== undefined
                    && data) {
                    yield [
                        section,
                        source,
                        start + offset,
                        type === 'errorMappingOnly'
                            ? codeFeatures_1.codeFeatures.verification
                            : typeof data === 'function'
                                ? data(start + offset)
                                : data,
                    ];
                }
                else {
                    yield section;
                }
            }
            yield addSuffix;
        }
    }
}
function* forEachInterpolationSegment(ts, inlineTsAsts, destructuredPropNames, templateRefNames, ctx, originalCode, start, prefix, suffix) {
    const code = prefix + originalCode + suffix;
    const offset = start !== undefined ? start - prefix.length : undefined;
    let ctxVars = [];
    if (utils_1.identifierRegex.test(originalCode) && !shouldIdentifierSkipped(ctx, originalCode, destructuredPropNames)) {
        ctxVars.push({
            text: originalCode,
            offset: prefix.length,
        });
    }
    else {
        const ast = (0, utils_1.createTsAst)(ts, inlineTsAsts, code);
        const varCb = (id, isShorthand) => {
            const text = (0, shared_2.getNodeText)(ts, id, ast);
            if (!shouldIdentifierSkipped(ctx, text, destructuredPropNames)) {
                ctxVars.push({
                    text,
                    offset: (0, shared_2.getStartEnd)(ts, id, ast).start,
                    isShorthand,
                });
            }
        };
        ts.forEachChild(ast, node => walkIdentifiers(ts, node, ast, varCb, ctx, [], true));
    }
    ctxVars = ctxVars.sort((a, b) => a.offset - b.offset);
    if (ctxVars.length) {
        for (let i = 0; i < ctxVars.length; i++) {
            const lastVar = ctxVars[i - 1];
            const curVar = ctxVars[i];
            const lastVarEnd = lastVar ? lastVar.offset + lastVar.text.length : 0;
            if (curVar.isShorthand) {
                yield [code.slice(lastVarEnd, curVar.offset + curVar.text.length), lastVarEnd];
                yield [': ', undefined];
            }
            else {
                yield [code.slice(lastVarEnd, curVar.offset), lastVarEnd, i ? undefined : 'startText'];
            }
            yield* generateVar(templateRefNames, ctx, code, offset, curVar);
        }
        const lastVar = ctxVars.at(-1);
        if (lastVar.offset + lastVar.text.length < code.length) {
            yield [code.slice(lastVar.offset + lastVar.text.length), lastVar.offset + lastVar.text.length, 'endText'];
        }
    }
    else {
        yield [code, 0];
    }
}
function* generateVar(templateRefNames, ctx, code, offset, curVar) {
    // fix https://github.com/vuejs/language-tools/issues/1205
    // fix https://github.com/vuejs/language-tools/issues/1264
    yield ['', curVar.offset, 'errorMappingOnly'];
    const isTemplateRef = templateRefNames?.has(curVar.text) ?? false;
    if (isTemplateRef) {
        yield [`__VLS_unref(`, undefined];
        yield [code.slice(curVar.offset, curVar.offset + curVar.text.length), curVar.offset];
        yield [`)`, undefined];
    }
    else {
        if (offset !== undefined) {
            ctx.accessExternalVariable(curVar.text, offset + curVar.offset);
        }
        else {
            ctx.accessExternalVariable(curVar.text);
        }
        if (ctx.dollarVars.has(curVar.text)) {
            yield [`__VLS_dollars.`, undefined];
        }
        else {
            yield [`__VLS_ctx.`, undefined];
        }
        yield [code.slice(curVar.offset, curVar.offset + curVar.text.length), curVar.offset];
    }
}
function walkIdentifiers(ts, node, ast, cb, ctx, blockVars, isRoot = false) {
    if (ts.isIdentifier(node)) {
        cb(node, false);
    }
    else if (ts.isShorthandPropertyAssignment(node)) {
        cb(node.name, true);
    }
    else if (ts.isPropertyAccessExpression(node)) {
        walkIdentifiers(ts, node.expression, ast, cb, ctx, blockVars);
    }
    else if (ts.isVariableDeclaration(node)) {
        const bindingNames = (0, collectBindings_1.collectBindingNames)(ts, node.name, ast);
        for (const name of bindingNames) {
            ctx.addLocalVariable(name);
            blockVars.push(name);
        }
        if (node.initializer) {
            walkIdentifiers(ts, node.initializer, ast, cb, ctx, blockVars);
        }
    }
    else if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
        walkIdentifiersInFunction(ts, node, ast, cb, ctx);
    }
    else if (ts.isObjectLiteralExpression(node)) {
        for (const prop of node.properties) {
            if (ts.isPropertyAssignment(prop)) {
                // fix https://github.com/vuejs/language-tools/issues/1176
                if (ts.isComputedPropertyName(prop.name)) {
                    walkIdentifiers(ts, prop.name.expression, ast, cb, ctx, blockVars);
                }
                walkIdentifiers(ts, prop.initializer, ast, cb, ctx, blockVars);
            }
            // fix https://github.com/vuejs/language-tools/issues/1156
            else if (ts.isShorthandPropertyAssignment(prop)) {
                walkIdentifiers(ts, prop, ast, cb, ctx, blockVars);
            }
            // fix https://github.com/vuejs/language-tools/issues/1148#issuecomment-1094378126
            else if (ts.isSpreadAssignment(prop)) {
                // TODO: cannot report "Spread types may only be created from object types.ts(2698)"
                walkIdentifiers(ts, prop.expression, ast, cb, ctx, blockVars);
            }
            // fix https://github.com/vuejs/language-tools/issues/4604
            else if (ts.isFunctionLike(prop) && prop.body) {
                walkIdentifiersInFunction(ts, prop, ast, cb, ctx);
            }
        }
    }
    // fix https://github.com/vuejs/language-tools/issues/1422
    else if (ts.isTypeNode(node)) {
        walkIdentifiersInTypeNode(ts, node, cb);
    }
    else {
        const _blockVars = blockVars;
        if (ts.isBlock(node)) {
            blockVars = [];
        }
        ts.forEachChild(node, node => walkIdentifiers(ts, node, ast, cb, ctx, blockVars));
        if (ts.isBlock(node)) {
            for (const varName of blockVars) {
                ctx.removeLocalVariable(varName);
            }
        }
        blockVars = _blockVars;
    }
    if (isRoot) {
        for (const varName of blockVars) {
            ctx.removeLocalVariable(varName);
        }
    }
}
function walkIdentifiersInFunction(ts, node, ast, cb, ctx) {
    const functionArgs = [];
    for (const param of node.parameters) {
        functionArgs.push(...(0, collectBindings_1.collectBindingNames)(ts, param.name, ast));
        if (param.type) {
            walkIdentifiersInTypeNode(ts, param.type, cb);
        }
    }
    for (const varName of functionArgs) {
        ctx.addLocalVariable(varName);
    }
    if (node.body) {
        walkIdentifiers(ts, node.body, ast, cb, ctx, [], true);
    }
    for (const varName of functionArgs) {
        ctx.removeLocalVariable(varName);
    }
}
function walkIdentifiersInTypeNode(ts, node, cb) {
    if (ts.isTypeQueryNode(node)) {
        let id = node.exprName;
        while (!ts.isIdentifier(id)) {
            id = id.left;
        }
        cb(id, false);
    }
    else {
        ts.forEachChild(node, node => walkIdentifiersInTypeNode(ts, node, cb));
    }
}
function shouldIdentifierSkipped(ctx, text, destructuredPropNames) {
    return ctx.hasLocalVariable(text)
        // https://github.com/vuejs/core/blob/245230e135152900189f13a4281302de45fdcfaa/packages/compiler-core/src/transforms/transformExpression.ts#L342-L352
        || (0, shared_1.isGloballyAllowed)(text)
        || isLiteralWhitelisted(text)
        || text === 'require'
        || text.startsWith('__VLS_')
        || destructuredPropNames?.has(text);
}
//# sourceMappingURL=interpolation.js.map