import type * as CompilerDOM from '@vue/compiler-dom';
import type { SFCParseResult } from '@vue/compiler-sfc';
import type * as ts from 'typescript';
import type { Sfc, VueLanguagePluginReturn } from '../types';
export declare const templateInlineTsAsts: WeakMap<CompilerDOM.RootNode, Map<string, ts.SourceFile>>;
export declare function computedSfc(ts: typeof import('typescript'), plugins: VueLanguagePluginReturn[], fileName: string, getSnapshot: () => ts.IScriptSnapshot, getParseResult: () => SFCParseResult | undefined): Sfc;
