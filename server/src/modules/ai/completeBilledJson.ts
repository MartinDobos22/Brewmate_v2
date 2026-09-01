import { totalInputTokens, type AiTokenUsage } from '../../ai/aiTokenUsage.js';
import type { AiUsageService } from '../aiUsage/aiUsageService.js';

import { isAiCompletionFailure } from './aiCompletionFailure.js';
import { completeJson, type JsonCompletion, type JsonCompletionRequest } from './completeJson.js';
import { recordJsonUsage } from './recordJsonUsage.js';

const NO_TOKENS = 0;

export interface BilledJsonCompletionRequest<TValue> extends JsonCompletionRequest<TValue> {
  readonly aiUsageService: AiUsageService;
  /** Whose allowance this comes out of. */
  readonly userId: string;
}

/**
 * A call that failed before the provider had read or written anything.
 *
 * Worth telling apart, because a usage row is also a call against the daily
 * ceiling: charging somebody's allowance for an outage of ours would take the
 * app away from them for a reason that was never theirs.
 */
const hasSpentTokens = (usage: AiTokenUsage): boolean =>
  totalInputTokens(usage) > NO_TOKENS || usage.tokensOut > NO_TOKENS;

/**
 * One model call, asked for and paid for in the same breath.
 *
 * The two used to be separate lines in each of nine services, and the second
 * one was only ever reached when the first succeeded. So the case that costs
 * the most - a malformed answer, retried once, still malformed - was the one
 * case nothing recorded: two calls at the provider, no row in
 * `ai_usage_logs`, nothing on the cost dashboard, and nothing counted against
 * the allowance that exists to stop precisely that. Joining them here makes
 * the omission unavailable rather than merely discouraged, which is the same
 * reason the allowance is a hook in front of `/ai/*` rather than a line in
 * every handler.
 *
 * Billing a failure must never replace it. A usage row that cannot be written
 * is a lost record; a usage row that throws on the way out of a failed request
 * would turn "this photograph could not be read" into "something went wrong on
 * the server", which is the one message the user cannot act on.
 */
export const completeBilledJson = async <TValue>(
  request: BilledJsonCompletionRequest<TValue>,
): Promise<JsonCompletion<TValue>> => {
  const { aiUsageService, userId } = request;

  try {
    const completion = await completeJson(request);

    await recordJsonUsage(aiUsageService, { userId, spent: completion });

    return completion;
  } catch (cause: unknown) {
    if (isAiCompletionFailure(cause) && hasSpentTokens(cause.spent.usage)) {
      await recordJsonUsage(aiUsageService, { userId, spent: cause.spent }).catch((): null => null);
    }

    throw cause;
  }
};
