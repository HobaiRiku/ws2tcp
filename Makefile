# ws2tcp — top-level Makefile
# Targets are placeholders during scaffolding; see docs/design/06-build-and-testing.md.

BINARY := ws2tcp
PKG    := ./...

.PHONY: all build run tidy fmt vet test test-unit test-service test-e2e web web-build clean

all: build

build:
	go build -o bin/$(BINARY) .

run:
	go run . run

tidy:
	go mod tidy

fmt:
	go fmt $(PKG)

vet:
	go vet $(PKG)

test: test-unit

test-unit:
	go test $(PKG)

test-service:
	@echo "TODO: service-layer integration tests"

test-e2e:
	@echo "TODO: Go<->Node interop tests under tests/interop/"

web-build:
	cd web && pnpm install && pnpm build

clean:
	rm -rf bin/ web/dist/
