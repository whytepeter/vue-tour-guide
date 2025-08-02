"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierRegex = exports.combineLastMapping = exports.endOfLine = exports.newLine = void 0;
exports.normalizeAttributeValue = normalizeAttributeValue;
exports.createTsAst = createTsAst;
exports.generateSfcBlockSection = generateSfcBlockSection;
exports.newLine = `\n`;
exports.endOfLine = `;${exports.newLine}`;
exports.combineLastMapping = { __combineOffset: 1 };
exports.identifierRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
function normalizeAttributeValue(node) {
    let offset = node.loc.start.offset;
    let content = node.loc.source;
    if ((content.startsWith(`'`) && content.endsWith(`'`))
        || (content.startsWith(`"`) && content.endsWith(`"`))) {
        offset++;
        content = content.slice(1, -1);
    }
    return [content, offset];
}
function createTsAst(ts, inlineTsAsts, text) {
    let ast = inlineTsAsts?.get(text);
    if (!ast) {
        ast = ts.createSourceFile('/a.ts', text, 99);
        inlineTsAsts?.set(text, ast);
    }
    ast.__volar_used = true;
    return ast;
}
function generateSfcBlockSection(block, start, end, features) {
    return [
        block.content.slice(start, end),
        block.name,
        start,
        features,
    ];
}
//# sourceMappingURL=index.js.map