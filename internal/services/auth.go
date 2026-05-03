package services

// API token issue/verify for the management plane (HTTP API + WebSocket
// log/event streams). Tokens are stored as argon2id hashes in
// data/tokens.yaml; plaintext is shown exactly once on issue.
//
// Implementation lands together with the api/ package so the verifier
// signature can be matched to the gin middleware shape. Tracking under
// docs/design/04-api-cli-shared-service.md.
//
// TODO: argon2id hash + tokens.yaml store + Issue/Verify/Revoke.
