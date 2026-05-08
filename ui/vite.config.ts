import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Vite 把产物直接落到 internal/web/static/, 由带 -tags embedui 的发布构建
// 通过 internal/web/embed_ui.go 内嵌. 默认构建 (make dev / go run .) 不引用
// 这个目录, 所以仓库里也不再保留 .gitkeep.
//
// dev 工作流: 一边 `make run` 起后端, 一边 `make ui-dev` 起 vite, 浏览器访问
// vite 端口即可, /api 由下方 proxy 转给后端.
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
      emptyOutDir: true,
      sourcemap: false,
      target: 'es2022'
    }
  }
})
