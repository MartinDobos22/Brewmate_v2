/**
 * What one model call consumed, split the way the provider bills it.
 *
 * Four numbers rather than two, because prompt caching prices input tokens in
 * three tiers: fresh input, the surcharge for writing a prompt into the cache,
 * and the tenth of the price a cached prefix costs to read back. Summing them
 * into one figure and pricing it at the fresh rate would report several times
 * the real cost of a cached call - and a cost estimate that disagrees with the
 * invoice in either direction is worse than no estimate at all.
 */
export interface AiTokenUsage {
  /** Input tokens the provider read afresh. */
  readonly tokensIn: number;
  /** Input tokens written into the cache, billed at a surcharge. */
  readonly cacheWriteTokens: number;
  /** Input tokens served from the cache, billed at a fraction. */
  readonly cacheReadTokens: number;
  readonly tokensOut: number;
}

const NO_TOKENS = 0;

export const EMPTY_AI_TOKEN_USAGE: AiTokenUsage = {
  tokensIn: NO_TOKENS,
  cacheWriteTokens: NO_TOKENS,
  cacheReadTokens: NO_TOKENS,
  tokensOut: NO_TOKENS,
};

/**
 * Two calls, added up.
 *
 * Used across the one retry a malformed answer gets: a retry is spent money,
 * and a usage log that hides it is a usage log that disagrees with the invoice.
 */
export const addAiTokenUsage = (left: AiTokenUsage, right: AiTokenUsage): AiTokenUsage => ({
  tokensIn: left.tokensIn + right.tokensIn,
  cacheWriteTokens: left.cacheWriteTokens + right.cacheWriteTokens,
  cacheReadTokens: left.cacheReadTokens + right.cacheReadTokens,
  tokensOut: left.tokensOut + right.tokensOut,
});

/**
 * Every input token, whatever it cost.
 *
 * `ai_usage_logs.tokens_in` records this rather than the fresh tokens alone,
 * because the column answers "how much was the model asked", and a cached
 * prefix was still read. What the three tiers cost is already settled by then,
 * in `cost_estimate`.
 */
export const totalInputTokens = (usage: AiTokenUsage): number =>
  usage.tokensIn + usage.cacheWriteTokens + usage.cacheReadTokens;
