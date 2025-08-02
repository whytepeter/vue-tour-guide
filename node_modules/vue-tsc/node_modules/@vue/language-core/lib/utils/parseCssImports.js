"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCssImports = parseCssImports;
const cssImportReg = /(?<=@import\s+url\()(["']?).*?\1(?=\))|(?<=@import\b\s*)(["']).*?\2/g;
function* parseCssImports(css) {
    const matches = css.matchAll(cssImportReg);
    for (const match of matches) {
        let text = match[0];
        let offset = match.index;
        if (text.startsWith("'") || text.startsWith('"')) {
            text = text.slice(1, -1);
            offset += 1;
        }
        if (text) {
            yield { text, offset };
        }
    }
}
//# sourceMappingURL=parseCssImports.js.map