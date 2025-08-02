export * from './system.js';
import { type ReactiveNode } from './system.js';
interface EffectScope extends ReactiveNode {
}
export declare let batchDepth: number;
export declare function getCurrentSub(): ReactiveNode | undefined;
export declare function setCurrentSub(sub: ReactiveNode | undefined): ReactiveNode | undefined;
export declare function getCurrentScope(): EffectScope | undefined;
export declare function setCurrentScope(scope: EffectScope | undefined): EffectScope | undefined;
export declare function startBatch(): void;
export declare function endBatch(): void;
/**
 * @deprecated Will be removed in the next major version. Use `const pausedSub = setCurrentSub(undefined)` instead for better performance.
 */
export declare function pauseTracking(): void;
/**
 * @deprecated Will be removed in the next major version. Use `setCurrentSub(pausedSub)` instead for better performance.
 */
export declare function resumeTracking(): void;
export declare function signal<T>(): {
    (): T | undefined;
    (value: T | undefined): void;
};
export declare function signal<T>(initialValue: T): {
    (): T;
    (value: T): void;
};
export declare function computed<T>(getter: (previousValue?: T) => T): () => T;
export declare function effect(fn: () => void): () => void;
export declare function effectScope(fn: () => void): () => void;
