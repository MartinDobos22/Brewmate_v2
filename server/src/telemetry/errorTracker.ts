/** What was happening when a failure was captured. Never anything a person wrote. */
export interface ErrorContext {
  /** The internal account id - a UUID, never an email or a display name. */
  readonly userId?: string;
  readonly requestId?: string;
  readonly route?: string;
  readonly method?: string;
  readonly statusCode?: number;
}

/**
 * Where unexpected failures go.
 *
 * An interface for the same reason `TokenVerifier` is one: the real
 * implementation talks to a third party over the network, and neither the
 * tests nor a deployment without a DSN should have to. A failure that reaches
 * this port has already been turned into a response for the client - reporting
 * it is a side effect and must never be able to change what the caller gets
 * back, which is why `capture` returns nothing and throws nothing.
 */
export interface ErrorTracker {
  capture(error: unknown, context: ErrorContext): void;
}
