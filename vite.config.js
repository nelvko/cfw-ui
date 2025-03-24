import {defineConfig} from 'vite'
import path from 'path'; // 导入 Node.js 的 path 模块
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [vue()],
})
