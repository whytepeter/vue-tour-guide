import type * as CompilerDOM from '@vue/compiler-dom';
import type { Code } from '../../types';
import type { TemplateCodegenContext } from './context';
import type { TemplateCodegenOptions } from './index';
export declare function generateElementChildren(options: TemplateCodegenOptions, ctx: TemplateCodegenContext, children: (CompilerDOM.TemplateChildNode | CompilerDOM.SimpleExpressionNode)[], enterNode?: boolean): Generator<Code>;
