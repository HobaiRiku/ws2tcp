package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/coder/websocket"
	"github.com/gin-gonic/gin"

	"websocket2Tcp/internal/services/events"
)

// StreamHandler serves server-sent events from the shared management event bus.
func StreamHandler(bus *events.Bus) gin.HandlerFunc {
	return func(c *gin.Context) {
		if bus == nil {
			c.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{"code": "EVENTS_UNAVAILABLE", "message": "event bus not configured"})
			return
		}
		flusher, ok := c.Writer.(http.Flusher)
		if !ok {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"code": "STREAM_UNSUPPORTED", "message": "response writer does not support streaming"})
			return
		}

		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		if _, err := fmt.Fprint(c.Writer, ": connected\n\n"); err != nil {
			return
		}
		flusher.Flush()

		streamCtx, cancel := context.WithCancel(c.Request.Context())
		defer cancel()
		sub := bus.Subscribe(streamCtx, topicFilters(c)...)

		for msg := range sub {
			raw, err := json.Marshal(msg)
			if err != nil {
				continue
			}
			if _, err := fmt.Fprintf(c.Writer, "event: %s\ndata: %s\n\n", msg.Topic, raw); err != nil {
				return
			}
			flusher.Flush()
		}
	}
}

// WebSocketHandler serves the same event bus over a WebSocket transport.
func WebSocketHandler(bus *events.Bus) gin.HandlerFunc {
	return func(c *gin.Context) {
		if bus == nil {
			c.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{"code": "EVENTS_UNAVAILABLE", "message": "event bus not configured"})
			return
		}
		// Subscribe BEFORE Accept so the subscription is live by the time
		// the client's Dial returns; otherwise events emitted in the gap
		// between handshake completion and Subscribe are silently dropped.
		sub := bus.Subscribe(c.Request.Context(), topicFilters(c)...)

		conn, err := websocket.Accept(c.Writer, c.Request, &websocket.AcceptOptions{
			OriginPatterns: []string{
				"localhost",
				"localhost:*",
				"127.0.0.1",
				"127.0.0.1:*",
				"[::1]",
				"[::1]:*",
			},
		})
		if err != nil {
			return
		}
		defer conn.Close(websocket.StatusNormalClosure, "")

		for msg := range sub {
			raw, err := json.Marshal(msg)
			if err != nil {
				continue
			}
			if err := conn.Write(c.Request.Context(), websocket.MessageText, raw); err != nil {
				return
			}
		}
	}
}

func topicFilters(c *gin.Context) []string {
	return c.QueryArray("topic")
}
