/** Defaults and bounds for the HTTP server. Overridable through the environment. */
export const DEFAULT_PORT = 3000;
export const MIN_PORT = 1;
export const MAX_PORT = 65535;

/** Binding to all interfaces is required inside containers. */
export const DEFAULT_HOST = '0.0.0.0';

/** Maximum accepted request body size. */
export const BODY_LIMIT_BYTES = 1048576;

/**
 * What the two routes that carry a photograph may accept instead.
 *
 * Per route rather than raised globally. A megabyte is the right ceiling for
 * every other endpoint here - they carry recipes, weights and sentences - and
 * lifting it everywhere so that two of them can take a picture would mean the
 * whole API accepts twelve megabytes of anything.
 *
 * Twelve mebibytes is the eight the image itself may weigh, plus the third
 * that base-64 adds, plus room for the JSON around it. The picture is refused
 * on the phone before it is sent; this is what stops a body from being read at
 * all, which is a different job and belongs to the server.
 */
export const PHOTO_BODY_LIMIT_BYTES = 12582912;

/** How long an in-flight request may finish before the process is forced down. */
export const GRACEFUL_SHUTDOWN_TIMEOUT_MS = 10000;

/** Process exit codes. */
export const EXIT_CODE_FAILURE = 1;
