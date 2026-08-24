import { estimateAiCost } from '../../ai/estimateAiCost.js';
import { totalInputTokens } from '../../ai/aiTokenUsage.js';
import type { AiUsageService } from '../aiUsage/aiUsageService.js';

import type { JsonCompletion } from './completeJson.js';
import type { AiFunctionName } from './constants/aiFunctionNames.js';

export interface JsonUsageRecord {
  readonly userId: string;
  readonly functionName: AiFunctionName;
  readonly completion: JsonCompletion<unknown>;
}

/**
 * Bills one answer, retry included.
 *
 * Written once rather than four times, because every AI service ends the same
 * way and the arithmetic behind `cost_estimate` is the part nobody would
 * notice going wrong. The one number a caller could get subtly different on
 * its own - which tiers of input tokens were involved - is settled here.
 */
export const recordJsonUsage = async (
  aiUsageService: AiUsageService,
  { userId, functionName, completion }: JsonUsageRecord,
): Promise<void> => {
  await aiUsageService.record({
    userId,
    functionName,
    model: completion.model,
    tokensIn: totalInputTokens(completion.usage),
    tokensOut: completion.usage.tokensOut,
    costEstimate: estimateAiCost(completion.usage),
  });
};
