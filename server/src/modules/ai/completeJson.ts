import { z, type ZodType } from 'zod';

import type { AiImage } from '../../ai/aiImage.js';
import { AI_ERROR_MESSAGES } from '../../ai/aiErrorMessages.js';
import { EMPTY_AI_TOKEN_USAGE, addAiTokenUsage, type AiTokenUsage } from '../../ai/aiTokenUsage.js';
import {
  AI_VALIDATION_ATTEMPTS,
  type AiEffort,
  type AiModelId,
} from '../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../ai/textCompletionClient.js';

import { AiCompletionFailure, type SpentAiCall } from './aiCompletionFailure.js';
import { AI_MODEL_ROUTES } from './constants/aiModelRoutes.js';
import type { AiFunctionName } from './constants/aiFunctionNames.js';
import { readJsonPayload } from './readJsonPayload.js';

const FIRST_ATTEMPT = 0;
const LINE_BREAK = '\n\n';

/**
 * What a retry is told about the attempt before it.
 *
 * The correction carries the validation error itself rather than a generic
 * "try again": the second call is only worth making if it knows what was wrong
 * with the first.
 */
const CORRECTION_PREFIX =
  'Your previous answer did not match the required shape and was rejected. Answer again with nothing but the JSON object. The problem was:';

export interface JsonCompletionRequest<TValue> {
  readonly client: TextCompletionClient;
  readonly schema: ZodType<TValue>;
  /**
   * What this call is for, which is also what picks the model.
   *
   * Named here rather than at the two places downstream that need it, so the
   * model a question was sent to and the row that bills it cannot disagree
   * about which feature spent the money.
   */
  readonly functionName: AiFunctionName;
  readonly system: string;
  readonly prompt: string;
  readonly image?: AiImage;
  readonly maxTokens: number;
  readonly effort: AiEffort;
}

/**
 * A validated answer, and everything the attempts cost together.
 *
 * The token counts are summed across the retry rather than reported for the
 * successful call alone: a retry is spent money, and a usage log that hides it
 * is a usage log that disagrees with the invoice.
 */
export interface JsonCompletion<TValue> {
  readonly value: TValue;
  readonly functionName: AiFunctionName;
  /** What the provider says answered, which is a dated variant of the id below. */
  readonly model: string;
  /** What was asked for, and therefore what the cost is priced against. */
  readonly modelId: AiModelId;
  readonly usage: AiTokenUsage;
}

/**
 * Asks a model for one JSON object and refuses to believe it until Zod agrees.
 *
 * A malformed answer is retried exactly once, with the validation error handed
 * back. Once, because the second attempt is what tells the two cases apart: a
 * model that slipped, and a photograph nothing can be read from. A third would
 * only spend somebody's afternoon proving the same thing.
 *
 * Every way out of here reports what was spent. Returning is the easy half;
 * the half that was missing is that giving up after two malformed answers, or
 * having the provider fail with one attempt already paid for, are both money
 * gone - and an exception carrying no token count is money nobody can bill,
 * cap or show on a dashboard.
 */
export const completeJson = async <TValue>({
  client,
  schema,
  functionName,
  system,
  prompt,
  image,
  maxTokens,
  effort,
}: JsonCompletionRequest<TValue>): Promise<JsonCompletion<TValue>> => {
  const modelId = AI_MODEL_ROUTES[functionName];

  let usage = EMPTY_AI_TOKEN_USAGE;
  /**
   * The id that was asked for, until the provider names its own dated variant.
   *
   * A call that failed before any answer came back still has to be billed, and
   * a usage row naming no model at all is one nobody can price or read.
   */
  let model: string = modelId;
  let correction = '';

  const spent = (): SpentAiCall => ({ functionName, model, modelId, usage });

  for (let attempt = FIRST_ATTEMPT; attempt < AI_VALIDATION_ATTEMPTS; attempt += 1) {
    /*
     * A provider that fails on the second attempt has still been paid for the
     * first, so its error is re-thrown carrying what the first one cost rather
     * than propagating raw and taking that figure with it.
     */
    const completion = await client
      .complete({
        model: modelId,
        system,
        prompt: correction === '' ? prompt : [prompt, correction].join(LINE_BREAK),
        image,
        maxTokens,
        effort,
      })
      .catch((cause: unknown): never => {
        throw new AiCompletionFailure(AI_ERROR_MESSAGES.providerUnreachable, spent(), cause);
      });

    usage = addAiTokenUsage(usage, completion.usage);
    model = completion.model;

    const parsed = schema.safeParse(readJsonPayload(completion.text));

    if (parsed.success) {
      return { value: parsed.data, functionName, model, modelId, usage };
    }

    correction = [CORRECTION_PREFIX, z.prettifyError(parsed.error)].join(LINE_BREAK);
  }

  throw new AiCompletionFailure(AI_ERROR_MESSAGES.answerMalformed, spent());
};
