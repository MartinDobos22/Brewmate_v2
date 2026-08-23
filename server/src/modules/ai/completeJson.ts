import { z, type ZodType } from 'zod';

import type { AiImage } from '../../ai/aiImage.js';
import { AI_ERROR_MESSAGES } from '../../ai/aiErrorMessages.js';
import { AI_VALIDATION_ATTEMPTS, type AiEffort } from '../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../ai/textCompletionClient.js';

import { readJsonPayload } from './readJsonPayload.js';

const NO_TOKENS = 0;
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
  readonly model: string;
  readonly tokensIn: number;
  readonly tokensOut: number;
}

/**
 * Asks a model for one JSON object and refuses to believe it until Zod agrees.
 *
 * A malformed answer is retried exactly once, with the validation error handed
 * back. Once, because the second attempt is what tells the two cases apart: a
 * model that slipped, and a photograph nothing can be read from. A third would
 * only spend somebody's afternoon proving the same thing.
 */
export const completeJson = async <TValue>({
  client,
  schema,
  system,
  prompt,
  image,
  maxTokens,
  effort,
}: JsonCompletionRequest<TValue>): Promise<JsonCompletion<TValue>> => {
  let tokensIn = NO_TOKENS;
  let tokensOut = NO_TOKENS;
  let model = '';
  let correction = '';

  for (let attempt = FIRST_ATTEMPT; attempt < AI_VALIDATION_ATTEMPTS; attempt += 1) {
    const completion = await client.complete({
      system,
      prompt: correction === '' ? prompt : [prompt, correction].join(LINE_BREAK),
      image,
      maxTokens,
      effort,
    });

    tokensIn += completion.tokensIn;
    tokensOut += completion.tokensOut;
    model = completion.model;

    const parsed = schema.safeParse(readJsonPayload(completion.text));

    if (parsed.success) {
      return { value: parsed.data, model, tokensIn, tokensOut };
    }

    correction = [CORRECTION_PREFIX, z.prettifyError(parsed.error)].join(LINE_BREAK);
  }

  throw new Error(AI_ERROR_MESSAGES.answerMalformed);
};
