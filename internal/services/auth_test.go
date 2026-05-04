package services

import (
	"errors"
	"testing"

	"websocket2Tcp/internal/paths"
)

func newAuthService(t *testing.T) (*AuthService, paths.Paths) {
	t.Helper()

	p, err := paths.Resolve(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := p.EnsureTree(); err != nil {
		t.Fatal(err)
	}
	return NewAuthService(p.Tokens(), p.FileMode()), p
}

func TestAuthServiceIssueListVerifyRevoke(t *testing.T) {
	auth, _ := newAuthService(t)

	token, info, err := auth.IssueToken("cli-local", []string{TokenScopeClientWrite})
	if err != nil {
		t.Fatal(err)
	}
	if token == "" {
		t.Fatal("expected plaintext token")
	}
	if len(info.Scopes) != 2 || info.Scopes[0] != TokenScopeClientWrite || info.Scopes[1] != TokenScopeRead {
		t.Fatalf("unexpected scopes: %#v", info.Scopes)
	}

	listed, err := auth.ListTokens()
	if err != nil {
		t.Fatal(err)
	}
	if len(listed) != 1 || listed[0].Name != "cli-local" {
		t.Fatalf("unexpected listed tokens: %#v", listed)
	}

	if _, err := auth.VerifyToken(token, TokenScopeRead); err != nil {
		t.Fatalf("verify read failed: %v", err)
	}
	if _, err := auth.VerifyToken(token, TokenScopeClientWrite); err != nil {
		t.Fatalf("verify client:write failed: %v", err)
	}
	if _, err := auth.VerifyToken(token, TokenScopeServerWrite); !errors.Is(err, ErrTokenForbidden) {
		t.Fatalf("expected forbidden, got %v", err)
	}

	if err := auth.RevokeToken("cli-local"); err != nil {
		t.Fatal(err)
	}
	if _, err := auth.VerifyToken(token, TokenScopeRead); !errors.Is(err, ErrTokenUnauthorized) {
		t.Fatalf("expected unauthorized after revoke, got %v", err)
	}
}

func TestAuthServiceRejectsDuplicateAndBadScope(t *testing.T) {
	auth, _ := newAuthService(t)

	if _, _, err := auth.IssueToken("dup", []string{"invalid"}); err == nil {
		t.Fatal("expected invalid scope error")
	}
	if _, _, err := auth.IssueToken("dup", []string{TokenScopeRead}); err != nil {
		t.Fatal(err)
	}
	if _, _, err := auth.IssueToken("dup", []string{TokenScopeRead}); err == nil {
		t.Fatal("expected duplicate token error")
	}
}
