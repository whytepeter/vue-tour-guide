import type * as ts from 'typescript';
import type { TextRange } from '../types';
export { hyphenate as hyphenateTag } from '@vue/shared';
export declare function hyphenateAttr(str: string): string;
export declare function getSlotsPropertyName(vueVersion: number): "$scopedSlots" | "$slots";
export declare function getStartEnd(ts: typeof import('typescript'), node: ts.Node, ast: ts.SourceFile): TextRange;
export declare function getNodeText(ts: typeof import('typescript'), node: ts.Node, ast: ts.SourceFile): string;
