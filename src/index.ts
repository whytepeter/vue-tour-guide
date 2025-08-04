// Components
export { default as TourGuideManager } from './components/TourManager.vue'
export { default as TourGuideTooltip } from './components/TourGuideTooltip.vue'

// Composables
export { useTourGuide } from './composables/useTourGuide'

// Types
export type {
    TourGuideStep,
    TourGuideManagerProps,
    TourGuideTooltipProps,
    TourGuideState,
    TourGuideEvents,
    TourGuideLabels,
    UseTourGuideReturn,
    TourGuideManagerRef
} from './types'

// CSS
import './style.css'
