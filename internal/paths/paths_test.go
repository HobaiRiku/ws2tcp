package paths

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

func TestResolveOverrideWins(t *testing.T) {
	t.Setenv(envHome, "/tmp/from-env")
	p, err := Resolve("/tmp/from-flag")
	if err != nil {
		t.Fatal(err)
	}
	if p.Home != "/tmp/from-flag" {
		t.Fatalf("override should win, got %q", p.Home)
	}
}

func TestResolveEnvBeatsHome(t *testing.T) {
	t.Setenv(envHome, "/tmp/from-env")
	p, err := Resolve("")
	if err != nil {
		t.Fatal(err)
	}
	if p.Home != "/tmp/from-env" {
		t.Fatalf("env should win when no override, got %q", p.Home)
	}
}

func TestEnsureTreeCreatesSubdirs(t *testing.T) {
	dir := t.TempDir()
	root := filepath.Join(dir, "ws2tcp-home")
	p, err := Resolve(root)
	if err != nil {
		t.Fatal(err)
	}
	if err := p.EnsureTree(); err != nil {
		t.Fatal(err)
	}
	for _, d := range []string{p.Certs(), p.Data(), p.Logs()} {
		st, err := os.Stat(d)
		if err != nil {
			t.Fatalf("missing %s: %v", d, err)
		}
		if !st.IsDir() {
			t.Fatalf("%s not a directory", d)
		}
		if st.Mode().Perm() != 0o700 {
			t.Fatalf("%s mode = %o, want 0700", d, st.Mode().Perm())
		}
	}
}

func TestResolveRelative(t *testing.T) {
	p := Paths{Home: "/srv/ws2tcp"}
	cases := map[string]string{
		"":               "",
		"certs/cert.pem": "/srv/ws2tcp/certs/cert.pem",
		"/etc/abs.pem":   "/etc/abs.pem",
	}
	for in, want := range cases {
		if got := p.ResolveRelative(in); got != want {
			t.Errorf("ResolveRelative(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestHomeDirMode(t *testing.T) {
	t.Run("user home stays private", func(t *testing.T) {
		p := Paths{Home: filepath.Join(t.TempDir(), "ws2tcp-home")}
		if got := p.homeDirMode(); got != 0o700 {
			t.Fatalf("homeDirMode() = %o, want 0700", got)
		}
	})

	t.Run("darwin system home is traversable", func(t *testing.T) {
		p := Paths{Home: SystemHome()}
		got := p.homeDirMode()
		if runtime.GOOS == "darwin" {
			if got != 0o770 {
				t.Fatalf("homeDirMode() = %o, want 0770", got)
			}
			return
		}
		if got != 0o700 {
			t.Fatalf("homeDirMode() = %o, want 0700", got)
		}
	})
}

func TestFileMode(t *testing.T) {
	t.Run("user home file mode is private", func(t *testing.T) {
		p := Paths{Home: filepath.Join(t.TempDir(), "ws2tcp-home")}
		if got := p.FileMode(); got != 0o600 {
			t.Fatalf("FileMode() = %o, want 0600", got)
		}
	})

	t.Run("darwin system home file mode allows admin group", func(t *testing.T) {
		p := Paths{Home: SystemHome()}
		got := p.FileMode()
		if runtime.GOOS == "darwin" {
			if got != 0o660 {
				t.Fatalf("FileMode() = %o, want 0660", got)
			}
			return
		}
		if got != 0o600 {
			t.Fatalf("FileMode() = %o, want 0600", got)
		}
	})
}
