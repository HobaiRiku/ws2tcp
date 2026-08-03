//go:build !linux

package pid

import "time"

// procStartTime is a no-op on non-Linux platforms.
func procStartTime(pid int) (time.Time, bool) { return time.Time{}, false }
