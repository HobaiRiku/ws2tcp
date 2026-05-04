package cmd

import (
	"fmt"
	"net"
	"strconv"
	"text/tabwriter"

	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

func clientCmd() *cobra.Command {
	client := &cobra.Command{
		Use:   "client",
		Short: "Manage named client profiles and tunnels",
	}
	client.AddCommand(
		clientEndpointCmd(),
		clientTunnelsCmd(),
	)
	return client
}

func clientEndpointCmd() *cobra.Command {
	endpoint := &cobra.Command{
		Use:   "endpoint",
		Short: "Show or update the selected client's resolved endpoint",
	}
	endpoint.AddCommand(
		clientEndpointShowCmd(),
		clientEndpointSetCmd(),
	)
	return endpoint
}

func clientEndpointShowCmd() *cobra.Command {
	var clientName string
	cmd := &cobra.Command{
		Use:   "show",
		Short: "Print the selected client's resolved endpoint",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			endpoint, err := reg.ClientEndpoint(clientName)
			if err != nil {
				return err
			}
			out, err := yaml.Marshal(endpoint)
			if err != nil {
				return fmt.Errorf("marshal endpoint: %w", err)
			}
			_, _ = fmt.Fprint(cmd.OutOrStdout(), string(out))
			return nil
		},
	}
	addClientNameFlag(cmd, &clientName)
	return cmd
}

func clientEndpointSetCmd() *cobra.Command {
	var (
		clientName            string
		host                  string
		ip                    string
		port                  int
		path                  string
		aesKey                string
		wss                   bool
		sslRejectUnauthorized bool
	)

	cmd := &cobra.Command{
		Use:   "set",
		Short: "Update the selected client's referenced endpoint",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			ep, err := reg.ClientEndpoint(clientName)
			if err != nil {
				return err
			}
			if cmd.Flags().Changed("host") {
				ep.Host = host
			}
			if cmd.Flags().Changed("ip") {
				ep.IP = ip
			}
			if cmd.Flags().Changed("port") {
				ep.Port = port
			}
			if cmd.Flags().Changed("path") {
				ep.Path = path
			}
			if cmd.Flags().Changed("aes-key") {
				ep.AESKey = aesKey
			}
			if cmd.Flags().Changed("wss") {
				ep.WSS = wss
			}
			if cmd.Flags().Changed("ssl-reject-unauthorized") {
				ep.SSLRejectUnauthorized = sslRejectUnauthorized
			}
			if err := reg.SetClientEndpoint(clientName, ep); err != nil {
				return fmt.Errorf("set client endpoint: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "client endpoint updated")
			return nil
		},
	}

	addClientNameFlag(cmd, &clientName)
	cmd.Flags().StringVar(&host, "host", "", "upstream ws host for SNI and Host header")
	cmd.Flags().StringVar(&ip, "ip", "", "optional direct dial IP override")
	cmd.Flags().IntVar(&port, "port", 0, "upstream ws port")
	cmd.Flags().StringVar(&path, "path", "", "upstream ws path")
	cmd.Flags().StringVar(&aesKey, "aes-key", "", "32-byte shared AES key")
	cmd.Flags().BoolVar(&wss, "wss", false, "use TLS when dialing upstream")
	cmd.Flags().BoolVar(&sslRejectUnauthorized, "ssl-reject-unauthorized", false, "verify upstream TLS certificate")
	return cmd
}

func clientTunnelsCmd() *cobra.Command {
	tunnels := &cobra.Command{
		Use:   "tunnels",
		Short: "Manage tunnels for a selected client profile",
	}
	tunnels.AddCommand(
		clientTunnelsListCmd(),
		clientTunnelsAddCmd(),
		clientTunnelsUpdateCmd(),
		clientTunnelsRmCmd(),
	)
	return tunnels
}

func clientTunnelsListCmd() *cobra.Command {
	var clientName string
	cmd := &cobra.Command{
		Use:   "list",
		Short: "List configured tunnels for a selected client",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			tunnels, err := reg.Tunnels(clientName)
			if err != nil {
				return err
			}
			tw := tabwriter.NewWriter(cmd.OutOrStdout(), 0, 2, 2, ' ', 0)
			_, _ = fmt.Fprintln(tw, "NAME\tLISTEN\tTARGET")
			for _, tunnel := range tunnels {
				_, _ = fmt.Fprintf(tw, "%s\t%s\t%s:%d\n", tunnel.Name, tunnel.Listen, tunnel.TargetHost, tunnel.TargetPort)
			}
			return tw.Flush()
		},
	}
	addClientNameFlag(cmd, &clientName)
	return cmd
}

func clientTunnelsAddCmd() *cobra.Command {
	var (
		clientName string
		name       string
		listen     string
		target     string
	)

	cmd := &cobra.Command{
		Use:   "add",
		Short: "Add a client tunnel",
		RunE: func(cmd *cobra.Command, _ []string) error {
			host, port, err := splitTarget(target)
			if err != nil {
				return err
			}
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.CreateTunnel(clientName, config.Tunnel{
				Name:       name,
				Listen:     listen,
				TargetHost: host,
				TargetPort: port,
			}); err != nil {
				return fmt.Errorf("add tunnel: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "tunnel added")
			return nil
		},
	}

	addClientNameFlag(cmd, &clientName)
	cmd.Flags().StringVar(&name, "name", "", "tunnel name")
	cmd.Flags().StringVar(&listen, "listen", "", "local listen address")
	cmd.Flags().StringVar(&target, "target", "", "target in host:port form")
	_ = cmd.MarkFlagRequired("name")
	_ = cmd.MarkFlagRequired("listen")
	_ = cmd.MarkFlagRequired("target")
	return cmd
}

func clientTunnelsUpdateCmd() *cobra.Command {
	var (
		clientName string
		listen     string
		target     string
	)

	cmd := &cobra.Command{
		Use:   "update <name>",
		Short: "Update an existing client tunnel",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			var patch config.Tunnel
			var update services.TunnelPatch

			if cmd.Flags().Changed("listen") {
				update.Listen = &listen
			}
			if cmd.Flags().Changed("target") {
				host, port, err := splitTarget(target)
				if err != nil {
					return err
				}
				patch.TargetHost = host
				patch.TargetPort = port
				update.TargetHost = &patch.TargetHost
				update.TargetPort = &patch.TargetPort
			}
			if update.Listen == nil && update.TargetHost == nil && update.TargetPort == nil {
				return fmt.Errorf("no tunnel fields provided")
			}

			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.UpdateTunnel(clientName, args[0], update); err != nil {
				return fmt.Errorf("update tunnel: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "tunnel updated")
			return nil
		},
	}

	addClientNameFlag(cmd, &clientName)
	cmd.Flags().StringVar(&listen, "listen", "", "local listen address")
	cmd.Flags().StringVar(&target, "target", "", "target in host:port form")
	return cmd
}

func clientTunnelsRmCmd() *cobra.Command {
	var clientName string
	cmd := &cobra.Command{
		Use:   "rm <name>",
		Short: "Remove a client tunnel",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.DeleteTunnel(clientName, args[0]); err != nil {
				return fmt.Errorf("remove tunnel: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "tunnel removed")
			return nil
		},
	}
	addClientNameFlag(cmd, &clientName)
	return cmd
}

func addClientNameFlag(cmd *cobra.Command, target *string) {
	cmd.Flags().StringVar(target, "client", "", "client profile name")
	_ = cmd.MarkFlagRequired("client")
}

func splitTarget(target string) (string, int, error) {
	host, portStr, err := net.SplitHostPort(target)
	if err != nil {
		return "", 0, fmt.Errorf("parse target %q: %w", target, err)
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return "", 0, fmt.Errorf("parse target port %q: %w", portStr, err)
	}
	if host == "" || port <= 0 || port > 65535 {
		return "", 0, fmt.Errorf("invalid target %q", target)
	}
	return host, port, nil
}
