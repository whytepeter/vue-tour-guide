<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Vue Tour Guide Example
      </h1>
      <p class="text-gray-600">
        This example demonstrates the basic usage of v-tour-guide.
      </p>
    </div>

    <!-- Demo Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left Column -->
      <div class="space-y-6">
        <div
          data-tour-guide="welcome-card"
          class="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 class="text-xl font-semibold mb-3">Welcome Card</h2>
          <p class="text-gray-600">This is the first element in our tour.</p>
        </div>

        <div
          data-tour-guide="feature-list"
          class="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 class="text-xl font-semibold mb-3">Feature List</h2>
          <ul class="space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Vue 3 Support
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              TypeScript Support
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              Nuxt Compatible
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <div
          data-tour-guide="action-button"
          class="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 class="text-xl font-semibold mb-3">Actions</h2>
          <div class="space-y-3">
            <button
              @click="startTour"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Start Tour
            </button>
            <button
              @click="resetTourGuide"
              class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Reset Tour
            </button>
            <button
              @click="toggleInteractions"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {{ allowInteractions ? "Block" : "Allow" }} Interactions
            </button>
            <button
              @click="startCustomTour"
              class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-md transition-all"
            >
              🎨 Custom Styled Tour
            </button>
          </div>
        </div>

        <div
          data-tour-guide="settings-panel"
          class="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 class="text-xl font-semibold mb-3">Settings</h2>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                type="checkbox"
                class="mr-2"
                data-tour-guide="notification-checkbox"
              />
              Enable notifications
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2" checked />
              Auto-save progress
            </label>
          </div>
          <div class="mt-4 pt-4 border-t">
            <button
              data-tour-guide="tooltip-anchor"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tour Guide Manager Component -->
    <TourGuideManager
      ref="tourManager"
      :steps="tourSteps"
      :auto-start="false"
      :allow-skip="true"
      :allow-interactions="allowInteractions"
      :labels="customLabels"
      @start="onTourStart"
      @complete="onTourComplete"
      @skip="onTourSkip"
      @step-change="onStepChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  TourGuideManager,
  useTourGuide,
  type TourGuideStep,
  type TourGuideLabels,
} from "v-tour-guide";

// Tour Guide Composable
const { resetTourGuide: resetTourState } = useTourGuide();

// Custom Labels for Tour Guide
const customLabels: TourGuideLabels = {
  skip: "Skip Tour",
  next: "Continue",
  previous: "Go Back",
  finish: "Complete Tour",
};

// Tour Manager Reference
const tourManager = ref<InstanceType<typeof TourGuideManager>>();

// Allow Interactions State
const allowInteractions = ref(false);

// Tour Steps Configuration
const tourSteps: TourGuideStep[] = [
  {
    id: "welcome",
    title: "Welcome to Vue Tour Guide!",
    content:
      "This is your first tour step. Let's explore the main features of this demo.",
    target: "welcome-card", // Using data-tour-guide attribute
    direction: "bottom",
    scrollToView: true,
    showAction: true,
    beforeShow: async () => {
      // Welcome step about to show
    },
    afterShow: () => {
      // Welcome step is now visible
    },
  },
  {
    id: "features",
    title: "Amazing Features",
    content:
      "Here you can see all the powerful features that Vue Tour Guide offers.",
    target: "feature-list", // Using data-tour-guide attribute
    direction: "right",
    showAction: true,
    offsetX: 10,
  },
  {
    id: "actions",
    title: "Take Action",
    content: "Use these buttons to control your tour experience.",
    target: "action-button", // Using data-tour-guide attribute
    direction: "left",
    showAction: true,
    radius: 12,
  },
  {
    id: "settings",
    title: "Customize Settings",
    content: "Configure your preferences here to personalize your experience.",
    target: "settings-panel", // Using data-tour-guide attribute
    direction: "top",
    showAction: true,
    prevLabel: "Back to Actions",
  },
  {
    id: "separate-targeting",
    title: "Advanced Tooltip Positioning",
    content:
      "This step highlights the notification checkbox but positions the tooltip relative to the save button below. This demonstrates separate target and tooltip positioning!",
    target: "notification-checkbox", // Element to highlight (data-tour-guide attribute)
    tooltipTarget: "tooltip-anchor", // Element for tooltip positioning (class selector)
    direction: "left",
    showAction: true,
    nextLabel: "Customize Style",
  },
  {
    id: "custom-styling",
    title: "🎨 Custom Styled Tooltip",
    content:
      "This tooltip demonstrates custom styling! Notice the gradient background, custom colors, and rounded corners. Each tooltip can have its own unique appearance.",
    target: "tooltip-anchor", // Using class selector
    direction: "top",
    showAction: true,
    finishLabel: "All Done!",
    // Custom styling for this step
    tooltip: {
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#ffffff",
      borderRadius: "1rem",
      padding: "1rem",
      maxWidth: "20rem",
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
      buttonBackgroundColor: "#4f46e5",
      buttonTextColor: "#ffffff",
      buttonHoverColor: "#6366f1",
      skipButtonColor: "#e5e7eb",
      skipButtonHoverColor: "#ffffff",
      progressActiveColor: "#10b981",
      progressInactiveColor: "rgba(255, 255, 255, 0.3)",
    },
  },
];

// Tour Event Handlers
const onTourStart = () => {
  // Tour has started
};

const onTourComplete = () => {
  // Tour completed successfully
  alert("🎉 Tour completed! You're all set.");
};

const onTourSkip = () => {
  // Tour was skipped
  alert("Tour skipped. You can restart it anytime!");
};

const onStepChange = (step: TourGuideStep, index: number) => {
  // Step changed
};

// Tour Control Methods
const startTour = () => {
  tourManager.value?.startTourGuide();
};

const resetTourGuide = () => {
  resetTourState();
  alert("Tour state has been reset!");
};

const toggleInteractions = () => {
  allowInteractions.value = !allowInteractions.value;
  alert(
    `Interactions ${
      allowInteractions.value ? "enabled" : "disabled"
    } for next tour!`
  );
};

const startCustomTour = () => {
  // Start tour from the custom styling step
  tourManager.value?.goToStep(tourSteps.length - 1);
};
</script>

<style scoped>
/* Add any component-specific styles here */
.tour-highlight {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}
</style>
