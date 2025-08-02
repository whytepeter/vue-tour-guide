<template>
  <div>
    <!-- 
          Visual Overlay with Rounded Cut-out Effect
          
          Creates a dimming overlay with a rounded cut-out to highlight the target element.
          Uses box-shadow technique: positioned exactly over the target with a massive
          box-shadow extending outward to cover the entire viewport.
          
          Z-index: 35 (below tooltip at 70, above most content)
          Pointer events: none (allows interaction with highlighted content)
        -->
    <div
      v-if="isActive && currentTarget"
      :style="roundedCutoutStyle"
      class="fixed z-[35] pointer-events-none"
    ></div>

    <!-- 
          Tour Guide Tooltip Container
          
          Teleported to body to ensure:
          - Proper z-index stacking outside container constraints
          - Positioning relative to viewport, not parent containers
          - No clipping by overflow:hidden containers
          
          The container is marked as interactive to allow tooltip interactions
          while the global CSS blocks everything else.
        -->
    <teleport to="body">
      <div
        v-if="isActive && currentTarget"
        ref="tooltipRef"
        :style="tooltipPositionStyle"
        class="fixed z-[70]"
        data-tour-guide-interactive="true"
      >
        <TourTooltip
          :visible="isActive"
          :title="currentStep?.title"
          :content="currentStep?.content"
          :direction="finalDirection"
          :current-step="activeStepIndex + 1"
          :total-steps="steps.length"
          :show-previous="activeStepIndex > 0"
          :show-close="allowSkip"
          :show-actions="currentStep?.showAction"
          :arrow-offset="arrowOffset"
          @next="nextStep"
          @previous="previousStep"
          @close="skipTourGuide"
          :skipLabel="currentStep?.skipLabel || computedLabels.skip"
          :nextLabel="currentStep?.nextLabel || computedLabels.next"
          :prevLabel="currentStep?.prevLabel || computedLabels.previous"
          :finishLabel="currentStep?.finishLabel || computedLabels.finish"
          :backgroundColor="currentStep?.backgroundColor"
          :textColor="currentStep?.textColor"
          :borderRadius="currentStep?.borderRadius"
          :padding="currentStep?.padding"
          :maxWidth="currentStep?.maxWidth"
          :boxShadow="currentStep?.boxShadow"
          :buttonBackgroundColor="currentStep?.buttonBackgroundColor"
          :buttonTextColor="currentStep?.buttonTextColor"
          :buttonHoverColor="currentStep?.buttonHoverColor"
          :skipButtonColor="currentStep?.skipButtonColor"
          :skipButtonHoverColor="currentStep?.skipButtonHoverColor"
          :progressActiveColor="currentStep?.progressActiveColor"
          :progressInactiveColor="currentStep?.progressInactiveColor"
          :tooltipClass="currentStep?.tooltipClass"
          :headerClass="currentStep?.headerClass"
          :contentClass="currentStep?.contentClass"
          :actionsClass="currentStep?.actionsClass"
        >
          <!-- Forward all slots to the tooltip component -->
          <template #default="slotProps" v-if="$slots.default">
            <slot
              name="default"
              v-bind="{
                ...slotProps,
                step: currentStep,
                stepIndex: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
              }"
            />
          </template>

          <template #header="slotProps" v-if="$slots.header">
            <slot
              name="header"
              v-bind="{
                ...slotProps,
                step: currentStep,
                stepIndex: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
              }"
            />
          </template>

          <template #content="slotProps" v-if="$slots.content">
            <slot
              name="content"
              v-bind="{
                ...slotProps,
                step: currentStep,
                stepIndex: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
              }"
            />
          </template>

          <template #skip-button="slotProps" v-if="$slots['skip-button']">
            <slot
              name="skip-button"
              v-bind="{
                ...slotProps,
                step: currentStep,
                stepIndex: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
                onSkip: skipTourGuide,
              }"
            />
          </template>

          <template #progress="slotProps" v-if="$slots.progress">
            <slot
              name="progress"
              v-bind="{
                ...slotProps,
                step: currentStep,
                stepIndex: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
              }"
            />
          </template>

          <template #actions="slotProps" v-if="$slots.actions">
            <slot
              name="actions"
              v-bind="{
                ...slotProps,
                step: currentStep,
                stepIndex: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
                onNext: nextStep,
                onPrevious: previousStep,
                onSkip: skipTourGuide,
              }"
            />
          </template>

          <!-- Legacy slot support - kept for backward compatibility -->
          <template #step-content="slotProps" v-if="$slots['step-content']">
            <slot
              name="step-content"
              v-bind="{
                ...slotProps,
                step: currentStep,
                index: activeStepIndex,
                currentStep: activeStepIndex + 1,
                totalSteps: steps.length,
              }"
            />
          </template>
        </TourTooltip>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  readonly,
} from "vue";
import TourTooltip from "./TourGuideTooltip.vue";
import type { TourGuideStep, TourGuideLabels } from "../types";
import { useTourGuide } from "../composables/useTourGuide";

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

/**
 * Component Emits Interface
 *
 * Events emitted during tour guide lifecycle for parent components to listen to.
 */
interface Emits {
  /** Emitted when tour guide starts, completes, or is skipped */
  (e: "start" | "complete" | "skip"): void;

  /** Emitted when step changes, provides current step and its index */
  (e: "step-change", step: TourGuideStep, index: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  autoStart: false,
  showOverlay: true,
  allowSkip: true,
  highlightPadding: 4,
  allowInteractions: false,
  viewportMargin: 16,
  scrollToView: true,
});

// Default labels for buttons
const defaultLabels: TourGuideLabels = {
  skip: "Skip",
  next: "Next",
  previous: "Previous",
  finish: "Finish",
};

// Computed labels that merge default with provided labels
const computedLabels = computed(() => ({
  ...defaultLabels,
  ...props.labels,
}));

const emit = defineEmits<Emits>();

// Initialize tour guide composable
const {
  completeStep,
  finishTourGuide,
  startTourGuide: startTourState,
  updateCurrentStep,
} = useTourGuide();

/**
 * Component State Management
 *
 * Reactive state for managing tour guide flow, element tracking, and performance optimization.
 */

// Core tour guide flow state
const isActive = ref(false); // Whether tour guide is currently running
const activeStepIndex = ref(0); // Current step index (0-based)

// Element targeting and positioning
const currentTarget = ref<HTMLElement | null>(null); // Currently highlighted DOM element
const currentTooltipTarget = ref<HTMLElement | null>(null); // Element for tooltip positioning
const tooltipRef = ref<HTMLElement>(); // Reference to tooltip container DOM element
const targetRect = ref<DOMRect | null>(null); // Cached bounding rect of target element
const tooltipTargetRect = ref<DOMRect | null>(null); // Cached bounding rect of tooltip target element
const tooltipSize = ref<{ width: number; height: number }>({
  width: 0,
  height: 0,
}); // Cached tooltip dimensions

// Position calculation results
const finalDirection = ref<"top" | "bottom" | "left" | "right">("bottom");
const arrowOffset = ref<number>(0);

// Performance optimization systems
const animationId = ref<number | null>(null); // RequestAnimationFrame ID for 60fps position monitoring
const mutationObserver = ref<MutationObserver | null>(null); // Observer for DOM changes affecting positioning
const resizeObserver = ref<ResizeObserver | null>(null); // Observer for element size changes

/**
 * Computed Properties
 *
 * Reactive calculations for positioning and styling based on current state.
 */

/** Get the current step configuration */
const currentStep = computed(() => props.steps[activeStepIndex.value]);

/**
 * Rounded Cut-out Overlay Styling
 *
 * Creates the visual effect of a dimmed background with a rounded cut-out
 * highlighting the target element. Uses the box-shadow technique:
 * 1. Position a div exactly over the target element
 * 2. Apply border-radius for rounded corners
 * 3. Use massive box-shadow to extend overlay beyond viewport
 *
 * This approach maintains the rounded corners while creating the dimming effect.
 */
const roundedCutoutStyle = computed(() => {
  if (!currentTarget.value || !currentStep.value || !targetRect.value)
    return {};

  const rect = targetRect.value;
  const padding = props.highlightPadding;
  const radius = currentStep.value.radius ?? 8; // Default radius if not specified

  // Calculate overlay dimensions with padding
  const top = rect.top - padding;
  const left = rect.left - padding;
  const width = rect.width + padding * 2;
  const height = rect.height + padding * 2;

  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${radius}px`,
    // Massive box-shadow creates the dimming overlay around the cut-out
    boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`,
  };
});

/**
 * Smart Positioning System
 *
 * Automatically determines the best position for the tooltip based on:
 * 1. User preference (if specified)
 * 2. Available space in each direction
 * 3. Viewport boundaries and margins
 * 4. Target element position and size
 */

/**
 * Calculate Available Space in Each Direction
 *
 * Determines how much space is available around the target element
 * for placing the tooltip, considering viewport margins.
 */
const calculateAvailableSpace = (rect: DOMRect) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const margin = props.viewportMargin;

  return {
    top: rect.top - margin,
    bottom: viewport.height - rect.bottom - margin,
    left: rect.left - margin,
    right: viewport.width - rect.right - margin,
  };
};

/**
 * Determine Optimal Direction
 *
 * Analyzes available space and tooltip dimensions to find the best position.
 * Prioritizes user preference if there's enough space, otherwise chooses
 * the direction with the most available space.
 */
const determineOptimalDirection = (
  targetRect: DOMRect,
  tooltipSize: { width: number; height: number },
  preferredDirection?: string
): "top" | "bottom" | "left" | "right" => {
  const space = calculateAvailableSpace(targetRect);

  // Check if preferred direction has enough space
  if (preferredDirection) {
    const hasSpace = {
      top: space.top >= tooltipSize.height,
      bottom: space.bottom >= tooltipSize.height,
      left: space.left >= tooltipSize.width,
      right: space.right >= tooltipSize.width,
    };

    if (hasSpace[preferredDirection as keyof typeof hasSpace]) {
      return preferredDirection as "top" | "bottom" | "left" | "right";
    }
  }

  // Find direction with most available space
  const directions = [
    {
      name: "bottom" as const,
      space: space.bottom,
      needed: tooltipSize.height,
    },
    { name: "top" as const, space: space.top, needed: tooltipSize.height },
    { name: "right" as const, space: space.right, needed: tooltipSize.width },
    { name: "left" as const, space: space.left, needed: tooltipSize.width },
  ];

  // First try to find a direction with enough space
  const fitsDirections = directions.filter((d) => d.space >= d.needed);
  if (fitsDirections.length > 0) {
    return fitsDirections.sort((a, b) => b.space - a.space)[0].name;
  }

  // If nothing fits perfectly, choose the one with most space
  return directions.sort((a, b) => b.space - a.space)[0].name;
};

/**
 * Calculate Arrow Offset
 *
 * Determines how much the arrow should be offset from center to point
 * directly at the target element, especially important when tooltip
 * is repositioned to fit in viewport.
 */
const calculateArrowOffset = (
  targetRect: DOMRect,
  tooltipRect: DOMRect,
  direction: "top" | "bottom" | "left" | "right"
): number => {
  if (direction === "top" || direction === "bottom") {
    const targetCenter = targetRect.left + targetRect.width / 2;
    const tooltipCenter = tooltipRect.left + tooltipRect.width / 2;
    return targetCenter - tooltipCenter;
  } else {
    const targetCenter = targetRect.top + targetRect.height / 2;
    const tooltipCenter = tooltipRect.top + tooltipRect.height / 2;
    return targetCenter - tooltipCenter;
  }
};

/**
 * Enhanced Tooltip Positioning Style
 *
 * Calculates the optimal position for the tooltip with:
 * 1. Automatic direction detection
 * 2. Viewport boundary collision detection
 * 3. Accurate arrow positioning
 * 4. Smooth repositioning on resize/scroll
 */
const tooltipPositionStyle = computed(() => {
  if (!currentStep.value) return {};

  // Use tooltip target if specified and available, otherwise fall back to main target
  const tooltipElement = currentTooltipTarget.value || currentTarget.value;
  const tooltipRect = tooltipTargetRect.value || targetRect.value;

  if (!tooltipElement || !tooltipRect) return {};

  const rect = tooltipRect;
  const preferredDirection = currentStep.value.direction;
  const offsetX = currentStep.value.offsetX || 0;
  const offsetY = currentStep.value.offsetY || 0;

  // Use current tooltip size or reasonable defaults
  const currentTooltipSize =
    tooltipSize.value.width > 0
      ? tooltipSize.value
      : { width: 320, height: 200 };

  // Determine optimal direction
  const direction = determineOptimalDirection(
    rect,
    currentTooltipSize,
    preferredDirection
  );
  finalDirection.value = direction;

  let top = 0;
  let left = 0;
  const gap = 12; // Gap between tooltip and target

  // Calculate base position based on optimal direction
  switch (direction) {
    case "top":
      top = rect.top - currentTooltipSize.height - gap + offsetY;
      left =
        rect.left + rect.width / 2 - currentTooltipSize.width / 2 + offsetX;
      break;
    case "bottom":
      top = rect.bottom + gap + offsetY;
      left =
        rect.left + rect.width / 2 - currentTooltipSize.width / 2 + offsetX;
      break;
    case "left":
      top =
        rect.top + rect.height / 2 - currentTooltipSize.height / 2 + offsetY;
      left = rect.left - currentTooltipSize.width - gap + offsetX;
      break;
    case "right":
      top =
        rect.top + rect.height / 2 - currentTooltipSize.height / 2 + offsetY;
      left = rect.right + gap + offsetX;
      break;
  }

  // Constrain to viewport boundaries
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const margin = props.viewportMargin;

  // Horizontal constraints
  if (left < margin) {
    left = margin;
  } else if (left + currentTooltipSize.width > viewport.width - margin) {
    left = viewport.width - currentTooltipSize.width - margin;
  }

  // Vertical constraints
  if (top < margin) {
    top = margin;
  } else if (top + currentTooltipSize.height > viewport.height - margin) {
    top = viewport.height - currentTooltipSize.height - margin;
  }

  // Calculate arrow offset based on final position
  const finalTooltipRect = {
    left,
    top,
    width: currentTooltipSize.width,
    height: currentTooltipSize.height,
  };

  arrowOffset.value = calculateArrowOffset(
    rect,
    finalTooltipRect as DOMRect,
    direction
  );

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Tooltip positioning:", {
      stepId: currentStep.value.id,
      preferredDirection,
      finalDirection: direction,
      targetRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      tooltipSize: currentTooltipSize,
      finalPosition: { top, left },
      arrowOffset: arrowOffset.value,
    });
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: "none", // We handle positioning directly now
  };
});

/**
 * Enhanced Position Tracking System
 *
 * Monitors target element position and tooltip size changes in real-time.
 * Uses multiple techniques for comprehensive position detection.
 */

/**
 * Update Target Element Positions
 *
 * Calculates the current bounding rectangles of both the main target element
 * and the tooltip target element (if specified). Includes optimization to
 * prevent unnecessary re-renders by comparing with previous positions.
 */
const updateTargetRect = () => {
  // Update main target position
  if (currentTarget.value) {
    const newRect = currentTarget.value.getBoundingClientRect();
    const oldRect = targetRect.value;

    // Performance optimization: only update if position actually changed
    // Compares all dimension properties to detect any layout changes
    if (
      !oldRect ||
      oldRect.top !== newRect.top ||
      oldRect.left !== newRect.left ||
      oldRect.width !== newRect.width ||
      oldRect.height !== newRect.height
    ) {
      targetRect.value = newRect;
    }
  }

  // Update tooltip target position if it exists
  if (currentTooltipTarget.value) {
    const newTooltipRect = currentTooltipTarget.value.getBoundingClientRect();
    const oldTooltipRect = tooltipTargetRect.value;

    // Performance optimization: only update if position actually changed
    if (
      !oldTooltipRect ||
      oldTooltipRect.top !== newTooltipRect.top ||
      oldTooltipRect.left !== newTooltipRect.left ||
      oldTooltipRect.width !== newTooltipRect.width ||
      oldTooltipRect.height !== newTooltipRect.height
    ) {
      tooltipTargetRect.value = newTooltipRect;
    }
  }

  // Update tooltip size
  if (tooltipRef.value) {
    const newSize = {
      width: tooltipRef.value.offsetWidth,
      height: tooltipRef.value.offsetHeight,
    };

    if (
      tooltipSize.value.width !== newSize.width ||
      tooltipSize.value.height !== newSize.height
    ) {
      tooltipSize.value = newSize;
    }
  }
};

/**
 * Continuous Position Monitoring
 *
 * Uses requestAnimationFrame for smooth 60fps position tracking.
 * This catches position changes from:
 * - CSS animations/transitions
 * - Dynamic content loading
 * - Layout shifts
 * - Any other position changes not caught by event listeners
 */
const startPositionMonitoring = () => {
  const checkPosition = () => {
    if (isActive.value && currentTarget.value) {
      updateTargetRect();
      animationId.value = requestAnimationFrame(checkPosition);
    }
  };
  animationId.value = requestAnimationFrame(checkPosition);
};

/**
 * Stop Position Monitoring
 *
 * Cancels the requestAnimationFrame loop to prevent memory leaks
 * and unnecessary CPU usage when tour guide is inactive.
 */
const stopPositionMonitoring = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
};

/**
 * Scroll Container Detection
 *
 * Intelligently finds all scrollable ancestor elements to ensure
 * position tracking works regardless of scroll container nesting.
 */
const getScrollParents = (element: HTMLElement): HTMLElement[] => {
  const scrollParents: HTMLElement[] = [];
  let parent = element.parentElement;

  // Traverse up the DOM tree to find all scrollable containers
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);

    // Check for any scrollable overflow settings
    if (
      style.overflow === "auto" ||
      style.overflow === "scroll" ||
      style.overflowY === "auto" ||
      style.overflowY === "scroll" ||
      style.overflowX === "auto" ||
      style.overflowX === "scroll"
    ) {
      scrollParents.push(parent);
    }
    parent = parent.parentElement;
  }

  return scrollParents;
};

/**
 * Comprehensive Event Listener Setup
 *
 * Establishes multi-layered position monitoring:
 * 1. Window/Document scroll events (main page scrolling)
 * 2. Scrollable parent container events (nested scrolling)
 * 3. Window resize events (viewport changes)
 * 4. RequestAnimationFrame monitoring (smooth tracking)
 * 5. MutationObserver (DOM changes affecting position)
 * 6. ResizeObserver (element size changes)
 */
const addScrollListeners = () => {
  if (!currentTarget.value) return;

  // Global scroll and resize events
  window.addEventListener("scroll", updateTargetRect, { passive: true });
  document.addEventListener("scroll", updateTargetRect, { passive: true });
  window.addEventListener("resize", updateTargetRect, { passive: true });

  // Nested scrollable container events
  const scrollParents = getScrollParents(currentTarget.value);
  scrollParents.forEach((parent) => {
    parent.addEventListener("scroll", updateTargetRect, { passive: true });
  });

  // Continuous 60fps position monitoring
  startPositionMonitoring();

  // DOM mutation monitoring for dynamic changes
  mutationObserver.value = new MutationObserver(() => {
    updateTargetRect();
  });

  // Monitor for changes that could affect element positioning
  mutationObserver.value.observe(document.body, {
    childList: true, // Child element additions/removals
    subtree: true, // Monitor entire document tree
    attributes: true, // Attribute changes
    attributeFilter: ["style", "class"], // Focus on styling changes
  });

  // Element size monitoring
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver.value = new ResizeObserver(() => {
      updateTargetRect();
    });

    // Observe target element size changes
    resizeObserver.value.observe(currentTarget.value);

    // Also observe tooltip size changes
    if (tooltipRef.value) {
      resizeObserver.value.observe(tooltipRef.value);
    }
  }
};

/**
 * Complete Event Listener Cleanup
 *
 * Removes all event listeners and stops monitoring to prevent
 * memory leaks and unnecessary CPU usage.
 */
const removeScrollListeners = () => {
  // Remove global event listeners (always safe)
  window.removeEventListener("scroll", updateTargetRect);
  document.removeEventListener("scroll", updateTargetRect);
  window.removeEventListener("resize", updateTargetRect);

  // Remove scrollable parent listeners if target still exists
  if (currentTarget.value) {
    const scrollParents = getScrollParents(currentTarget.value);
    scrollParents.forEach((parent) => {
      parent.removeEventListener("scroll", updateTargetRect);
    });
  }

  // Stop monitoring
  stopPositionMonitoring();

  // Disconnect observers
  if (mutationObserver.value) {
    mutationObserver.value.disconnect();
    mutationObserver.value = null;
  }

  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
    resizeObserver.value = null;
  }
};

/**
 * Core Tour Guide Methods
 *
 * Methods for managing target elements and tour guide flow.
 */

/**
 * Find Target Element
 *
 * Intelligently locates DOM elements using multiple strategies:
 * 1. Direct CSS selector matching
 * 2. Data attribute matching (data-tour-guide="selector")
 *
 * This flexible approach allows both specific selectors and
 * simplified data attribute targeting.
 */
const findTargetElement = (selector: string): HTMLElement | null => {
  // Strategy 1: Try direct CSS selector
  let element = document.querySelector(selector) as HTMLElement;

  // Strategy 2: Try data-tour-guide attribute matching
  if (!element) {
    element = document.querySelector(
      `[data-tour-guide="${selector}"]`
    ) as HTMLElement;
  }

  return element;
};

/**
 * Update Current Target Element
 *
 * Core method that manages the transition between tour guide steps:
 * 1. Cleans up previous target styling
 * 2. Finds and validates new target element
 * 3. Finds tooltip target element if specified
 * 4. Applies auto-scroll if configured
 * 5. Sets up highlighting and interactivity
 * 6. Initializes position tracking
 */
const updateCurrentTarget = async () => {
  if (!currentStep.value) return;

  // Clean up previous target element
  if (currentTarget.value) {
    currentTarget.value.style.removeProperty("z-index");
    currentTarget.value.style.removeProperty("position");
    currentTarget.value.style.removeProperty("border-radius");
    currentTarget.value.style.removeProperty("pointer-events");
    currentTarget.value.style.removeProperty("isolation");
    currentTarget.value.removeAttribute("data-tour-guide-interactive");
  }

  // Find new target element
  currentTarget.value = findTargetElement(currentStep.value.target);

  if (!currentTarget.value) {
    console.warn(
      `Tour Guide: Target element "${currentStep.value.target}" not found`
    );
    return;
  }

  // Find tooltip target element if specified
  if (currentStep.value.tooltipTarget) {
    currentTooltipTarget.value = findTargetElement(
      currentStep.value.tooltipTarget
    );

    if (!currentTooltipTarget.value) {
      console.warn(
        `Tour Guide: Tooltip target element "${currentStep.value.tooltipTarget}" not found, falling back to main target`
      );
      // Fall back to main target for tooltip positioning
      currentTooltipTarget.value = null;
    }
  } else {
    // No tooltip target specified, use main target
    currentTooltipTarget.value = null;
  }

  // Auto-scroll to target if enabled
  if (props.scrollToView) {
    currentTarget.value.scrollIntoView({
      behavior: "smooth", // Smooth animation
      block: "center", // Center vertically in viewport
      inline: "nearest", // Minimal horizontal scrolling
    });
    // Wait for scroll animation to complete before proceeding
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Set up element highlighting and interactivity
  // These styles ensure the target is visible above the overlay and interactive
  currentTarget.value.style.position = "relative"; // Required for z-index
  currentTarget.value.style.zIndex = "60"; // Above overlay (z-35) and below tooltip (z-70)
  currentTarget.value.style.borderRadius = "8px"; // Visual polish
  currentTarget.value.style.isolation = "isolate"; // Creates new stacking context
  currentTarget.value.setAttribute("data-tour-guide-interactive", "true"); // CSS selector for interaction

  // Initialize position tracking for this target
  updateTargetRect();

  // Wait for tooltip to render and get its size
  await nextTick();

  // Initialize tooltip size after element is rendered
  if (tooltipRef.value) {
    tooltipSize.value = {
      width: tooltipRef.value.offsetWidth || 320, // fallback width
      height: tooltipRef.value.offsetHeight || 200, // fallback height
    };
  } else {
    // Set default size if tooltip not yet rendered
    tooltipSize.value = { width: 320, height: 200 };
  }

  updateTargetRect();
};

/**
 * Start Tour Guide Flow
 *
 * Initializes the complete tour guide system:
 * 1. Validates steps exist
 * 2. Activates global interaction blocking
 * 3. Sets up target element highlighting
 * 4. Starts position monitoring
 * 5. Executes lifecycle hooks
 * 6. Emits events for parent components
 */
const startTourGuide = async () => {
  if (props.steps.length === 0) return;

  // Initialize tour guide state
  isActive.value = true;
  activeStepIndex.value = 0;
  startTourState(); // Update composable state

  // Enable global interaction blocking (only highlighted elements work)
  if (!props.allowInteractions) {
    document.body.classList.add("tour-guide-active");
  }

  // Set up first target element
  await nextTick();
  await updateCurrentTarget();

  // Initialize tooltip size with defaults first
  tooltipSize.value = { width: 320, height: 200 };

  // Begin comprehensive position monitoring
  addScrollListeners();

  // Wait a bit more for tooltip to fully render
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Update tooltip size after it's rendered
  if (tooltipRef.value) {
    tooltipSize.value = {
      width: tooltipRef.value.offsetWidth || 320,
      height: tooltipRef.value.offsetHeight || 200,
    };
  }

  // Execute step lifecycle hooks
  if (currentStep.value?.beforeShow) {
    await currentStep.value.beforeShow();
  }

  // Notify parent components
  emit("start");
  emit("step-change", currentStep.value, activeStepIndex.value);

  // Complete step setup
  if (currentStep.value?.afterShow) {
    currentStep.value.afterShow();
  }
};

const nextStep = async () => {
  // Complete current step in composable
  if (currentStep.value) {
    completeStep(currentStep.value.id);
  }

  // Execute beforeHide hook
  if (currentStep.value?.beforeHide) {
    await currentStep.value.beforeHide();
  }

  if (activeStepIndex.value < props.steps.length - 1) {
    activeStepIndex.value++;
    updateCurrentStep(activeStepIndex.value); // Update composable state

    await nextTick();
    await updateCurrentTarget();

    // Execute beforeShow hook for new step
    if (currentStep.value?.beforeShow) {
      await currentStep.value.beforeShow();
    }

    emit("step-change", currentStep.value, activeStepIndex.value);

    // Execute afterShow hook for new step
    if (currentStep.value?.afterShow) {
      currentStep.value.afterShow();
    }
  } else {
    completeTourGuide();
  }
};

const previousStep = async () => {
  if (activeStepIndex.value > 0) {
    // Execute beforeHide hook
    if (currentStep.value?.beforeHide) {
      await currentStep.value.beforeHide();
    }

    activeStepIndex.value--;
    updateCurrentStep(activeStepIndex.value); // Update composable state

    await nextTick();
    await updateCurrentTarget();

    // Execute beforeShow hook for previous step
    if (currentStep.value?.beforeShow) {
      await currentStep.value.beforeShow();
    }

    emit("step-change", currentStep.value, activeStepIndex.value);

    // Execute afterShow hook for previous step
    if (currentStep.value?.afterShow) {
      currentStep.value.afterShow();
    }
  }
};

const skipTourGuide = () => {
  // Reset target element styling and attributes
  if (currentTarget.value) {
    currentTarget.value.style.removeProperty("z-index");
    currentTarget.value.style.removeProperty("position");
    currentTarget.value.style.removeProperty("border-radius");
    currentTarget.value.style.removeProperty("pointer-events");
    currentTarget.value.style.removeProperty("isolation");
    currentTarget.value.removeAttribute("data-tour-guide-interactive");
  }

  // Remove all scroll listeners and stop monitoring
  removeScrollListeners();

  // Remove global tour guide class to re-enable all interactions
  if (!props.allowInteractions) {
    document.body.classList.remove("tour-guide-active");
  }

  isActive.value = false;
  currentTarget.value = null;
  currentTooltipTarget.value = null;
  targetRect.value = null;
  tooltipTargetRect.value = null;
  tooltipSize.value = { width: 0, height: 0 };
  finishTourGuide(); // Update composable state
  emit("skip");
};

const completeTourGuide = () => {
  // Complete the final step
  if (currentStep.value) {
    completeStep(currentStep.value.id);
  }

  // Reset target element styling and attributes
  if (currentTarget.value) {
    currentTarget.value.style.removeProperty("z-index");
    currentTarget.value.style.removeProperty("position");
    currentTarget.value.style.removeProperty("border-radius");
    currentTarget.value.style.removeProperty("pointer-events");
    currentTarget.value.style.removeProperty("isolation");
    currentTarget.value.removeAttribute("data-tour-guide-interactive");
  }

  // Remove all scroll listeners and stop monitoring
  removeScrollListeners();

  // Remove global tour guide class to re-enable all interactions
  if (!props.allowInteractions) {
    document.body.classList.remove("tour-guide-active");
  }

  isActive.value = false;
  currentTarget.value = null;
  currentTooltipTarget.value = null;
  targetRect.value = null;
  tooltipTargetRect.value = null;
  tooltipSize.value = { width: 0, height: 0 };
  finishTourGuide(); // Update composable state
  emit("complete");
};

const goToStep = async (stepIndex: number) => {
  if (stepIndex >= 0 && stepIndex < props.steps.length) {
    // Complete all steps up to the target step
    for (let i = 0; i <= stepIndex; i++) {
      const step = props.steps[i];
      if (step) {
        completeStep(step.id);
      }
    }

    activeStepIndex.value = stepIndex;
    updateCurrentStep(activeStepIndex.value); // Update composable state

    await nextTick();
    await updateCurrentTarget();

    if (currentStep.value?.beforeShow) {
      await currentStep.value.beforeShow();
    }

    emit("step-change", currentStep.value, activeStepIndex.value);

    if (currentStep.value?.afterShow) {
      currentStep.value.afterShow();
    }
  }
};

/**
 * Component Lifecycle Management
 *
 * Handles component initialization and cleanup to ensure proper
 * resource management and prevent memory leaks.
 */

onMounted(() => {
  // Auto-start tour guide if configured
  if (props.autoStart) {
    startTourGuide();
  }
});

onUnmounted(() => {
  // Critical cleanup: remove all event listeners and reset global state
  // This prevents memory leaks and interaction blocking if component unmounts
  if (isActive.value) {
    removeScrollListeners();
    if (!props.allowInteractions) {
      document.body.classList.remove("tour-guide-active");
    }
  }
});

/**
 * Reactive Watchers
 *
 * Automatically respond to state changes to keep the system synchronized.
 */

// Automatically update target when step changes
watch(
  () => activeStepIndex.value,
  async () => {
    if (isActive.value) {
      await updateCurrentTarget();
    }
  }
);

// Restart monitoring when target element changes
watch(currentTarget, (newTarget, oldTarget) => {
  // Clean up monitoring for previous target
  if (oldTarget) {
    removeScrollListeners();
  }

  // Set up monitoring for new target
  if (newTarget && isActive.value) {
    updateTargetRect();
    addScrollListeners();
  }
});

// Also monitor tooltip target changes for position updates
watch(currentTooltipTarget, () => {
  if (isActive.value) {
    updateTargetRect();
  }
});

// Watch for tooltip ref changes to update size tracking
watch(
  tooltipRef,
  (newRef) => {
    if (newRef && isActive.value) {
      // Use nextTick to ensure DOM is updated
      nextTick(() => {
        // Initial size measurement
        tooltipSize.value = {
          width: newRef.offsetWidth || 320,
          height: newRef.offsetHeight || 200,
        };

        // Add to resize observer if available
        if (resizeObserver.value) {
          resizeObserver.value.observe(newRef);
        }
      });
    }
  },
  { immediate: true }
);

// Expose methods for parent components
defineExpose({
  startTourGuide,
  skipTourGuide,
  completeTourGuide,
  nextStep,
  previousStep,
  goToStep,
  isActive: readonly(isActive),
  currentStepIndex: readonly(activeStepIndex),
});
</script>
