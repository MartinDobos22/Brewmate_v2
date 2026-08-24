import type { AiTokenUsage } from './aiTokenUsage.js';
import {
  AI_COST_DECIMAL_PLACES,
  AI_COST_PER_MILLION_CACHE_READ_TOKENS,
  AI_COST_PER_MILLION_CACHE_WRITE_TOKENS,
  AI_COST_PER_MILLION_INPUT_TOKENS,
  AI_COST_PER_MILLION_OUTPUT_TOKENS,
  TOKENS_PER_MILLION,
} from './constants/aiModels.js';

/**
 * What one call cost, as a decimal string.
 *
 * A string rather than a number because `ai_usage_logs.cost_estimate` is
 * `numeric`: these rows get summed over months, and a float sum of fractions
 * of a cent is wrong in the way nobody notices until the invoice.
 *
 * Each tier is priced at its own rate. A cached system prompt is the whole
 * point of caching one, and charging a cache read at the fresh input rate
 * would report roughly ten times what the call actually cost.
 */
export const estimateAiCost = (usage: AiTokenUsage): string => {
  const cost =
    (usage.tokensIn * AI_COST_PER_MILLION_INPUT_TOKENS +
      usage.cacheWriteTokens * AI_COST_PER_MILLION_CACHE_WRITE_TOKENS +
      usage.cacheReadTokens * AI_COST_PER_MILLION_CACHE_READ_TOKENS +
      usage.tokensOut * AI_COST_PER_MILLION_OUTPUT_TOKENS) /
    TOKENS_PER_MILLION;

  return cost.toFixed(AI_COST_DECIMAL_PLACES);
};
