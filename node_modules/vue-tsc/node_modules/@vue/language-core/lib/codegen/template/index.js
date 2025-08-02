"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
exports.forEachElementNode = forEachElementNode;
const CompilerDOM = require("@vue/compiler-dom");
const shared_1 = require("../../utils/shared");
const codeFeatures_1 = require("../codeFeatures");
const utils_1 = require("../utils");
const wrapWith_1 = require("../utils/wrapWith");
const objectProperty_1 = require("./objectProperty");
const styleScopedClasses_1 = require("./styleScopedClasses");
const templateChild_1 = require("./templateChild");
__exportStar(require("./context"), exports);
function* generateTemplate(options, ctx) {
    if (options.slotsAssignName) {
        ctx.addLocalVariable(options.slotsAssignName);
    }
    if (options.propsAssignName) {
        ctx.addLocalVariable(options.propsAssignName);
    }
    const slotsPropertyName = (0, shared_1.getSlotsPropertyName)(options.vueCompilerOptions.target);
    if (options.vueCompilerOptions.inferTemplateDollarSlots) {
        ctx.dollarVars.add(slotsPropertyName);
    }
    if (options.vueCompilerOptions.inferTemplateDollarAttrs) {
        ctx.dollarVars.add('$attrs');
    }
    if (options.vueCompilerOptions.inferTemplateDollarRefs) {
        ctx.dollarVars.add('$refs');
    }
    if (options.vueCompilerOptions.inferTemplateDollarEl) {
        ctx.dollarVars.add('$el');
    }
    if (options.template.ast) {
        yield* (0, templateChild_1.generateTemplateChild)(options, ctx, options.template.ast);
    }
    yield* (0, styleScopedClasses_1.generateStyleScopedClassReferences)(ctx);
    yield* ctx.generateHoistVariables();
    const speicalTypes = [
        [slotsPropertyName, yield* generateSlots(options, ctx)],
        ['$attrs', yield* generateInheritedAttrs(options, ctx)],
        ['$refs', yield* generateTemplateRefs(options, ctx)],
        ['$el', yield* generateRootEl(ctx)],
    ];
    yield `var __VLS_dollars!: {${utils_1.newLine}`;
    for (const [name, type] of speicalTypes) {
        yield `${name}: ${type}${utils_1.endOfLine}`;
    }
    yield `} & { [K in keyof import('${options.vueCompilerOptions.lib}').ComponentPublicInstance]: unknown }${utils_1.endOfLine}`;
}
function* generateSlots(options, ctx) {
    if (!options.hasDefineSlots) {
        yield `type __VLS_Slots = {}`;
        for (const { expVar, propsVar } of ctx.dynamicSlots) {
            yield `${utils_1.newLine}& { [K in NonNullable<typeof ${expVar}>]?: (props: typeof ${propsVar}) => any }`;
        }
        for (const slot of ctx.slots) {
            yield `${utils_1.newLine}& { `;
            if (slot.name && slot.offset !== undefined) {
                yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, slot.name, slot.offset, codeFeatures_1.codeFeatures.navigation);
            }
            else {
                yield* (0, wrapWith_1.wrapWith)(slot.tagRange[0], slot.tagRange[1], codeFeatures_1.codeFeatures.navigation, `default`);
            }
            yield `?: (props: typeof ${slot.propsVar}) => any }`;
        }
        yield `${utils_1.endOfLine}`;
    }
    return `__VLS_Slots`;
}
function* generateInheritedAttrs(options, ctx) {
    yield `type __VLS_InheritedAttrs = {}`;
    for (const varName of ctx.inheritedAttrVars) {
        yield ` & typeof ${varName}`;
    }
    yield utils_1.endOfLine;
    if (ctx.bindingAttrLocs.length) {
        yield `[`;
        for (const loc of ctx.bindingAttrLocs) {
            yield `__VLS_dollars.`;
            yield [
                loc.source,
                'template',
                loc.start.offset,
                codeFeatures_1.codeFeatures.all,
            ];
            yield `,`;
        }
        yield `]${utils_1.endOfLine}`;
    }
    return `import('${options.vueCompilerOptions.lib}').ComponentPublicInstance['$attrs'] & Partial<__VLS_InheritedAttrs>`;
}
function* generateTemplateRefs(options, ctx) {
    yield `type __VLS_TemplateRefs = {}`;
    for (const [name, refs] of ctx.templateRefs) {
        yield `${utils_1.newLine}& `;
        if (refs.length >= 2) {
            yield `(`;
        }
        for (let i = 0; i < refs.length; i++) {
            const { typeExp, offset } = refs[i];
            if (i) {
                yield ` | `;
            }
            yield `{ `;
            yield* (0, objectProperty_1.generateObjectProperty)(options, ctx, name, offset, codeFeatures_1.codeFeatures.navigation);
            yield `: ${typeExp} }`;
        }
        if (refs.length >= 2) {
            yield `)`;
        }
    }
    yield utils_1.endOfLine;
    return `__VLS_TemplateRefs`;
}
function* generateRootEl(ctx) {
    yield `type __VLS_RootEl = `;
    if (ctx.singleRootElTypes.length && !ctx.singleRootNodes.has(null)) {
        for (const type of ctx.singleRootElTypes) {
            yield `${utils_1.newLine}| ${type}`;
        }
    }
    else {
        yield `any`;
    }
    yield utils_1.endOfLine;
    return `__VLS_RootEl`;
}
function* forEachElementNode(node) {
    if (node.type === CompilerDOM.NodeTypes.ROOT) {
        for (const child of node.children) {
            yield* forEachElementNode(child);
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.ELEMENT) {
        const patchForNode = (0, templateChild_1.getVForNode)(node);
        if (patchForNode) {
            yield* forEachElementNode(patchForNode);
        }
        else {
            yield node;
            for (const child of node.children) {
                yield* forEachElementNode(child);
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.IF) {
        // v-if / v-else-if / v-else
        for (let i = 0; i < node.branches.length; i++) {
            const branch = node.branches[i];
            for (const childNode of branch.children) {
                yield* forEachElementNode(childNode);
            }
        }
    }
    else if (node.type === CompilerDOM.NodeTypes.FOR) {
        // v-for
        for (const child of node.children) {
            yield* forEachElementNode(child);
        }
    }
}
//# sourceMappingURL=index.js.map