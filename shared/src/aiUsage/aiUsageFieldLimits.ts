/** Bounds for one recorded model call. */
export const AI_FUNCTION_NAME_MAX_LENGTH = 64;
export const AI_MODEL_NAME_MAX_LENGTH = 64;
export const AI_TOKENS_MIN = 0;

/**
 * Cost travels as a decimal string, never as a float.
 *
 * These rows get summed over months of usage, and a float sum of fractions of
 * a cent is wrong in a way nobody notices until the invoice.
 */
export const AI_COST_PRECISION = 12;
export const AI_COST_SCALE = 6;
