"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVSlot = generateVSlot;
const CompilerDOM = require("@vue/compiler-dom");
const collectBindings_1 = require("../../utils/collectBindings");
const shared_1 = require("../../utils/shared");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const wrapWith_1 = require("../utils/wrapWith");
const elementChildren_1 = require("./elementChildren");
const objectProperty_1 = require("./objectProperty");
function* generateVSlot(options, ctx, node, slotDir) {
    if (!ctx.currentComponent) {
        return;
    }
    const slotBlockVars = [];
    const slotVar = ctx.getInternalVariable();
    if (slotDir) {
        yield `{${utils_1.newLine}`;
    }
    if (slotDir || node.children.length) {
        ctx.currentComponent.used = true;
        yield `const { `;
        if (slotDir) {
            if (slotDir.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION && slotDir.arg.content) {
                yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, slotDir.arg.loc.source, slotDir.arg.loc.start.offset, slotDir.arg.isStatic ? codeFeatures_1.codeFeatures.withoutHighlight : codeFeatures_1.codeFeatures.all, false, true);
            }
            else {
                yield* (0, wrapWith_1.wrapWith)(slotDir.loc.start.offset, slotDir.loc.start.offset + (slotDir.rawName?.length ?? 0), codeFeatures_1.codeFeatures.withoutHighlightAndCompletion, `default`);
            }
        }
        else {
            // #932: reference for implicit default slot
            yield* (0, wrapWith_1.wrapWith)(node.loc.start.offset, node.loc.end.offset, codeFeatures_1.codeFeatures.navigation, `default`);
        }
        yield `: ${slotVar} } = ${ctx.currentComponent.ctxVar}.slots!${utils_1.endOfLine}`;
    }
    if (slotDir?.exp?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
        const slotAst = (0, utils_1.createTsAst)(options.ts, ctx.inlineTsAsts, `(${slotDir.exp.content}) => {}`);
        slotBlockVars.push(...(0, collectBindings_1.collectBindingNames)(options.ts, slotAst, slotAst));
        yield* generateSlotParameters(options, slotAst, slotDir.exp, slotVar);
    }
    for (const varName of slotBlockVars) {
        ctx.addLocalVariable(varName);
    }
    yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node.children);
    for (const varName of slotBlockVars) {
        ctx.removeLocalVariable(varName);
    }
    if (slotDir) {
        let isStatic = true;
        if (slotDir.arg?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
            isStatic = slotDir.arg.isStatic;
        }
        if (isStatic && !slotDir.arg) {
            yield `${ctx.currentComponent.ctxVar}.slots!['`;
            yield [
                '',
                'template',
                slotDir.loc.start.offset + (slotDir.loc.source.startsWith('#')
                    ? '#'.length
                    : slotDir.loc.source.startsWith('v-slot:')
                        ? 'v-slot:'.length
                        : 0),
                codeFeatures_1.codeFeatures.completion,
            ];
            yield `'/* empty slot name completion */]${utils_1.endOfLine}`;
        }
        yield `}${utils_1.newLine}`;
    }
}
function* generateSlotParameters(options, ast, exp, slotVar) {
    const { ts } = options;
    const statement = ast.statements[0];
    if (!ts.isExpressionStatement(statement) || !ts.isArrowFunction(statement.expression)) {
        return;
    }
    const { expression } = statement;
    const startOffset = exp.loc.start.offset - 1;
    const modifies = [];
    const types = [];
    for (const { name, type } of expression.parameters) {
        if (type) {
            modifies.push([
                [``],
                name.end,
                type.end,
            ]);
            types.push(chunk((0, shared_1.getStartEnd)(ts, type, ast).start, type.end));
        }
        else {
            types.push(null);
        }
    }
    yield `const [`;
    let nextStart = 1;
    for (const [codes, start, end] of modifies) {
        yield chunk(nextStart, start);
        yield* codes;
        nextStart = end;
    }
    yield chunk(nextStart, expression.equalsGreaterThanToken.pos - 1);
    yield `] = __VLS_getSlotParameters(${slotVar}!`;
    if (types.some(t => t)) {
        yield `, `;
        yield* (0, wrapWith_1.wrapWith)(exp.loc.start.offset, exp.loc.end.offset, codeFeatures_1.codeFeatures.verification, `(`, ...types.flatMap(type => type ? [`_: `, type, `, `] : `_, `), `) => [] as any`);
    }
    yield `)${utils_1.endOfLine}`;
    function chunk(start, end) {
        return [
            ast.text.slice(start, end),
            'template',
            startOffset + start,
            codeFeatures_1.codeFeatures.all,
        ];
    }
}
//# sourceMappingURL=vSlot.js.map