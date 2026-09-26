import type { LogFormat } from '../logging/logFormats.js';
import type { LogLevel } from '../logging/logLevels.js';

export interface LoggingConfig {
  readonly level: LogLevel;
  readonly format: LogFormat;
}
