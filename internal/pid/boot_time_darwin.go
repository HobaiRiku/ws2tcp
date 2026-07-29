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
	// time.Unix expects nanoseconds in its second argument; kern.boottime
	// reports microseconds.
	return time.Unix(int64(tv.Sec), int64(tv.Usec)*1000)
}
