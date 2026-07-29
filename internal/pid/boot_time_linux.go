//go:build linux

package pid

import (
	"time"

	"golang.org/x/sys/unix"
)

func systemBootTime() time.Time {
	var info unix.Sysinfo_t
	if err := unix.Sysinfo(&info); err != nil {
		return time.Time{}
	}
	return time.Now().Add(-time.Duration(info.Uptime) * time.Second)
}
