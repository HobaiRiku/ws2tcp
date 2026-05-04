// Package config defines the typed YAML schema for ~/.ws2tcp/config.yaml,
// loads + validates it, and provides an atomic writer that preserves
// comments and key order via gopkg.in/yaml.v3 *yaml.Node.
//
// See docs/design/01-config-and-storage.md for the schema rationale and
// reload semantics.
package config

// Config is the root document of config.yaml.
type Config struct {
	App    AppConfig    `yaml:"app" json:"app"`
	Server ServerConfig `yaml:"server" json:"server"`
	Client ClientConfig `yaml:"client" json:"client"`
}

// ServerConfigured reports whether the server section has enough user-provided
// data to mean "run the server role" without relying on an explicit enabled bit.
func (c *Config) ServerConfigured() bool {
	return c.Server.Listen != "" ||
		c.Server.AESKey != "" ||
		c.Server.WSHost != "" ||
		len(c.Server.Clients) > 0 ||
		c.Server.TLS.Enabled
}

// ClientConfigured reports whether the client section has any configured
// endpoints or profiles and therefore should be validated/run.
func (c *Config) ClientConfigured() bool {
	return len(c.Client.Endpoints) > 0 || len(c.Client.Clients) > 0
}

// AppConfig covers the management plane (HTTP API + Web UI) and shared
// process settings such as log level.
type AppConfig struct {
	HTTPListen string `yaml:"http_listen" json:"http_listen"`
	HTTPAuth   bool   `yaml:"http_auth" json:"http_auth"`
	HTTPToken  string `yaml:"http_token" json:"http_token"`
	LogLevel   string `yaml:"log_level" json:"log_level"`
}

// ServerConfig is the ws2tcp-server role (terminate WS, dial target TCP).
type ServerConfig struct {
	Listen        string           `yaml:"listen" json:"listen"`
	WSPath        string           `yaml:"ws_path" json:"ws_path"`
	WSHost        string           `yaml:"ws_host" json:"ws_host"`
	TrustProxy    bool             `yaml:"trust_proxy" json:"trust_proxy"`
	AESKey        string           `yaml:"aes_key" json:"aes_key"`
	UseEncryption bool             `yaml:"use_encryption" json:"use_encryption"`
	TLS           TLSConfig        `yaml:"tls" json:"tls"`
	Clients       []ClientIdentity `yaml:"clients" json:"clients"`
}

// TLSConfig switches on native wss; cert/key paths are resolved relative
// to WS2TCP_HOME.
type TLSConfig struct {
	Enabled bool   `yaml:"enabled" json:"enabled"`
	Cert    string `yaml:"cert" json:"cert"`
	Key     string `yaml:"key" json:"key"`
}

// ClientIdentity is one server-side credential record (a "user").
type ClientIdentity struct {
	ID     string    `yaml:"id" json:"id"`
	Secret string    `yaml:"secret" json:"secret"`
	ACL    []ACLRule `yaml:"acl" json:"acl"`
}

// ACLRule grants access from a CIDR to a list of port specs.
// A port spec is either "22" or "8000-8999"; parse with ParsePortRange.
type ACLRule struct {
	CIDR  string   `yaml:"cidr" json:"cidr"`
	Ports []string `yaml:"ports" json:"ports"`
}

// ClientConfig is the ws2tcp-client role (local TCP listener -> WS dial).
// Endpoints are reusable connection profiles; clients own credentials and
// tunnels, and each client references one endpoint by name.
type ClientConfig struct {
	Endpoints []Endpoint      `yaml:"endpoints" json:"endpoints"`
	Clients   []ClientProfile `yaml:"clients" json:"clients"`
}

// Endpoint describes how to reach a remote ws2tcp-server.
type Endpoint struct {
	Name                  string `yaml:"name" json:"name"`
	Host                  string `yaml:"host" json:"host"`
	IP                    string `yaml:"ip" json:"ip"`
	Port                  int    `yaml:"port" json:"port"`
	Path                  string `yaml:"path" json:"path"`
	WSS                   bool   `yaml:"wss" json:"wss"`
	AESKey                string `yaml:"aes_key" json:"aes_key"`
	SSLRejectUnauthorized bool   `yaml:"ssl_reject_unauthorized" json:"ssl_reject_unauthorized"`
}

// ClientProfile is one named ws2tcp client definition. It references a shared
// endpoint, owns its handshake credentials, and owns its local tunnels.
type ClientProfile struct {
	Name         string   `yaml:"name" json:"name"`
	Endpoint     string   `yaml:"endpoint" json:"endpoint"`
	ClientID     string   `yaml:"client_id" json:"client_id"`
	ClientSecret string   `yaml:"client_secret" json:"client_secret"`
	Tunnels      []Tunnel `yaml:"tunnels" json:"tunnels"`
}

// Tunnel binds a local listener to a (target_host, target_port) reached via
// the owning client's configured endpoint.
type Tunnel struct {
	Name       string `yaml:"name" json:"name"`
	Listen     string `yaml:"listen" json:"listen"`
	TargetHost string `yaml:"target_host" json:"target_host"`
	TargetPort int    `yaml:"target_port" json:"target_port"`
}
