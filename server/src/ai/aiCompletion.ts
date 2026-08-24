import type { AiImage } from './aiImage.js';
import type { AiTokenUsage } from './aiTokenUsage.js';
import type { AiEffort } from './constants/aiModels.js';

/** One question put to a model, with an optional photograph attached. */
export interface AiCompletionRequest {
  readonly system: string;
  readonly prompt: string;
  readonly image?: AiImage;
  readonly maxTokens: number;
  readonly effort: AiEffort;
}

/**
 * What came back, and what it cost.
 *
 * The token counts travel with the text because they are only knowable at the
 * call - deriving them afterwards would mean counting tokens a second time and
 * getting a different answer than the invoice.
 */
export interface AiCompletion {
  readonly text: string;
  readonly model: string;
  readonly usage: AiTokenUsage;
}
