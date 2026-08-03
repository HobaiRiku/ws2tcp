//go:build !linux

package pid

// FindPortOwner returns the PID listening on the given TCP port.
// On non-Linux platforms this always returns 0 (unknown); per-port attribution
// is not supported without shelling out to lsof/netstat.
func FindPortOwner(_ int) int {
	return 0
}
