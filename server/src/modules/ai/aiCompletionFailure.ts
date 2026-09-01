import type { AiTokenUsage } from '../../ai/aiTokenUsage.js';
import type { AiModelId } from '../../ai/constants/aiModels.js';

import type { AiFunctionName } from './constants/aiFunctionNames.js';

/**
 * What a model call consumed, whether or not it produced a usable answer.
 *
 * Named separately from the completion that usually carries it because the
 * failing case needs exactly these four fields and has no value to report: an
 * answer nobody could parse still burned tokens, and the row that bills them
 * has to say which feature spent them and at whose rates.
 */
export interface SpentAiCall {
  readonly functionName: AiFunctionName;
  /** What the provider says answered; the requested id until one has spoken. */
  readonly model: string;
  /** What was asked for, and therefore what the cost is priced against. */
  readonly modelId: AiModelId;
  readonly usage: AiTokenUsage;
}

/**
 * A model call that cost money and produced nothing usable.
 *
 * The tokens are the whole reason this type exists. A malformed answer is
 * retried once, so giving up means two calls have been paid for at the
 * provider - and before this carried them, both were invisible: absent from
 * `ai_usage_logs`, absent from the cost dashboard, and absent from the
 * allowance that exists to stop exactly this. The trigger is not rare either.
 * A photograph a model cannot read fails the same way every time and is
 * deliberately not cached, so each press of "Odfotiť znova" bought two more
 * unbilled calls.
 *
 * The message is preserved from the failure it describes rather than replaced,
 * because the services above tell a malformed answer from an unreachable
 * provider by reading it - one is a 400 the user can act on, the other a 503.
 */
export class AiCompletionFailure extends Error {
  public readonly spent: SpentAiCall;

  public constructor(message: string, spent: SpentAiCall, cause?: unknown) {
    super(message, { cause });

    this.name = AiCompletionFailure.name;
    this.spent = spent;
  }
}

export const isAiCompletionFailure = (error: unknown): error is AiCompletionFailure =>
  error instanceof AiCompletionFailure;
