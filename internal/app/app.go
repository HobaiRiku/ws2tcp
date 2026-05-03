package app

// Composition root: paths.Resolve -> config.Load -> log.Init -> services.New
// -> spawn server/client/HTTP goroutines, wait on signal, graceful drain.
// TODO.
