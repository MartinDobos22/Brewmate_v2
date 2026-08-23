import type { AiCompletion, AiCompletionRequest } from '../../src/ai/aiCompletion.js';
import type { TextCompletionClient } from '../../src/ai/textCompletionClient.js';

const TOKENS_IN = 1200;
const TOKENS_OUT = 300;
const MODEL = 'fake-model';
const FIRST = 0;

/** A recorded call, so a test can assert what the model was actually asked. */
export interface RecordingCompletionClient extends TextCompletionClient {
  readonly calls: readonly AiCompletionRequest[];
  /** Queues one answer; the client hands them out in order and repeats the last. */
  readonly answerWith: (...answers: readonly string[]) => void;
  readonly reset: () => void;
}

/**
 * Stands in for the model.
 *
 * Real vision calls cannot be made in CI, cost money and are not
 * deterministic - and none of the behaviour worth testing is the model's. What
 * is worth testing is everything around it: that a malformed answer is retried
 * exactly once, that both attempts are billed, that a photograph read before
 * is not read again, and that a coffee already judged is not judged twice.
 */
export const createFakeCompletionClient = (): RecordingCompletionClient => {
  let queue: string[] = [];
  const calls: AiCompletionRequest[] = [];

  return {
    calls,

    answerWith: (...answers: readonly string[]): void => {
      queue = [...answers];
    },

    reset: (): void => {
      queue = [];
      calls.length = FIRST;
    },

    complete: (request: AiCompletionRequest): Promise<AiCompletion> => {
      calls.push(request);

      const answer = queue.length > 1 ? (queue.shift() ?? '') : (queue[FIRST] ?? '');

      return Promise.resolve({
        text: answer,
        model: MODEL,
        tokensIn: TOKENS_IN,
        tokensOut: TOKENS_OUT,
      });
    },
  };
};

export { TOKENS_IN as FAKE_TOKENS_IN, TOKENS_OUT as FAKE_TOKENS_OUT, MODEL as FAKE_MODEL };
