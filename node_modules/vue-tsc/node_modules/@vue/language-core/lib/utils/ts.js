"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerOptionsResolver = void 0;
exports.createParsedCommandLineByJson = createParsedCommandLineByJson;
exports.createParsedCommandLine = createParsedCommandLine;
exports.getDefaultCompilerOptions = getDefaultCompilerOptions;
exports.writeGlobalTypes = writeGlobalTypes;
const shared_1 = require("@vue/shared");
const path_browserify_1 = require("path-browserify");
const globalTypes_1 = require("../codegen/globalTypes");
const languagePlugin_1 = require("../languagePlugin");
const shared_2 = require("./shared");
function createParsedCommandLineByJson(ts, parseConfigHost, rootDir, json, configFileName = rootDir + '/jsconfig.json') {
    const proxyHost = proxyParseConfigHostForExtendConfigPaths(parseConfigHost);
    ts.parseJsonConfigFileContent(json, proxyHost.host, rootDir, {}, configFileName);
    const resolver = new CompilerOptionsResolver(parseConfigHost.fileExists);
    for (const extendPath of proxyHost.extendConfigPaths.reverse()) {
        try {
            const configFile = ts.readJsonConfigFile(extendPath, proxyHost.host.readFile);
            const obj = ts.convertToObject(configFile, []);
            const rawOptions = obj?.vueCompilerOptions ?? {};
            resolver.addConfig(rawOptions, path_browserify_1.posix.dirname(configFile.fileName));
        }
        catch { }
    }
    // ensure the rootDir is added to the config roots
    resolver.addConfig({}, rootDir);
    const resolvedVueOptions = resolver.build();
    const parsed = ts.parseJsonConfigFileContent(json, proxyHost.host, rootDir, {}, configFileName, undefined, (0, languagePlugin_1.getAllExtensions)(resolvedVueOptions)
        .map(extension => ({
        extension: extension.slice(1),
        isMixedContent: true,
        scriptKind: ts.ScriptKind.Deferred,
    })));
    // fix https://github.com/vuejs/language-tools/issues/1786
    // https://github.com/microsoft/TypeScript/issues/30457
    // patching ts server broke with outDir + rootDir + composite/incremental
    parsed.options.outDir = undefined;
    return {
        ...parsed,
        vueOptions: resolvedVueOptions,
    };
}
function createParsedCommandLine(ts, parseConfigHost, tsConfigPath) {
    try {
        const rootDir = path_browserify_1.posix.dirname(tsConfigPath);
        const proxyHost = proxyParseConfigHostForExtendConfigPaths(parseConfigHost);
        const config = ts.readJsonConfigFile(tsConfigPath, proxyHost.host.readFile);
        ts.parseJsonSourceFileConfigFileContent(config, proxyHost.host, rootDir, {}, tsConfigPath);
        const resolver = new CompilerOptionsResolver(parseConfigHost.fileExists);
        for (const extendPath of proxyHost.extendConfigPaths.reverse()) {
            try {
                const configFile = ts.readJsonConfigFile(extendPath, proxyHost.host.readFile);
                const obj = ts.convertToObject(configFile, []);
                const rawOptions = obj?.vueCompilerOptions ?? {};
                resolver.addConfig(rawOptions, path_browserify_1.posix.dirname(configFile.fileName));
            }
            catch { }
        }
        const resolvedVueOptions = resolver.build();
        const parsed = ts.parseJsonSourceFileConfigFileContent(config, proxyHost.host, path_browserify_1.posix.dirname(tsConfigPath), {}, tsConfigPath, undefined, (0, languagePlugin_1.getAllExtensions)(resolvedVueOptions)
            .map(extension => ({
            extension: extension.slice(1),
            isMixedContent: true,
            scriptKind: ts.ScriptKind.Deferred,
        })));
        // fix https://github.com/vuejs/language-tools/issues/1786
        // https://github.com/microsoft/TypeScript/issues/30457
        // patching ts server broke with outDir + rootDir + composite/incremental
        parsed.options.outDir = undefined;
        return {
            ...parsed,
            vueOptions: resolvedVueOptions,
        };
    }
    catch {
        // console.warn('Failed to resolve tsconfig path:', tsConfigPath, err);
        return {
            fileNames: [],
            options: {},
            vueOptions: getDefaultCompilerOptions(),
            errors: [],
        };
    }
}
function proxyParseConfigHostForExtendConfigPaths(parseConfigHost) {
    const extendConfigPaths = [];
    const host = new Proxy(parseConfigHost, {
        get(target, key) {
            if (key === 'readFile') {
                return (fileName) => {
                    if (!fileName.endsWith('/package.json') && !extendConfigPaths.includes(fileName)) {
                        extendConfigPaths.push(fileName);
                    }
                    return target.readFile(fileName);
                };
            }
            return target[key];
        },
    });
    return {
        host,
        extendConfigPaths,
    };
}
class CompilerOptionsResolver {
    constructor(fileExists) {
        this.fileExists = fileExists;
        this.configRoots = new Set();
        this.options = {};
        this.plugins = [];
    }
    addConfig(options, rootDir) {
        this.configRoots.add(rootDir);
        for (const key in options) {
            switch (key) {
                case 'target':
                    if (options[key] === 'auto') {
                        this.target = findVueVersion(rootDir);
                    }
                    else {
                        this.target = options[key];
                    }
                    break;
                case 'globalTypesPath':
                    if (options[key] !== undefined) {
                        this.globalTypesPath = path_browserify_1.posix.join(rootDir, options[key]);
                    }
                    break;
                case 'plugins':
                    this.plugins = (options.plugins ?? [])
                        .flatMap((pluginPath) => {
                        try {
                            const resolvedPath = resolvePath(pluginPath, rootDir);
                            if (resolvedPath) {
                                const plugin = require(resolvedPath);
                                plugin.__moduleName = pluginPath;
                                return plugin;
                            }
                            else {
                                console.warn('[Vue] Load plugin failed:', pluginPath);
                            }
                        }
                        catch (error) {
                            console.warn('[Vue] Resolve plugin path failed:', pluginPath, error);
                        }
                        return [];
                    });
                    break;
                default:
                    // @ts-expect-error
                    this.options[key] = options[key];
                    break;
            }
        }
        if (options.target === undefined) {
            this.target ??= findVueVersion(rootDir);
        }
    }
    build(defaults) {
        defaults ??= getDefaultCompilerOptions(this.target, this.options.lib, this.options.strictTemplates);
        const resolvedOptions = {
            ...defaults,
            ...this.options,
            plugins: this.plugins,
            macros: {
                ...defaults.macros,
                ...this.options.macros,
            },
            composables: {
                ...defaults.composables,
                ...this.options.composables,
            },
            fallthroughComponentNames: [
                ...defaults.fallthroughComponentNames,
                ...this.options.fallthroughComponentNames ?? [],
            ].map(shared_2.hyphenateTag),
            // https://github.com/vuejs/vue-next/blob/master/packages/compiler-dom/src/transforms/vModel.ts#L49-L51
            // https://vuejs.org/guide/essentials/forms.html#form-input-bindings
            experimentalModelPropName: Object.fromEntries(Object.entries(this.options.experimentalModelPropName ?? defaults.experimentalModelPropName).map(([k, v]) => [(0, shared_1.camelize)(k), v])),
        };
        if (resolvedOptions.globalTypesPath === shared_1.NOOP) {
            if (this.fileExists && this.globalTypesPath === undefined) {
                const fileDirToGlobalTypesPath = new Map();
                resolvedOptions.globalTypesPath = fileName => {
                    const fileDir = path_browserify_1.posix.dirname(fileName);
                    if (fileDirToGlobalTypesPath.has(fileDir)) {
                        return fileDirToGlobalTypesPath.get(fileDir);
                    }
                    const root = this.findNodeModulesRoot(fileDir, resolvedOptions.lib);
                    const result = root
                        ? path_browserify_1.posix.join(root, 'node_modules', '.vue-global-types', (0, globalTypes_1.getGlobalTypesFileName)(resolvedOptions))
                        : undefined;
                    fileDirToGlobalTypesPath.set(fileDir, result);
                    return result;
                };
            }
            else {
                resolvedOptions.globalTypesPath = () => this.globalTypesPath;
            }
        }
        return resolvedOptions;
    }
    findNodeModulesRoot(dir, lib) {
        while (!this.fileExists(path_browserify_1.posix.join(dir, 'node_modules', lib, 'package.json'))) {
            const parentDir = path_browserify_1.posix.dirname(dir);
            if (dir === parentDir) {
                return;
            }
            dir = parentDir;
        }
        return dir;
    }
}
exports.CompilerOptionsResolver = CompilerOptionsResolver;
function findVueVersion(rootDir) {
    const resolvedPath = resolvePath('vue/package.json', rootDir);
    if (resolvedPath) {
        const vuePackageJson = require(resolvedPath);
        const versionNumbers = vuePackageJson.version.split('.');
        return Number(versionNumbers[0] + '.' + versionNumbers[1]);
    }
    else {
        // console.warn('Load vue/package.json failed from', folder);
    }
}
function resolvePath(scriptPath, root) {
    try {
        if (require?.resolve) {
            return require.resolve(scriptPath, { paths: [root] });
        }
        else {
            // console.warn('failed to resolve path:', scriptPath, 'require.resolve is not supported in web');
        }
    }
    catch {
        // console.warn(error);
    }
}
function getDefaultCompilerOptions(target = 99, lib = 'vue', strictTemplates = false) {
    return {
        target,
        lib,
        globalTypesPath: shared_1.NOOP,
        extensions: ['.vue'],
        vitePressExtensions: [],
        petiteVueExtensions: [],
        jsxSlots: false,
        strictVModel: strictTemplates,
        strictCssModules: false,
        checkUnknownProps: strictTemplates,
        checkUnknownEvents: strictTemplates,
        checkUnknownDirectives: strictTemplates,
        checkUnknownComponents: strictTemplates,
        inferComponentDollarEl: false,
        inferComponentDollarRefs: false,
        inferTemplateDollarAttrs: false,
        inferTemplateDollarEl: false,
        inferTemplateDollarRefs: false,
        inferTemplateDollarSlots: false,
        skipTemplateCodegen: false,
        fallthroughAttributes: false,
        resolveStyleImports: false,
        resolveStyleClassNames: 'scoped',
        fallthroughComponentNames: [
            'Transition',
            'KeepAlive',
            'Teleport',
            'Suspense',
        ],
        dataAttributes: [],
        htmlAttributes: ['aria-*'],
        optionsWrapper: target >= 2.7
            ? [`(await import('${lib}')).defineComponent(`, `)`]
            : [`(await import('${lib}')).default.extend(`, `)`],
        macros: {
            defineProps: ['defineProps'],
            defineSlots: ['defineSlots'],
            defineEmits: ['defineEmits'],
            defineExpose: ['defineExpose'],
            defineModel: ['defineModel'],
            defineOptions: ['defineOptions'],
            withDefaults: ['withDefaults'],
        },
        composables: {
            useAttrs: ['useAttrs'],
            useCssModule: ['useCssModule'],
            useSlots: ['useSlots'],
            useTemplateRef: ['useTemplateRef', 'templateRef'],
        },
        plugins: [],
        experimentalModelPropName: {
            '': {
                input: true,
            },
            value: {
                input: { type: 'text' },
                textarea: true,
                select: true,
            },
        },
    };
}
function writeGlobalTypes(vueOptions, writeFile) {
    const originalFn = vueOptions.globalTypesPath;
    if (!originalFn) {
        return;
    }
    const writed = new Set();
    vueOptions.globalTypesPath = (fileName) => {
        const result = originalFn(fileName);
        if (result && !writed.has(result)) {
            writed.add(result);
            writeFile(result, (0, globalTypes_1.generateGlobalTypes)(vueOptions));
        }
        return result;
    };
}
//# sourceMappingURL=ts.js.map