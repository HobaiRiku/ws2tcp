//go:build !darwin && !linux

package pid

import "time"

func systemBootTime() time.Time {
	return time.Time{}
}
