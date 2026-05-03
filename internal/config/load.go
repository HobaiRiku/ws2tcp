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
func (c *Config) applyTrueDefaults() {
	c.App.HTTPListen = "127.0.0.1:7321"
	c.App.HTTPAuth = true
	c.App.LogLevel = "info"
	c.Server.UseEncryption = true
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
