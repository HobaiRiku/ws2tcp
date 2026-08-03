//go:build darwin

package pid

import (
	"time"

	"golang.org/x/sys/unix"
)

func systemBootTime() time.Time {
	tv, err := unix.SysctlTimeval("kern.boottime")
	if err != nil {
		return time.Time{}
	}
	// time.Unix takes seconds plus nanoseconds; kern.boottime reports tv.Usec
	// in microseconds, so convert usec -> nsec with *1000.
	return time.Unix(int64(tv.Sec), int64(tv.Usec)*1000)
}
