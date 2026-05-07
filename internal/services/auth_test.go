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

// 当 config 里 http_token 留空时, 任何请求 (含携带任意 token 的) 都必须
// 被拒. 这是"empty config = closed API"的安全契约, 别的兜底都不该绕过它.
func TestAuthServiceEmptyExpectedRejectsEverything(t *testing.T) {
	auth := NewAuthService(func() string { return "" })

	for _, tok := range []string{"", "anything", "change-me-management-token"} {
		if _, err := auth.VerifyToken(tok, TokenScopeRead); !errors.Is(err, ErrTokenUnauthorized) {
			t.Fatalf("token %q should be rejected when expected is empty, got %v", tok, err)
		}
	}
}
