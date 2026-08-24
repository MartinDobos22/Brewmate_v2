import type { ErrorContext, ErrorTracker } from '../../src/telemetry/errorTracker.js';

const FIRST = 0;

/** One captured failure, so a test can assert what was reported and what was not. */
export interface CapturedError {
  readonly error: unknown;
  readonly context: ErrorContext;
}

export interface RecordingErrorTracker extends ErrorTracker {
  readonly captured: readonly CapturedError[];
  readonly reset: () => void;
}

/**
 * Stands in for the reporter.
 *
 * The behaviour worth testing is not the provider's - it is which failures get
 * reported at all. A 404 for a coffee that is not there is the API working; a
 * 500 is not, and only one of them belongs in an alerting tool.
 */
export const createFakeErrorTracker = (): RecordingErrorTracker => {
  const captured: CapturedError[] = [];

  return {
    captured,
    capture: (error: unknown, context: ErrorContext): void => {
      captured.push({ error, context });
    },
    reset: (): void => {
      captured.length = FIRST;
    },
  };
};
