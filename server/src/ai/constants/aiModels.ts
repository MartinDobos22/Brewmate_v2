/**
 * The model behind the camera, and what one call to it costs.
 *
 * Reading a label is extraction, not reasoning: the effort is deliberately low
 * so a scan in a shop comes back while somebody is still holding the bag. The
 * verdict is left at the provider's default, because that one is an argument
 * about a person's taste and is worth thinking about.
 */
export const AI_MODEL_ID = 'claude-sonnet-5';

/** Effort levels the provider accepts. */
export const AI_EFFORT_LEVELS = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export type AiEffort = (typeof AI_EFFORT_LEVELS)[keyof typeof AI_EFFORT_LEVELS];

/**
 * Output ceilings. Both answers are small, structured documents; a ceiling
 * this size is a guard against a runaway response rather than a budget.
 */
export const AI_PARSE_MAX_TOKENS = 2048;
export const AI_VERDICT_MAX_TOKENS = 2048;

/**
 * List price per million tokens, in the provider's billing currency.
 *
 * The standard rate rather than the introductory one: a cost estimate that
 * quietly reports less than the invoice is worse than no estimate at all.
 */
export const AI_COST_PER_MILLION_INPUT_TOKENS = 3;
export const AI_COST_PER_MILLION_OUTPUT_TOKENS = 15;
export const TOKENS_PER_MILLION = 1000000;

/** Decimal places a recorded cost keeps, matching `ai_usage_logs.cost_estimate`. */
export const AI_COST_DECIMAL_PLACES = 6;

/**
 * A malformed answer is retried exactly once.
 *
 * Once, because the second attempt is the one that tells the two cases apart:
 * a model that slipped, and a photograph nothing can be read from. Retrying a
 * third time only spends somebody's afternoon proving the same thing.
 */
export const AI_VALIDATION_ATTEMPTS = 2;
