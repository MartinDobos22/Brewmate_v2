/**
 * Reads a declared-but-unfilled environment variable as absent.
 *
 * A hosting dashboard writes a variable it was told about but given no value
 * for as an empty string rather than leaving it out - `render.yaml` names
 * `ANTHROPIC_API_KEY` and `SENTRY_DSN` precisely so somebody can see they
 * exist, and both of them are meant to be leavable empty. Without this, a
 * deployment that has not bought a model key yet refuses to start over a
 * variable whose whole point is that it is optional.
 *
 * Empty is treated as absent everywhere rather than only on the optional
 * variables, so a blank required one fails with the sentence that names it
 * ("DATABASE_URL is required") instead of with "Invalid URL".
 */
export const emptyAsUndefined = (value: unknown): unknown => (value === '' ? undefined : value);
