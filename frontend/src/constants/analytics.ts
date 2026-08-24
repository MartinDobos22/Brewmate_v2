/**
 * How much telemetry the app is willing to hold on to.
 *
 * A ceiling rather than an unbounded queue, because the failure this guards
 * against is a phone that has been offline for a fortnight: the funnel is
 * worth having, and it is not worth filling somebody's storage for. Past the
 * ceiling the oldest events are dropped rather than the newest, because what
 * somebody did this morning is what anybody would want to know.
 */
export const ANALYTICS_QUEUE_MAX = 200;

/**
 * How long the queue is allowed to sit before a flush is attempted anyway.
 *
 * Most flushes happen because the connection came back, which is the event
 * that changes the answer. This is the backstop for a session that never goes
 * offline and never navigates: without it the last few events of a long
 * session would only be sent the next time the app was opened.
 */
export const ANALYTICS_FLUSH_INTERVAL_MS = 60000;
