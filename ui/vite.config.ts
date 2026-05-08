import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
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
//
// PWA: 用户对齐过的策略 = "安装来源同源 + 只缓存壳". manifest 让浏览器能装到桌面/
// 启动器, workbox 只 precache 前端静态资源 (index.html / assets/*), /api/** 永远
// 走网络. 后端不通时 NetworkOnly 路由 fetch 会抛错, 走特性 1 的 BackendDown 页.
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
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        // 开发环境不开 SW, 避免缓存干扰热更新.
        devOptions: { enabled: false },
        includeAssets: ['pwa-icon.svg'],
        manifest: {
          name: 'ws2tcp',
          short_name: 'ws2tcp',
          description: 'WebSocket to TCP tunnel manager',
          theme_color: '#0f6cbd',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
        },
        workbox: {
          // 只 precache 前端壳. /api/** 不进 SW 缓存, 永远走网络.
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: /\/api\//,
              handler: 'NetworkOnly'
            }
          ]
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
