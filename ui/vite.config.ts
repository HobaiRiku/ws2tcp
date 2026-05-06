import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 把产物直接落到 internal/web/static/, 让 Go 的 //go:embed all:static 自动
// 拾取. dev 时通过 proxy 把 /api 转发到本地后端.
//
// 注意: emptyOutDir 设为 false, 因为 outDir 里有一个 git 跟踪的 .gitkeep 占位文件,
// 用来保证 //go:embed 在前端没构建时也能编译通过. Makefile 的 ui-build 会在调用
// vite 之前手动清理 assets/ 与 index.html.
//
// 默认 dev port = 5266, 走 .env / .env.local 用 VITE_DEV_PORT 覆盖.
// dev 阶段 /api proxy 目标用 VITE_API_PROXY_TARGET 覆盖, 默认 http://127.0.0.1:7321.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_DEV_PORT) || 5266
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:7321'

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
          target: apiProxyTarget,
          changeOrigin: true,
          ws: true
        }
      }
    },
    build: {
      outDir: '../internal/web/static',
      emptyOutDir: false,
      sourcemap: false,
      target: 'es2022'
    }
  }
})
