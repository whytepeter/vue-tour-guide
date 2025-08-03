<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
    <!-- Floating GitHub link -->
    <a
      href="https://github.com/whytepeter/v-tour-guide"
      target="_blank"
      class="size-12 flex items-center justify-center fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <i class="fab fa-github text-xl"></i>
    </a>

    <!-- Header -->
    <header class="py-8 text-center">
      <div
        class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
      >
        <i class="fa-regular fa-compass text-4xl text-white"></i>
      </div>
      <h1
        class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Vue Tour Guide
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Create beautiful, interactive tour guides for your Vue applications
      </p>
    </header>

    <!-- Start Tour Button -->
    <div class="flex justify-center mb-12">
      <button
        @click="startTour"
        class="floating-btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-3"
      >
        <i class="fa-regular fa-compass animate-pulse-slow"></i>
        Start Interactive Tour
      </button>
    </div>

    <!-- Demo Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <!-- Left Column -->
      <div class="space-y-6">
        <div
          data-tour-guide="welcome-card"
          class="card-hover bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4"
          >
            <i
              class="fa-solid fa-hand text-blue-500 dark:text-blue-400 text-xl"
            ></i>
          </div>
          <h2 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Welcome Card
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            This is the first element in our tour. Click "Start Tour" to begin
            your journey!
          </p>
          <div class="mt-4 flex gap-2">
            <span
              class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              Step 1
            </span>
            <span
              class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
            >
              Interactive
            </span>
          </div>
        </div>

        <div
          data-tour-guide="feature-list"
          class="card-hover bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4"
          >
            <i
              class="fa-solid fa-star text-purple-500 dark:text-purple-400 text-xl"
            ></i>
          </div>
          <h2 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Amazing Features
          </h2>
          <ul class="space-y-3 text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              <span>Vue 3 & Composition API</span>
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              <span>Full TypeScript Support</span>
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              <span>Nuxt 3 Compatible</span>
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              <span>Customizable Tooltips</span>
            </li>
            <li class="flex items-center">
              <i class="fa-solid fa-check text-green-500 mr-3"></i>
              <span>Flexible Positioning</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <div
          data-tour-guide="action-button"
          class="card-hover bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4"
          >
            <i
              class="fa-solid fa-bolt text-green-500 dark:text-green-400 text-xl"
            ></i>
          </div>
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            🚀 Actions
          </h2>
          <div class="space-y-3">
            <button
              @click="startTour"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
            >
              🎯 Start Tour
            </button>
            <button
              @click="startCustomTour"
              class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
            >
              🎨 Custom Styled Tour
            </button>
            <button
              @click="resetTourGuide"
              class="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all"
            >
              🔄 Reset Tour
            </button>
            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <label class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  v-model="allowInteractions"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Allow interactions during tour</span
                >
              </label>
            </div>
          </div>
        </div>

        <div
          data-tour-guide="settings-panel"
          class="card-hover bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div
            class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4"
          >
            <i
              class="fa-solid fa-gear text-orange-500 dark:text-orange-400 text-xl"
            ></i>
          </div>
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            ⚙️ Settings
          </h2>
          <div class="space-y-4 text-gray-600 dark:text-gray-400">
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-blue-600"
                data-tour-guide="notification-checkbox"
              />
              <span>Enable notifications</span>
            </label>
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                class="w-4 h-4 rounded text-blue-600"
                checked
              />
              <span>Auto-save progress</span>
            </label>
          </div>
          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              data-tour-guide="tooltip-anchor"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              💾 Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tour Status -->
    <div
      data-tour-guide="status-panel"
      class="card-hover bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-12 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-6">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="fa-solid fa-chart-simple text-blue-500"></i>
          Tour Status
        </h2>
        <div class="flex items-center gap-2">
          <span
            class="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            Step 5
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Current Status
          </h3>
          <div
            class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-gray-600 dark:text-gray-400">Active:</span>
              <span
                :class="
                  tourGuideState.isActive ? 'text-green-600' : 'text-red-600'
                "
                class="font-medium"
              >
                {{ tourGuideState.isActive ? "Yes" : "No" }}
              </span>
            </div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-gray-600 dark:text-gray-400"
                >Current Step:</span
              >
              <span class="font-medium">{{
                tourGuideState.currentStep + 1
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400"
                >Has Seen Tour:</span
              >
              <span class="font-medium">
                {{ tourGuideState.hasSeenTourGuide ? "Yes" : "No" }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Progress
          </h3>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div
              class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-4"
            >
              <div
                class="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <div class="text-center text-sm text-gray-600 dark:text-gray-400">
              {{ progressPercentage }}% completed ({{
                tourGuideState.completedSteps.length
              }}/{{ tourSteps.length }} steps)
            </div>
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
import { ref, computed, watch } from "vue";
import {
  TourGuideManager,
  useTourGuide,
  type TourGuideStep,
  type TourGuideLabels,
} from "../src";

// Tour Guide Composable
const { tourGuideState, resetTourGuide: resetTourState } = useTourGuide();

// Tour Manager Reference
const tourManager = ref<InstanceType<typeof TourGuideManager>>();

// UI State

const allowInteractions = ref(false);

// Custom Labels for Tour Guide
const customLabels: TourGuideLabels = {
  skip: "Skip",
  next: "Continue",
  previous: "Go Back",
  finish: "Complete Tour",
};

// Tour Steps Configuration
const tourSteps: TourGuideStep[] = [
  {
    id: "welcome",
    title: "🎉 Welcome to Vue Tour Guide!",
    content:
      "This is your first tour step. Let's explore the main features of this amazing demo application.",
    target: "welcome-card",
    // direction: "bottom",
    showAction: true,
    beforeShow: async () => {
      console.log("About to show welcome step");
    },
    afterShow: () => {
      console.log("Welcome step is now visible");
    },
  },
  {
    id: "features",
    title: "✨ Amazing Features",
    content:
      "Here you can see all the powerful features that Vue Tour Guide offers. Each feature is carefully crafted for the best developer experience.",
    target: "feature-list",
    // direction: "right",
    showAction: true,
    offsetX: 10,
  },
  {
    id: "actions",
    title: "🚀 Take Action",
    content:
      "Use these buttons to control your tour experience. Try different options to see how flexible the system is!",
    target: "action-button",
    direction: "left",
    showAction: true,
    radius: 12,
  },
  {
    id: "settings",
    title: "⚙️ Customize Settings",
    content: "Configure your preferences here to personalize your experience.",
    target: "settings-panel",
    direction: "top",
    showAction: true,
    prevLabel: "Back to Actions",
  },
  {
    id: "separate-targeting",
    title: "🎯 Advanced Tooltip Positioning",
    content:
      "This step highlights the notification checkbox but positions the tooltip relative to the save button below. This demonstrates separate target and tooltip positioning!",
    target: "settings-panel",
    tooltipTarget: "notification-checkbox",
    direction: "left",
    showAction: true,
    nextLabel: "See Custom Style",
  },
  {
    id: "custom-styling",
    title: "🎨 Custom Styled Tooltip",
    content:
      "This tooltip demonstrates custom styling! Notice the gradient background, custom colors, and rounded corners. Each tooltip can have its own unique appearance.",
    target: "settings-panel", // Using data-tour-guide attribute
    tooltipTarget: "tooltip-anchor", // Using class selector
    direction: "top",
    showAction: true,
    finishLabel: "Awesome! 🎉",
    // Custom styling for this step
    tooltip: {
      textColor: "#ffffff",
      borderRadius: "1rem",
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
  {
    id: "status",
    title: "📊 Tour Status",
    content:
      "Monitor your progress through the tour with the status panel. See which steps you've completed and what's next.",
    target: "status-panel",
    direction: "top",
    showAction: true,
    prevLabel: "Previous",
  },
];

// Computed progress percentage
const progressPercentage = computed(() => {
  const completed = tourGuideState.completedSteps.length;
  const total = tourSteps.length;
  return Math.round((completed / total) * 100);
});

// Tour Event Handlers
const onTourStart = () => {
  console.log("🎯 Tour has started!");
};

const onTourComplete = () => {
  console.log("✅ Tour completed successfully!");
  alert(
    "🎉 Congratulations! You've completed the tour. You're now ready to use Vue Tour Guide!"
  );
};

const onTourSkip = () => {
  console.log("⏭️ Tour was skipped");
  alert("Tour skipped. You can restart it anytime!");
};

const onStepChange = (step: TourGuideStep, index: number) => {
  console.log(
    `📍 Step changed to: ${step.title} (${index + 1}/${tourSteps.length})`
  );
};

// Tour Control Methods
const startTour = () => {
  tourManager.value?.startTourGuide();
};

const startCustomTour = () => {
  // Start tour from the custom styling step
  tourManager.value?.goToStep(5); // Index of custom-styling step
};

const resetTourGuide = () => {
  resetTourState();
  alert("🔄 Tour state has been reset!");
};
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.floating-btn {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: pulse-slow 4s infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.tour-highlight {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
}

/* Add dark mode transitions */
.bg-gray-50,
.bg-white,
.bg-gray-800,
.bg-gray-900,
.text-gray-900,
.text-gray-600,
.text-gray-400,
.text-gray-200,
.border-gray-100,
.border-gray-700 {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}
</style>
