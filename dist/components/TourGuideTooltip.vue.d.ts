interface Props {
    visible?: boolean;
    title?: string;
    content?: string;
    direction?: "top" | "bottom" | "left" | "right";
    showClose?: boolean;
    showActions?: boolean;
    showPrevious?: boolean;
    currentStep?: number;
    totalSteps?: number;
    offsetX?: number;
    offsetY?: number;
    skipLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    finishLabel?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    padding?: string;
    maxWidth?: string;
    boxShadow?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverColor?: string;
    skipButtonColor?: string;
    skipButtonHoverColor?: string;
    progressActiveColor?: string;
    progressInactiveColor?: string;
    tooltipClass?: string;
    headerClass?: string;
    contentClass?: string;
    actionsClass?: string;
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        header?(_: {
            title: string | undefined;
            currentStep: number;
            totalSteps: number;
        }): any;
        'skip-button'?(_: {
            skipLabel: string;
            onClose: () => void;
        }): any;
        content?(_: {
            content: string | undefined;
            currentStep: number;
            totalSteps: number;
        }): any;
        default?(_: {}): any;
        progress?(_: {
            currentStep: number;
            totalSteps: number;
        }): any;
        actions?(_: {
            showPrevious: boolean;
            isLastStep: boolean;
            prevLabel: string;
            nextLabel: string;
            finishLabel: string;
            onPrevious: () => void;
            onNext: () => void;
        }): any;
    };
    refs: {};
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    close: () => any;
    next: () => any;
    previous: () => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onClose?: (() => any) | undefined;
    onNext?: (() => any) | undefined;
    onPrevious?: (() => any) | undefined;
}>, {
    visible: boolean;
    direction: "top" | "bottom" | "left" | "right";
    showClose: boolean;
    showActions: boolean;
    showPrevious: boolean;
    currentStep: number;
    totalSteps: number;
    offsetX: number;
    offsetY: number;
    skipLabel: string;
    nextLabel: string;
    prevLabel: string;
    finishLabel: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    padding: string;
    maxWidth: string;
    boxShadow: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    buttonHoverColor: string;
    skipButtonColor: string;
    skipButtonHoverColor: string;
    progressActiveColor: string;
    progressInactiveColor: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=TourGuideTooltip.vue.d.ts.map