import type { FastifyServerOptions } from 'fastify';

import { NODE_ENVIRONMENTS, type NodeEnvironment } from '../config/nodeEnvironment.js';

import { createPrettyStream } from './createPrettyStream.js';
import { LOG_FORMATS, type LogFormat } from './logFormats.js';
import type { LogLevel } from './logLevels.js';
import { REDACT_PATHS, REDACT_PLACEHOLDER } from './redactPaths.js';

type LoggerOptions = FastifyServerOptions['logger'];

/**
 * Readable lines or JSON records, as LOG_FORMAT says, in every environment
 * but tests - which stay silent so assertion output is readable.
 *
 * Redaction applies to both formats: it happens in pino before a record is
 * serialised, so the pretty-printer never sees a credential to print.
 */
export const createLoggerOptions = (
  environment: NodeEnvironment,
  level: LogLevel,
  format: LogFormat,
): LoggerOptions => {
  if (environment === NODE_ENVIRONMENTS.test) {
    return false;
  }

  const redact = {
    paths: [...REDACT_PATHS],
    censor: REDACT_PLACEHOLDER,
  };

  if (format === LOG_FORMATS.pretty) {
    return { level, redact, stream: createPrettyStream() };
  }

  return { level, redact };
};
