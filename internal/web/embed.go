package web

import (
	"io/fs"
	"net/http"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

// uiFS is wired up by the build-tagged variant in embed_ui.go when the
// binary is compiled with `-tags embedui` (after `make ui-build` has
// populated internal/web/static/). Default builds leave it nil and the
// placeholder HTML below is served instead — this lets `make dev` /
// `go run .` work without needing the SPA built first.
var uiFS fs.FS

const uiNotBuiltHTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>ws2tcp - UI not built</title>
<style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:640px;margin:auto;color:#0f172a}code{background:#f1f5f9;padding:0.15rem 0.4rem;border-radius:4px}</style>
</head><body><h1>ws2tcp UI 尚未构建或未内嵌</h1>
<p>当前二进制没有内嵌 SPA 资源 (开发模式 / 未使用 <code>-tags embedui</code> 构建)。</p>
<p>开发: 在另一个终端跑 <code>make ui-dev</code> 直连 vite dev server (默认 5173)。</p>
<p>发布: 跑 <code>make build</code> 即可同时构建前端并把产物嵌入 Go 二进制。</p>
<p>API 仍然正常工作, 可直接访问 <code>/api/*</code>。</p></body></html>`

// Mount registers the SPA shell and history-mode fallback routes on the
// shared management HTTP engine.
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
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if uiFS == nil {
			servePlaceholder(w, r)
			return
		}
		serveEmbedded(w, r, uiFS)
	})
}

// servePlaceholder serves the "UI not built" notice for shell paths and
// 404s anything that looks like an asset request — keeps the dev-mode
// behaviour predictable without dragging in unused 200 responses.
func servePlaceholder(w http.ResponseWriter, r *http.Request) {
	clean := path.Clean("/" + r.URL.Path)
	if clean != "/" && path.Ext(clean) != "" {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(uiNotBuiltHTML))
}

func serveEmbedded(w http.ResponseWriter, r *http.Request, sub fs.FS) {
	files := http.FileServer(http.FS(sub))
	name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
	if name == "" || name == "." {
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
}
