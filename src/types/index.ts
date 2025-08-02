/**
 * TourGuideStep Interface
 *
 * Defines the structure for each step in the tour guide flow.
 * Each step targets a specific element and provides guidance through tooltips.
 */
export interface TourGuideStep {
    /** Unique identifier for the step (used for tracking progress) */
    id: string;

    /** Display title shown in the tooltip header */
    title: string;

    /** Optional description content shown in the tooltip body */
    content?: string;

    /** CSS selector, class, id, or data attribute to target the element */
    target: string;

    /** CSS selector, class, id, or data attribute for tooltip positioning (optional) */
    tooltipTarget?: string;

    /** Position of tooltip relative to target element */
    direction?: "top" | "bottom" | "left" | "right";

    /** Horizontal offset for fine-tuning tooltip position (pixels) */
    offsetX?: number;

    /** Vertical offset for fine-tuning tooltip position (pixels) */
    offsetY?: number;

    /** Border radius for the highlight cut-out (pixels, default: 8) */
    radius?: number;


    /** Whether to show the action button */
    showAction?: boolean;

    /** Custom label for skip button */
    skipLabel?: string;

    /** Custom label for next button */
    nextLabel?: string;

    /** Custom label for previous button */
    prevLabel?: string;

    /** Custom label for finish button */
    finishLabel?: string;

    // Tooltip customization props (can be overridden per step)
    tooltip?: {
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

    /** Hook called before step becomes visible (async supported) */
    beforeShow?: () => void | Promise<void>;

    /** Hook called after step becomes visible */
    afterShow?: () => void;

    /** Hook called before step is hidden */
    beforeHide?: () => void | Promise<void>;
}

/**
 * TourGuide Labels Interface
 *
 * Customizable labels for tour guide buttons.
 */
export interface TourGuideLabels {
    /** Label for skip button */
    skip?: string;

    /** Label for next button */
    next?: string;

    /** Label for previous button */
    previous?: string;

    /** Label for finish button */
    finish?: string;
}

/**
 * TourGuideManager Props Interface
 *
 * Configuration options for customizing tour guide manager behavior.
 */
export interface TourGuideManagerProps {
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
}

/**
 * TourGuideTooltip Props Interface
 *
 * Configuration options for the tooltip component.
 */
export interface TourGuideTooltipProps {
    /** Whether the tooltip is visible */
    visible?: boolean;

    /** Title displayed in the tooltip header */
    title?: string;

    /** Content displayed in the tooltip body */
    content?: string;

    /** Direction of the tooltip relative to the target */
    direction?: "top" | "bottom" | "left" | "right";

    /** Whether to show the close/skip button */
    showClose?: boolean;

    /** Whether to show action buttons (previous/next) */
    showActions?: boolean;

    /** Whether to show the previous button */
    showPrevious?: boolean;

    /** Current step number (1-based) */
    currentStep?: number;

    /** Total number of steps */
    totalSteps?: number;

    /** Horizontal offset for positioning */
    offsetX?: number;

    /** Vertical offset for positioning */
    offsetY?: number;


    /** Custom label for skip button */
    skipLabel?: string;

    /** Custom label for next button */
    nextLabel?: string;

    /** Custom label for previous button */
    prevLabel?: string;

    /** Custom label for finish button */
    finishLabel?: string;

    // Tooltip customization props
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

/**
 * TourGuide State Interface
 *
 * Global state management for tour guide flow.
 */
export interface TourGuideState {
    /** Whether tour guide is currently active */
    isActive: boolean;

    /** Current step index (0-based) */
    currentStep: number;

    /** Array of completed step IDs */
    completedSteps: string[];

    /** Whether user has seen tour guide before */
    hasSeenTourGuide: boolean;
}

/**
 * TourGuide Events Interface
 *
 * Events emitted by tour guide components.
 */
export interface TourGuideEvents {
    /** Emitted when tour guide starts */
    start: [];

    /** Emitted when tour guide completes successfully */
    complete: [];

    /** Emitted when tour guide is skipped */
    skip: [];

    /** Emitted when step changes */
    'step-change': [step: TourGuideStep, index: number];
}

/**
 * TourGuide Composable Return Type
 *
 * Return type for the useTourGuide composable.
 */
export interface UseTourGuideReturn {
    /** Readonly tour guide state */
    tourGuideState: Readonly<TourGuideState>;

    /** Start tour guide flow */
    startTourGuide: (stepId?: string) => void;

    /** Complete a specific step */
    completeStep: (stepId: string) => void;

    /** Finish/skip the entire tour guide */
    finishTourGuide: () => void;

    /** Reset tour guide state (for testing) */
    resetTourGuide: () => void;

    /** Check if a step is completed */
    isStepCompleted: (stepId: string) => boolean;

    /** Load state from localStorage */
    loadTourGuideState: () => void;

    /** Save state to localStorage */
    saveTourGuideState: () => void;
}
