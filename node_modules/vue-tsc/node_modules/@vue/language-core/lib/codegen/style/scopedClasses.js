"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStyleScopedClasses = generateStyleScopedClasses;
const utils_1 = require("../utils");
const classProperty_1 = require("./classProperty");
const imports_1 = require("./imports");
function* generateStyleScopedClasses(options, ctx) {
    const option = options.vueCompilerOptions.resolveStyleClassNames;
    const styles = options.sfc.styles
        .map((style, i) => [style, i])
        .filter(([style]) => option === true || (option === 'scoped' && style.scoped));
    if (!styles.length) {
        return;
    }
    const firstClasses = new Set();
    yield `type __VLS_StyleScopedClasses = {}`;
    for (const [style, i] of styles) {
        if (options.vueCompilerOptions.resolveStyleImports) {
            yield* (0, imports_1.generateStyleImports)(style);
        }
        for (const className of style.classNames) {
            if (firstClasses.has(className.text)) {
                ctx.scopedClasses.push({
                    source: 'style_' + i,
                    className: className.text.slice(1),
                    offset: className.offset + 1,
                });
                continue;
            }
            firstClasses.add(className.text);
            yield* (0, classProperty_1.generateClassProperty)(i, className.text, className.offset, 'boolean');
        }
    }
    yield utils_1.endOfLine;
}
//# sourceMappingURL=scopedClasses.js.map