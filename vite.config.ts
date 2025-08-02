import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  // Check if we're building for demo or library
  const isDemo = command === 'serve' || mode === 'demo'

  if (isDemo) {
    // Demo configuration for GitHub Pages
    return {
      plugins: [vue()],
      base: '/vue-tour-guide/', // GitHub Pages base path
      build: {
        outDir: 'dist-demo',
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html')
          }
        }
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src')
        }
      }
    }
  }

  // Library configuration
  return {
    plugins: [
      vue(),
      dts({
        insertTypesEntry: true,
        exclude: ['src/dev/**', 'src/**/*.stories.ts', 'src/**/*.test.ts']
      })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'VueTourGuide',
        fileName: 'index',
        formats: ['es']
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.css'
            return assetInfo.name!
          }
        }
      },
      cssCodeSplit: false
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    }
  }
})