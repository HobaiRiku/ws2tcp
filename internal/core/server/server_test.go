package server

import (
	"net/http/httptest"
	"net/url"
	"testing"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/core/crypto"
)

const k32 = "njpjvjkgfykgpqpcksvjydvlctgznlnz"

func TestReplayReserveRelease(t *testing.T) {
	s := NewReplayStoreWithTTL(0)
	defer s.Close()
	if !s.Reserve("a") {
		t.Fatal("first reserve must succeed")
	}
	if s.Reserve("a") {
		t.Fatal("second reserve of same id must fail")
	}
	s.Release("a")
	if !s.Reserve("a") {
		t.Fatal("reserve after release must succeed")
	}
}

func TestClientIPRespectsTrustProxy(t *testing.T) {
	r := httptest.NewRequest("GET", "/", nil)
	r.RemoteAddr = "10.1.1.1:1234"
	r.Header.Set("X-Forwarded-For", "203.0.113.5, 10.0.0.1")
	r.Header.Set("X-Real-IP", "198.51.100.7")

	if got := ClientIP(r, false); got != "10.1.1.1" {
		t.Errorf("trustProxy=false should ignore headers, got %q", got)
	}
	if got := ClientIP(r, true); got != "203.0.113.5" {
		t.Errorf("trustProxy=true should pick first XFF entry, got %q", got)
	}

	r.Header.Del("X-Forwarded-For")
	if got := ClientIP(r, true); got != "198.51.100.7" {
		t.Errorf("trustProxy=true falls back to X-Real-IP, got %q", got)
	}
}

func TestParseCommandRoundTrip(t *testing.T) {
	cmd := "u1:s1:192.168.1.5:22:abc-123"
	enc, err := crypto.AesEncrypt([]byte(cmd), []byte(k32))
	if err != nil {
		t.Fatal(err)
	}
	urlEncoded := url.QueryEscape(enc)

	got, err := ParseCommand(urlEncoded, []byte(k32))
	if err != nil {
		t.Fatal(err)
	}
	if got.ClientID != "u1" || got.ClientSecret != "s1" ||
		got.TargetHost != "192.168.1.5" || got.TargetPort != 22 ||
		got.ConnID != "abc-123" {
		t.Fatalf("got %+v", got)
	}
}

func TestParseCommandRejectsBadInputs(t *testing.T) {
	cases := []string{
		"",                            // empty
		"%ZZ",                         // bad URL escape
		"not-base64-at-all-!@#",       // bad base64
	}
	for _, c := range cases {
		if _, err := ParseCommand(c, []byte(k32)); err == nil {
			t.Errorf("ParseCommand(%q) should error", c)
		}
	}
}
