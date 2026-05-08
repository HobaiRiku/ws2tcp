package cmd

import (
	"fmt"
	"net"
	"strconv"

	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

type tunnelView struct {
	Client   string `yaml:"client"`
	Endpoint string `yaml:"endpoint"`
	Name     string `yaml:"name"`
	Listen   string `yaml:"listen"`
	Target   string `yaml:"target"`
}

func tunnelCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "tunnel",
		Short: "Manage client tunnels",
	}
	cmd.AddCommand(
		tunnelListCmd(),
		tunnelShowCmd(),
		tunnelCreateCmd(),
		tunnelUpdateCmd(),
		tunnelDeleteCmd(),
	)
	return cmd
}

func tunnelListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List all configured tunnels",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			tw := newTable(cmd)
			tw.AppendHeader(table.Row{"CLIENT", "ENDPOINT", "NAME", "LISTEN", "TARGET"})
			for _, profile := range reg.ClientProfiles() {
				for _, tunnel := range profile.Tunnels {
					tw.AppendRow(table.Row{
						tableString(profile.Name),
						tableString(profile.Endpoint),
						tableString(tunnel.Name),
						tableString(tunnel.Listen),
						fmt.Sprintf("%s:%d", tableString(tunnel.TargetHost), tunnel.TargetPort),
					})
				}
			}
			tw.Render()
			return nil
		},
	}
}

func tunnelShowCmd() *cobra.Command {
	var clientName string

	cmd := &cobra.Command{
		Use:   "show <name>",
		Short: "Show one tunnel",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			profile, err := reg.FindClientProfile(clientName)
			if err != nil {
				return err
			}
			tunnel, err := reg.FindTunnel(clientName, args[0])
			if err != nil {
				return err
			}
			return printYAML(cmd, tunnelView{
				Client:   clientName,
				Endpoint: profile.Endpoint,
				Name:     tunnel.Name,
				Listen:   tunnel.Listen,
				Target:   fmt.Sprintf("%s:%d", tunnel.TargetHost, tunnel.TargetPort),
			})
		},
	}

	addClientNameFlag(cmd, &clientName)
	return cmd
}

func tunnelCreateCmd() *cobra.Command {
	var (
		clientName string
		name       string
		listen     string
		target     string
	)

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a tunnel",
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
				return fmt.Errorf("create tunnel: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "tunnel created")
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

func tunnelUpdateCmd() *cobra.Command {
	var (
		clientName string
		listen     string
		target     string
	)

	cmd := &cobra.Command{
		Use:   "update <name>",
		Short: "Update one tunnel",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := requireChangedFlags(cmd, "listen", "target"); err != nil {
				return err
			}

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
	cmd.Flags().StringVar(&listen, "listen", "", "replacement local listen address")
	cmd.Flags().StringVar(&target, "target", "", "replacement target in host:port form")
	return cmd
}

func tunnelDeleteCmd() *cobra.Command {
	var clientName string

	cmd := &cobra.Command{
		Use:   "delete <name>",
		Short: "Delete one tunnel",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.DeleteTunnel(clientName, args[0]); err != nil {
				return fmt.Errorf("delete tunnel: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "tunnel deleted")
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
