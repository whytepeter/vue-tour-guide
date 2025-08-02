import type { Code, VueCodeInformation } from '../../types';
import type { ScriptCodegenOptions } from '../script';
import type { TemplateCodegenContext } from './context';
import type { TemplateCodegenOptions } from './index';
export declare function generateInterpolation(options: TemplateCodegenOptions | ScriptCodegenOptions, ctx: TemplateCodegenContext, source: string, data: VueCodeInformation | ((offset: number) => VueCodeInformation) | undefined, code: string, start: number | undefined, prefix?: string, suffix?: string): Generator<Code>;
