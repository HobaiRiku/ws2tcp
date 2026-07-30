//go:build linux

package pid

import (
	"fmt"
	"os"
	"time"
)

// procStartTime returns the procfs directory timestamp for pid, which tracks
// when the kernel created the process entry. Returns zero, false on failure.
func procStartTime(pid int) (time.Time, bool) {
	info, err := os.Stat(fmt.Sprintf("/proc/%d", pid))
	if err != nil {
		return time.Time{}, false
	}
	start := info.ModTime()
	if start.IsZero() {
		return time.Time{}, false
	}
	return start, true
}
