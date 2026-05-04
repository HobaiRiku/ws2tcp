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

type Bus struct {
	mu     sync.RWMutex
	nextID int
	subs   map[int]subscriber
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
	b.mu.RLock()
	defer b.mu.RUnlock()
	for _, sub := range b.subs {
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
