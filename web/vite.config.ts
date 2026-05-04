import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 在构建时会清空 outDir，所以我们直接把产物落到 internal/web/static/，
// 让 Go 的 //go:embed static/* 自动拾取。dev 时通过 proxy 把 /api 转发到本地后端。
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Fluent UI 都是 fluent- 前缀的自定义元素
          isCustomElement: tag => tag.startsWith('fluent-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        ws: true
      }
    }
  },
  build: {
    outDir: '../internal/web/static',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2022'
  }
})
