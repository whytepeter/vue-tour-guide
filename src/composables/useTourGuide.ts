import { reactive, readonly, onMounted } from 'vue'

interface TourGuideState {
    isActive: boolean
    currentStep: number
    completedSteps: string[]
    hasSeenTourGuide: boolean
}

const tourGuideState = reactive<TourGuideState>({
    isActive: false,
    currentStep: 0,
    completedSteps: [],
    hasSeenTourGuide: false,
})

export const useTourGuide = () => {
    // Get tour guide state from localStorage if available
    const loadTourGuideState = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tour-guide-state')
            if (saved) {
                const parsed = JSON.parse(saved)
                Object.assign(tourGuideState, parsed)
            }
        }
    }

    // Save tour guide state to localStorage
    const saveTourGuideState = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tour-guide-state', JSON.stringify(tourGuideState))
        }
    }

    // Start tour guide for a specific flow
    const startTourGuide = (_stepId?: string) => {
        tourGuideState.isActive = true
        tourGuideState.currentStep = 0
        tourGuideState.completedSteps = [] // Reset completed steps when starting
        saveTourGuideState()
    }

    // Complete a step
    const completeStep = (stepId: string) => {
        if (!tourGuideState.completedSteps.includes(stepId)) {
            tourGuideState.completedSteps.push(stepId)
            saveTourGuideState()
        }
    }

    // Update current step
    const updateCurrentStep = (stepIndex: number) => {
        tourGuideState.currentStep = stepIndex
        saveTourGuideState()
    }

    // Skip/finish tour guide
    const finishTourGuide = () => {
        tourGuideState.isActive = false
        tourGuideState.hasSeenTourGuide = true
        saveTourGuideState()
    }

    // Reset tour guide (for testing)
    const resetTourGuide = () => {
        tourGuideState.isActive = false
        tourGuideState.currentStep = 0
        tourGuideState.completedSteps = []
        tourGuideState.hasSeenTourGuide = false
        saveTourGuideState()
    }

    // Check if a step is completed
    const isStepCompleted = (stepId: string) => {
        return tourGuideState.completedSteps.includes(stepId)
    }

    // Initialize tour guide on mount
    onMounted(() => {
        loadTourGuideState()
    })

    return {
        // State
        tourGuideState: readonly(tourGuideState),

        // Actions
        startTourGuide,
        completeStep,
        updateCurrentStep,
        finishTourGuide,
        resetTourGuide,
        isStepCompleted,

        // Helpers
        loadTourGuideState,
        saveTourGuideState,
    }
}
