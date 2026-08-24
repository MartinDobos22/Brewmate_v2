import type { AiImage } from './aiImage.js';
import type { AiTokenUsage } from './aiTokenUsage.js';
import type { AiEffort, AiModelId } from './constants/aiModels.js';

/**
 * One question put to a model, with an optional photograph attached.
 *
 * The model is named by the caller rather than chosen here, because which
 * model answers which question is a routing decision that belongs beside the
 * function names the usage log is grouped by - not inside the client that
 * makes the call.
 */
export interface AiCompletionRequest {
  readonly model: AiModelId;
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
