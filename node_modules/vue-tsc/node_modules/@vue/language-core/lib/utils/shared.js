"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hyphenateTag = void 0;
exports.hyphenateAttr = hyphenateAttr;
exports.getSlotsPropertyName = getSlotsPropertyName;
exports.getStartEnd = getStartEnd;
exports.getNodeText = getNodeText;
const shared_1 = require("@vue/shared");
var shared_2 = require("@vue/shared");
Object.defineProperty(exports, "hyphenateTag", { enumerable: true, get: function () { return shared_2.hyphenate; } });
function hyphenateAttr(str) {
    let hyphencase = (0, shared_1.hyphenate)(str);
    // fix https://github.com/vuejs/core/issues/8811
    if (str.length && str[0] !== str[0].toLowerCase()) {
        hyphencase = '-' + hyphencase;
    }
    return hyphencase;
}
function getSlotsPropertyName(vueVersion) {
    return vueVersion < 3 ? '$scopedSlots' : '$slots';
}
function getStartEnd(ts, node, ast) {
    return {
        start: ts.getTokenPosOfNode(node, ast),
        end: node.end,
    };
}
function getNodeText(ts, node, ast) {
    const { start, end } = getStartEnd(ts, node, ast);
    return ast.text.slice(start, end);
}
//# sourceMappingURL=shared.js.map