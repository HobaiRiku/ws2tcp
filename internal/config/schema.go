// Package config defines the typed YAML schema for ~/.ws2tcp/config.yaml,
// loads + validates it, and provides an atomic writer that preserves
// comments and key order via gopkg.in/yaml.v3 *yaml.Node.
//
// See docs/design/01-config-and-storage.md for the schema rationale and
// reload semantics.
package config

// Config is the root document of config.yaml.
type Config struct {
	App    AppConfig    `yaml:"app"`
	Server ServerConfig `yaml:"server"`
	Client ClientConfig `yaml:"client"`
}

// AppConfig covers the management plane (HTTP API + Web UI) and shared
// process settings such as log level.
type AppConfig struct {
	HTTPListen string `yaml:"http_listen"`
	HTTPAuth   bool   `yaml:"http_auth"`
	LogLevel   string `yaml:"log_level"`
}

// ServerConfig is the ws2tcp-server role (terminate WS, dial target TCP).
type ServerConfig struct {
	Enabled       bool             `yaml:"enabled"`
	Listen        string           `yaml:"listen"`
	WSPath        string           `yaml:"ws_path"`
	WSHost        string           `yaml:"ws_host"`
	TrustProxy    bool             `yaml:"trust_proxy"`
	AESKey        string           `yaml:"aes_key"`
	UseEncryption bool             `yaml:"use_encryption"`
	TLS           TLSConfig        `yaml:"tls"`
	Clients       []ClientIdentity `yaml:"clients"`
}

// TLSConfig switches on native wss; cert/key paths are resolved relative
// to WS2TCP_HOME.
type TLSConfig struct {
	Enabled bool   `yaml:"enabled"`
	Cert    string `yaml:"cert"`
	Key     string `yaml:"key"`
}

// ClientIdentity is one server-side credential record (a "user").
type ClientIdentity struct {
	ID     string    `yaml:"id"`
	Secret string    `yaml:"secret"`
	ACL    []ACLRule `yaml:"acl"`
}

// ACLRule grants access from a CIDR to a list of port specs.
// A port spec is either "22" or "8000-8999"; parse with ParsePortRange.
type ACLRule struct {
	CIDR  string   `yaml:"cidr"`
	Ports []string `yaml:"ports"`
}

// ClientConfig is the ws2tcp-client role (local TCP listener -> WS dial).
// Endpoints are reusable connection profiles; tunnels reference them by name.
type ClientConfig struct {
	Enabled   bool       `yaml:"enabled"`
	Endpoints []Endpoint `yaml:"endpoints"`
	Tunnels   []Tunnel   `yaml:"tunnels"`
}

// Endpoint describes how to reach a remote ws2tcp-server.
type Endpoint struct {
	Name                  string `yaml:"name"`
	Host                  string `yaml:"host"`
	IP                    string `yaml:"ip"`
	Port                  int    `yaml:"port"`
	Path                  string `yaml:"path"`
	WSS                   bool   `yaml:"wss"`
	AESKey                string `yaml:"aes_key"`
	SSLRejectUnauthorized bool   `yaml:"ssl_reject_unauthorized"`
	ClientID              string `yaml:"client_id"`
	ClientSecret          string `yaml:"client_secret"`
}

// Tunnel binds a local listener to a (target_host, target_port) reached via
// a named endpoint.
type Tunnel struct {
	Name       string `yaml:"name"`
	Endpoint   string `yaml:"endpoint"`
	Listen     string `yaml:"listen"`
	TargetHost string `yaml:"target_host"`
	TargetPort int    `yaml:"target_port"`
}
