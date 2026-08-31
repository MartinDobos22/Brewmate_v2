import { z } from 'zod';

import { BODY_LIMIT_BYTES } from '../constants/serverDefaults.js';

import type { AppConfig } from './appConfig.js';
import { CONFIG_ERROR_MESSAGES } from './configErrorMessages.js';
import { envSchema } from './envSchema.js';
import { resolveAiConfig } from './resolveAiConfig.js';
import { resolveDatabaseConfig } from './resolveDatabaseConfig.js';
import { resolveFirebaseCredentials } from './resolveFirebaseCredentials.js';
import { resolveTelemetryConfig } from './resolveTelemetryConfig.js';
import { resolveVisionConfig } from './resolveVisionConfig.js';

const MESSAGE_SEPARATOR = '\n';

/**
 * Validates the process environment and freezes it into an AppConfig.
 * Throws with a readable report when anything is missing or malformed.
 */
export const loadConfig = (source: NodeJS.ProcessEnv = process.env): AppConfig => {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error(
      [CONFIG_ERROR_MESSAGES.invalidEnvironment, z.prettifyError(result.error)].join(
        MESSAGE_SEPARATOR,
      ),
    );
  }

  const env = result.data;

  return {
    environment: env.NODE_ENV,
    server: {
      host: env.HOST,
      port: env.PORT,
      bodyLimitBytes: BODY_LIMIT_BYTES,
    },
    database: resolveDatabaseConfig(env),
    firebase: resolveFirebaseCredentials(env),
    ai: resolveAiConfig(env),
    vision: resolveVisionConfig(env),
    telemetry: resolveTelemetryConfig(env),
    logging: { level: env.LOG_LEVEL },
  };
};
