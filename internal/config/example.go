package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// Example returns a runnable starter config for first-run initialization.
func Example() *Config {
	return &Config{
		App: AppConfig{
			HTTPListen: "127.0.0.1:7321",
			HTTPAuth:   true,
			HTTPToken:  "change-me-management-token",
			LogLevel:   "info",
		},
		Server: ServerConfig{
			Listen:        "0.0.0.0:3005",
			WSPath:        "/connect",
			TrustProxy:    false,
			AESKey:        "njpjvjkgfykgpqpcksvjydvlctgznlnz",
			UseEncryption: true,
			TLS: TLSConfig{
				Enabled: false,
				Cert:    "certs/cert.pem",
				Key:     "certs/key.pem",
			},
			Clients: []ClientIdentity{
				{
					ID:     "test1",
					Secret: "test1",
					ACL: []ACLRule{
						{CIDR: "192.168.1.0/24", Ports: []string{"22", "80", "443"}},
						{CIDR: "10.0.0.0/8", Ports: []string{"3306", "6379", "8000-8999"}},
					},
				},
			},
		},
		Client: ClientConfig{
			Endpoints: []Endpoint{
				{
					Name:                  "prod-ws",
					Host:                  "ws.example.com",
					Port:                  3005,
					Path:                  "/connect",
					AESKey:                "njpjvjkgfykgpqpcksvjydvlctgznlnz",
					SSLRejectUnauthorized: false,
				},
			},
			Clients: []ClientProfile{
				{
					Name:         "prod",
					Endpoint:     "prod-ws",
					ClientID:     "test1",
					ClientSecret: "test1",
					Tunnels: []Tunnel{
						{
							Name:       "ssh-prod",
							Listen:     "127.0.0.1:2000",
							TargetHost: "192.168.1.192",
							TargetPort: 22,
						},
					},
				},
			},
		},
	}
}

// WriteExample initializes path with the starter config.
func WriteExample(path string, perm os.FileMode) error {
	raw, err := yaml.Marshal(Example())
	if err != nil {
		return fmt.Errorf("marshal example config: %w", err)
	}
	return WriteAtomic(path, raw, perm)
}
