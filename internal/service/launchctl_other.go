//go:build !darwin

package service

import kservice "github.com/kardianos/service"

func darwinBootout(_ string)                 {}
func darwinBootstrap(_ string) error         { return nil }
func darwinKickstart(_ string) (bool, error) { return false, nil }
func darwinKill(_ string) (bool, error)      { return false, nil }
func darwinStatus(_ string) (bool, kservice.Status, error) {
	return false, kservice.StatusUnknown, nil
}
