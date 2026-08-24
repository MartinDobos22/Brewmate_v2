/** What was happening when a failure was captured. Never anything a person wrote. */
export interface ErrorContext {
  /** Where in the app it happened - a screen name, not a URL with an id in it. */
  readonly screen?: string;
  /** What the app was doing: a query key root, a mutation name. */
  readonly action?: string;
}

/**
 * Where unexpected failures go.
 *
 * An interface for the same reason the API's is: the real implementation talks
 * to a third party over the network, and a build without a DSN should not have
 * to. Capturing must never be able to change what the person in front of the
 * app sees, which is why it returns nothing and throws nothing.
 */
export interface ErrorTracker {
  capture(error: unknown, context?: ErrorContext): void;
}
