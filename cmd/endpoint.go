package cmd

import (
	"fmt"

	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

func endpointCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "endpoint",
		Short: "Manage reusable client endpoints",
	}
	cmd.AddCommand(
		endpointListCmd(),
		endpointShowCmd(),
		endpointCreateCmd(),
		endpointUpdateCmd(),
		endpointDeleteCmd(),
	)
	return cmd
}

func endpointListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List configured endpoints",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			tw := newTable(cmd)
			tw.AppendHeader(table.Row{"NAME", "HOST", "IP", "PORT", "PATH", "WSS", "VERIFY_TLS"})
			for _, ep := range reg.Endpoints() {
				tw.AppendRow(table.Row{
					tableString(ep.Name),
					tableString(ep.Host),
					tableString(ep.IP),
					ep.Port,
					tableString(ep.Path),
					ep.WSS,
					ep.SSLRejectUnauthorized,
				})
			}
			tw.Render()
			return nil
		},
	}
}

func endpointShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show <name>",
		Short: "Show one endpoint",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			ep, err := reg.FindEndpoint(args[0])
			if err != nil {
				return err
			}
			return printYAML(cmd, ep)
		},
	}
}

func endpointCreateCmd() *cobra.Command {
	var (
		name                  string
		host                  string
		ip                    string
		port                  int
		path                  string
		wss                   bool
		aesKey                string
		sslRejectUnauthorized bool
	)

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create an endpoint",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if host == "" && ip == "" {
				return fmt.Errorf("endpoint host or ip is required")
			}
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.CreateEndpoint(config.Endpoint{
				Name:                  name,
				Host:                  host,
				IP:                    ip,
				Port:                  port,
				Path:                  path,
				WSS:                   wss,
				AESKey:                aesKey,
				SSLRejectUnauthorized: sslRejectUnauthorized,
			}); err != nil {
				return fmt.Errorf("create endpoint: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "endpoint created")
			return nil
		},
	}

	cmd.Flags().StringVar(&name, "name", "", "endpoint name")
	cmd.Flags().StringVar(&host, "host", "", "endpoint host or SNI")
	cmd.Flags().StringVar(&ip, "ip", "", "direct dial IP override")
	cmd.Flags().IntVar(&port, "port", 0, "endpoint port")
	cmd.Flags().StringVar(&path, "path", "", "websocket path")
	cmd.Flags().BoolVar(&wss, "wss", false, "use WSS when dialing upstream")
	cmd.Flags().StringVar(&aesKey, "aes-key", "", "32-byte shared AES key")
	cmd.Flags().BoolVar(&sslRejectUnauthorized, "ssl-reject-unauthorized", false, "verify upstream TLS certificate")
	_ = cmd.MarkFlagRequired("name")
	_ = cmd.MarkFlagRequired("port")
	_ = cmd.MarkFlagRequired("path")
	_ = cmd.MarkFlagRequired("aes-key")
	return cmd
}

func endpointUpdateCmd() *cobra.Command {
	var (
		host                  string
		ip                    string
		port                  int
		path                  string
		wss                   bool
		aesKey                string
		sslRejectUnauthorized bool
	)

	cmd := &cobra.Command{
		Use:   "update <name>",
		Short: "Update one endpoint",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := requireChangedFlags(cmd, "host", "ip", "port", "path", "wss", "aes-key", "ssl-reject-unauthorized"); err != nil {
				return err
			}

			var patch services.EndpointPatch
			if cmd.Flags().Changed("host") {
				patch.Host = &host
			}
			if cmd.Flags().Changed("ip") {
				patch.IP = &ip
			}
			if cmd.Flags().Changed("port") {
				patch.Port = &port
			}
			if cmd.Flags().Changed("path") {
				patch.Path = &path
			}
			if cmd.Flags().Changed("wss") {
				patch.WSS = &wss
			}
			if cmd.Flags().Changed("aes-key") {
				patch.AESKey = &aesKey
			}
			if cmd.Flags().Changed("ssl-reject-unauthorized") {
				patch.SSLRejectUnauthorized = &sslRejectUnauthorized
			}

			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.UpdateEndpoint(args[0], patch); err != nil {
				return fmt.Errorf("update endpoint: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "endpoint updated")
			return nil
		},
	}

	cmd.Flags().StringVar(&host, "host", "", "replacement endpoint host or SNI")
	cmd.Flags().StringVar(&ip, "ip", "", "replacement direct dial IP override")
	cmd.Flags().IntVar(&port, "port", 0, "replacement endpoint port")
	cmd.Flags().StringVar(&path, "path", "", "replacement websocket path")
	cmd.Flags().BoolVar(&wss, "wss", false, "use WSS when dialing upstream")
	cmd.Flags().StringVar(&aesKey, "aes-key", "", "replacement 32-byte shared AES key")
	cmd.Flags().BoolVar(&sslRejectUnauthorized, "ssl-reject-unauthorized", false, "verify upstream TLS certificate")
	return cmd
}

func endpointDeleteCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "delete <name>",
		Short: "Delete one endpoint",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.DeleteEndpoint(args[0]); err != nil {
				return fmt.Errorf("delete endpoint: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "endpoint deleted")
			return nil
		},
	}
}
