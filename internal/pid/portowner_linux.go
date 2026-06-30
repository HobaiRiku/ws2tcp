//go:build linux

package pid

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

const tcpStateListen = "0A"

// FindPortOwner returns the PID of the process that is currently listening on
// the given TCP port, or 0 if the owner cannot be determined. It inspects
// /proc/net/tcp and /proc/net/tcp6 to find the socket inode and then scans
// /proc/*/fd symlinks to map the inode back to a PID.
func FindPortOwner(port int) int {
	portHex := fmt.Sprintf("%04X", port)
	for _, procNetPath := range []string{"/proc/net/tcp", "/proc/net/tcp6"} {
		if inode := findInodeForPort(procNetPath, portHex); inode != 0 {
			if pid := findPIDForInode(inode); pid != 0 {
				return pid
			}
		}
	}
	return 0
}

// findInodeForPort parses a /proc/net/tcp[6] file and returns the socket
// inode for a LISTEN entry matching portHex (uppercase 4-hex-digit string).
func findInodeForPort(path, portHex string) uint64 {
	f, err := os.Open(path)
	if err != nil {
		return 0
	}
	defer f.Close()

	// portHex is already uppercase (formatted with %04X in FindPortOwner).
	sc := bufio.NewScanner(f)
	sc.Scan() // skip header line
	for sc.Scan() {
		fields := strings.Fields(sc.Text())
		// Expected columns: sl local_address rem_address st tx:rx tr:when retrans uid timeout inode …
		if len(fields) < 10 {
			continue
		}
		localAddr := fields[1] // "XXXXXXXX:PPPP"
		state := fields[3]
		inodeStr := fields[9]

		if state != tcpStateListen {
			continue
		}
		// The port is the hex value after the last ':' in local_address.
		colon := strings.LastIndex(localAddr, ":")
		if colon < 0 || localAddr[colon+1:] != portHex {
			continue
		}
		inode, err := strconv.ParseUint(inodeStr, 10, 64)
		if err != nil {
			continue
		}
		return inode
	}
	return 0
}

// findPIDForInode walks /proc/[0-9]*/fd looking for a symlink that resolves
// to "socket:[inode]".
func findPIDForInode(inode uint64) int {
	target := fmt.Sprintf("socket:[%d]", inode)
	// Glob only numeric PID directories to skip non-process entries.
	fdDirs, err := filepath.Glob("/proc/[0-9]*/fd")
	if err != nil {
		return 0
	}
	for _, fdDir := range fdDirs {
		entries, err := os.ReadDir(fdDir)
		if err != nil {
			continue
		}
		for _, e := range entries {
			link, err := os.Readlink(filepath.Join(fdDir, e.Name()))
			if err != nil {
				continue
			}
			if link != target {
				continue
			}
			// fdDir is "/proc/<PID>/fd"
			parts := strings.Split(fdDir, string(filepath.Separator))
			// parts: ["", "proc", "<PID>", "fd"]
			if len(parts) >= 3 {
				if p, err := strconv.Atoi(parts[2]); err == nil {
					return p
				}
			}
		}
	}
	return 0
}
