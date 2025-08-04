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
npm install v-tour-guide
```

## CSS Import

**Important**: You need to import the tour guide CSS for proper styling (arrows, animations, etc.):

### Option 1: Import in your plugin (Recommended)

```typescript
// plugins/v-tour-guide.client.ts
import { TourGuideManager, TourGuideTooltip } from 'v-tour-guide'
import 'v-tour-guide/style.css' // Add this line

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('TourGuideManager', TourGuideManager)
  nuxtApp.vueApp.component('TourGuideTooltip', TourGuideTooltip)
})
```

### Option 2: Import in your component

```vue
<script setup lang="ts">
import { useTourGuide, type TourGuideStep } from 'v-tour-guide'
import 'v-tour-guide/style.css' // Add this line
</script>
```

### Option 3: Add to Nuxt config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    'v-tour-guide/style.css'
  ],
  // ... rest of your config
})
```

## Live Demo

🎮 **Try it out**: [Live Demo](https://whytepeter.github.io/v-tour-guide/)

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
import { TourGuideManager, type TourGuideStep } from 'v-tour-guide'

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

1. Create a plugin file `plugins/v-tour-guide.client.ts`:

```typescript
import { TourGuideManager, TourGuideTooltip } from 'v-tour-guide'

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
import { useTourGuide, type TourGuideStep } from 'v-tour-guide'

const { startTourGuide } = useTourGuide()

const steps: TourGuideStep[] = [
  // Your tour steps
]
</script>
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

The `target` property accepts CSS selectors and data attributes:

```html
<!-- Using data attributes (recommended) -->
<div data-tour-guide="welcome">Welcome!</div>

<!-- Using CSS selectors -->
<div id="submit-button">Submit</div>
<div class="feature-list">Features</div>
```

```javascript
const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome!',
    target: 'welcome',           // data-tour-guide="welcome"
    content: 'Welcome to our app'
  },
  {
    id: 'submit',
    title: 'Submit',
    target: '#submit-button',    // ID selector
    content: 'Click to submit'
  },
  {
    id: 'features',
    title: 'Features',
    target: '.feature-list',     // Class selector
    content: 'Check out our features'
  }
];
```



### Tooltip Customization

You can customize tooltip appearance and behavior:

```javascript
{
  id: 'custom-step',
  title: 'Custom Styled Tooltip',
  content: 'This tooltip has custom styling!',
  target: 'my-element',
  showAction: true,
  
  tooltip: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    maxWidth: '24rem',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    buttonBackgroundColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    buttonHoverColor: '#2563eb'
  }
}
```



## Advanced Features

### Separate Tooltip Positioning

Highlight one element while positioning the tooltip relative to a different element:

```javascript
{
  id: 'complex-step',
  title: 'Advanced Feature',
  content: 'This highlights one element but positions tooltip elsewhere.',
  target: '.main-button',        // Element to highlight
  tooltipTarget: '.tooltip-anchor', // Different element for tooltip positioning
  direction: 'right',
  showAction: true
}
```

### Lifecycle Hooks

```javascript
{
  id: 'async-step',
  title: 'Loading Data',
  target: 'data-section',
  async beforeShow() {
    await fetchData()
  },
  afterShow() {
    analytics.track('tour_step_viewed', { step: 'data-section' })
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



## Accessibility

The tour guide is built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support for navigation
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Automatic focus handling
- **High Contrast Mode**: Support for high contrast themes
- **Reduced Motion**: Respects `prefers-reduced-motion` settings

## Examples

Check out the `examples/` directory for detailed usage examples:

- [Basic Usage](./examples/basic-usage.vue) - Simple tour implementation



## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/whytepeter/v-tour-guide)
- 🐛 [Issue Tracker](https://github.com/whytepeter/v-tour-guide/issues)
- 💬 [Discussions](https://github.com/whytepeter/v-tour-guide/discussions)

---

Made with ❤️ for the Vue.js community
# Trigger deployment
