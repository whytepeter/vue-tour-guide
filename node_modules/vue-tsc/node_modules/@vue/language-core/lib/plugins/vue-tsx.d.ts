import type { Code, Sfc, VueLanguagePlugin } from '../types';
export declare const tsCodegen: WeakMap<Sfc, {
    getLang: () => string;
    getScriptRanges: () => {
        exportDefault: (import("../types").TextRange & {
            expression: import("../types").TextRange;
            args: import("../types").TextRange;
            argsNode: import("typescript").ObjectLiteralExpression;
            componentsOption: import("../types").TextRange | undefined;
            componentsOptionNode: import("typescript").ObjectLiteralExpression | undefined;
            directivesOption: import("../types").TextRange | undefined;
            nameOption: import("../types").TextRange | undefined;
            inheritAttrsOption: string | undefined;
        }) | undefined;
        classBlockEnd: number | undefined;
        bindings: {
            range: import("../types").TextRange;
            moduleName?: string;
            isDefaultImport?: boolean;
            isNamespace?: boolean;
        }[];
    } | undefined;
    getScriptSetupRanges: () => {
        leadingCommentEndOffset: number;
        importSectionEndOffset: number;
        bindings: {
            range: import("../types").TextRange;
            moduleName?: string;
            isDefaultImport?: boolean;
            isNamespace?: boolean;
        }[];
        defineModel: {
            localName?: import("../types").TextRange;
            name?: import("../types").TextRange;
            type?: import("../types").TextRange;
            modifierType?: import("../types").TextRange;
            runtimeType?: import("../types").TextRange;
            defaultValue?: import("../types").TextRange;
            required?: boolean;
            comments?: import("../types").TextRange;
            argNode?: import("typescript").Expression;
        }[];
        defineProps: ({
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        } & {
            name?: string;
            destructured?: Map<string, import("typescript").Expression | undefined>;
            destructuredRest?: string;
            statement: import("../types").TextRange;
            argNode?: import("typescript").Expression;
        }) | undefined;
        withDefaults: (Omit<{
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        }, "typeArg"> & {
            argNode?: import("typescript").Expression;
        }) | undefined;
        defineEmits: ({
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        } & {
            name?: string;
            hasUnionTypeArg?: boolean;
            statement: import("../types").TextRange;
        }) | undefined;
        defineSlots: ({
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        } & {
            name?: string;
            statement: import("../types").TextRange;
        }) | undefined;
        defineExpose: {
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        } | undefined;
        defineOptions: {
            name?: string;
            inheritAttrs?: string;
        } | undefined;
        useAttrs: {
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        }[];
        useCssModule: {
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        }[];
        useSlots: {
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        }[];
        useTemplateRef: ({
            callExp: import("../types").TextRange;
            exp: import("../types").TextRange;
            arg?: import("../types").TextRange;
            typeArg?: import("../types").TextRange;
        } & {
            name?: string;
        })[];
    } | undefined;
    getSetupSlotsAssignName: () => string | undefined;
    getGeneratedScript: () => {
        codes: Code[];
        generatedTemplate: boolean;
        generatedPropsType: boolean;
        bypassDefineComponent: boolean;
        bindingNames: Set<string>;
        localTypes: {
            generate: (names: string[]) => Generator<string, void, unknown>;
            getUsedNames(): Set<string>;
            readonly PrettifyLocal: string;
            readonly OmitKeepDiscriminatedUnion: string;
            readonly WithDefaults: string;
            readonly WithSlots: string;
            readonly PropsChildren: string;
            readonly TypePropsToOption: string;
            readonly OmitIndexSignature: string;
        };
        inlayHints: import("../codegen/inlayHints").InlayHintInfo[];
    };
    getGeneratedTemplate: () => {
        codes: Code[];
        currentInfo: {
            ignoreError?: boolean;
            expectError?: {
                token: number;
                node: import("@vue/compiler-dom").CommentNode;
            };
            generic?: {
                content: string;
                offset: number;
            };
        };
        resolveCodeFeatures: (features: import("../types").VueCodeInformation) => import("../types").VueCodeInformation;
        inlineTsAsts: Map<string, import("typescript").SourceFile> | undefined;
        inVFor: boolean;
        slots: {
            name: string;
            offset?: number;
            tagRange: [number, number];
            nodeLoc: any;
            propsVar: string;
        }[];
        dynamicSlots: {
            expVar: string;
            propsVar: string;
        }[];
        dollarVars: Set<string>;
        accessExternalVariables: Map<string, Set<number>>;
        blockConditions: string[];
        scopedClasses: {
            source: string;
            className: string;
            offset: number;
        }[];
        emptyClassOffsets: number[];
        inlayHints: import("../codegen/inlayHints").InlayHintInfo[];
        bindingAttrLocs: import("@vue/compiler-dom").SourceLocation[];
        inheritedAttrVars: Set<string>;
        templateRefs: Map<string, {
            typeExp: string;
            offset: number;
        }[]>;
        currentComponent: {
            ctxVar: string;
            used: boolean;
        } | undefined;
        singleRootElTypes: string[];
        singleRootNodes: Set<import("@vue/compiler-dom").ElementNode | null>;
        addTemplateRef(name: string, typeExp: string, offset: number): void;
        accessExternalVariable(name: string, offset?: number): void;
        hasLocalVariable(name: string): boolean;
        addLocalVariable(name: string): void;
        removeLocalVariable(name: string): void;
        getInternalVariable(): string;
        getHoistVariable(originalVar: string): string;
        generateHoistVariables(): Generator<string, void, unknown>;
        generateConditionGuards(): Generator<string, void, unknown>;
        generateAutoImportCompletion(): Generator<Code>;
        enter(node: import("@vue/compiler-dom").RootNode | import("@vue/compiler-dom").TemplateChildNode | import("@vue/compiler-dom").SimpleExpressionNode): boolean;
        exit(): Generator<Code>;
    } | undefined;
}>;
declare const plugin: VueLanguagePlugin;
export default plugin;
