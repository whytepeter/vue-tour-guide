"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIntersectMerge = generateIntersectMerge;
exports.generateSpreadMerge = generateSpreadMerge;
const index_1 = require("./index");
function* generateIntersectMerge(codes) {
    yield codes[0];
    for (let i = 1; i < codes.length; i++) {
        yield ` & `;
        yield codes[i];
    }
}
function* generateSpreadMerge(codes) {
    if (codes.length === 1) {
        yield codes[0];
    }
    else {
        yield `{${index_1.newLine}`;
        for (const code of codes) {
            yield `...`;
            yield code;
            yield `,${index_1.newLine}`;
        }
        yield `}`;
    }
}
//# sourceMappingURL=merge.js.map