/** Defaults and bounds for the HTTP server. Overridable through the environment. */
export const DEFAULT_PORT = 3000;
export const MIN_PORT = 1;
export const MAX_PORT = 65535;

/** Binding to all interfaces is required inside containers. */
export const DEFAULT_HOST = '0.0.0.0';

/** Maximum accepted request body size. */
export const BODY_LIMIT_BYTES = 1048576;

/** How long an in-flight request may finish before the process is forced down. */
export const GRACEFUL_SHUTDOWN_TIMEOUT_MS = 10000;

/** Process exit codes. */
export const EXIT_CODE_FAILURE = 1;
