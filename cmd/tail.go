package cmd

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"sort"
	"strings"
	"syscall"
	"time"

	"github.com/spf13/cobra"

	applog "websocket2Tcp/internal/log"
)

type tailOptions struct {
	lines     int
	follow    bool
	level     string
	client    string
	clientID  string
	tunnel    string
	component string
}

var defaultHTTPClient = &http.Client{Timeout: 15 * time.Second}

func tailCmd() *cobra.Command {
	opts := tailOptions{}
	cmd := &cobra.Command{
		Use:   "tail",
		Short: "Show recent process logs and follow new entries",
		RunE: func(cmd *cobra.Command, _ []string) error {
			cfg, err := loadConfig()
			if err != nil {
				return err
			}
			baseURL, err := managementBaseURL(cfg.App.HTTPListen)
			if err != nil {
				return err
			}

			filters := buildTailQuery(opts)
			records, err := fetchRecentLogs(cmd.Context(), baseURL, cfg.App.HTTPToken, filters, opts.lines)
			if err != nil {
				return err
			}
			for _, rec := range records {
				_, _ = fmt.Fprintln(cmd.OutOrStdout(), formatLogRecord(rec))
			}
			if !opts.follow {
				return nil
			}

			ctx, stop := signal.NotifyContext(cmd.Context(), os.Interrupt, syscall.SIGTERM)
			defer stop()
			return streamLogs(ctx, cmd.OutOrStdout(), baseURL, cfg.App.HTTPToken, opts)
		},
	}
	cmd.Flags().IntVarP(&opts.lines, "lines", "n", 10, "number of recent log lines to print before following")
	cmd.Flags().BoolVar(&opts.follow, "follow", true, "keep streaming new log entries")
	cmd.Flags().StringVar(&opts.level, "level", "", "filter by log level prefix")
	cmd.Flags().StringVar(&opts.client, "client", "", "filter by client profile name")
	cmd.Flags().StringVar(&opts.clientID, "client-id", "", "filter by server client id")
	cmd.Flags().StringVar(&opts.tunnel, "tunnel", "", "filter by tunnel name")
	cmd.Flags().StringVar(&opts.component, "component", "", "filter by component")
	return cmd
}

func buildTailQuery(opts tailOptions) url.Values {
	values := url.Values{}
	if value := strings.TrimSpace(opts.level); value != "" {
		values.Set("level", value)
	}
	if value := strings.TrimSpace(opts.client); value != "" {
		values.Set("client", value)
	}
	if value := strings.TrimSpace(opts.clientID); value != "" {
		values.Set("client_id", value)
	}
	if value := strings.TrimSpace(opts.tunnel); value != "" {
		values.Set("tunnel", value)
	}
	if value := strings.TrimSpace(opts.component); value != "" {
		values.Set("component", value)
	}
	return values
}

func fetchRecentLogs(ctx context.Context, baseURL, token string, filters url.Values, lines int) ([]applog.Record, error) {
	query := cloneValues(filters)
	query.Set("limit", fmt.Sprintf("%d", lines))
	endpoint := baseURL + "/api/logs/recent"
	if encoded := query.Encode(); encoded != "" {
		endpoint += "?" + encoded
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	authorizeRequest(req, token)

	resp, err := defaultHTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request recent logs: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, readHTTPError("request recent logs", resp)
	}

	var payload struct {
		Records []applog.Record `json:"records"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return nil, fmt.Errorf("decode recent logs: %w", err)
	}
	return payload.Records, nil
}

func streamLogs(ctx context.Context, out io.Writer, baseURL, token string, opts tailOptions) error {
	query := url.Values{}
	query.Set("topic", "log")
	endpoint := baseURL + "/api/events/stream?" + query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return err
	}
	authorizeRequest(req, token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("open log stream: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return readHTTPError("open log stream", resp)
	}

	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	var (
		eventName string
		dataLines []string
	)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			if err := handleSSERecord(out, eventName, dataLines, opts); err != nil {
				return err
			}
			eventName = ""
			dataLines = nil
			continue
		}
		switch {
		case strings.HasPrefix(line, "event:"):
			eventName = strings.TrimSpace(strings.TrimPrefix(line, "event:"))
		case strings.HasPrefix(line, "data:"):
			dataLines = append(dataLines, strings.TrimSpace(strings.TrimPrefix(line, "data:")))
		}
	}
	if err := scanner.Err(); err != nil && ctx.Err() == nil {
		return fmt.Errorf("read log stream: %w", err)
	}
	return nil
}

func handleSSERecord(out io.Writer, eventName string, dataLines []string, opts tailOptions) error {
	if len(dataLines) == 0 {
		return nil
	}
	if eventName != "" && eventName != "log" {
		return nil
	}

	var payload struct {
		Topic string `json:"topic"`
		Time  string `json:"time"`
		Data  struct {
			Level   string         `json:"level"`
			Message string         `json:"message"`
			Attrs   map[string]any `json:"attrs"`
		} `json:"data"`
	}
	if err := json.Unmarshal([]byte(strings.Join(dataLines, "\n")), &payload); err != nil {
		return fmt.Errorf("decode log event: %w", err)
	}

	rec := applog.Record{
		Level:   payload.Data.Level,
		Message: payload.Data.Message,
		Attrs:   payload.Data.Attrs,
	}
	if payload.Time != "" {
		if ts, err := time.Parse(time.RFC3339Nano, payload.Time); err == nil {
			rec.Time = ts
		}
	}
	if !matchesTailRecord(rec, opts) {
		return nil
	}
	_, err := fmt.Fprintln(out, formatLogRecord(rec))
	return err
}

func matchesTailRecord(rec applog.Record, opts tailOptions) bool {
	if value := strings.TrimSpace(opts.level); value != "" && !strings.HasPrefix(strings.ToUpper(rec.Level), strings.ToUpper(value)) {
		return false
	}
	want := map[string]string{
		"client":    strings.TrimSpace(opts.client),
		"client_id": strings.TrimSpace(opts.clientID),
		"tunnel":    strings.TrimSpace(opts.tunnel),
		"component": strings.TrimSpace(opts.component),
	}
	for key, value := range want {
		if value == "" {
			continue
		}
		if rec.Attrs == nil || fmt.Sprint(rec.Attrs[key]) != value {
			return false
		}
	}
	return true
}

func formatLogRecord(rec applog.Record) string {
	timestamp := "-"
	if !rec.Time.IsZero() {
		timestamp = rec.Time.Local().Format("2006-01-02 15:04:05")
	}
	line := fmt.Sprintf("%s %-5s %s", timestamp, strings.ToUpper(rec.Level), rec.Message)
	if attrs := formatAttrs(rec.Attrs); attrs != "" {
		line += " " + attrs
	}
	return line
}

func formatAttrs(attrs map[string]any) string {
	if len(attrs) == 0 {
		return ""
	}
	keys := make([]string, 0, len(attrs))
	for key := range attrs {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	parts := make([]string, 0, len(keys))
	for _, key := range keys {
		parts = append(parts, fmt.Sprintf("%s=%v", key, attrs[key]))
	}
	return strings.Join(parts, " ")
}

func managementBaseURL(listen string) (string, error) {
	host, port, err := net.SplitHostPort(strings.TrimSpace(listen))
	if err != nil {
		return "", fmt.Errorf("parse app.http_listen %q: %w", listen, err)
	}
	switch host {
	case "", "0.0.0.0":
		host = "127.0.0.1"
	case "::", "[::]":
		host = "::1"
	}
	return "http://" + net.JoinHostPort(host, port), nil
}

func authorizeRequest(req *http.Request, token string) {
	if strings.TrimSpace(token) != "" {
		req.Header.Set("Authorization", "Bearer "+strings.TrimSpace(token))
	}
}

func readHTTPError(action string, resp *http.Response) error {
	body, _ := io.ReadAll(io.LimitReader(resp.Body, 16*1024))
	text := strings.TrimSpace(string(body))
	if text == "" {
		text = resp.Status
	}
	return fmt.Errorf("%s: %s", action, text)
}

func cloneValues(values url.Values) url.Values {
	out := url.Values{}
	for key, vals := range values {
		copied := append([]string(nil), vals...)
		out[key] = copied
	}
	return out
}
