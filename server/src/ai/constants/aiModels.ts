/**
 * The models this server may call, and what a call to each one costs.
 *
 * Two of them, because the work divides in two. Sonnet reads labels, writes
 * verdicts, writes recipes, answers what somebody said about a cup and dials
 * an espresso in - everything where the answer is an argument about a person's
 * coffee and being wrong is expensive. Haiku does the auxiliary work: putting
 * numbers that were already computed in code into a Slovak sentence. Sending
 * that to the larger model would be paying reasoning rates for typing.
 *
 * Which function goes where is not decided here - it is a routing table in
 * `modules/ai/constants/aiModelRoutes.ts`, next to the function names the
 * usage log is grouped by, so the model and the row recording it cannot drift.
 */
export const AI_MODELS = {
  sonnet: 'claude-sonnet-5',
  haiku: 'claude-haiku-4-5-20251001',
} as const;

export type AiModelId = (typeof AI_MODELS)[keyof typeof AI_MODELS];

/** Effort levels the provider accepts. */
export const AI_EFFORT_LEVELS = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export type AiEffort = (typeof AI_EFFORT_LEVELS)[keyof typeof AI_EFFORT_LEVELS];

/**
 * Output ceilings. Every answer here is a small, structured document; a
 * ceiling this size is a guard against a runaway response rather than a budget.
 *
 * A recipe is the longest of them - a pour schedule, a rationale and a hint per
 * missing piece of gear. A chat answer is shorter but may carry a patch, so it
 * gets room for both. An explanation is a paragraph and nothing else.
 */
export const AI_PARSE_MAX_TOKENS = 2048;
export const AI_VERDICT_MAX_TOKENS = 2048;
export const AI_RECIPE_MAX_TOKENS = 4096;
export const AI_CHAT_MAX_TOKENS = 3072;
export const AI_EXPLANATION_MAX_TOKENS = 1024;

/**
 * List price per million tokens, in the provider's billing currency, for each
 * model and each tier of token.
 *
 * The standard rates rather than any introductory one: a cost estimate that
 * quietly reports less than the invoice is worse than no estimate at all.
 *
 * All four tiers are priced separately because caching is what makes these
 * prompts affordable. Brewmate's system prompts are long, unchanging documents
 * that get re-sent on every brew; a cache read costs a tenth of fresh input
 * and a cache write carries a surcharge over it. Charging all three at the
 * fresh rate would report roughly ten times what a call actually cost, and a
 * cost estimate that disagrees with the invoice in either direction is worse
 * than none.
 *
 * A model that reaches this table without an entry is a deployment mistake
 * rather than a runtime case, which is why the record is total over `AiModelId`
 * and adding a model is a type error here.
 */
export interface AiModelPricing {
  readonly input: number;
  readonly output: number;
  readonly cacheWrite: number;
  readonly cacheRead: number;
}

export const AI_MODEL_PRICING: Record<AiModelId, AiModelPricing> = {
  [AI_MODELS.sonnet]: { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
  [AI_MODELS.haiku]: { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
};

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
