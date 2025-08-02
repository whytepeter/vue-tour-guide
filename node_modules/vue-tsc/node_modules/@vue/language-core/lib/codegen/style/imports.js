"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyleImports = generateStyleImports;
const utils_1 = require("../utils");
const wrapWith_1 = require("../utils/wrapWith");
function* generateStyleImports(style) {
    const features = {
        navigation: true,
        verification: true,
    };
    if (typeof style.src === 'object') {
        yield `${utils_1.newLine} & typeof import(`;
        yield* (0, wrapWith_1.wrapWith)(style.src.offset, style.src.offset + style.src.text.length, 'main', features, `'`, [style.src.text, 'main', style.src.offset, utils_1.combineLastMapping], `'`);
        yield `).default`;
    }
    for (const { text, offset } of style.imports) {
        yield `${utils_1.newLine} & typeof import('`;
        yield [
            text,
            style.name,
            offset,
            features,
        ];
        yield `').default`;
    }
}
//# sourceMappingURL=imports.js.map