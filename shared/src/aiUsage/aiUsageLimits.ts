/**
 * What one account may spend on models, per day and per month.
 *
 * Both windows exist because they answer different failures. The daily ceiling
 * catches a loop - a screen that retries a scan every second - before it has
 * cost anything worth noticing. The monthly one is the actual budget: a
 * fortnight of ordinary use sits comfortably underneath it, and nothing about
 * brewing coffee needs six hundred model calls in a month.
 *
 * Both a call count and a cost ceiling, for the same reason. Calls are what
 * runs away; money is what hurts. A recipe and a one-line chat answer cost
 * very different amounts, so counting either alone would leave one of the two
 * failures unguarded.
 *
 * These are in the contract rather than in the server's configuration because
 * the app prints them: a dashboard that says "40 denne" while the API enforces
 * something else is a dashboard nobody can plan around.
 */
export const AI_DAILY_CALL_LIMIT = 40;
export const AI_MONTHLY_CALL_LIMIT = 600;

/**
 * Ceilings in the provider's billing currency.
 *
 * Compared against a sum PostgreSQL computes in `numeric`, so the total itself
 * is exact; only the comparison happens in floating point, and it decides
 * whether one more call is allowed. Being wrong by a millionth of a cent there
 * changes nothing anybody can observe.
 */
export const AI_DAILY_COST_LIMIT = 1.5;
export const AI_MONTHLY_COST_LIMIT = 15;

/** The two windows usage is measured over. Both roll over in UTC. */
export const AI_USAGE_WINDOWS = {
  day: 'day',
  month: 'month',
} as const;

export type AiUsageWindowName = (typeof AI_USAGE_WINDOWS)[keyof typeof AI_USAGE_WINDOWS];

/** Which of the two ceilings a window ran into. */
export const AI_LIMIT_KINDS = {
  calls: 'calls',
  cost: 'cost',
} as const;

export type AiLimitKind = (typeof AI_LIMIT_KINDS)[keyof typeof AI_LIMIT_KINDS];
