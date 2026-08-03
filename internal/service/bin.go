package service

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"

	"websocket2Tcp/internal/paths"
)

// BinDir returns the platform install directory for the given scope.
func BinDir(scope string) (string, error) {
	switch runtime.GOOS {
	case "windows":
		if scope == paths.ScopeSystem {
			if dir := os.Getenv("ProgramFiles"); dir != "" {
				return filepath.Join(dir, "ws2tcp"), nil
			}
			return `C:\Program Files\ws2tcp`, nil
		}
		if dir := os.Getenv("LOCALAPPDATA"); dir != "" {
			return filepath.Join(dir, "Programs", "ws2tcp"), nil
		}
		return `C:\Users\Default\AppData\Local\Programs\ws2tcp`, nil
	default:
		if scope == paths.ScopeSystem {
			return "/usr/local/bin", nil
		}
		home, err := os.UserHomeDir()
		if err != nil || home == "" {
			return "", fmt.Errorf("resolve user home: %w", err)
		}
		return filepath.Join(home, ".local", "bin"), nil
	}
}

// InstallBin copies the running executable into destDir atomically.
func InstallBin(destDir string) (string, error) {
	src, err := os.Executable()
	if err != nil {
		return "", fmt.Errorf("resolve current executable: %w", err)
	}
	src, err = filepath.Abs(src)
	if err != nil {
		return "", fmt.Errorf("resolve executable path: %w", err)
	}
	target := filepath.Join(destDir, filepath.Base(src))
	if samePath(src, target) {
		return target, nil
	}

	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return "", fmt.Errorf("create bin dir %s: %w", destDir, err)
	}

	in, err := os.Open(src)
	if err != nil {
		return "", fmt.Errorf("open source executable: %w", err)
	}
	defer in.Close()

	tmp, err := os.CreateTemp(destDir, filepath.Base(target)+".tmp-*")
	if err != nil {
		return "", fmt.Errorf("create temp binary: %w", err)
	}
	tmpPath := tmp.Name()
	keepTemp := false
	defer func() {
		if !keepTemp {
			_ = os.Remove(tmpPath)
		}
	}()

	if _, err := io.Copy(tmp, in); err != nil {
		_ = tmp.Close()
		return "", fmt.Errorf("copy executable: %w", err)
	}
	if err := tmp.Chmod(0o755); err != nil {
		_ = tmp.Close()
		return "", fmt.Errorf("chmod executable: %w", err)
	}
	if err := tmp.Sync(); err != nil {
		_ = tmp.Close()
		return "", fmt.Errorf("sync executable: %w", err)
	}
	if err := tmp.Close(); err != nil {
		return "", fmt.Errorf("close temp executable: %w", err)
	}
	if err := os.Rename(tmpPath, target); err != nil {
		return "", fmt.Errorf("install executable to %s: %w", target, err)
	}
	keepTemp = true
	return target, nil
}

// RemoveBin removes the installed executable from destDir best-effort.
func RemoveBin(destDir string) {
	src, err := os.Executable()
	if err != nil {
		return
	}
	_ = os.Remove(filepath.Join(destDir, filepath.Base(src)))
}

func samePath(a, b string) bool {
	aa, err := filepath.Abs(a)
	if err != nil {
		return false
	}
	bb, err := filepath.Abs(b)
	if err != nil {
		return false
	}
	return filepath.Clean(aa) == filepath.Clean(bb)
}
