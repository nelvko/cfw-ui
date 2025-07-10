import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import loadVersion from 'vite-plugin-package-version'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    loadVersion(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({ registerType: 'autoUpdate' }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
