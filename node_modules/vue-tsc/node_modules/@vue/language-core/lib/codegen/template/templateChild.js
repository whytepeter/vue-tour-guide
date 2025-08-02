"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplateChild = generateTemplateChild;
exports.getVForNode = getVForNode;
exports.parseInterpolationNode = parseInterpolationNode;
const CompilerDOM = require("@vue/compiler-dom");
const shared_1 = require("../../utils/shared");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const element_1 = require("./element");
const elementChildren_1 = require("./elementChildren");
const interpolation_1 = require("./interpolation");
const slotOutlet_1 = require("./slotOutlet");
const vFor_1 = require("./vFor");
const vIf_1 = require("./vIf");
const vSlot_1 = require("./vSlot");
// @ts-ignore
const transformContext = {
    onError: () => { },
    helperString: str => str.toString(),
    replaceNode: () => { },
    cacheHandlers: false,
    prefixIdentifiers: false,
    scopes: {
        vFor: 0,
        vOnce: 0,
        vPre: 0,
        vSlot: 0,
    },
    expressionPlugins: ['typescript'],
};
function* generateTemplateChild(options, ctx, node, enterNode = true) {
    if (enterNode && !ctx.enter(node)) {
        return;
    }
    const cur = node;
    if (cur.codegenNode?.type === CompilerDOM.NodeTypes.JS_CACHE_EXPRESSION) {
        cur.codegenNode = cur.codegenNode.value;
    }
    if (node.type === CompilerDOM.NodeTypes.ROOT) {
        for (const item of collectSingleRootNodes(options, node.children)) {
            ctx.singleRootNodes.add(item);
        }
        yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node.children);
    }
    else if (node.type === CompilerDOM.NodeTypes.ELEMENT) {
        const vForNode = getVForNode(node);
        const vIfNode = getVIfNode(node);
        if (vForNode) {
            yield* (0, vFor_1.generateVFor)(options, ctx, vForNode);
        }
        else if (vIfNode) {
            yield* (0, vIf_1.generateVIf)(options, ctx, vIfNode);
        }
        else if (node.tagType === CompilerDOM.ElementTypes.SLOT) {
            yield* (0, slotOutlet_1.generateSlotOutlet)(options, ctx, node);
        }
        else {
            const slotDir = node.props.find(p => p.type === CompilerDOM.NodeTypes.DIRECTIVE && p.name === 'slot');
            if (node.tagType === CompilerDOM.ElementTypes.TEMPLATE
                && ctx.currentComponent
                && slotDir) {
                yield* (0, vSlot_1.generateVSlot)(options, ctx, node, slotDir);
            }
            else if (node.tagType === CompilerDOM.ElementTypes.ELEMENT
                || node.tagType === CompilerDOM.ElementTypes.TEMPLATE) {
                yield* (0, element_1.generateElement)(options, ctx, node);
            }
            else {
                const { currentComponent } = ctx;
                yield* (0, element_1.generateComponent)(options, ctx, node);
                ctx.currentComponent = currentComponent;
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.TEXT_CALL) {
        // {{ var }}
        yield* generateTemplateChild(options, ctx, node.content, false);
    }
    else if (node.type === CompilerDOM.NodeTypes.COMPOUND_EXPRESSION) {
        // {{ ... }} {{ ... }}
        yield* (0, elementChildren_1.generateElementChildren)(options, ctx, node.children.filter(child => typeof child === 'object'), false);
    }
    else if (node.type === CompilerDOM.NodeTypes.INTERPOLATION) {
        // {{ ... }}
        const [content, start] = parseInterpolationNode(node, options.template.content);
        yield* (0, interpolation_1.generateInterpolation)(options, ctx, 'template', codeFeatures_1.codeFeatures.all, content, start, `(`, `)${utils_1.endOfLine}`);
    }
    else if (node.type === CompilerDOM.NodeTypes.IF) {
        // v-if / v-else-if / v-else
        yield* (0, vIf_1.generateVIf)(options, ctx, node);
    }
    else if (node.type === CompilerDOM.NodeTypes.FOR) {
        // v-for
        yield* (0, vFor_1.generateVFor)(options, ctx, node);
    }
    else if (node.type === CompilerDOM.NodeTypes.TEXT) {
        // not needed progress
    }
    if (enterNode) {
        yield* ctx.exit();
    }
}
function* collectSingleRootNodes(options, children) {
    if (children.length !== 1) {
        // "null" is used to determine whether the component is not always has a single root
        if (children.length > 1) {
            yield null;
        }
        return;
    }
    const child = children[0];
    if (child.type === CompilerDOM.NodeTypes.IF) {
        for (const branch of child.branches) {
            yield* collectSingleRootNodes(options, branch.children);
        }
        return;
    }
    else if (child.type !== CompilerDOM.NodeTypes.ELEMENT) {
        return;
    }
    yield child;
    const tag = (0, shared_1.hyphenateTag)(child.tag);
    if (options.vueCompilerOptions.fallthroughComponentNames.includes(tag)) {
        yield* collectSingleRootNodes(options, child.children);
    }
}
// TODO: track https://github.com/vuejs/vue-next/issues/3498
function getVForNode(node) {
    const forDirective = node.props.find((prop) => prop.type === CompilerDOM.NodeTypes.DIRECTIVE
        && prop.name === 'for');
    if (forDirective) {
        let forNode;
        CompilerDOM.processFor(node, forDirective, transformContext, _forNode => {
            forNode = { ..._forNode };
            return undefined;
        });
        if (forNode) {
            forNode.children = [{
                    ...node,
                    props: node.props.filter(prop => prop !== forDirective),
                }];
            return forNode;
        }
    }
}
function getVIfNode(node) {
    const ifDirective = node.props.find((prop) => prop.type === CompilerDOM.NodeTypes.DIRECTIVE
        && prop.name === 'if');
    if (ifDirective) {
        let ifNode;
        CompilerDOM.processIf(node, ifDirective, transformContext, _ifNode => {
            ifNode = { ..._ifNode };
            return undefined;
        });
        if (ifNode) {
            for (const branch of ifNode.branches) {
                branch.children = [{
                        ...node,
                        props: node.props.filter(prop => prop !== ifDirective),
                    }];
            }
            return ifNode;
        }
    }
}
function parseInterpolationNode(node, template) {
    let content = node.content.loc.source;
    let start = node.content.loc.start.offset;
    let leftCharacter;
    let rightCharacter;
    // fix https://github.com/vuejs/language-tools/issues/1787
    while ((leftCharacter = template.slice(start - 1, start)).trim() === '' && leftCharacter.length) {
        start--;
        content = leftCharacter + content;
    }
    while ((rightCharacter = template.slice(start + content.length, start + content.length + 1)).trim() === ''
        && rightCharacter.length) {
        content = content + rightCharacter;
    }
    return [
        content,
        start,
    ];
}
//# sourceMappingURL=templateChild.js.map