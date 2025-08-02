# Vue Tour Guide

A comprehensive Vue 3 tour guide library with TypeScript support for Vue and Nuxt applications.

## Features

- 🎯 **Precise Element Targeting** - Target elements using CSS selectors or data attributes
- 🎨 **Beautiful Tooltips** - Customizable tooltips with multiple directions and styling options
- 📱 **Responsive Design** - Works seamlessly across all device sizes
- 🔄 **Real-time Position Tracking** - Automatic position updates during scrolling and resizing
- ⚡ **Performance Optimized** - Efficient rendering with 60fps position monitoring
- 🎪 **Flexible Positioning** - Support for separate tooltip targeting and custom offsets
- 🔧 **TypeScript Support** - Full type safety with comprehensive interfaces
- 🎭 **Lifecycle Hooks** - beforeShow, afterShow, beforeHide hooks for custom logic
- 🌐 **Framework Agnostic** - Works with Vue 3 and Nuxt 3
- ♿ **Accessibility Ready** - Built with screen readers and keyboard navigation in mind

## Installation

```bash
npm install vue-tour-guide
```

## Quick Start

### Vue 3 Application

```vue
<template>
  <div>
    <!-- Your app content -->
    <div data-tour-guide="welcome">Welcome to our app!</div>
    <button data-tour-guide="action-button">Get Started</button>
    
    <!-- Tour Guide Manager -->
    <TourGuideManager
      :steps="tourSteps"
      :auto-start="true"
      @complete="onTourComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { TourGuideManager, type TourGuideStep } from 'vue-tour-guide'

const tourSteps: TourGuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome!',
    content: 'This is your first step in the tour.',
    target: 'welcome',
    direction: 'bottom',
    showAction: true
  },
  {
    id: 'action',
    title: 'Take Action',
    content: 'Click this button to get started.',
    target: 'action-button',
    direction: 'top',
    showAction: true
  }
]

const onTourComplete = () => {
  console.log('Tour completed!')
}
</script>
```

### Nuxt 3 Application

1. Create a plugin file `plugins/vue-tour-guide.client.ts`:

```typescript
import { TourGuideManager, TourGuideTooltip } from 'vue-tour-guide'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('TourGuideManager', TourGuideManager)
  nuxtApp.vueApp.component('TourGuideTooltip', TourGuideTooltip)
})
```

2. Use in your pages:

```vue
<template>
  <div>
    <div data-tour-guide="content">Your content here</div>
    <TourGuideManager :steps="steps" />
  </div>
</template>

<script setup lang="ts">
import { useTourGuide, type TourGuideStep } from 'vue-tour-guide'

const { startTourGuide } = useTourGuide()

const steps: TourGuideStep[] = [
  // Your tour steps
]
</script>
```

## CSS Setup

The package includes Tailwind CSS via CDN by default. If you're using your own Tailwind setup, you can import just the core styles:

```typescript
// Import without Tailwind CDN
import 'vue-tour-guide/dist/style.css'
```

## API Reference

### TourGuideManager Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `TourGuideStep[]` | `[]` | Array of tour steps |
| `autoStart` | `boolean` | `false` | Auto-start tour when component mounts |
| `showOverlay` | `boolean` | `true` | Show dimming overlay |
| `allowSkip` | `boolean` | `true` | Allow users to skip the tour |
| `highlightPadding` | `number` | `4` | Padding around highlighted elements (px) |
| `labels` | `TourGuideLabels` | `undefined` | Global button labels |
| `allowInteractions` | `boolean` | `false` | Allow interactions with other elements during tour |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `start` | `void` | Tour has started |
| `complete` | `void` | Tour completed successfully |
| `skip` | `void` | Tour was skipped |
| `step-change` | `(step: TourGuideStep, index: number)` | Current step changed |

#### Exposed Methods

```typescript
// Start the tour programmatically
tourManager.startTourGuide()

// Skip/stop the tour
tourManager.skipTourGuide()

// Complete the tour
tourManager.completeTourGuide()

// Navigate to specific step
tourManager.goToStep(stepIndex)

// Navigation
tourManager.nextStep()
tourManager.previousStep()

// State access
tourManager.isActive // readonly ref
tourManager.currentStepIndex // readonly ref
```

### TourGuideStep Interface

```typescript
interface TourGuideStep {
  id: string                              // Unique step identifier
  title: string                           // Tooltip title
  content?: string                        // Tooltip content
  target: string                          // CSS selector, class, id, or data attribute
  tooltipTarget?: string                  // Separate element for tooltip positioning
  direction?: 'top' | 'bottom' | 'left' | 'right' // Tooltip direction
  offsetX?: number                        // Horizontal offset (px)
  offsetY?: number                        // Vertical offset (px)
  radius?: number                         // Highlight border radius (px)
  scrollToView?: boolean                  // Auto-scroll to element
  showAction?: boolean                    // Show action buttons
  skipLabel?: string                      // Custom skip button label
  nextLabel?: string                      // Custom next button label  
  prevLabel?: string                      // Custom previous button label
  finishLabel?: string                    // Custom finish button label
  tooltip?: {                             // Tooltip customization options
    backgroundColor?: string
    textColor?: string
    borderRadius?: string
    padding?: string
    maxWidth?: string
    boxShadow?: string
    buttonBackgroundColor?: string
    buttonTextColor?: string
    buttonHoverColor?: string
    skipButtonColor?: string
    skipButtonHoverColor?: string
    progressActiveColor?: string
    progressInactiveColor?: string
    tooltipClass?: string
    headerClass?: string
    contentClass?: string
    actionsClass?: string
  }
  beforeShow?: () => void | Promise<void> // Pre-show hook
  afterShow?: () => void                  // Post-show hook
  beforeHide?: () => void | Promise<void> // Pre-hide hook
}
```

### TourGuideLabels Interface

```typescript
interface TourGuideLabels {
  skip?: string      // Label for skip button (default: "Skip")
  next?: string      // Label for next button (default: "Next")  
  previous?: string  // Label for previous button (default: "Previous")
  finish?: string    // Label for finish button (default: "Finish")
}
```

### useTourGuide Composable

```typescript
const {
  tourGuideState,      // Reactive state object
  startTourGuide,      // Start tour function
  completeStep,        // Complete specific step
  finishTourGuide,     // Finish/skip tour
  resetTourGuide,      // Reset tour state
  isStepCompleted,     // Check if step is completed
} = useTourGuide()
```

## Element Targeting

The `target` property accepts various CSS selectors and data attributes:

### Data Attributes (Recommended)

```html
<div data-tour-guide="my-element">Content</div>
```

```javascript
{
  target: 'my-element' // Targets [data-tour-guide="my-element"]
}
```

### CSS Selectors

```html
<div id="welcome" class="hero-section">Content</div>
```

```javascript
{
  target: '#welcome'        // ID selector
  target: '.hero-section'   // Class selector
  target: 'div'             // Element selector
  target: '[data-tour-guide="integrations"]' // Data attribute selector
}
```

### Examples

```html
<!-- Using class -->
<div class="tooltip-anchor">Content</div>

<!-- Using ID -->
<div id="tooltip-anchor">Content</div>

<!-- Using data attribute -->
<div data-tour-guide="integrations">Content</div>
```

```javascript
{
  target: 'tooltip-anchor'                    // Class selector
  target: '#tooltip-anchor'                   // ID selector  
  target: '[data-tour-guide="integrations"]'  // Data attribute selector
  target: 'button[type="submit"]'             // Complex CSS selector
  target: '.nav-item.active'                  // Compound class selector
}
```

### Complete Example

```javascript
const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome!',
    target: 'welcome-card',                    // data-tour-guide="welcome-card"
    content: 'This is the welcome section'
  },
  {
    id: 'features', 
    title: 'Features',
    target: '.feature-list',                   // class="feature-list"
    content: 'Check out our amazing features'
  },
  {
    id: 'submit',
    title: 'Submit',
    target: '#submit-button',                  // id="submit-button"
    content: 'Click here to submit'
  },
  {
    id: 'settings',
    title: 'Settings',
    target: '[data-tour-guide="settings"]',   // data-tour-guide="settings"
    content: 'Configure your settings here'
  }
];
```

### Custom Button Labels

You can customize button labels either globally or per step:

#### Global Labels

```vue
<template>
  <TourGuideManager 
    :steps="steps" 
    :labels="{ 
      skip: 'Skip Tour',
      next: 'Continue', 
      previous: 'Go Back',
      finish: 'Complete'
    }"
  />
</template>
```

#### Per-Step Labels

```javascript
{
  id: 'final-step',
  title: 'Almost Done!',
  target: 'submit-button',
  skipLabel: 'Exit Now',
  nextLabel: 'Continue',
  prevLabel: 'Go Back',  
  finishLabel: 'All Done!',
  showAction: true
}
```

**Note:** Step-level labels override global labels for that specific step.

### Tooltip Customization

The tour guide tooltips are fully customizable with colors, styling, and content slots.

#### Custom Colors & Styling

The `backgroundColor` property supports both solid colors and CSS gradients:

```javascript
{
  id: 'custom-step',
  title: 'Custom Styled Tooltip',
  content: 'This tooltip has custom styling!',
  target: 'my-element',
  showAction: true,
  
  // Tooltip customization
  tooltip: {
    // Custom colors (supports gradients too!)
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    maxWidth: '24rem',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    
    // Button styling
    buttonBackgroundColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#2563eb',
    
    // Skip button styling
    skipButtonColor: '#9ca3af',
    skipButtonHoverColor: '#ffffff',
    
    // Progress indicators
    progressActiveColor: '#10b981',
    progressInactiveColor: 'rgba(255, 255, 255, 0.2)',
    
    // Custom CSS classes
    tooltipClass: 'my-tooltip-class',
    headerClass: 'my-header-class',
    contentClass: 'my-content-class',
    actionsClass: 'my-actions-class'
  }
}
```

#### Content Slots

For maximum flexibility, you can customize any part of the tooltip using Vue slots:

```vue
<template>
  <TourGuideManager :steps="steps">
    <!-- Custom header -->
    <template #header="{ title, currentStep, totalSteps }">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold">{{ currentStep }}</span>
        </div>
        <h3 class="text-lg font-bold">{{ title }}</h3>
      </div>
    </template>

    <!-- Custom content -->
    <template #content="{ content, currentStep, totalSteps }">
      <div class="space-y-2">
        <p>{{ content }}</p>
        <div class="text-xs opacity-75">
          Step {{ currentStep }} of {{ totalSteps }}
        </div>
      </div>
    </template>

    <!-- Custom skip button -->
    <template #skip-button="{ skipLabel, onClose }">
      <button @click="onClose" class="custom-skip-btn">
        ✕ {{ skipLabel }}
      </button>
    </template>

    <!-- Custom progress indicators -->
    <template #progress="{ currentStep, totalSteps }">
      <div class="flex space-x-1">
        <div 
          v-for="step in totalSteps" 
          :key="step"
          class="w-3 h-1 rounded-full transition-colors"
          :class="step <= currentStep ? 'bg-green-400' : 'bg-gray-300'"
        />
      </div>
    </template>

    <!-- Custom action buttons -->
    <template #actions="{ showPrevious, isLastStep, prevLabel, nextLabel, finishLabel, onPrevious, onNext }">
      <div class="flex gap-2">
        <button v-if="showPrevious" @click="onPrevious" class="custom-prev-btn">
          ← {{ prevLabel }}
        </button>
        <button @click="onNext" class="custom-next-btn">
          {{ isLastStep ? finishLabel : nextLabel }} →
        </button>
      </div>
    </template>
  </TourGuideManager>
</template>
```

#### Available Slots

| Slot Name | Props | Description |
|-----------|-------|-------------|
| `header` | `{ title, currentStep, totalSteps }` | Custom header content |
| `content` | `{ content, currentStep, totalSteps }` | Custom main content |
| `skip-button` | `{ skipLabel, onClose }` | Custom skip button |
| `progress` | `{ currentStep, totalSteps }` | Custom progress indicators |
| `actions` | `{ showPrevious, isLastStep, prevLabel, nextLabel, finishLabel, onPrevious, onNext }` | Custom action buttons |

#### Gradient Backgrounds

```javascript
{
  id: 'gradient-step',
  title: 'Beautiful Gradients',
  target: 'my-element',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '1rem',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
}
```

### Allow Interactions During Tour

By default, the tour guide blocks all interactions except with highlighted elements. You can disable this behavior:

```vue
<template>
  <TourGuideManager 
    :steps="steps" 
    :allow-interactions="true"
  />
</template>
```

**Use Cases:**
- **Interactive tutorials** where users need to interact with other UI elements
- **Non-blocking tours** that guide without restricting user actions
- **Educational overlays** that provide information without interrupting workflow

⚠️ **Note:** When `allowInteractions` is `true`, users can interact with any part of your application during the tour, which may cause the tour to become out of sync if users navigate away or modify the UI state.

## Advanced Features

### Separate Tooltip Positioning

You can highlight one element while positioning the tooltip relative to a different element:

```javascript
{
  id: 'complex-step',
  title: 'Advanced Feature',
  content: 'This highlights one element but positions tooltip elsewhere.',
  target: '.main-button',        // Element to highlight (gets the overlay cutout)
  tooltipTarget: '.tooltip-anchor', // Different element for tooltip positioning
  direction: 'right',
  showAction: true
}
```

**HTML Example:**
```html
<!-- This input will be highlighted -->
<input type="checkbox" data-tour-guide="main-button" />

<!-- But tooltip will be positioned relative to this button -->
<button data-tour-guide="tooltip-anchor">Save</button>
```

**Use Cases:**
- **Small UI elements** - Highlight a small checkbox but position tooltip near a larger element
- **Complex layouts** - Avoid tooltip positioning conflicts in cramped layouts  
- **Grouped elements** - Highlight individual items but position tooltip for the whole group
- **Better UX** - Position tooltips where they won't cover important UI elements

### Lifecycle Hooks

```javascript
{
  id: 'async-step',
  title: 'Loading Data',
  target: 'data-section',
  async beforeShow() {
    // Load data before showing step
    await fetchData()
  },
  afterShow() {
    // Track analytics
    analytics.track('tour_step_viewed', { step: 'data-section' })
  },
  async beforeHide() {
    // Save progress
    await saveProgress()
  }
}
```

### Auto-scroll Configuration

```javascript
{
  id: 'scroll-step',
  title: 'Scroll to View',
  target: 'footer-content',
  scrollToView: true, // Automatically scrolls element into view
  direction: 'top'
}
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --tour-guide-tooltip-bg: #1f2937;
  --tour-guide-tooltip-text: #ffffff;
  --tour-guide-overlay-color: rgba(0, 0, 0, 0.5);
  --tour-guide-highlight-radius: 8px;
}
```

### Custom Tooltip Classes

```vue
<template>
  <TourGuideManager :steps="steps">
    <template #step-content="{ step, index }">
      <div class="custom-tooltip-content">
        <h3>{{ step.title }}</h3>
        <p>{{ step.content }}</p>
        <div class="step-counter">{{ index + 1 }} of {{ steps.length }}</div>
      </div>
    </template>
  </TourGuideManager>
</template>
```

## Accessibility

The tour guide is built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support for navigation
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Automatic focus handling
- **High Contrast Mode**: Support for high contrast themes
- **Reduced Motion**: Respects `prefers-reduced-motion` settings

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## Examples

Check out the `examples/` directory for more detailed usage examples:

- [Basic Usage](./examples/basic-usage.vue) - Simple tour implementation
- [Advanced Features](./examples/advanced-features.vue) - Complex scenarios
- [Nuxt Integration](./examples/nuxt-example.vue) - Nuxt-specific setup

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://vue-tour-guide.dev)
- 🐛 [Issue Tracker](https://github.com/whytepeter/vue-tour-guide/issues)
- 💬 [Discussions](https://github.com/whytepeter/vue-tour-guide/discussions)

---

Made with ❤️ for the Vue.js community
