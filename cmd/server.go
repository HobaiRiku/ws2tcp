package cmd

import (
	"fmt"
	"strings"
	"text/tabwriter"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

func serverCmd() *cobra.Command {
	server := &cobra.Command{
		Use:   "server",
		Short: "Manage server-side clients and ACLs",
	}
	server.AddCommand(
		serverClientsCmd(),
		serverACLCmd(),
	)
	return server
}

func serverClientsCmd() *cobra.Command {
	clients := &cobra.Command{
		Use:   "clients",
		Short: "Manage server-side client identities",
	}
	clients.AddCommand(
		serverClientsListCmd(),
		serverClientsAddCmd(),
		serverClientsUpdateCmd(),
		serverClientsRmCmd(),
	)
	return clients
}

func serverClientsListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List configured server-side clients",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			tw := tabwriter.NewWriter(cmd.OutOrStdout(), 0, 2, 2, ' ', 0)
			_, _ = fmt.Fprintln(tw, "ID\tACL_RULES")
			for _, client := range reg.Identities() {
				_, _ = fmt.Fprintf(tw, "%s\t%d\n", client.ID, len(client.ACL))
			}
			return tw.Flush()
		},
	}
}

func serverClientsAddCmd() *cobra.Command {
	var (
		id     string
		secret string
		acl    []string
	)

	cmd := &cobra.Command{
		Use:   "add",
		Short: "Add a server-side client identity",
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
				return fmt.Errorf("add server client: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server client added")
			return nil
		},
	}

	cmd.Flags().StringVar(&id, "id", "", "client id")
	cmd.Flags().StringVar(&secret, "secret", "", "client secret")
	cmd.Flags().StringArrayVar(&acl, "acl", nil, "ACL rule in cidr:port[,port...] form")
	_ = cmd.MarkFlagRequired("id")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func serverClientsUpdateCmd() *cobra.Command {
	var (
		secret string
		acl    []string
	)

	cmd := &cobra.Command{
		Use:   "update <id>",
		Short: "Update a server-side client identity",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
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
			if patch.Secret == nil && patch.ACL == nil {
				return fmt.Errorf("no client fields provided")
			}

			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.UpdateClient(args[0], patch); err != nil {
				return fmt.Errorf("update server client: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server client updated")
			return nil
		},
	}

	cmd.Flags().StringVar(&secret, "secret", "", "new client secret")
	cmd.Flags().StringArrayVar(&acl, "acl", nil, "replacement ACL rules in cidr:port[,port...] form")
	return cmd
}

func serverClientsRmCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "rm <id>",
		Short: "Remove a server-side client identity",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.DeleteClient(args[0]); err != nil {
				return fmt.Errorf("remove server client: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "server client removed")
			return nil
		},
	}
}

func serverACLCmd() *cobra.Command {
	acl := &cobra.Command{
		Use:   "acl",
		Short: "Manage server-side ACLs",
	}
	acl.AddCommand(&cobra.Command{
		Use:   "set <id> <rule> [rule...]",
		Short: "Replace a client's ACL with compact cidr:port[,port...] rules",
		Args:  cobra.MinimumNArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			rules, err := parseACLSpecs(args[1:])
			if err != nil {
				return err
			}
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.SetClientACL(args[0], rules); err != nil {
				return fmt.Errorf("set client acl: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "client acl updated")
			return nil
		},
	})
	return acl
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
