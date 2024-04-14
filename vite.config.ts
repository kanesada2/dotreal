import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // a-frame components
        isCustomElement: tag => tag.startsWith('a-')
      }
    }
  })],
})
