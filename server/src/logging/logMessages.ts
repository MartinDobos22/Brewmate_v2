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
  purchaseBackfillStarted:
    'recording purchases for bags written down before purchases were learned from',
  purchaseBackfillComplete: 'purchases recorded',
  purchaseBackfillFailed: 'recording purchases failed',
  databasePingFailed: 'database ping failed',
  firebaseInitialised: 'firebase admin initialised',
  userProvisioned: 'provisioned new user from firebase identity',
  requestFailed: 'request failed',
  /** The one line every request leaves behind, e.g. `GET /me -> 200 (6 ms)`. */
  requestCompleted: (method: string, url: string, statusCode: number, durationMs: number): string =>
    `${method} ${url} -> ${String(statusCode)} (${String(durationMs)} ms)`,
  unhandledError: 'unhandled error',
  errorReportingConfigured: 'error reporting configured',
  errorReportingDsnInvalid: 'SENTRY_DSN is not a valid DSN - errors will only be logged',
  errorReportFailed: 'could not deliver an error report',
} as const;
