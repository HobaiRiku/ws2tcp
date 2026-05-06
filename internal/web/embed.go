package web

import (
	"embed"
	"io/fs"
	"net/http"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

// 用 all: 前缀让 .gitkeep 也被纳入, 这样在前端没构建时 (仅有 .gitkeep)
// `go build` / `go test` 也能成功; 真正的产物由 `make ui-build` 落到 static/ 里.
//
//go:embed all:static
var embedded embed.FS

const uiNotBuiltHTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>ws2tcp - UI not built</title>
<style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:640px;margin:auto;color:#0f172a}code{background:#f1f5f9;padding:0.15rem 0.4rem;border-radius:4px}</style>
</head><body><h1>ws2tcp UI 尚未构建</h1>
<p>当前二进制内嵌的 <code>internal/web/static/</code> 目录里没有 <code>index.html</code>。</p>
<p>请先运行 <code>make ui-build</code> (或 <code>cd ui &amp;&amp; pnpm run build</code>) 然后重新启动服务。</p>
<p>API 仍然正常工作，可直接访问 <code>/api/*</code>。</p></body></html>`

// Mount registers the embedded SPA shell and history-mode fallback routes on
// the shared management HTTP engine.
func Mount(router *gin.Engine) {
	ui := handler()
	router.GET("/", gin.WrapH(ui))
	router.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/api/") {
			c.Status(http.StatusNotFound)
			return
		}
		ui.ServeHTTP(c.Writer, c.Request)
	})
}

func handler() http.Handler {
	sub, err := fs.Sub(embedded, "static")
	if err != nil {
		panic(err)
	}
	files := http.FileServer(http.FS(sub))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		switch name {
		case ".", "/":
			name = "index.html"
		}

		if name != "index.html" {
			if info, err := fs.Stat(sub, name); err == nil && !info.IsDir() {
				files.ServeHTTP(w, r)
				return
			}
			if path.Ext(name) != "" {
				http.NotFound(w, r)
				return
			}
		}

		body, err := fs.ReadFile(sub, "index.html")
		if err != nil {
			body = []byte(uiNotBuiltHTML)
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(body)
	})
}
