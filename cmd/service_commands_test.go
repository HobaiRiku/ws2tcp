package cmd

import (
	"bytes"
	"errors"
	"testing"

	kservice "github.com/kardianos/service"
)

func TestServiceLifecycleCommands(t *testing.T) {
	t.Run("install uses root home and scope", func(t *testing.T) {
		var gotHome, gotScope string
		restore := swapInstall(func(home, scope string) (string, error) {
			gotHome = home
			gotScope = scope
			return "/mock/bin/ws2tcp", nil
		})
		defer restore()

		out, err := executeRoot(t, "--system", "--home", "/tmp/ws2tcp-home", "install")
		if err != nil {
			t.Fatalf("install returned error: %v", err)
		}
		if gotHome != "/tmp/ws2tcp-home" {
			t.Fatalf("install got home %q", gotHome)
		}
		if gotScope == "" {
			t.Fatal("install scope must not be empty")
		}
		if out != "service installed scope=system home=/tmp/ws2tcp-home bin=/mock/bin/ws2tcp\n" {
			t.Fatalf("unexpected output %q", out)
		}
	})

	t.Run("start reports wrapped error", func(t *testing.T) {
		restore := swapStart(func(string, string) error {
			return errors.New("boom")
		})
		defer restore()

		_, err := executeRoot(t, "--system", "--home", "/tmp/ws2tcp-home", "start")
		if err == nil || err.Error() != "start service scope=system home=/tmp/ws2tcp-home: boom" {
			t.Fatalf("unexpected error: %v", err)
		}
	})

	t.Run("stop prints success", func(t *testing.T) {
		restore := swapStop(func(string, string) error { return nil })
		defer restore()

		out, err := executeRoot(t, "--system", "--home", "/tmp/ws2tcp-home", "stop")
		if err != nil {
			t.Fatalf("stop returned error: %v", err)
		}
		if out != "service stopped scope=system home=/tmp/ws2tcp-home\n" {
			t.Fatalf("unexpected output %q", out)
		}
	})

	t.Run("uninstall prints success", func(t *testing.T) {
		restore := swapUninstall(func(string, string) error { return nil })
		defer restore()

		out, err := executeRoot(t, "--system", "--home", "/tmp/ws2tcp-home", "uninstall")
		if err != nil {
			t.Fatalf("uninstall returned error: %v", err)
		}
		if out != "service uninstalled scope=system home=/tmp/ws2tcp-home\n" {
			t.Fatalf("unexpected output %q", out)
		}
	})

	t.Run("status prints mapped service status", func(t *testing.T) {
		restore := swapStatus(func(string, string) (kservice.Status, error) {
			return kservice.StatusRunning, nil
		})
		defer restore()

		out, err := executeRoot(t, "--system", "--home", "/tmp/ws2tcp-home", "status")
		if err != nil {
			t.Fatalf("status returned error: %v", err)
		}
		if out != "scope: system\nhome: /tmp/ws2tcp-home\nstatus: running\n" {
			t.Fatalf("unexpected output %q", out)
		}
	})
}

func executeRoot(t *testing.T, args ...string) (string, error) {
	t.Helper()
	rootFlags = struct {
		Home   string
		System bool
	}{}

	root := Root()
	var stdout bytes.Buffer
	root.SetOut(&stdout)
	root.SetErr(&stdout)
	root.SetArgs(args)
	err := root.Execute()
	return stdout.String(), err
}

func swapInstall(fn func(string, string) (string, error)) func() {
	prev := serviceInstall
	serviceInstall = fn
	return func() { serviceInstall = prev }
}

func swapStart(fn func(string, string) error) func() {
	prev := serviceStart
	serviceStart = fn
	return func() { serviceStart = prev }
}

func swapStop(fn func(string, string) error) func() {
	prev := serviceStop
	serviceStop = fn
	return func() { serviceStop = prev }
}

func swapUninstall(fn func(string, string) error) func() {
	prev := serviceUninstall
	serviceUninstall = fn
	return func() { serviceUninstall = prev }
}

func swapStatus(fn func(string, string) (kservice.Status, error)) func() {
	prev := serviceStatus
	serviceStatus = fn
	return func() { serviceStatus = prev }
}
