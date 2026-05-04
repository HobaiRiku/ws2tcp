import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 在构建时会清空 outDir, 所以直接把产物落到 internal/web/static/, 让 Go 的
// //go:embed static/* 自动拾取. dev 时通过 proxy 把 /api 转发到本地后端.
//
// 默认 dev port = 5266, 走 .env / .env.local 用 VITE_DEV_PORT 覆盖.
// 后端 base URL 用 VITE_API_BASE 覆盖, 默认 http://127.0.0.1:8080.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_DEV_PORT) || 5266
  const apiBase = env.VITE_API_BASE || 'http://127.0.0.1:8080'

  return {
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
      port,
      strictPort: false,
      proxy: {
        '/api': {
          target: apiBase,
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
  }
})
