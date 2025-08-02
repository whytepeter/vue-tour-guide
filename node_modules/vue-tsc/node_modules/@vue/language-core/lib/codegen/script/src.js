"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSrc = generateSrc;
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const wrapWith_1 = require("../utils/wrapWith");
function* generateSrc(src) {
    if (src === true) {
        return;
    }
    let { text } = src;
    if (text.endsWith('.d.ts')) {
        text = text.slice(0, -'.d.ts'.length);
    }
    else if (text.endsWith('.ts')) {
        text = text.slice(0, -'.ts'.length);
    }
    else if (text.endsWith('.tsx')) {
        text = text.slice(0, -'.tsx'.length) + '.jsx';
    }
    if (!text.endsWith('.js') && !text.endsWith('.jsx')) {
        text = text + '.js';
    }
    yield `export * from `;
    yield* (0, wrapWith_1.wrapWith)(src.offset, src.offset + src.text.length, 'main', {
        ...codeFeatures_1.codeFeatures.all,
        ...text !== src.text ? codeFeatures_1.codeFeatures.navigationWithoutRename : {},
    }, `'`, [text.slice(0, src.text.length), 'main', src.offset, utils_1.combineLastMapping], text.slice(src.text.length), `'`);
    yield utils_1.endOfLine;
    yield `export { default } from '${text}'${utils_1.endOfLine}`;
}
//# sourceMappingURL=src.js.map