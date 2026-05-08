package config

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net"
	"os"
	"strconv"

	"gopkg.in/yaml.v3"
)

// Example returns a runnable starter config for first-run initialization.
//
// 每次调用都会:
//   - 重新生成 32 字节的 server AES 信令密钥;
//   - client 段配置直接指向本机 server (127.0.0.1:listen 端口),
//     形成可立即测试的闭环 (默认带一个 ssh -> 127.0.0.1:22 的 tunnel);
//   - server 与 endpoint 共用同一把 aes_key, secret 也对应,
//     避免新手第一次跑时 client 因为示例值不一致连不上.
func Example() *Config {
	aesKey := randomAESKey()
	const (
		serverListen   = "0.0.0.0:3005"
		wsPath         = "/connect"
		clientID       = "local"
		clientSecret   = "local"
		endpointName   = "local"
		profileName    = "local"
		tunnelName     = "local-ssh"
		tunnelListen   = "127.0.0.1:2222"
		tunnelHost     = "127.0.0.1"
		tunnelPort     = 22
		endpointHost   = "127.0.0.1"
		endpointPath   = wsPath
	)
	endpointPort := portFromListen(serverListen, 3005)

	return &Config{
		App: AppConfig{
			HTTPListen: "127.0.0.1:7321",
			HTTPAuth:   true,
			HTTPToken:  randomHTTPToken(),
			LogLevel:   "info",
		},
		Server: ServerConfig{
			Enabled:       false,
			Listen:        serverListen,
			WSPath:        wsPath,
			TrustProxy:    false,
			AESKey:        aesKey,
			UseEncryption: true,
			TLS: TLSConfig{
				Enabled: false,
				Cert:    "certs/cert.pem",
				Key:     "certs/key.pem",
			},
			Clients: []ClientIdentity{
				{
					// 默认不带 ACL: 空 ACL 视为"不限制", 匹配 dual-stack 的
					// localhost 解析 (127.0.0.1 / ::1) 就不会因为 strict-AND
					// 严格匹配把 IPv6 这一支顶掉. 真实部署时可在 UI 里加规则.
					ID:     clientID,
					Secret: clientSecret,
				},
			},
		},
		Client: ClientConfig{
			Endpoints: []Endpoint{
				{
					Name:                  endpointName,
					Host:                  endpointHost,
					Port:                  endpointPort,
					Path:                  endpointPath,
					WSS:                   false,
					AESKey:                aesKey,
					SSLRejectUnauthorized: false,
				},
			},
			Clients: []ClientProfile{
				{
					Name:         profileName,
					Endpoint:     endpointName,
					ClientID:     clientID,
					ClientSecret: clientSecret,
					Tunnels: []Tunnel{
						{
							Name:       tunnelName,
							Listen:     tunnelListen,
							TargetHost: tunnelHost,
							TargetPort: tunnelPort,
						},
					},
				},
			},
		},
	}
}

// WriteExample initializes path with the starter config.
func WriteExample(path string, perm os.FileMode) error {
	raw, err := yaml.Marshal(Example())
	if err != nil {
		return fmt.Errorf("marshal example config: %w", err)
	}
	return WriteAtomic(path, raw, perm)
}

const aesKeyAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789"

// randomAESKey 返回 32 字节 ASCII 字符串, 满足 server.aes_key 的长度校验.
// 失败极少见, 但仍然 fall back 到一个固定值, 保证 init 不会因熵不足而崩溃.
func randomAESKey() string {
	const n = 32
	buf := make([]byte, n)
	if _, err := rand.Read(buf); err != nil {
		return "njpjvjkgfykgpqpcksvjydvlctgznlnz"
	}
	out := make([]byte, n)
	for i := 0; i < n; i++ {
		out[i] = aesKeyAlphabet[int(buf[i])%len(aesKeyAlphabet)]
	}
	return string(out)
}

// randomHTTPToken 给首次 init 的管理 API 生成一个随机 token (32 位 hex,
// 即 16 字节熵). 失败极罕见, 但仍然返回一个安全占位 — 用一个明显的
// "REGENERATE-ME-..." 前缀让用户一眼看出来有问题, 而不是误以为是真 token.
func randomHTTPToken() string {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "REGENERATE-ME-rand-failed"
	}
	return hex.EncodeToString(buf)
}

// portFromListen 从 "host:port" 形式的监听字符串里抽出端口; 解析失败回退 def.
func portFromListen(listen string, def int) int {
	_, port, err := net.SplitHostPort(listen)
	if err != nil {
		return def
	}
	n, err := strconv.Atoi(port)
	if err != nil || n <= 0 || n > 65535 {
		return def
	}
	return n
}
