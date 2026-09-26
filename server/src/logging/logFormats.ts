/**
 * How a log line is written, chosen through the LOG_FORMAT environment variable.
 *
 * `pretty` is one readable line per event, for a person reading the host's log
 * viewer. `json` is one pino record per line, for a machine - a log drain, a
 * search index - that parses fields rather than reads sentences.
 */
export const LOG_FORMATS = {
  pretty: 'pretty',
  json: 'json',
} as const;

export type LogFormat = (typeof LOG_FORMATS)[keyof typeof LOG_FORMATS];

/**
 * Readable by default, because the only reader this API has today is somebody
 * scrolling Render's log tab - and a wall of JSON there is a log nobody reads.
 * Set LOG_FORMAT=json the day a drain is attached.
 */
export const DEFAULT_LOG_FORMAT: LogFormat = LOG_FORMATS.pretty;
