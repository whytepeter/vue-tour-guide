import { TourGuideStep, TourGuideLabels } from '../types';
/**
 * Component Props Interface
 *
 * Configuration options for customizing tour guide manager behavior.
 */
interface Props {
    /** Array of tour guide steps to execute in sequence */
    steps: TourGuideStep[];
    /** Whether to automatically start tour guide when component mounts */
    autoStart?: boolean;
    /** Whether to show the dimming overlay (should generally be true) */
    showOverlay?: boolean;
    /** Whether users can skip the entire tour guide flow */
    allowSkip?: boolean;
    /** Padding around highlighted elements in pixels (affects cut-out size) */
    highlightPadding?: number;
    /** Global labels for tour guide buttons */
    labels?: TourGuideLabels;
    /** Whether to allow interactions with other elements during tour (default: false) */
    allowInteractions?: boolean;
    /** Minimum distance from viewport edges for tooltip positioning */
    viewportMargin?: number;
    /** Auto-scroll target into view before highlighting (default: false) */
    scrollToView?: boolean;
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {
            step: TourGuideStep;
            stepIndex: number;
            currentStep: number;
            totalSteps: number;
            content: string | undefined;
        }): any;
        header?(_: {
            step: TourGuideStep;
            stepIndex: number;
            currentStep: number;
            totalSteps: number;
            title: string | undefined;
        }): any;
        content?(_: any): any;
        'skip-button'?(_: {
            step: TourGuideStep;
            stepIndex: number;
            currentStep: number;
            totalSteps: number;
            onSkip: () => void;
            skipLabel: string;
            onClose: () => void;
        }): any;
        progress?(_: {
            step: TourGuideStep;
            stepIndex: number;
            currentStep: number;
            totalSteps: number;
        }): any;
        actions?(_: {
            step: TourGuideStep;
            stepIndex: number;
            currentStep: number;
            totalSteps: number;
            onNext: () => Promise<void>;
            onPrevious: () => Promise<void>;
            onSkip: () => void;
            showPrevious: boolean;
            isLastStep: boolean;
            prevLabel: string;
            nextLabel: string;
            finishLabel: string;
        }): any;
        'step-content'?(_: any): any;
    };
    refs: {
        tooltipRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Props, {
    startTourGuide: () => Promise<void>;
    skipTourGuide: () => void;
    completeTourGuide: () => void;
    nextStep: () => Promise<void>;
    previousStep: () => Promise<void>;
    goToStep: (stepIndex: number) => Promise<void>;
    isActive: Readonly<import('vue').Ref<boolean, boolean>>;
    currentStepIndex: Readonly<import('vue').Ref<number, number>>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    start: () => any;
    complete: () => any;
    skip: () => any;
    "step-change": (step: TourGuideStep, index: number) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onStart?: (() => any) | undefined;
    onComplete?: (() => any) | undefined;
    onSkip?: (() => any) | undefined;
    "onStep-change"?: ((step: TourGuideStep, index: number) => any) | undefined;
}>, {
    autoStart: boolean;
    showOverlay: boolean;
    allowSkip: boolean;
    highlightPadding: number;
    allowInteractions: boolean;
    viewportMargin: number;
    scrollToView: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    tooltipRef: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=TourManager.vue.d.ts.map