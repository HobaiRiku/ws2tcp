package web

import (
	"embed"
	"io/fs"
	"net/http"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

//go:embed static/*
var embedded embed.FS

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
			http.Error(w, "embedded ui unavailable", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(body)
	})
}
