/**
 * Where unexpected failures are reported.
 *
 * Null wherever no DSN is configured, which is a working state: the log still
 * carries every error with its stack and its request id, and an installation
 * that would rather not hand stack traces to a third party says so by leaving
 * the variable unset.
 */
export interface TelemetryConfig {
  readonly errorReportingDsn: string;
}
