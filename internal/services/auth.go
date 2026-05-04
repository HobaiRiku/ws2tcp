package services

import (
	"crypto/subtle"
	"errors"
	"strings"
)

const (
	TokenScopeAdmin       = "admin"
	TokenScopeRead        = "read"
	TokenScopeClientWrite = "client:write"
	TokenScopeServerWrite = "server:write"
)

var (
	ErrTokenUnauthorized = errors.New("unauthorized")
)

type TokenInfo struct {
	Name   string   `json:"name"`
	Scopes []string `json:"scopes"`
}

type AuthService struct {
	tokenSource func() string
}

func NewAuthService(tokenSource func() string) *AuthService {
	return &AuthService{tokenSource: tokenSource}
}

func (a *AuthService) VerifyToken(plain string, requiredScopes ...string) (TokenInfo, error) {
	plain = strings.TrimSpace(plain)
	if plain == "" {
		return TokenInfo{}, ErrTokenUnauthorized
	}
	if a == nil || a.tokenSource == nil {
		return TokenInfo{}, ErrTokenUnauthorized
	}
	expected := strings.TrimSpace(a.tokenSource())
	if expected == "" {
		return TokenInfo{}, ErrTokenUnauthorized
	}
	if subtle.ConstantTimeCompare([]byte(plain), []byte(expected)) != 1 {
		return TokenInfo{}, ErrTokenUnauthorized
	}
	return TokenInfo{
		Name:   "configured-token",
		Scopes: []string{TokenScopeAdmin},
	}, nil
}
