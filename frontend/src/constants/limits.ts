import { MILLISECONDS_PER_DAY, MILLISECONDS_PER_MINUTE } from './time';

/** Thresholds and limits shared across the app. */
export const LIMITS = {
  /** How long a query result is considered fresh. */
  queryStaleTimeMs: MILLISECONDS_PER_MINUTE * 5,
  /** How long an unused query stays in memory. */
  queryGcTimeMs: MILLISECONDS_PER_MINUTE * 30,
  /** How long a persisted cache entry may be restored from disk. */
  persistMaxAgeMs: MILLISECONDS_PER_DAY * 7,
  /** Debounce before the cache is written back to storage. */
  persistThrottleMs: MILLISECONDS_PER_MINUTE,
  /** Failed requests are retried this many times before the error surfaces. */
  queryRetryCount: 2,
  /** A request that takes longer than this is aborted. */
  requestTimeoutMs: MILLISECONDS_PER_MINUTE / 4,
  /**
   * The same, for the routes that ask a model something.
   *
   * Fifteen seconds is right for a query and nowhere near enough for a recipe:
   * a few thousand tokens written against a system prompt of several hundred
   * lines routinely takes half a minute, and a host that hibernates between
   * requests spends the first few seconds waking up before any of that starts.
   * Aborting there does not save anybody anything - the call is already made
   * and already billed - it only turns an answer that was coming into "server
   * neodpovedal včas" and a second attempt at the same cost.
   */
  aiRequestTimeoutMs: MILLISECONDS_PER_MINUTE * 2,
  /** How long typing has to stop before a search reaches the API. */
  searchDebounceMs: 300,
} as const;

export type LimitToken = keyof typeof LIMITS;
