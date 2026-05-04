package services

import (
	"errors"
	"testing"
)

func TestAuthServiceVerifyToken(t *testing.T) {
	auth := NewAuthService(func() string { return "fixed-token" })

	info, err := auth.VerifyToken("fixed-token", TokenScopeRead)
	if err != nil {
		t.Fatal(err)
	}
	if info.Name != "configured-token" || len(info.Scopes) != 1 || info.Scopes[0] != TokenScopeAdmin {
		t.Fatalf("unexpected auth info: %#v", info)
	}

	if _, err := auth.VerifyToken("wrong-token", TokenScopeRead); !errors.Is(err, ErrTokenUnauthorized) {
		t.Fatalf("expected unauthorized, got %v", err)
	}
}
