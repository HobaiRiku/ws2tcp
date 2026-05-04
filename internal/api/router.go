package api

import (
	"errors"
	"log/slog"
	"net/http"
	"runtime/debug"
	"strings"

	"github.com/gin-gonic/gin"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

// Options carries the dependencies needed to build the management router.
// Auth middleware can be injected later; if Protect is nil, routes are open.
type Options struct {
	Registry *services.Registry
	Runtime  *services.Runtime
	Logger   *slog.Logger
	Protect  gin.HandlerFunc
}

type errorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type tunnelPatchRequest struct {
	Listen     *string `json:"listen"`
	TargetHost *string `json:"target_host"`
	TargetPort *int    `json:"target_port"`
}

type clientPatchRequest struct {
	Secret *string           `json:"secret"`
	ACL    *[]config.ACLRule `json:"acl"`
}

// NewRouter builds the base management REST API.
func NewRouter(opts Options) *gin.Engine {
	if opts.Logger == nil {
		opts.Logger = slog.Default()
	}

	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery())

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})
	router.GET("/api/version", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"version": buildVersion()})
	})

	api := router.Group("/api")
	if opts.Protect != nil {
		api.Use(opts.Protect)
	}

	api.GET("/config/path", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"path": opts.Registry.ConfigPath()})
	})
	api.GET("/config", func(c *gin.Context) {
		cfg, err := config.Load(opts.Registry.ConfigPath())
		if err != nil {
			writeError(c, http.StatusInternalServerError, "CONFIG_LOAD_FAILED", err)
			return
		}
		c.JSON(http.StatusOK, redactConfig(cfg))
	})

	clientAPI := api.Group("/client/:name")
	clientAPI.GET("/endpoint", func(c *gin.Context) {
		endpoint, err := opts.Registry.ClientEndpoint(c.Param("name"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_PROFILE_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, endpoint)
	})
	clientAPI.PUT("/endpoint", func(c *gin.Context) {
		var endpoint config.Endpoint
		if err := c.ShouldBindJSON(&endpoint); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.SetClientEndpoint(c.Param("name"), endpoint); err != nil {
			writeError(c, classifyStatus(err), "SET_CLIENT_ENDPOINT_FAILED", err)
			return
		}
		resolved, _ := opts.Registry.ClientEndpoint(c.Param("name"))
		c.JSON(http.StatusOK, resolved)
	})

	clientAPI.GET("/tunnels", func(c *gin.Context) {
		tunnels, err := opts.Registry.Tunnels(c.Param("name"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_PROFILE_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, tunnels)
	})
	clientAPI.POST("/tunnels", func(c *gin.Context) {
		var tunnel config.Tunnel
		if err := c.ShouldBindJSON(&tunnel); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.CreateTunnel(c.Param("name"), tunnel); err != nil {
			writeError(c, classifyStatus(err), "CREATE_TUNNEL_FAILED", err)
			return
		}
		c.JSON(http.StatusCreated, tunnel)
	})
	clientAPI.GET("/tunnels/:tunnel", func(c *gin.Context) {
		tunnel, err := opts.Registry.FindTunnel(c.Param("name"), c.Param("tunnel"))
		if err != nil {
			writeError(c, http.StatusNotFound, "TUNNEL_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, tunnel)
	})
	clientAPI.PATCH("/tunnels/:tunnel", func(c *gin.Context) {
		var req tunnelPatchRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		patch := services.TunnelPatch{
			Listen:     req.Listen,
			TargetHost: req.TargetHost,
			TargetPort: req.TargetPort,
		}
		if patch.Listen == nil && patch.TargetHost == nil && patch.TargetPort == nil {
			writeError(c, http.StatusBadRequest, "EMPTY_PATCH", errors.New("no tunnel fields provided"))
			return
		}
		if err := opts.Registry.UpdateTunnel(c.Param("name"), c.Param("tunnel"), patch); err != nil {
			writeError(c, classifyStatus(err), "UPDATE_TUNNEL_FAILED", err)
			return
		}
		tunnel, _ := opts.Registry.FindTunnel(c.Param("name"), c.Param("tunnel"))
		c.JSON(http.StatusOK, tunnel)
	})
	clientAPI.DELETE("/tunnels/:tunnel", func(c *gin.Context) {
		if err := opts.Registry.DeleteTunnel(c.Param("name"), c.Param("tunnel")); err != nil {
			writeError(c, classifyStatus(err), "DELETE_TUNNEL_FAILED", err)
			return
		}
		c.Status(http.StatusNoContent)
	})

	api.GET("/server/clients", func(c *gin.Context) {
		c.JSON(http.StatusOK, opts.Registry.Identities())
	})
	api.POST("/server/clients", func(c *gin.Context) {
		var client config.ClientIdentity
		if err := c.ShouldBindJSON(&client); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.CreateClient(client); err != nil {
			writeError(c, classifyStatus(err), "CREATE_CLIENT_FAILED", err)
			return
		}
		c.JSON(http.StatusCreated, client)
	})
	api.GET("/server/clients/:id", func(c *gin.Context) {
		client, err := opts.Registry.FindIdentity(c.Param("id"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, client)
	})
	api.PATCH("/server/clients/:id", func(c *gin.Context) {
		var req clientPatchRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		patch := services.ClientPatch{
			Secret: req.Secret,
			ACL:    req.ACL,
		}
		if patch.Secret == nil && patch.ACL == nil {
			writeError(c, http.StatusBadRequest, "EMPTY_PATCH", errors.New("no client fields provided"))
			return
		}
		if err := opts.Registry.UpdateClient(c.Param("id"), patch); err != nil {
			writeError(c, classifyStatus(err), "UPDATE_CLIENT_FAILED", err)
			return
		}
		client, _ := opts.Registry.FindIdentity(c.Param("id"))
		c.JSON(http.StatusOK, client)
	})
	api.DELETE("/server/clients/:id", func(c *gin.Context) {
		if err := opts.Registry.DeleteClient(c.Param("id")); err != nil {
			writeError(c, classifyStatus(err), "DELETE_CLIENT_FAILED", err)
			return
		}
		c.Status(http.StatusNoContent)
	})
	api.PUT("/server/clients/:id/acl", func(c *gin.Context) {
		var rules []config.ACLRule
		if err := c.ShouldBindJSON(&rules); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.SetClientACL(c.Param("id"), rules); err != nil {
			writeError(c, classifyStatus(err), "SET_CLIENT_ACL_FAILED", err)
			return
		}
		client, _ := opts.Registry.FindIdentity(c.Param("id"))
		c.JSON(http.StatusOK, client)
	})

	return router
}

func buildVersion() string {
	if info, ok := debug.ReadBuildInfo(); ok && info.Main.Version != "" {
		return info.Main.Version
	}
	return "dev"
}

func redactConfig(cfg *config.Config) *config.Config {
	cp := *cfg
	cp.Server = cfg.Server
	cp.Client = cfg.Client
	cp.Server.AESKey = ""
	cp.Server.Clients = make([]config.ClientIdentity, len(cfg.Server.Clients))
	for i, client := range cfg.Server.Clients {
		cp.Server.Clients[i] = client
		cp.Server.Clients[i].Secret = ""
	}
	cp.Client.Endpoints = make([]config.Endpoint, len(cfg.Client.Endpoints))
	for i, endpoint := range cfg.Client.Endpoints {
		cp.Client.Endpoints[i] = endpoint
		cp.Client.Endpoints[i].AESKey = ""
	}
	cp.Client.Clients = make([]config.ClientProfile, len(cfg.Client.Clients))
	for i, client := range cfg.Client.Clients {
		cp.Client.Clients[i] = client
		cp.Client.Clients[i].ClientSecret = ""
		cp.Client.Clients[i].Tunnels = append([]config.Tunnel(nil), client.Tunnels...)
	}
	return &cp
}

func classifyStatus(err error) int {
	if err == nil {
		return http.StatusOK
	}
	var missing *config.MissingFileError
	if errors.As(err, &missing) {
		return http.StatusNotFound
	}
	msg := err.Error()
	switch {
	case strings.Contains(msg, "not found"):
		return http.StatusNotFound
	case strings.Contains(msg, "already exists"):
		return http.StatusConflict
	case strings.Contains(msg, "invalid"):
		return http.StatusBadRequest
	default:
		return http.StatusBadRequest
	}
}

func writeError(c *gin.Context, status int, code string, err error) {
	c.JSON(status, errorResponse{
		Code:    code,
		Message: err.Error(),
	})
}
