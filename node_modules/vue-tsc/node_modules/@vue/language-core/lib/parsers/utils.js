"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBindingRanges = parseBindingRanges;
exports.getClosestMultiLineCommentRange = getClosestMultiLineCommentRange;
const collectBindings_1 = require("../utils/collectBindings");
const shared_1 = require("../utils/shared");
function parseBindingRanges(ts, ast) {
    const bindings = [];
    ts.forEachChild(ast, node => {
        if (ts.isVariableStatement(node)) {
            for (const decl of node.declarationList.declarations) {
                const ranges = (0, collectBindings_1.collectBindingRanges)(ts, decl.name, ast);
                bindings.push(...ranges.map(range => ({ range })));
            }
        }
        else if (ts.isFunctionDeclaration(node)) {
            if (node.name && ts.isIdentifier(node.name)) {
                bindings.push({
                    range: _getStartEnd(node.name),
                });
            }
        }
        else if (ts.isClassDeclaration(node)) {
            if (node.name) {
                bindings.push({
                    range: _getStartEnd(node.name),
                });
            }
        }
        else if (ts.isEnumDeclaration(node)) {
            bindings.push({
                range: _getStartEnd(node.name),
            });
        }
        if (ts.isImportDeclaration(node)) {
            const moduleName = _getNodeText(node.moduleSpecifier).slice(1, -1);
            if (node.importClause && !node.importClause.isTypeOnly) {
                const { name, namedBindings } = node.importClause;
                if (name) {
                    bindings.push({
                        range: _getStartEnd(name),
                        moduleName,
                        isDefaultImport: true,
                    });
                }
                if (namedBindings) {
                    if (ts.isNamedImports(namedBindings)) {
                        for (const element of namedBindings.elements) {
                            if (element.isTypeOnly) {
                                continue;
                            }
                            bindings.push({
                                range: _getStartEnd(element.name),
                                moduleName,
                                isDefaultImport: element.propertyName?.text === 'default',
                            });
                        }
                    }
                    else {
                        bindings.push({
                            range: _getStartEnd(namedBindings.name),
                            moduleName,
                            isNamespace: true,
                        });
                    }
                }
            }
        }
    });
    return bindings;
    function _getStartEnd(node) {
        return (0, shared_1.getStartEnd)(ts, node, ast);
    }
    function _getNodeText(node) {
        return (0, shared_1.getNodeText)(ts, node, ast);
    }
}
function getClosestMultiLineCommentRange(ts, node, parents, ast) {
    for (let i = parents.length - 1; i >= 0; i--) {
        if (ts.isStatement(node)) {
            break;
        }
        node = parents[i];
    }
    const comment = ts.getLeadingCommentRanges(ast.text, node.pos)
        ?.reverse()
        .find(range => range.kind === 3);
    if (comment) {
        return {
            start: comment.pos,
            end: comment.end,
        };
    }
}
//# sourceMappingURL=utils.js.map