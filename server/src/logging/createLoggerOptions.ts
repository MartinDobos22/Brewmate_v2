import type { FastifyServerOptions } from 'fastify';

import { NODE_ENVIRONMENTS, type NodeEnvironment } from '../config/nodeEnvironment.js';

import type { LogLevel } from './logLevels.js';
import { REDACT_PATHS, REDACT_PLACEHOLDER } from './redactPaths.js';

const PRETTY_TRANSPORT_TARGET = 'pino-pretty';
const PRETTY_TIME_FORMAT = 'HH:MM:ss.l';

type LoggerOptions = FastifyServerOptions['logger'];

/**
 * Structured JSON logs everywhere; human-readable output only while developing.
 * Tests stay silent so assertion output is readable.
 */
export const createLoggerOptions = (
  environment: NodeEnvironment,
  level: LogLevel,
): LoggerOptions => {
  if (environment === NODE_ENVIRONMENTS.test) {
    return false;
  }

  const redact = {
    paths: [...REDACT_PATHS],
    censor: REDACT_PLACEHOLDER,
  };

  if (environment === NODE_ENVIRONMENTS.development) {
    return {
      level,
      redact,
      transport: {
        target: PRETTY_TRANSPORT_TARGET,
        options: { colorize: true, translateTime: PRETTY_TIME_FORMAT },
      },
    };
  }

  return { level, redact };
};
