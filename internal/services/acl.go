package services

// ACL rule CRUD + Allow(clientId, dstIP, dstPort) check. Rules combine CIDR
// allow-lists and port ranges. See docs/design/02-server-acl-auth.md. TODO.
