package web

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestMountServesIndexAndFallback(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	Mount(router)

	for _, path := range []string{"/", "/dashboard"} {
		req := httptest.NewRequest(http.MethodGet, path, nil)
		rr := httptest.NewRecorder()
		router.ServeHTTP(rr, req)
		if rr.Code != http.StatusOK {
			t.Fatalf("%s returned %d", path, rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "<title>ws2tcp") {
			t.Fatalf("%s did not serve embedded ui shell: %s", path, rr.Body.String())
		}
	}
}

func TestMountLeavesUnknownAPIPathsAs404(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	Mount(router)

	req := httptest.NewRequest(http.MethodGet, "/api/missing", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for api path, got %d", rr.Code)
	}
}

func TestMountMissingAssetReturns404(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	Mount(router)

	req := httptest.NewRequest(http.MethodGet, "/missing.js", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for missing asset, got %d", rr.Code)
	}
	body, _ := io.ReadAll(rr.Body)
	if !strings.Contains(string(body), "404") {
		t.Fatalf("unexpected missing asset body: %s", string(body))
	}
}
