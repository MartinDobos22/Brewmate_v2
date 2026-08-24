import { estimateAiCost } from '../../ai/estimateAiCost.js';
import { totalInputTokens } from '../../ai/aiTokenUsage.js';
import type { AiUsageService } from '../aiUsage/aiUsageService.js';

import type { JsonCompletion } from './completeJson.js';

export interface JsonUsageRecord {
  readonly userId: string;
  readonly completion: JsonCompletion<unknown>;
}

/**
 * Bills one answer, retry included.
 *
 * Written once rather than eight times, because every AI service ends the same
 * way and the arithmetic behind `cost_estimate` is the part nobody would
 * notice going wrong. The two numbers a caller could get subtly different on
 * its own are settled here: which tiers of input tokens were involved, and
 * which model's rates they are priced at.
 *
 * The function name and the model both come off the completion rather than
 * being passed alongside it, so a row can never claim one feature spent money
 * that a different feature actually spent.
 */
export const recordJsonUsage = async (
  aiUsageService: AiUsageService,
  { userId, completion }: JsonUsageRecord,
): Promise<void> => {
  await aiUsageService.record({
    userId,
    functionName: completion.functionName,
    model: completion.model,
    tokensIn: totalInputTokens(completion.usage),
    tokensOut: completion.usage.tokensOut,
    costEstimate: estimateAiCost(completion.usage, completion.modelId),
  });
};
