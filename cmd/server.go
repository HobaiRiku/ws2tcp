package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/config"
)

func serverCmd() *cobra.Command {
	server := &cobra.Command{
		Use:   "server",
		Short: "Manage server settings",
	}
	server.AddCommand(
		serverShowCmd(),
		serverEnableCmd(),
		serverDisableCmd(),
		serverUpdateCmd(),
	)
	return server
}

func serverShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show",
		Short: "Show the server configuration",
		RunE: func(cmd *cobra.Command, _ []string) error {
			cfg, err := loadConfig()
			if err != nil {
				return err
			}
			return printYAML(cmd, cfg.Server)
		},
	}
}

func serverEnableCmd() *cobra.Command {
	return serverEnabledCmd(true)
}

func serverDisableCmd() *cobra.Command {
	return serverEnabledCmd(false)
}

func serverEnabledCmd(enabled bool) *cobra.Command {
	use := "disable"
	msg := "server disabled"
	raw := "false"
	if enabled {
		use = "enable"
		msg = "server enabled"
		raw = "true"
	}
	return &cobra.Command{
		Use:   use,
		Short: msg[:1] + msg[1:],
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.SetConfigValue("server.enabled", raw); err != nil {
				return fmt.Errorf("set server.enabled: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), msg)
			return nil
		},
	}
}

func serverUpdateCmd() *cobra.Command {
	var (
		listen        string
		wsPath        string
		wsHost        string
		trustProxy    bool
		aesKey        string
		useEncryption bool
		tlsEnabled    bool
		tlsCert       string
		tlsKey        string
	)

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update server settings",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if err := requireChangedFlags(cmd,
				"listen",
				"ws-path",
				"ws-host",
				"trust-proxy",
				"aes-key",
				"use-encryption",
				"tls-enabled",
				"tls-cert",
				"tls-key",
			); err != nil {
				return err
			}

			cfg, reg, err := loadConfigAndRegistry()
			if err != nil {
				return err
			}

			patch := cfg.Server
			if cmd.Flags().Changed("listen") {
				patch.Listen = listen
			}
			if cmd.Flags().Changed("ws-path") {
				patch.WSPath = wsPath
			}
			if cmd.Flags().Changed("ws-host") {
				patch.WSHost = wsHost
			}
			if cmd.Flags().Changed("trust-proxy") {
				patch.TrustProxy = trustProxy
			}
			if cmd.Flags().Changed("aes-key") {
				patch.AESKey = aesKey
			}
			if cmd.Flags().Changed("use-encryption") {
				patch.UseEncryption = useEncryption
			}
			if cmd.Flags().Changed("tls-enabled") {
				patch.TLS.Enabled = tlsEnabled
			}
			if cmd.Flags().Changed("tls-cert") {
				patch.TLS.Cert = tlsCert
			}
			if cmd.Flags().Changed("tls-key") {
				patch.TLS.Key = tlsKey
			}

			next := *cfg
			next.Server = patch
			if err := reg.ReplaceConfig(&next); err != nil {
				return fmt.Errorf("update server: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server updated")
			return nil
		},
	}

	cmd.Flags().StringVar(&listen, "listen", "", "server listen address")
	cmd.Flags().StringVar(&wsPath, "ws-path", "", "websocket path")
	cmd.Flags().StringVar(&wsHost, "ws-host", "", "required Host header for websocket requests")
	cmd.Flags().BoolVar(&trustProxy, "trust-proxy", false, "trust reverse proxy headers")
	cmd.Flags().StringVar(&aesKey, "aes-key", "", "32-byte handshake AES key")
	cmd.Flags().BoolVar(&useEncryption, "use-encryption", false, "enable end-to-end data encryption")
	cmd.Flags().BoolVar(&tlsEnabled, "tls-enabled", false, "enable native TLS on the server listener")
	cmd.Flags().StringVar(&tlsCert, "tls-cert", "", "TLS certificate path relative to WS2TCP_HOME")
	cmd.Flags().StringVar(&tlsKey, "tls-key", "", "TLS key path relative to WS2TCP_HOME")
	return cmd
}

func findServerClient(cfg *config.Config, id string) (config.ClientIdentity, error) {
	for _, client := range cfg.Server.Clients {
		if client.ID == id {
			return client, nil
		}
	}
	return config.ClientIdentity{}, fmt.Errorf("client %q not found", id)
}
