package services

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"golang.org/x/crypto/argon2"
	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
)

const (
	TokenScopeAdmin       = "admin"
	TokenScopeRead        = "read"
	TokenScopeClientWrite = "client:write"
	TokenScopeServerWrite = "server:write"
)

var (
	ErrTokenUnauthorized = errors.New("unauthorized")
	ErrTokenForbidden    = errors.New("forbidden")
	ErrTokenNotFound     = errors.New("token not found")
)

type TokenInfo struct {
	Name      string    `json:"name" yaml:"name"`
	CreatedAt time.Time `json:"created_at" yaml:"created_at"`
	ExpiresAt int64     `json:"expires_at" yaml:"expires_at"`
	Scopes    []string  `json:"scopes" yaml:"scopes"`
}

type issuedToken struct {
	TokenInfo `yaml:",inline"`
	Hash      string `yaml:"hash"`
}

type tokenFile struct {
	Tokens []issuedToken `yaml:"tokens"`
}

type AuthService struct {
	path     string
	fileMode os.FileMode
	mu       sync.Mutex
}

func NewAuthService(path string, fileMode os.FileMode) *AuthService {
	return &AuthService{path: path, fileMode: fileMode}
}

func (a *AuthService) ListTokens() ([]TokenInfo, error) {
	a.mu.Lock()
	defer a.mu.Unlock()

	doc, err := a.load()
	if err != nil {
		return nil, err
	}
	out := make([]TokenInfo, 0, len(doc.Tokens))
	for _, token := range doc.Tokens {
		out = append(out, token.TokenInfo)
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].Name < out[j].Name
	})
	return out, nil
}

func (a *AuthService) IssueToken(name string, scopes []string) (string, TokenInfo, error) {
	if strings.TrimSpace(name) == "" {
		return "", TokenInfo{}, fmt.Errorf("token name required")
	}
	normalized, err := normalizeTokenScopes(scopes)
	if err != nil {
		return "", TokenInfo{}, err
	}
	plain, err := randomToken()
	if err != nil {
		return "", TokenInfo{}, err
	}
	hash, err := hashToken(plain)
	if err != nil {
		return "", TokenInfo{}, err
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	doc, err := a.load()
	if err != nil {
		return "", TokenInfo{}, err
	}
	for _, token := range doc.Tokens {
		if token.Name == name {
			return "", TokenInfo{}, fmt.Errorf("token %q already exists", name)
		}
	}

	info := TokenInfo{
		Name:      name,
		CreatedAt: time.Now().UTC(),
		ExpiresAt: 0,
		Scopes:    normalized,
	}
	doc.Tokens = append(doc.Tokens, issuedToken{
		TokenInfo: info,
		Hash:      hash,
	})
	if err := a.save(doc); err != nil {
		return "", TokenInfo{}, err
	}
	return plain, info, nil
}

func (a *AuthService) RevokeToken(name string) error {
	a.mu.Lock()
	defer a.mu.Unlock()

	doc, err := a.load()
	if err != nil {
		return err
	}
	for i, token := range doc.Tokens {
		if token.Name == name {
			doc.Tokens = append(doc.Tokens[:i], doc.Tokens[i+1:]...)
			return a.save(doc)
		}
	}
	return fmt.Errorf("%w: %s", ErrTokenNotFound, name)
}

func (a *AuthService) VerifyToken(plain string, requiredScopes ...string) (TokenInfo, error) {
	plain = strings.TrimSpace(plain)
	if plain == "" {
		return TokenInfo{}, ErrTokenUnauthorized
	}
	required, err := normalizeRequiredScopes(requiredScopes)
	if err != nil {
		return TokenInfo{}, err
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	doc, err := a.load()
	if err != nil {
		return TokenInfo{}, err
	}
	now := time.Now().Unix()
	for _, token := range doc.Tokens {
		if token.ExpiresAt > 0 && token.ExpiresAt <= now {
			continue
		}
		ok, err := verifyTokenHash(token.Hash, plain)
		if err != nil {
			return TokenInfo{}, err
		}
		if !ok {
			continue
		}
		if !hasRequiredScopes(token.Scopes, required) {
			return TokenInfo{}, ErrTokenForbidden
		}
		return token.TokenInfo, nil
	}
	return TokenInfo{}, ErrTokenUnauthorized
}

func (a *AuthService) load() (tokenFile, error) {
	if a.path == "" {
		return tokenFile{}, fmt.Errorf("token store path is empty")
	}
	raw, err := os.ReadFile(a.path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return tokenFile{}, nil
		}
		return tokenFile{}, fmt.Errorf("read tokens: %w", err)
	}
	var doc tokenFile
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return tokenFile{}, fmt.Errorf("parse tokens: %w", err)
	}
	return doc, nil
}

func (a *AuthService) save(doc tokenFile) error {
	sort.Slice(doc.Tokens, func(i, j int) bool {
		return doc.Tokens[i].Name < doc.Tokens[j].Name
	})
	raw, err := yaml.Marshal(doc)
	if err != nil {
		return fmt.Errorf("marshal tokens: %w", err)
	}
	return config.WriteAtomic(a.path, raw, a.fileMode)
}

func normalizeTokenScopes(scopes []string) ([]string, error) {
	if len(scopes) == 0 {
		return nil, fmt.Errorf("at least one token scope is required")
	}
	set := map[string]struct{}{}
	for _, scope := range scopes {
		scope = strings.TrimSpace(scope)
		switch scope {
		case TokenScopeAdmin, TokenScopeRead, TokenScopeClientWrite, TokenScopeServerWrite:
			set[scope] = struct{}{}
		default:
			return nil, fmt.Errorf("invalid token scope %q", scope)
		}
	}
	if _, ok := set[TokenScopeAdmin]; ok {
		return []string{TokenScopeAdmin}, nil
	}
	if _, ok := set[TokenScopeClientWrite]; ok {
		set[TokenScopeRead] = struct{}{}
	}
	if _, ok := set[TokenScopeServerWrite]; ok {
		set[TokenScopeRead] = struct{}{}
	}
	out := make([]string, 0, len(set))
	for scope := range set {
		out = append(out, scope)
	}
	sort.Strings(out)
	return out, nil
}

func normalizeRequiredScopes(scopes []string) ([]string, error) {
	if len(scopes) == 0 {
		return nil, nil
	}
	return normalizeTokenScopes(scopes)
}

func hasRequiredScopes(granted, required []string) bool {
	if len(required) == 0 {
		return true
	}
	grantedSet := map[string]struct{}{}
	for _, scope := range granted {
		grantedSet[scope] = struct{}{}
	}
	if _, ok := grantedSet[TokenScopeAdmin]; ok {
		return true
	}
	for _, scope := range required {
		if _, ok := grantedSet[scope]; ok {
			continue
		}
		if scope == TokenScopeRead {
			if _, ok := grantedSet[TokenScopeClientWrite]; ok {
				continue
			}
			if _, ok := grantedSet[TokenScopeServerWrite]; ok {
				continue
			}
		}
		return false
	}
	return true
}

func randomToken() (string, error) {
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return "", fmt.Errorf("generate token: %w", err)
	}
	return base64.RawURLEncoding.EncodeToString(raw), nil
}

func hashToken(plain string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("generate token salt: %w", err)
	}
	const (
		timeCost    uint32 = 1
		memoryCost  uint32 = 64 * 1024
		parallelism uint8  = 4
		keyLen      uint32 = 32
	)
	hash := argon2.IDKey([]byte(plain), salt, timeCost, memoryCost, parallelism, keyLen)
	return fmt.Sprintf(
		"argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		memoryCost,
		timeCost,
		parallelism,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	), nil
}

func verifyTokenHash(encoded, plain string) (bool, error) {
	parts := strings.Split(encoded, "$")
	if len(parts) != 5 || parts[0] != "argon2id" {
		return false, fmt.Errorf("invalid token hash format")
	}

	var version int
	if _, err := fmt.Sscanf(parts[1], "v=%d", &version); err != nil {
		return false, fmt.Errorf("invalid token hash version: %w", err)
	}
	if version != argon2.Version {
		return false, fmt.Errorf("unsupported token hash version %d", version)
	}

	var memoryCost, timeCost uint32
	var parallelism uint8
	if _, err := fmt.Sscanf(parts[2], "m=%d,t=%d,p=%d", &memoryCost, &timeCost, &parallelism); err != nil {
		return false, fmt.Errorf("invalid token hash params: %w", err)
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[3])
	if err != nil {
		return false, fmt.Errorf("decode token salt: %w", err)
	}
	expected, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, fmt.Errorf("decode token hash: %w", err)
	}

	actual := argon2.IDKey([]byte(plain), salt, timeCost, memoryCost, parallelism, uint32(len(expected)))
	return subtle.ConstantTimeCompare(actual, expected) == 1, nil
}
