package server

import (
	"sync"
	"time"
)

// ReplayStore is the in-process anti-replay set for clientConnectionId.
//
// Replaces legacy/server.mjs `clientConnectionIdList` (a slice + linear
// scan). Same single-process scope, but adds a TTL janitor so a missed
// Release does not leak the id forever.
type ReplayStore struct {
	mu    sync.Mutex
	ids   map[string]time.Time
	ttl   time.Duration
	now   func() time.Time
	stop  chan struct{}
	clock *time.Ticker
}

// NewReplayStore returns a store with default 5-minute TTL and a janitor
// that runs every TTL/2.
func NewReplayStore() *ReplayStore { return NewReplayStoreWithTTL(5 * time.Minute) }

// NewReplayStoreWithTTL allows tests to dial down the TTL.
func NewReplayStoreWithTTL(ttl time.Duration) *ReplayStore {
	s := &ReplayStore{
		ids:  map[string]time.Time{},
		ttl:  ttl,
		now:  time.Now,
		stop: make(chan struct{}),
	}
	if ttl > 0 {
		s.clock = time.NewTicker(ttl / 2)
		go s.gc()
	}
	return s
}

// Reserve attempts to claim id. Returns false if id is already live.
func (s *ReplayStore) Reserve(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.ids[id]; exists {
		return false
	}
	s.ids[id] = s.now()
	return true
}

// Release removes id; safe to call on an absent id.
func (s *ReplayStore) Release(id string) {
	s.mu.Lock()
	delete(s.ids, id)
	s.mu.Unlock()
}

// Len returns the current set size; mainly for tests / metrics.
func (s *ReplayStore) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.ids)
}

// Close stops the janitor. Must be called on shutdown when the store was
// constructed with a non-zero TTL.
func (s *ReplayStore) Close() {
	if s.clock == nil {
		return
	}
	close(s.stop)
	s.clock.Stop()
}

func (s *ReplayStore) gc() {
	for {
		select {
		case <-s.stop:
			return
		case <-s.clock.C:
			s.sweep()
		}
	}
}

func (s *ReplayStore) sweep() {
	cutoff := s.now().Add(-s.ttl)
	s.mu.Lock()
	defer s.mu.Unlock()
	for id, t := range s.ids {
		if t.Before(cutoff) {
			delete(s.ids, id)
		}
	}
}
