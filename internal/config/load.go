package config

import (
	"errors"
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// MissingFileError is returned by Load when the file does not exist, so the
// caller can choose to scaffold a default rather than abort.
type MissingFileError struct{ Path string }

func (e *MissingFileError) Error() string {
	return fmt.Sprintf("config file not found: %s", e.Path)
}

// Load reads, decodes, fills defaults on, and validates the config file at
// path. Returned errors are caller-friendly (no stack); a missing file is
// distinguishable via *MissingFileError.
func Load(path string) (*Config, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, &MissingFileError{Path: path}
		}
		return nil, fmt.Errorf("read %s: %w", path, err)
	}

	cfg := &Config{}
	cfg.applyTrueDefaults()
	if err := yaml.Unmarshal(raw, cfg); err != nil {
		return nil, fmt.Errorf("parse %s: %w", path, err)
	}
	cfg.dropEmptyPlaceholders()
	cfg.applyZeroDefaults()

	if err := cfg.Validate(); err != nil {
		return nil, err
	}
	return cfg, nil
}

// applyTrueDefaults sets fields whose default is `true`. We pre-set them
// before YAML decode so an absent key keeps the default, while an explicit
// `false` in YAML overrides. (Go's zero value for bool is false, which is
// indistinguishable from "absent" after unmarshal.)
//
// 注意: 这里**不**给 http_token 设兜底默认 — 缺失就保持空字符串, 由
// services.AuthService 在校验时直接 401 (空 expected token 永不通过).
// 写一个固定占位字符串等于把所有未配置的实例都暴露给同一把"密钥".
func (c *Config) applyTrueDefaults() {
	c.App.HTTPListen = "127.0.0.1:7321"
	c.App.HTTPAuth = true
	c.App.LogLevel = "info"
	c.Server.UseEncryption = true
	c.Server.Enabled = true
}

// applyZeroDefaults fills string/numeric fields whose default isn't the
// zero value, after YAML decode.
func (c *Config) applyZeroDefaults() {
	if c.Server.WSPath == "" {
		c.Server.WSPath = "/connect"
	}
	if c.App.LogLevel == "" {
		c.App.LogLevel = "info"
	}
	if c.App.HTTPListen == "" {
		c.App.HTTPListen = "127.0.0.1:7321"
	}
}

func (c *Config) dropEmptyPlaceholders() {
	c.Server.Clients = filterServerClients(c.Server.Clients)
	c.Client.Endpoints = filterEndpoints(c.Client.Endpoints)
	c.Client.Clients = filterClientProfiles(c.Client.Clients)
}

func filterServerClients(items []ClientIdentity) []ClientIdentity {
	out := make([]ClientIdentity, 0, len(items))
	for _, item := range items {
		if item.ID == "" && item.Secret == "" && len(item.ACL) == 0 {
			continue
		}
		out = append(out, item)
	}
	return out
}

func filterEndpoints(items []Endpoint) []Endpoint {
	out := make([]Endpoint, 0, len(items))
	for _, item := range items {
		if item.Name == "" && item.Host == "" && item.IP == "" && item.Port == 0 && item.Path == "" && item.AESKey == "" {
			continue
		}
		out = append(out, item)
	}
	return out
}

func filterClientProfiles(items []ClientProfile) []ClientProfile {
	out := make([]ClientProfile, 0, len(items))
	for _, item := range items {
		item.Tunnels = filterTunnels(item.Tunnels)
		if item.Name == "" && item.Endpoint == "" && item.ClientID == "" && item.ClientSecret == "" && len(item.Tunnels) == 0 {
			continue
		}
		out = append(out, item)
	}
	return out
}

func filterTunnels(items []Tunnel) []Tunnel {
	out := make([]Tunnel, 0, len(items))
	for _, item := range items {
		if item.Name == "" && item.Listen == "" && item.TargetHost == "" && item.TargetPort == 0 {
			continue
		}
		out = append(out, item)
	}
	return out
}
