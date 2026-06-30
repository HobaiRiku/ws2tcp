//go:build !darwin

package service

func darwinBootout(_ string)              {}
func darwinBootstrap(_ string) error      { return nil }
func darwinKickstart(_ string) (bool, error) { return false, nil }
func darwinKill(_ string) (bool, error)      { return false, nil }
