//go:build linux

package pid

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"golang.org/x/sys/unix"
)

// procStartTime reads /proc/<pid>/stat and returns the process start time as
// an absolute time.Time (boot time + start_ticks / clk_tck). Returns zero,
// false on any failure.
func procStartTime(pid int) (time.Time, bool) {
	// Read /proc/<pid>/stat
	path := fmt.Sprintf("/proc/%d/stat", pid)
	f, err := os.Open(path)
	if err != nil {
		return time.Time{}, false
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	if !scanner.Scan() {
		return time.Time{}, false
	}
	line := scanner.Text()
	// stat format: pid (comm) rest...
	// find last ')' to skip comm which may contain spaces
	idx := strings.LastIndex(line, ")")
	if idx < 0 || idx+2 >= len(line) {
		return time.Time{}, false
	}
	after := line[idx+2:]
	parts := strings.Fields(after)
	// starttime is the 22nd field overall, which becomes parts[19]
	if len(parts) < 20 {
		return time.Time{}, false
	}
	startTicksStr := parts[19]
	startTicks, err := strconv.ParseUint(startTicksStr, 10, 64)
	if err != nil {
		return time.Time{}, false
	}
	// get clk ticks per second
	ticks, err := unix.Sysconf(unix._SC_CLK_TCK)
	if err != nil || ticks <= 0 {
		return time.Time{}, false
	}
	boot := bootTimeNow()
	if boot.IsZero() {
		return time.Time{}, false
	}
	secs := float64(startTicks) / float64(ticks)
	start := boot.Add(time.Duration(secs * float64(time.Second)))
	return start, true
}
