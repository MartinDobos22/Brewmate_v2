import {
  AI_COST_DECIMAL_PLACES,
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
 */
export const estimateAiCost = (tokensIn: number, tokensOut: number): string => {
  const cost =
    (tokensIn * AI_COST_PER_MILLION_INPUT_TOKENS + tokensOut * AI_COST_PER_MILLION_OUTPUT_TOKENS) /
    TOKENS_PER_MILLION;

  return cost.toFixed(AI_COST_DECIMAL_PLACES);
};
