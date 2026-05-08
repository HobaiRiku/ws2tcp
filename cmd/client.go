package cmd

import (
	"fmt"

	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
)

func clientCmd() *cobra.Command {
	client := &cobra.Command{
		Use:   "client",
		Short: "Manage client profiles",
	}
	client.AddCommand(
		clientListCmd(),
		clientShowCmd(),
		clientCreateCmd(),
		clientUpdateCmd(),
		clientDeleteCmd(),
	)
	return client
}

func clientListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List configured client profiles",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			tw := newTable(cmd)
			tw.AppendHeader(table.Row{"NAME", "ENDPOINT", "CLIENT_ID", "TUNNELS"})
			for _, profile := range reg.ClientProfiles() {
				tw.AppendRow(table.Row{
					tableString(profile.Name),
					tableString(profile.Endpoint),
					tableString(profile.ClientID),
					len(profile.Tunnels),
				})
			}
			tw.Render()
			return nil
		},
	}
}

func clientShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show <name>",
		Short: "Show one client profile",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			profile, err := reg.FindClientProfile(args[0])
			if err != nil {
				return err
			}
			return printYAML(cmd, profile)
		},
	}
}

func clientCreateCmd() *cobra.Command {
	var (
		name         string
		endpoint     string
		clientID     string
		clientSecret string
	)

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a client profile",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.CreateClientProfile(config.ClientProfile{
				Name:         name,
				Endpoint:     endpoint,
				ClientID:     clientID,
				ClientSecret: clientSecret,
			}); err != nil {
				return fmt.Errorf("create client profile: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "client created")
			return nil
		},
	}

	cmd.Flags().StringVar(&name, "name", "", "client profile name")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "referenced endpoint name")
	cmd.Flags().StringVar(&clientID, "client-id", "", "shared client ID")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "shared client secret")
	_ = cmd.MarkFlagRequired("name")
	_ = cmd.MarkFlagRequired("endpoint")
	_ = cmd.MarkFlagRequired("client-id")
	_ = cmd.MarkFlagRequired("client-secret")
	return cmd
}

func clientUpdateCmd() *cobra.Command {
	var (
		endpoint     string
		clientID     string
		clientSecret string
	)

	cmd := &cobra.Command{
		Use:   "update <name>",
		Short: "Update one client profile",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := requireChangedFlags(cmd, "endpoint", "client-id", "client-secret"); err != nil {
				return err
			}

			var patch services.ClientProfilePatch
			if cmd.Flags().Changed("endpoint") {
				patch.Endpoint = &endpoint
			}
			if cmd.Flags().Changed("client-id") {
				patch.ClientID = &clientID
			}
			if cmd.Flags().Changed("client-secret") {
				patch.ClientSecret = &clientSecret
			}

			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.UpdateClientProfile(args[0], patch); err != nil {
				return fmt.Errorf("update client profile: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "client updated")
			return nil
		},
	}

	cmd.Flags().StringVar(&endpoint, "endpoint", "", "replacement endpoint name")
	cmd.Flags().StringVar(&clientID, "client-id", "", "replacement client ID")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "replacement client secret")
	return cmd
}

func clientDeleteCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "delete <name>",
		Short: "Delete one client profile",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.DeleteClientProfile(args[0]); err != nil {
				return fmt.Errorf("delete client profile: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "client deleted")
			return nil
		},
	}
}
