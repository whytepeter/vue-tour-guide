"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateElementEvents = generateElementEvents;
exports.generateEventArg = generateEventArg;
exports.generateEventExpression = generateEventExpression;
exports.generateModelEventExpression = generateModelEventExpression;
exports.isCompoundExpression = isCompoundExpression;
const CompilerDOM = require("@vue/compiler-dom");
const shared_1 = require("@vue/shared");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const camelized_1 = require("../utils/camelized");
const wrapWith_1 = require("../utils/wrapWith");
const interpolation_1 = require("./interpolation");
function* generateElementEvents(options, ctx, node, componentOriginalVar, componentFunctionalVar, componentVNodeVar, componentCtxVar) {
    let emitsVar;
    let propsVar;
    for (const prop of node.props) {
        if (prop.type === CompilerDOM.NodeTypes.DIRECTIVE
            && (prop.name === 'on'
                && (prop.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION && prop.arg.isStatic)
                || options.vueCompilerOptions.strictVModel
                    && prop.name === 'model'
                    && (!prop.arg || prop.arg.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION && prop.arg.isStatic))) {
            ctx.currentComponent.used = true;
            if (!emitsVar) {
                emitsVar = ctx.getInternalVariable();
                propsVar = ctx.getInternalVariable();
                yield `let ${emitsVar}!: __VLS_ResolveEmits<typeof ${componentOriginalVar}, typeof ${componentCtxVar}.emit>${utils_1.endOfLine}`;
                yield `let ${propsVar}!: __VLS_FunctionalComponentProps<typeof ${componentFunctionalVar}, typeof ${componentVNodeVar}>${utils_1.endOfLine}`;
            }
            let source = prop.arg?.loc.source ?? 'model-value';
            let start = prop.arg?.loc.start.offset;
            let propPrefix = 'on-';
            let emitPrefix = '';
            if (prop.name === 'model') {
                propPrefix = 'onUpdate:';
                emitPrefix = 'update:';
            }
            else if (source.startsWith('vue:')) {
                source = source.slice('vue:'.length);
                start = start + 'vue:'.length;
                propPrefix = 'onVnode-';
                emitPrefix = 'vnode-';
            }
            const propName = (0, shared_1.camelize)(propPrefix + source);
            const emitName = emitPrefix + source;
            const camelizedEmitName = (0, shared_1.camelize)(emitName);
            yield `const ${ctx.getInternalVariable()}: __VLS_NormalizeComponentEvent<typeof ${propsVar}, typeof ${emitsVar}, '${propName}', '${emitName}', '${camelizedEmitName}'> = (${utils_1.newLine}`;
            if (prop.name === 'on') {
                yield `{ `;
                yield* generateEventArg(options, source, start, emitPrefix.slice(0, -1), codeFeatures_1.codeFeatures.navigation);
                yield `: {} as any } as typeof ${emitsVar},${utils_1.newLine}`;
            }
            yield `{ `;
            if (prop.name === 'on') {
                yield* generateEventArg(options, source, start, propPrefix.slice(0, -1));
                yield `: `;
                yield* generateEventExpression(options, ctx, prop);
            }
            else {
                yield `'${propName}': `;
                yield* generateModelEventExpression(options, ctx, prop);
            }
            yield `})${utils_1.endOfLine}`;
        }
    }
}
function* generateEventArg(options, name, start, directive = 'on', features) {
    features ??= {
        ...codeFeatures_1.codeFeatures.semanticWithoutHighlight,
        ...codeFeatures_1.codeFeatures.navigationWithoutRename,
        ...options.vueCompilerOptions.checkUnknownEvents
            ? codeFeatures_1.codeFeatures.verification
            : codeFeatures_1.codeFeatures.doNotReportTs2353AndTs2561,
    };
    if (directive.length) {
        name = (0, shared_1.capitalize)(name);
    }
    if (utils_1.identifierRegex.test((0, shared_1.camelize)(name))) {
        yield ['', 'template', start, features];
        yield directive;
        yield* (0, camelized_1.generateCamelized)(name, 'template', start, utils_1.combineLastMapping);
    }
    else {
        yield* (0, wrapWith_1.wrapWith)(start, start + name.length, features, `'`, directive, ...(0, camelized_1.generateCamelized)(name, 'template', start, utils_1.combineLastMapping), `'`);
    }
}
function* generateEventExpression(options, ctx, prop) {
    if (prop.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        let isFirstMapping = true;
        const ast = (0, utils_1.createTsAst)(options.ts, ctx.inlineTsAsts, prop.exp.content);
        const isCompound = isCompoundExpression(options.ts, ast);
        const interpolation = (0, interpolation_1.generateInterpolation)(options, ctx, 'template', offset => {
            if (isCompound && isFirstMapping) {
                isFirstMapping = false;
                ctx.inlayHints.push({
                    blockName: 'template',
                    offset,
                    setting: 'vue.inlayHints.inlineHandlerLeading',
                    label: '$event =>',
                    paddingRight: true,
                    tooltip: [
                        '`$event` is a hidden parameter, you can use it in this callback.',
                        'To hide this hint, set `vue.inlayHints.inlineHandlerLeading` to `false` in IDE settings.',
                        '[More info](https://github.com/vuejs/language-tools/issues/2445#issuecomment-1444771420)',
                    ].join('\n\n'),
                });
            }
            return codeFeatures_1.codeFeatures.all;
        }, prop.exp.content, prop.exp.loc.start.offset, isCompound ? `` : `(`, isCompound ? `` : `)`);
        if (isCompound) {
            yield `(...[$event]) => {${utils_1.newLine}`;
            ctx.addLocalVariable('$event');
            yield* ctx.generateConditionGuards();
            yield* interpolation;
            yield utils_1.endOfLine;
            ctx.removeLocalVariable('$event');
            yield* ctx.generateAutoImportCompletion();
            yield `}`;
        }
        else {
            yield* interpolation;
        }
    }
    else {
        yield `() => {}`;
    }
}
function* generateModelEventExpression(options, ctx, prop) {
    if (prop.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        yield `(...[$event]) => {${utils_1.newLine}`;
        yield* ctx.generateConditionGuards();
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.verification, prop.exp.content, prop.exp.loc.start.offset);
        yield ` = $event${utils_1.endOfLine}`;
        yield `}`;
    }
    else {
        yield `() => {}`;
    }
}
function isCompoundExpression(ts, ast) {
    let result = true;
    if (ast.statements.length === 0) {
        result = false;
    }
    else if (ast.statements.length === 1) {
        ts.forEachChild(ast, child_1 => {
            if (ts.isExpressionStatement(child_1)) {
                ts.forEachChild(child_1, child_2 => {
                    if (ts.isArrowFunction(child_2)) {
                        result = false;
                    }
                    else if (isPropertyAccessOrId(ts, child_2)) {
                        result = false;
                    }
                });
            }
            else if (ts.isFunctionDeclaration(child_1)) {
                result = false;
            }
        });
    }
    return result;
}
function isPropertyAccessOrId(ts, node) {
    if (ts.isIdentifier(node)) {
        return true;
    }
    if (ts.isPropertyAccessExpression(node)) {
        return isPropertyAccessOrId(ts, node.expression);
    }
    return false;
}
//# sourceMappingURL=elementEvents.js.map