package server

import (
	"net"
	"net/http"
	"strings"
)

// ClientIP returns the source IP of r, honouring trustProxy.
//
// Port of legacy/server.mjs getClientIp:
//
//	trustProxy=true  -> X-Forwarded-For[0] -> X-Real-IP -> RemoteAddr
//	trustProxy=false -> RemoteAddr only
//
// Caller is responsible for guarding trustProxy: it must only be enabled
// when the server sits behind a reverse proxy that overwrites these
// headers on every request — otherwise clients can forge them.
func ClientIP(r *http.Request, trustProxy bool) string {
	if trustProxy {
		if v := r.Header.Get("X-Forwarded-For"); v != "" {
			if ip := strings.TrimSpace(strings.Split(v, ",")[0]); ip != "" {
				return ip
			}
		}
		if v := strings.TrimSpace(r.Header.Get("X-Real-IP")); v != "" {
			return v
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
