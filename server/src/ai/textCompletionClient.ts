import type { AiCompletion, AiCompletionRequest } from './aiCompletion.js';

/**
 * The one way this server talks to a model.
 *
 * Deliberately small: a system prompt, a question, maybe a picture, and text
 * back. Everything that makes an answer useful - the schema it has to satisfy,
 * the retry when it does not, the row written to `ai_usage_logs` - belongs to
 * the services above, which is what keeps this replaceable and testable.
 */
export interface TextCompletionClient {
  complete(request: AiCompletionRequest): Promise<AiCompletion>;
}
