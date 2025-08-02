import type * as ts from 'typescript';
import type { ScriptRanges } from '../../parsers/scriptRanges';
import type { ScriptSetupRanges } from '../../parsers/scriptSetupRanges';
import type { Code, Sfc, VueCompilerOptions } from '../../types';
import type { TemplateCodegenContext } from '../template/context';
import { type ScriptCodegenContext } from './context';
export * from './context';
export interface ScriptCodegenOptions {
    ts: typeof ts;
    compilerOptions: ts.CompilerOptions;
    vueCompilerOptions: VueCompilerOptions;
    sfc: Sfc;
    fileName: string;
    lang: string;
    scriptRanges: ScriptRanges | undefined;
    scriptSetupRanges: ScriptSetupRanges | undefined;
    templateCodegen: TemplateCodegenContext & {
        codes: Code[];
    } | undefined;
    destructuredPropNames: Set<string>;
    templateRefNames: Set<string>;
}
export declare function generateScript(options: ScriptCodegenOptions, ctx: ScriptCodegenContext): Generator<Code>;
export declare function generateScriptSectionPartiallyEnding(source: string, end: number, mark: string, delimiter?: string): Generator<Code>;
