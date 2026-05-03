package server

// Decrypts ?command=, splits clientId:clientSecret:targetHost:targetPort:
// clientConnectionId, delegates identity check to services.Clients.Verify
// and ACL check to services.ACL.Allow. TODO.
