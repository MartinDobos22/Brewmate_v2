import type { Env } from './envSchema.js';
import type { TelemetryConfig } from './telemetryConfig.js';

/**
 * @returns the reporting configuration, or null when no DSN is set.
 *
 * The same shape as the model provider's config for the same reason: absent is
 * a state the whole application already knows how to be in, and turning a
 * missing optional into a start-up failure would make error reporting a
 * requirement for serving coffee recipes.
 */
export const resolveTelemetryConfig = (env: Env): TelemetryConfig | null =>
  env.SENTRY_DSN === undefined ? null : { errorReportingDsn: env.SENTRY_DSN };
