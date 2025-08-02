"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateElementChildren = generateElementChildren;
const templateChild_1 = require("./templateChild");
function* generateElementChildren(options, ctx, children, enterNode = true) {
    yield* ctx.generateAutoImportCompletion();
    for (const childNode of children) {
        yield* (0, templateChild_1.generateTemplateChild)(options, ctx, childNode, enterNode);
    }
    yield* ctx.generateAutoImportCompletion();
}
//# sourceMappingURL=elementChildren.js.map