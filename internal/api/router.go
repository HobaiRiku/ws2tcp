package api

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	eventws "websocket2Tcp/internal/api/ws"
	"websocket2Tcp/internal/config"
	applog "websocket2Tcp/internal/log"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
	"websocket2Tcp/internal/version"
)

// ServerControl lets the API trigger an in-process restart of the ws2tcp
// server subsystem after transport-affecting config changes.
type ServerControl interface {
	Restart()
}

// Options carries the dependencies needed to build the management router.
// Auth middleware can be injected later; if Protect is nil, routes are open.
type Options struct {
	Registry      *services.Registry
	Runtime       *services.Runtime
	Auth          *services.AuthService
	Events        *events.Bus
	LogTap        *applog.Tap
	RequireAuth   bool
	Logger        *slog.Logger
	ServerControl ServerControl
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

type endpointPatchRequest struct {
	Host                  *string `json:"host"`
	IP                    *string `json:"ip"`
	Port                  *int    `json:"port"`
	Path                  *string `json:"path"`
	WSS                   *bool   `json:"wss"`
	AESKey                *string `json:"aes_key"`
	SSLRejectUnauthorized *bool   `json:"ssl_reject_unauthorized"`
}

type clientProfilePatchRequest struct {
	Name         *string `json:"name"`
	Endpoint     *string `json:"endpoint"`
	ClientID     *string `json:"client_id"`
	ClientSecret *string `json:"client_secret"`
}

type serverStatsResponse struct {
	BytesIn           uint64           `json:"bytes_in"`
	BytesOut          uint64           `json:"bytes_out"`
	UptimeSeconds     int64            `json:"uptime_seconds"`
	ClientConnections map[string]int32 `json:"client_connections"`
}

type serverSettingsResponse struct {
	Listen        string `json:"listen"`
	WSPath        string `json:"ws_path"`
	WSHost        string `json:"ws_host"`
	TrustProxy    bool   `json:"trust_proxy"`
	AESKey        string `json:"aes_key"`
	UseEncryption bool   `json:"use_encryption"`
	TLSEnabled    bool   `json:"tls_enabled"`
	TLSCert       string `json:"tls_cert"`
	TLSKey        string `json:"tls_key"`
}

type serverSettingsPatchRequest struct {
	Listen        *string `json:"listen"`
	WSPath        *string `json:"ws_path"`
	WSHost        *string `json:"ws_host"`
	TrustProxy    *bool   `json:"trust_proxy"`
	AESKey        *string `json:"aes_key"`
	UseEncryption *bool   `json:"use_encryption"`
	TLSEnabled    *bool   `json:"tls_enabled"`
	TLSCert       *string `json:"tls_cert"`
	TLSKey        *string `json:"tls_key"`
}

type clientRuntimeResponse struct {
	Tunnels []services.TunnelStatus `json:"tunnels"`
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
		c.JSON(http.StatusOK, version.Current())
	})

	api := router.Group("/api")
	readOnly := authorize(opts, services.TokenScopeRead)

	// /api/auth/me — verifies a bearer token and returns its info. Used by
	// the web UI login flow; requires only the read scope.
	api.GET("/auth/me", readOnly, func(c *gin.Context) {
		token := bearerToken(c.GetHeader("Authorization"))
		if token == "" {
			token = c.Query("token")
		}
		if !opts.RequireAuth {
			c.JSON(http.StatusOK, gin.H{"auth_required": false})
			return
		}
		if _, err := opts.Auth.VerifyToken(token, services.TokenScopeRead); err != nil {
			writeError(c, classifyStatus(err), "AUTH_FAILED", err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"auth_required": true})
	})

	clientWrite := authorize(opts, services.TokenScopeClientWrite)
	serverWrite := authorize(opts, services.TokenScopeServerWrite)
	adminOnly := authorize(opts, services.TokenScopeAdmin)

	api.GET("/config/path", readOnly, func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"path": opts.Registry.ConfigPath()})
	})
	api.GET("/config", readOnly, func(c *gin.Context) {
		cfg, err := config.Load(opts.Registry.ConfigPath())
		if err != nil {
			writeError(c, http.StatusInternalServerError, "CONFIG_LOAD_FAILED", err)
			return
		}
		c.JSON(http.StatusOK, redactConfig(cfg))
	})
	api.PUT("/config", adminOnly, func(c *gin.Context) {
		var cfg config.Config
		if err := c.ShouldBindJSON(&cfg); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.ReplaceConfig(&cfg); err != nil {
			writeError(c, classifyStatus(err), "REPLACE_CONFIG_FAILED", err)
			return
		}
		loaded, err := config.Load(opts.Registry.ConfigPath())
		if err != nil {
			writeError(c, http.StatusInternalServerError, "CONFIG_LOAD_FAILED", err)
			return
		}
		c.JSON(http.StatusOK, redactConfig(loaded))
	})

	api.GET("/client/endpoints", readOnly, func(c *gin.Context) {
		c.JSON(http.StatusOK, redactEndpoints(opts.Registry.Endpoints()))
	})
	api.POST("/client/endpoints", clientWrite, func(c *gin.Context) {
		var endpoint config.Endpoint
		if err := c.ShouldBindJSON(&endpoint); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.CreateEndpoint(endpoint); err != nil {
			writeError(c, classifyStatus(err), "CREATE_ENDPOINT_FAILED", err)
			return
		}
		created, _ := opts.Registry.FindEndpoint(endpoint.Name)
		c.JSON(http.StatusCreated, redactEndpoint(created))
	})
	api.GET("/client/endpoints/:endpoint", readOnly, func(c *gin.Context) {
		endpoint, err := opts.Registry.FindEndpoint(c.Param("endpoint"))
		if err != nil {
			writeError(c, http.StatusNotFound, "ENDPOINT_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, redactEndpoint(endpoint))
	})
	api.PATCH("/client/endpoints/:endpoint", clientWrite, func(c *gin.Context) {
		var req endpointPatchRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		patch := services.EndpointPatch{
			Host:                  req.Host,
			IP:                    req.IP,
			Port:                  req.Port,
			Path:                  req.Path,
			WSS:                   req.WSS,
			AESKey:                req.AESKey,
			SSLRejectUnauthorized: req.SSLRejectUnauthorized,
		}
		if patch.Host == nil && patch.IP == nil && patch.Port == nil && patch.Path == nil && patch.WSS == nil && patch.AESKey == nil && patch.SSLRejectUnauthorized == nil {
			writeError(c, http.StatusBadRequest, "EMPTY_PATCH", errors.New("no endpoint fields provided"))
			return
		}
		if err := opts.Registry.UpdateEndpoint(c.Param("endpoint"), patch); err != nil {
			writeError(c, classifyStatus(err), "UPDATE_ENDPOINT_FAILED", err)
			return
		}
		endpoint, _ := opts.Registry.FindEndpoint(c.Param("endpoint"))
		c.JSON(http.StatusOK, redactEndpoint(endpoint))
	})
	api.DELETE("/client/endpoints/:endpoint", clientWrite, func(c *gin.Context) {
		if err := opts.Registry.DeleteEndpoint(c.Param("endpoint")); err != nil {
			writeError(c, classifyStatus(err), "DELETE_ENDPOINT_FAILED", err)
			return
		}
		c.Status(http.StatusNoContent)
	})
	api.GET("/client/profiles", readOnly, func(c *gin.Context) {
		c.JSON(http.StatusOK, redactClientProfiles(opts.Registry.ClientProfiles()))
	})
	api.POST("/client/profiles", clientWrite, func(c *gin.Context) {
		var profile config.ClientProfile
		if err := c.ShouldBindJSON(&profile); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.CreateClientProfile(profile); err != nil {
			writeError(c, classifyStatus(err), "CREATE_CLIENT_PROFILE_FAILED", err)
			return
		}
		created, _ := opts.Registry.FindClientProfile(profile.Name)
		c.JSON(http.StatusCreated, redactClientProfile(created))
	})
	api.GET("/client/profiles/:name", readOnly, func(c *gin.Context) {
		profile, err := opts.Registry.FindClientProfile(c.Param("name"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_PROFILE_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, redactClientProfile(profile))
	})
	api.PATCH("/client/profiles/:name", clientWrite, func(c *gin.Context) {
		var req clientProfilePatchRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		patch := services.ClientProfilePatch{
			Name:         req.Name,
			Endpoint:     req.Endpoint,
			ClientID:     req.ClientID,
			ClientSecret: req.ClientSecret,
		}
		if patch.Name == nil && patch.Endpoint == nil && patch.ClientID == nil && patch.ClientSecret == nil {
			writeError(c, http.StatusBadRequest, "EMPTY_PATCH", errors.New("no client profile fields provided"))
			return
		}
		if err := opts.Registry.UpdateClientProfile(c.Param("name"), patch); err != nil {
			writeError(c, classifyStatus(err), "UPDATE_CLIENT_PROFILE_FAILED", err)
			return
		}
		lookup := c.Param("name")
		if patch.Name != nil {
			lookup = *patch.Name
		}
		profile, _ := opts.Registry.FindClientProfile(lookup)
		c.JSON(http.StatusOK, redactClientProfile(profile))
	})
	api.DELETE("/client/profiles/:name", clientWrite, func(c *gin.Context) {
		if err := opts.Registry.DeleteClientProfile(c.Param("name")); err != nil {
			writeError(c, classifyStatus(err), "DELETE_CLIENT_PROFILE_FAILED", err)
			return
		}
		c.Status(http.StatusNoContent)
	})
	api.GET("/client/runtime", readOnly, func(c *gin.Context) {
		c.JSON(http.StatusOK, clientRuntimeResponse{Tunnels: opts.Runtime.TunnelStatuses()})
	})

	clientAPI := api.Group("/client/:name")
	clientAPI.GET("/endpoint", readOnly, func(c *gin.Context) {
		endpoint, err := opts.Registry.ClientEndpoint(c.Param("name"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_PROFILE_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, redactEndpoint(endpoint))
	})
	clientAPI.PUT("/endpoint", clientWrite, func(c *gin.Context) {
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
		c.JSON(http.StatusOK, redactEndpoint(resolved))
	})

	clientAPI.GET("/tunnels", readOnly, func(c *gin.Context) {
		tunnels, err := opts.Registry.Tunnels(c.Param("name"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_PROFILE_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, tunnels)
	})
	clientAPI.POST("/tunnels", clientWrite, func(c *gin.Context) {
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
	clientAPI.GET("/tunnels/:tunnel", readOnly, func(c *gin.Context) {
		tunnel, err := opts.Registry.FindTunnel(c.Param("name"), c.Param("tunnel"))
		if err != nil {
			writeError(c, http.StatusNotFound, "TUNNEL_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, tunnel)
	})
	clientAPI.PATCH("/tunnels/:tunnel", clientWrite, func(c *gin.Context) {
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
	clientAPI.DELETE("/tunnels/:tunnel", clientWrite, func(c *gin.Context) {
		if err := opts.Registry.DeleteTunnel(c.Param("name"), c.Param("tunnel")); err != nil {
			writeError(c, classifyStatus(err), "DELETE_TUNNEL_FAILED", err)
			return
		}
		c.Status(http.StatusNoContent)
	})

	api.GET("/server/clients", readOnly, func(c *gin.Context) {
		c.JSON(http.StatusOK, redactIdentities(opts.Registry.Identities()))
	})
	api.GET("/server/settings", readOnly, func(c *gin.Context) {
		cfg, err := config.Load(opts.Registry.ConfigPath())
		if err != nil {
			writeError(c, http.StatusInternalServerError, "CONFIG_LOAD_FAILED", err)
			return
		}
		c.JSON(http.StatusOK, serverSettings(cfg.Server))
	})
	api.PATCH("/server/settings", serverWrite, func(c *gin.Context) {
		var req serverSettingsPatchRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}

		// Apply each provided field. transportDirty tracks whether any change
		// actually affects the server's HTTP listener / TLS / handshake AES key
		// — only those require an in-process restart.
		type updateOp struct {
			path string
			val  string
		}
		var ops []updateOp
		transportDirty := false
		if req.Listen != nil {
			ops = append(ops, updateOp{"server.listen", *req.Listen})
			transportDirty = true
		}
		if req.WSPath != nil {
			ops = append(ops, updateOp{"server.ws_path", *req.WSPath})
			transportDirty = true
		}
		if req.WSHost != nil {
			ops = append(ops, updateOp{"server.ws_host", *req.WSHost})
			transportDirty = true
		}
		if req.TrustProxy != nil {
			ops = append(ops, updateOp{"server.trust_proxy", strconv.FormatBool(*req.TrustProxy)})
		}
		if req.AESKey != nil {
			ops = append(ops, updateOp{"server.aes_key", *req.AESKey})
			transportDirty = true
		}
		if req.UseEncryption != nil {
			ops = append(ops, updateOp{"server.use_encryption", strconv.FormatBool(*req.UseEncryption)})
		}
		if req.TLSEnabled != nil {
			ops = append(ops, updateOp{"server.tls.enabled", strconv.FormatBool(*req.TLSEnabled)})
			transportDirty = true
		}
		if req.TLSCert != nil {
			ops = append(ops, updateOp{"server.tls.cert", *req.TLSCert})
			transportDirty = true
		}
		if req.TLSKey != nil {
			ops = append(ops, updateOp{"server.tls.key", *req.TLSKey})
			transportDirty = true
		}
		if len(ops) == 0 {
			writeError(c, http.StatusBadRequest, "EMPTY_PATCH", errors.New("no server settings provided"))
			return
		}
		for _, op := range ops {
			if err := opts.Registry.SetConfigValue(op.path, op.val); err != nil {
				writeError(c, classifyStatus(err), "SET_SERVER_SETTINGS_FAILED", err)
				return
			}
		}
		cfg, err := config.Load(opts.Registry.ConfigPath())
		if err != nil {
			writeError(c, http.StatusInternalServerError, "CONFIG_LOAD_FAILED", err)
			return
		}
		if transportDirty && opts.ServerControl != nil {
			opts.ServerControl.Restart()
		}
		c.JSON(http.StatusOK, serverSettings(cfg.Server))
	})
	api.POST("/server/clients", serverWrite, func(c *gin.Context) {
		var client config.ClientIdentity
		if err := c.ShouldBindJSON(&client); err != nil {
			writeError(c, http.StatusBadRequest, "INVALID_JSON", err)
			return
		}
		if err := opts.Registry.CreateClient(client); err != nil {
			writeError(c, classifyStatus(err), "CREATE_CLIENT_FAILED", err)
			return
		}
		created, _ := opts.Registry.FindIdentity(client.ID)
		c.JSON(http.StatusCreated, redactIdentity(created))
	})
	api.GET("/server/clients/:id", readOnly, func(c *gin.Context) {
		client, err := opts.Registry.FindIdentity(c.Param("id"))
		if err != nil {
			writeError(c, http.StatusNotFound, "CLIENT_NOT_FOUND", err)
			return
		}
		c.JSON(http.StatusOK, redactIdentity(client))
	})
	api.PATCH("/server/clients/:id", serverWrite, func(c *gin.Context) {
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
		c.JSON(http.StatusOK, redactIdentity(client))
	})
	api.DELETE("/server/clients/:id", serverWrite, func(c *gin.Context) {
		if err := opts.Registry.DeleteClient(c.Param("id")); err != nil {
			writeError(c, classifyStatus(err), "DELETE_CLIENT_FAILED", err)
			return
		}
		c.Status(http.StatusNoContent)
	})
	api.PUT("/server/clients/:id/acl", serverWrite, func(c *gin.Context) {
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
		c.JSON(http.StatusOK, redactIdentity(client))
	})

	api.GET("/server/stats", readOnly, func(c *gin.Context) {
		bytesIn, bytesOut := opts.Runtime.Totals()
		c.JSON(http.StatusOK, serverStatsResponse{
			BytesIn:           bytesIn,
			BytesOut:          bytesOut,
			UptimeSeconds:     int64(services.Uptime() / time.Second),
			ClientConnections: opts.Runtime.ClientConnections(),
		})
	})

	api.GET("/events/stream", readOnly, eventws.StreamHandler(opts.Events))
	api.GET("/events/ws", readOnly, eventws.WebSocketHandler(opts.Events))

	api.GET("/logs/recent", readOnly, func(c *gin.Context) {
		if opts.LogTap == nil {
			c.JSON(http.StatusOK, gin.H{"records": []applog.Record{}})
			return
		}
		match := buildLogFilter(c)
		limit := parseLimit(c.Query("limit"), 200, 2000)
		records := opts.LogTap.Recent(match, limit)
		c.JSON(http.StatusOK, gin.H{"records": records})
	})

	return router
}

func redactConfig(cfg *config.Config) *config.Config {
	cp := *cfg
	cp.App = cfg.App
	cp.Server = cfg.Server
	cp.Client = cfg.Client
	cp.App.HTTPToken = ""
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

// 内部管理面板, endpoint AES key 直接回显, 方便用户编辑时一眼看到当前值.
// /api/config 全量导出仍由 redactConfig 抹掉 aes_key.
func redactEndpoint(endpoint config.Endpoint) config.Endpoint {
	return endpoint
}

func redactEndpoints(endpoints []config.Endpoint) []config.Endpoint {
	out := make([]config.Endpoint, len(endpoints))
	for i, endpoint := range endpoints {
		out[i] = redactEndpoint(endpoint)
	}
	return out
}

// 注意: 出于内部管理面板的便利性, 这里不再 redact client_secret. AES key
// 仍由 redactEndpoint 抹掉, 因为 endpoint 列表的语义不同.
func redactClientProfile(profile config.ClientProfile) config.ClientProfile {
	cp := profile
	cp.Tunnels = append([]config.Tunnel{}, profile.Tunnels...)
	return cp
}

func redactClientProfiles(profiles []config.ClientProfile) []config.ClientProfile {
	out := make([]config.ClientProfile, len(profiles))
	for i, profile := range profiles {
		out[i] = redactClientProfile(profile)
	}
	return out
}

func redactIdentity(identity services.Identity) gin.H {
	// 内部管理面板, secret 直接回显; AES 等更敏感的信息仍按需 redact.
	return gin.H{
		"id":     identity.ID,
		"secret": identity.Secret,
		"acl":    identityACL(identity),
	}
}

func redactIdentities(identities []services.Identity) []gin.H {
	out := make([]gin.H, len(identities))
	for i, identity := range identities {
		out[i] = redactIdentity(identity)
	}
	return out
}

func serverSettings(cfg config.ServerConfig) serverSettingsResponse {
	return serverSettingsResponse{
		Listen:        cfg.Listen,
		WSPath:        cfg.WSPath,
		WSHost:        cfg.WSHost,
		TrustProxy:    cfg.TrustProxy,
		AESKey:        cfg.AESKey,
		UseEncryption: cfg.UseEncryption,
		TLSEnabled:    cfg.TLS.Enabled,
		TLSCert:       cfg.TLS.Cert,
		TLSKey:        cfg.TLS.Key,
	}
}

func identityACL(identity services.Identity) []gin.H {
	out := make([]gin.H, len(identity.ACL))
	for i, rule := range identity.ACL {
		ports := make([]string, len(rule.Ports))
		for j, port := range rule.Ports {
			if port.Lo == port.Hi {
				ports[j] = strconv.Itoa(int(port.Lo))
				continue
			}
			ports[j] = strconv.Itoa(int(port.Lo)) + "-" + strconv.Itoa(int(port.Hi))
		}
		out[i] = gin.H{
			"cidr":  rule.CIDR.String(),
			"ports": ports,
		}
	}
	return out
}

func classifyStatus(err error) int {
	if err == nil {
		return http.StatusOK
	}
	if errors.Is(err, services.ErrTokenUnauthorized) {
		return http.StatusUnauthorized
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

func authorize(opts Options, scopes ...string) gin.HandlerFunc {
	if !opts.RequireAuth {
		return func(c *gin.Context) { c.Next() }
	}
	return func(c *gin.Context) {
		if opts.Auth == nil {
			writeError(c, http.StatusInternalServerError, "AUTH_NOT_CONFIGURED", errors.New("auth service not configured"))
			c.Abort()
			return
		}
		token := bearerToken(c.GetHeader("Authorization"))
		if token == "" {
			token = c.Query("token")
		}
		_, err := opts.Auth.VerifyToken(token, scopes...)
		if err != nil {
			writeError(c, classifyStatus(err), "AUTH_FAILED", err)
			c.Abort()
			return
		}
		c.Next()
	}
}

// buildLogFilter parses ?attr=key:value (repeatable) into an AND filter
// over the record's flattened attribute map. Convenience aliases ?client=,
// ?tunnel=, and ?level= are also supported.
func buildLogFilter(c *gin.Context) func(applog.Record) bool {
	type pair struct{ key, value string }
	var want []pair
	for _, raw := range c.QueryArray("attr") {
		idx := strings.Index(raw, ":")
		if idx <= 0 {
			continue
		}
		want = append(want, pair{raw[:idx], raw[idx+1:]})
	}
	aliases := map[string]string{
		"client":    "client",
		"client_id": "client_id",
		"tunnel":    "tunnel",
		"component": "component",
	}
	for q, k := range aliases {
		if v := strings.TrimSpace(c.Query(q)); v != "" {
			want = append(want, pair{k, v})
		}
	}
	level := strings.ToUpper(strings.TrimSpace(c.Query("level")))
	if len(want) == 0 && level == "" {
		return nil
	}
	return func(rec applog.Record) bool {
		if level != "" && !strings.HasPrefix(strings.ToUpper(rec.Level), level) {
			return false
		}
		for _, p := range want {
			got, ok := rec.Attrs[p.key]
			if !ok {
				return false
			}
			if asString(got) != p.value {
				return false
			}
		}
		return true
	}
}

func asString(v any) string {
	switch x := v.(type) {
	case string:
		return x
	case fmt.Stringer:
		return x.String()
	case nil:
		return ""
	}
	return fmt.Sprintf("%v", v)
}

func parseLimit(raw string, def, max int) int {
	if raw == "" {
		return def
	}
	n, err := strconv.Atoi(raw)
	if err != nil || n <= 0 {
		return def
	}
	if n > max {
		return max
	}
	return n
}

func bearerToken(header string) string {
	if header == "" {
		return ""
	}
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(header, prefix))
}
