package events

import (
	"context"
	"sync"
	"time"
)

type Message struct {
	Topic string         `json:"topic"`
	Time  time.Time      `json:"time"`
	Data  map[string]any `json:"data,omitempty"`
}

type subscriber struct {
	topics map[string]struct{}
	ch     chan Message
}

// recentCap caps the in-memory ring buffer used by Recent(); enough to keep
// app/server/api.listening startup events visible across a page reload, but
// small enough to bound memory under steady-state event chatter.
const recentCap = 200

type Bus struct {
	mu     sync.RWMutex
	nextID int
	subs   map[int]subscriber

	// ring buffer of last-N messages, oldest first. Read by Recent().
	recent []Message
}

func NewBus() *Bus {
	return &Bus{subs: map[int]subscriber{}}
}

func (b *Bus) Emit(topic string, data map[string]any) {
	if b == nil {
		return
	}
	b.Publish(Message{
		Topic: topic,
		Time:  time.Now().UTC(),
		Data:  data,
	})
}

func (b *Bus) Publish(msg Message) {
	if b == nil {
		return
	}
	// Take the write lock once: we both fan out to subscribers and append
	// to the ring buffer. Subscribers' ch is buffered so the send is
	// non-blocking and we don't hold the lock on slow consumers.
	b.mu.Lock()
	// log topics are firehose-y and not useful for "recent events"; only
	// non-log topics persist in the ring.
	if msg.Topic != "log" {
		if len(b.recent) >= recentCap {
			b.recent = append(b.recent[1:], msg)
		} else {
			b.recent = append(b.recent, msg)
		}
	}
	subs := b.subs
	b.mu.Unlock()

	for _, sub := range subs {
		if len(sub.topics) > 0 {
			if _, ok := sub.topics[msg.Topic]; !ok {
				continue
			}
		}
		select {
		case sub.ch <- msg:
		default:
		}
	}
}

// Recent returns a copy of the last-N non-log events, oldest first.
func (b *Bus) Recent() []Message {
	if b == nil {
		return nil
	}
	b.mu.RLock()
	defer b.mu.RUnlock()
	out := make([]Message, len(b.recent))
	copy(out, b.recent)
	return out
}

func (b *Bus) Subscribe(ctx context.Context, topics ...string) <-chan Message {
	ch := make(chan Message, 64)
	if b == nil {
		close(ch)
		return ch
	}

	topicSet := map[string]struct{}{}
	for _, topic := range topics {
		if topic == "" {
			continue
		}
		topicSet[topic] = struct{}{}
	}

	b.mu.Lock()
	id := b.nextID
	b.nextID++
	b.subs[id] = subscriber{topics: topicSet, ch: ch}
	b.mu.Unlock()

	go func() {
		<-ctx.Done()
		b.mu.Lock()
		delete(b.subs, id)
		b.mu.Unlock()
		close(ch)
	}()
	return ch
}
