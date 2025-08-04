<template>
  <div
    v-if="visible"
    :class="[
      'relative z-50 text-sm',
      'animate-in fade-in-0 zoom-in-95 duration-200',
      props.tooltipClass,
    ]"
    :style="tooltipStyle"
  >
    <!-- Smart Arrow with Dynamic Positioning -->
    <div :class="['arrow-base', arrowDirectionClass]" :style="arrowStyle"></div>

    <!-- Content -->
    <div class="relative space-y-2" :style="{ padding: '0' }">
      <!-- Header with Skip button -->
      <div
        :class="['flex items-start justify-between gap-3 ', props.headerClass]"
      >
        <slot
          name="header"
          :title="title"
          :currentStep="currentStep"
          :totalSteps="totalSteps"
        >
          <h3 v-if="title" class="font-medium leading-tight flex-1 min-w-0">
            {{ title }}
          </h3>
        </slot>
        <slot
          name="skip-button"
          :skipLabel="skipLabel"
          :onClose="() => $emit('close')"
        >
          <button
            type="button"
            v-if="showClose || currentStep === 1"
            @click="$emit('close')"
            class="underline text-sm transition-colors flex-shrink-0 custom-skip-btn"
            :style="skipButtonStyle"
          >
            {{ skipLabel }}
          </button>
        </slot>
      </div>

      <!-- Body -->
      <div
        v-if="content || $slots.default"
        :class="[
          'opacity-90 font-thin leading-4 break-words',
          props.contentClass,
        ]"
      >
        <!-- Named slot for complete content customization -->
        <template v-if="$slots.default">
          <slot
            :content="content"
            :currentStep="currentStep"
            :totalSteps="totalSteps"
          />
        </template>
        <template v-else>
          {{ content }}
        </template>
      </div>

      <!-- Actions -->
      <div
        v-if="showActions"
        :class="['flex items-center justify-between gap-2', props.actionsClass]"
      >
        <slot
          v-if="$slots.progress"
          name="progress"
          :currentStep="currentStep"
          :totalSteps="totalSteps"
        />

        <div v-else class="flex items-center flex-1">
          <div class="flex items-center gap-1 pr-2 py-1 rounded-full">
            <div
              v-for="step in totalSteps"
              :key="step"
              :class="['w-1.5 h-1.5 rounded-full transition-all duration-300']"
              :style="getProgressStyle(step)"
            ></div>
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <template v-if="$slots.actions">
            <slot
              name="actions"
              :showPrevious="showPrevious"
              :isLastStep="isLastStep"
              :prevLabel="prevLabel"
              :nextLabel="nextLabel"
              :finishLabel="finishLabel"
              :onPrevious="() => $emit('previous')"
              :onNext="() => $emit('next')"
            />
          </template>
          <template v-else>
            <button
              type="button"
              v-if="showPrevious"
              @click="$emit('previous')"
              class="text-xs px-2 py-1 rounded-md transition-colors flex-shrink-0 custom-action-btn whitespace-nowrap"
              :style="buttonStyle"
            >
              {{ prevLabel }}
            </button>
            <button
              type="button"
              @click="$emit('next')"
              class="text-xs px-2 py-1 rounded-md transition-colors flex-shrink-0 custom-action-btn whitespace-nowrap"
              :style="buttonStyle"
            >
              {{ isLastStep ? finishLabel : nextLabel }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

  // Arrow positioning
  arrowOffset?: number;

  // Customization props
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  maxWidth?: string;
  minWidth?: string;
  boxShadow?: string;

  // Button customization
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;

  // Skip button customization
  skipButtonColor?: string;
  skipButtonHoverColor?: string;

  // Progress indicator customization
  progressActiveColor?: string;
  progressInactiveColor?: string;

  // Custom CSS classes
  tooltipClass?: string;
  headerClass?: string;
  contentClass?: string;
  actionsClass?: string;
}

interface Emits {
  (e: "close" | "next" | "previous"): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  direction: "bottom",
  showClose: true,
  showActions: false,
  showPrevious: false,
  currentStep: 1,
  totalSteps: 1,
  offsetX: 0,
  offsetY: 0,
  arrowOffset: 0,
  skipLabel: "Skip",
  nextLabel: "Next",
  prevLabel: "Previous",
  finishLabel: "Finish",

  // Default styling
  backgroundColor: "#101828",
  textColor: "#ffffff",
  borderRadius: "0.75rem",
  padding: "0.75rem",
  maxWidth: "20rem",
  minWidth: "16rem",
  boxShadow:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",

  // Default button styling
  buttonBackgroundColor: "#374151",
  buttonTextColor: "#ffffff",
  buttonHoverColor: "#4B5563",

  // Default skip button styling
  skipButtonColor: "#ffffff",
  skipButtonHoverColor: "rgba(255, 255, 255, 0.8)",

  // Default progress styling
  progressActiveColor: "#60A5FA",
  progressInactiveColor: "rgba(255, 255, 255, 0.3)",
});

defineEmits<Emits>();

const isLastStep = computed(() => props.currentStep >= props.totalSteps);

// Instagram-style progress with fade effect
const getProgressStyle = computed(() => (step: number) => {
  const isActive = step <= props.currentStep;
  const distance = Math.abs(step - props.currentStep);

  if (isActive) {
    return {
      backgroundColor: props.progressActiveColor,
      opacity: 1,
    };
  } else {
    // Fade out based on distance from current step
    const opacity = Math.max(0.2, 1 - distance * 0.3);
    return {
      backgroundColor: props.progressInactiveColor,
      opacity: opacity,
    };
  }
});

// Dynamic styling computeds
const tooltipStyle = computed(() => {
  // Calculate content-based width more conservatively
  const estimatedWidth = Math.max(
    (props.title?.length || 0) * 7 + 50, // title width + padding
    (props.content?.length || 0) * 5 + 50, // content width + padding
    250 // minimum width
  );

  const finalWidth = Math.min(estimatedWidth, 350); // max 350px

  // Handle gradients vs solid colors
  const style: Record<string, string> = {};

  if (props.backgroundColor?.includes("gradient")) {
    style.background = props.backgroundColor;
  } else {
    style.backgroundColor = props.backgroundColor;
  }

  return {
    ...style,
    color: props.textColor,
    borderRadius: props.borderRadius,
    padding: props.padding,
    width: `${finalWidth}px`,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    boxShadow: props.boxShadow,
  };
});

/**
 * Smart Arrow Positioning
 *
 * Calculates arrow position based on direction and offset to ensure
 * it always points directly at the target element, even when tooltip
 * is repositioned to fit in viewport.
 */
const arrowDirectionClass = computed(() => {
  switch (props.direction) {
    case "top":
      return "arrow-top";
    case "bottom":
      return "arrow-bottom";
    case "left":
      return "arrow-left";
    case "right":
      return "arrow-right";
    default:
      return "arrow-bottom";
  }
});

const arrowStyle = computed(() => {
  const style: Record<string, string> = {};

  // Handle gradients vs solid colors for arrow
  if (props.backgroundColor?.includes("gradient")) {
    style.background = props.backgroundColor;
  } else {
    style.backgroundColor = props.backgroundColor;
  }

  // Apply offset to center arrow on target
  if (props.direction === "top" || props.direction === "bottom") {
    // For top/bottom positioning, offset horizontally
    if (props.arrowOffset !== 0) {
      const offsetPx = Math.max(-50, Math.min(50, props.arrowOffset)); // Clamp offset
      style.transform = `translateX(calc(-50% + ${offsetPx}px)) rotate(45deg)`;
    }
  } else if (props.direction === "left" || props.direction === "right") {
    // For left/right positioning, offset vertically
    if (props.arrowOffset !== 0) {
      const offsetPx = Math.max(-50, Math.min(50, props.arrowOffset)); // Clamp offset
      style.transform = `translateY(calc(-50% + ${offsetPx}px)) rotate(45deg)`;
    }
  }

  return style;
});

const buttonStyle = computed(() => ({
  backgroundColor: props.buttonBackgroundColor,
  color: props.buttonTextColor,
  "--hover-bg": props.buttonHoverColor,
}));

const skipButtonStyle = computed(() => ({
  color: props.skipButtonColor,
  "--hover-color": props.skipButtonHoverColor,
}));
</script>

<style scoped>
.custom-skip-btn:hover {
  color: v-bind("props.skipButtonHoverColor") !important;
}

.custom-action-btn:hover {
  background-color: v-bind("props.buttonHoverColor") !important;
}

/* Arrow positioning and rotation styles */
.arrow-base {
  position: absolute;
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
}

.arrow-top {
  top: 100%;
  left: 50%;
  margin-top: -6px;
  transform: translateX(-50%) rotate(45deg);
}

.arrow-bottom {
  bottom: 100%;
  left: 50%;
  margin-bottom: -6px;
  transform: translateX(-50%) rotate(45deg);
}

.arrow-left {
  left: 100%;
  top: 50%;
  margin-left: -6px;
  transform: translateY(-50%) rotate(45deg);
}

.arrow-right {
  right: 100%;
  top: 50%;
  margin-right: -6px;
  transform: translateY(-50%) rotate(45deg);
}

/* Animation classes */
.animate-in {
  animation: fadeInZoom 200ms ease-out;
}

@keyframes fadeInZoom {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
