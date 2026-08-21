/** Log messages. Kept out of the call sites so wording stays consistent and greppable. */
export const LOG_MESSAGES = {
  serverListening: 'server listening',
  serverStartFailed: 'server failed to start',
  shutdownSignalReceived: 'shutdown signal received',
  shutdownComplete: 'shutdown complete',
  shutdownFailed: 'graceful shutdown failed',
  migrationsStarted: 'running database migrations',
  migrationsComplete: 'database migrations complete',
  migrationsFailed: 'database migrations failed',
  seedStarted: 'seeding reference data',
  seedComplete: 'reference data seeded',
  seedFailed: 'seeding reference data failed',
  databasePingFailed: 'database ping failed',
  firebaseInitialised: 'firebase admin initialised',
  userProvisioned: 'provisioned new user from firebase identity',
  requestFailed: 'request failed',
  unhandledError: 'unhandled error',
} as const;
