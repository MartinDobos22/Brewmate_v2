import type { AiTokenUsage } from './aiTokenUsage.js';
import {
  AI_COST_DECIMAL_PLACES,
  AI_MODEL_PRICING,
  TOKENS_PER_MILLION,
  type AiModelId,
} from './constants/aiModels.js';

/**
 * What one call cost, as a decimal string.
 *
 * A string rather than a number because `ai_usage_logs.cost_estimate` is
 * `numeric`: these rows get summed over months, and a float sum of fractions
 * of a cent is wrong in the way nobody notices until the invoice.
 *
 * Priced against the model that was *asked for* rather than the one named in
 * the answer. The provider returns a dated variant of the same model, and
 * looking a price up by that string would either need a table of every dated
 * name or a prefix match that silently prices an unknown model at zero. The
 * requested id is the one this server chose, and it is the one the routing
 * table has a rate for.
 *
 * Each tier is priced at its own rate. A cached system prompt is the whole
 * point of caching one, and charging a cache read at the fresh input rate
 * would report roughly ten times what the call actually cost.
 */
export const estimateAiCost = (usage: AiTokenUsage, model: AiModelId): string => {
  const pricing = AI_MODEL_PRICING[model];

  const cost =
    (usage.tokensIn * pricing.input +
      usage.cacheWriteTokens * pricing.cacheWrite +
      usage.cacheReadTokens * pricing.cacheRead +
      usage.tokensOut * pricing.output) /
    TOKENS_PER_MILLION;

  return cost.toFixed(AI_COST_DECIMAL_PLACES);
};
