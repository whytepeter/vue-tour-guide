"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVIf = generateVIf;
const CompilerDOM = require("@vue/compiler-dom");
const muggle_string_1 = require("muggle-string");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const elementChildren_1 = require("./elementChildren");
const interpolation_1 = require("./interpolation");
function* generateVIf(options, ctx, node) {
    const originalBlockConditionsLength = ctx.blockConditions.length;
    for (let i = 0; i < node.branches.length; i++) {
        const branch = node.branches[i];
        if (i === 0) {
            yield `if `;
        }
        else if (branch.condition) {
            yield `else if `;
        }
        else {
            yield `else `;
        }
        let addedBlockCondition = false;
        if (branch.condition?.type === CompilerDOM.NodeTypes.SIMPLE_EXPRESSION) {
            const codes = [...(0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.all, branch.condition.content, branch.condition.loc.start.offset, `(`, `)`)];
            yield* codes;
            ctx.blockConditions.push((0, muggle_string_1.toString)(codes));
            addedBlockCondition = true;
            yield ` `;
        }
        yield `{${utils_1.newLine}`;
        yield* (0, elementChildren_1.generateElementChildren)(options, ctx, branch.children, isFragment(node));
        yield `}${utils_1.newLine}`;
        if (addedBlockCondition) {
            ctx.blockConditions[ctx.blockConditions.length - 1] = `!${ctx.blockConditions[ctx.blockConditions.length - 1]}`;
        }
    }
    ctx.blockConditions.length = originalBlockConditionsLength;
}
function isFragment(node) {
    return node.codegenNode
        && 'consequent' in node.codegenNode
        && 'tag' in node.codegenNode.consequent
        && node.codegenNode.consequent.tag === CompilerDOM.FRAGMENT;
}
//# sourceMappingURL=vIf.js.map