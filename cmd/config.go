package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
)

func configCmd() *cobra.Command {
	config := &cobra.Command{
		Use:   "config",
		Short: "Inspect and mutate config.yaml",
	}
	config.AddCommand(
		configShowCmd(),
		configPathCmd(),
		configSetCmd(),
		configClientAuthCmd(),
		configTokenCmd(),
	)
	return config
}

func configShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show",
		Short: "Print the raw config.yaml",
		RunE: func(cmd *cobra.Command, _ []string) error {
			p, err := paths.Resolve(rootFlags.Home)
			if err != nil {
				return err
			}
			raw, err := os.ReadFile(p.Config())
			if err != nil {
				return fmt.Errorf("read config: %w", err)
			}
			_, _ = fmt.Fprint(cmd.OutOrStdout(), string(raw))
			return nil
		},
	}
}

func configPathCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "path",
		Short: "Print the absolute config.yaml path",
		RunE: func(cmd *cobra.Command, _ []string) error {
			p, err := paths.Resolve(rootFlags.Home)
			if err != nil {
				return err
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), p.Config())
			return nil
		},
	}
}

func configSetCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "set <dotted.key> <value>",
		Short: "Update an existing scalar config value",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.SetConfigValue(args[0], args[1]); err != nil {
				return fmt.Errorf("set config value: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "config updated")
			return nil
		},
	}
}

func configClientAuthCmd() *cobra.Command {
	clientAuth := &cobra.Command{
		Use:   "client-auth",
		Short: "Manage named client authentication settings",
	}
	clientAuth.AddCommand(configClientAuthSetCmd())
	return clientAuth
}

func configClientAuthSetCmd() *cobra.Command {
	var (
		clientName   string
		clientID     string
		clientSecret string
	)

	cmd := &cobra.Command{
		Use:   "set",
		Short: "Update one client profile's client_id and client_secret",
		RunE: func(cmd *cobra.Command, _ []string) error {
			reg, err := loadRegistry()
			if err != nil {
				return err
			}
			if err := reg.SetClientCredentials(clientName, clientID, clientSecret); err != nil {
				return fmt.Errorf("set client auth: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "client auth updated")
			return nil
		},
	}

	cmd.Flags().StringVar(&clientName, "client", "", "client profile name")
	cmd.Flags().StringVar(&clientID, "client-id", "", "shared client id")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "shared client secret")
	_ = cmd.MarkFlagRequired("client")
	_ = cmd.MarkFlagRequired("client-id")
	_ = cmd.MarkFlagRequired("client-secret")
	return cmd
}

func configTokenCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "token",
		Short: "Print the current HTTP management API token",
		RunE: func(cmd *cobra.Command, _ []string) error {
			cfg, err := loadConfig()
			if err != nil {
				return err
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), cfg.App.HTTPToken)
			return nil
		},
	}
}
