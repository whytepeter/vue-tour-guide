import type * as ts from 'typescript';
import type { TextRange } from '../types';
export declare function parseBindingRanges(ts: typeof import('typescript'), ast: ts.SourceFile): {
    range: TextRange;
    moduleName?: string;
    isDefaultImport?: boolean;
    isNamespace?: boolean;
}[];
export declare function getClosestMultiLineCommentRange(ts: typeof import('typescript'), node: ts.Node, parents: ts.Node[], ast: ts.SourceFile): {
    start: number;
    end: number;
} | undefined;
