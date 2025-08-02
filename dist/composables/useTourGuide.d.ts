export declare const useTourGuide: () => {
    tourGuideState: {
        readonly isActive: boolean;
        readonly currentStep: number;
        readonly completedSteps: readonly string[];
        readonly hasSeenTourGuide: boolean;
    };
    startTourGuide: (_stepId?: string) => void;
    completeStep: (stepId: string) => void;
    updateCurrentStep: (stepIndex: number) => void;
    finishTourGuide: () => void;
    resetTourGuide: () => void;
    isStepCompleted: (stepId: string) => boolean;
    loadTourGuideState: () => void;
    saveTourGuideState: () => void;
};
//# sourceMappingURL=useTourGuide.d.ts.map