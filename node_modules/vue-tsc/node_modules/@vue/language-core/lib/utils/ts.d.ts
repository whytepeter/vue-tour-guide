import type * as ts from 'typescript';
import type { RawVueCompilerOptions, VueCompilerOptions, VueLanguagePlugin } from '../types';
export type ParsedCommandLine = ts.ParsedCommandLine & {
    vueOptions: VueCompilerOptions;
};
export declare function createParsedCommandLineByJson(ts: typeof import('typescript'), parseConfigHost: ts.ParseConfigHost & {
    writeFile?(path: string, data: string): void;
}, rootDir: string, json: any, configFileName?: string): ParsedCommandLine;
export declare function createParsedCommandLine(ts: typeof import('typescript'), parseConfigHost: ts.ParseConfigHost, tsConfigPath: string): ParsedCommandLine;
export declare class CompilerOptionsResolver {
    fileExists?: ((path: string) => boolean) | undefined;
    configRoots: Set<string>;
    options: Omit<RawVueCompilerOptions, 'target' | 'globalTypesPath' | 'plugins'>;
    target: number | undefined;
    globalTypesPath: string | undefined;
    plugins: VueLanguagePlugin[];
    constructor(fileExists?: ((path: string) => boolean) | undefined);
    addConfig(options: RawVueCompilerOptions, rootDir: string): void;
    build(defaults?: VueCompilerOptions): VueCompilerOptions;
    private findNodeModulesRoot;
}
export declare function getDefaultCompilerOptions(target?: number, lib?: string, strictTemplates?: boolean): VueCompilerOptions;
export declare function writeGlobalTypes(vueOptions: VueCompilerOptions, writeFile: (fileName: string, data: string) => void): void;
