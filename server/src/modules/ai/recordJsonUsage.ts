import { estimateAiCost } from '../../ai/estimateAiCost.js';
import { totalInputTokens } from '../../ai/aiTokenUsage.js';
import type { AiUsageService } from '../aiUsage/aiUsageService.js';

import type { SpentAiCall } from './aiCompletionFailure.js';

export interface JsonUsageRecord {
  readonly userId: string;
  /**
   * What the call consumed.
   *
   * Typed as the four fields a bill is made of rather than as a completion, so
   * that a call which produced a usable answer and one which produced nothing
   * are billed by the same code. The failing case is the one that used to be
   * missed, and it has no value to report - only a cost.
   */
  readonly spent: SpentAiCall;
}

/**
 * Bills one model call, retry included.
 *
 * Written once rather than nine times, because every AI service ends the same
 * way and the arithmetic behind `cost_estimate` is the part nobody would
 * notice going wrong. The two numbers a caller could get subtly different on
 * its own are settled here: which tiers of input tokens were involved, and
 * which model's rates they are priced at.
 *
 * The function name and the model both come off the call itself rather than
 * being passed alongside it, so a row can never claim one feature spent money
 * that a different feature actually spent.
 */
export const recordJsonUsage = async (
  aiUsageService: AiUsageService,
  { userId, spent }: JsonUsageRecord,
): Promise<void> => {
  await aiUsageService.record({
    userId,
    functionName: spent.functionName,
    model: spent.model,
    tokensIn: totalInputTokens(spent.usage),
    tokensOut: spent.usage.tokensOut,
    costEstimate: estimateAiCost(spent.usage, spent.modelId),
  });
};
