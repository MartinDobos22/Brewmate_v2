/** Connection pool tuning for the hosted (Neon) PostgreSQL instance. */
export const DEFAULT_POOL_MAX_CONNECTIONS = 10;
export const CONNECTION_TIMEOUT_MS = 10000;
export const IDLE_TIMEOUT_MS = 30000;

/** Cheapest possible round-trip used to prove the database answers. */
export const DATABASE_PING_QUERY = 'select 1';

/** Neon always requires TLS. */
export const DATABASE_SSL_REQUIRED = true;
