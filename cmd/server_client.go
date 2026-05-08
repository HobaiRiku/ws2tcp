package cmd

import (
	"fmt"
	"strings"

	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

func serverClientCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "server-client",
		Short: "Manage server-side client identities",
	}
	cmd.AddCommand(
		serverClientListCmd(),
		serverClientShowCmd(),
		serverClientCreateCmd(),
		serverClientUpdateCmd(),
		serverClientDeleteCmd(),
	)
	return cmd
}

func serverClientListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List configured server-side clients",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			tw := newTable(cmd)
			tw.AppendHeader(table.Row{"ID", "ACL_RULES"})
			for _, client := range reg.Identities() {
				tw.AppendRow(table.Row{tableString(client.ID), len(client.ACL)})
			}
			tw.Render()
			return nil
		},
	}
}

func serverClientShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show <id>",
		Short: "Show one server-side client",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := loadConfig()
			if err != nil {
				return err
			}
			client, err := findServerClient(cfg, args[0])
			if err != nil {
				return err
			}
			return printYAML(cmd, client)
		},
	}
}

func serverClientCreateCmd() *cobra.Command {
	var (
		id     string
		secret string
		acl    []string
	)

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a server-side client",
		RunE: func(cmd *cobra.Command, _ []string) error {
			rules, err := parseACLSpecs(acl)
			if err != nil {
				return err
			}
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.CreateClient(config.ClientIdentity{
				ID:     id,
				Secret: secret,
				ACL:    rules,
			}); err != nil {
				return fmt.Errorf("create server client: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server-client created")
			return nil
		},
	}

	cmd.Flags().StringVar(&id, "id", "", "server-side client ID")
	cmd.Flags().StringVar(&secret, "secret", "", "server-side client secret")
	cmd.Flags().StringArrayVar(&acl, "acl", nil, "ACL rule in cidr:port[,port...] form")
	_ = cmd.MarkFlagRequired("id")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func serverClientUpdateCmd() *cobra.Command {
	var (
		secret string
		acl    []string
	)

	cmd := &cobra.Command{
		Use:   "update <id>",
		Short: "Update one server-side client",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := requireChangedFlags(cmd, "secret", "acl"); err != nil {
				return err
			}

			var patch services.ClientPatch
			if cmd.Flags().Changed("secret") {
				patch.Secret = &secret
			}
			if cmd.Flags().Changed("acl") {
				rules, err := parseACLSpecs(acl)
				if err != nil {
					return err
				}
				patch.ACL = &rules
			}

			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.UpdateClient(args[0], patch); err != nil {
				return fmt.Errorf("update server client: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server-client updated")
			return nil
		},
	}

	cmd.Flags().StringVar(&secret, "secret", "", "replacement client secret")
	cmd.Flags().StringArrayVar(&acl, "acl", nil, "replacement ACL rules in cidr:port[,port...] form")
	return cmd
}

func serverClientDeleteCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "delete <id>",
		Short: "Delete one server-side client",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.DeleteClient(args[0]); err != nil {
				return fmt.Errorf("delete server client: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server-client deleted")
			return nil
		},
	}
}

func parseACLSpecs(specs []string) ([]config.ACLRule, error) {
	out := make([]config.ACLRule, 0, len(specs))
	for _, spec := range specs {
		parts := strings.SplitN(spec, ":", 2)
		if len(parts) != 2 || strings.TrimSpace(parts[0]) == "" || strings.TrimSpace(parts[1]) == "" {
			return nil, fmt.Errorf("invalid acl rule %q", spec)
		}
		ports := strings.Split(parts[1], ",")
		for i := range ports {
			ports[i] = strings.TrimSpace(ports[i])
		}
		out = append(out, config.ACLRule{
			CIDR:  strings.TrimSpace(parts[0]),
			Ports: ports,
		})
	}
	return out, nil
}
