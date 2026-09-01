import type { AiCompletion, AiCompletionRequest } from '../../src/ai/aiCompletion.js';
import type { TextCompletionClient } from '../../src/ai/textCompletionClient.js';

const TOKENS_IN = 1200;
const CACHE_READ_TOKENS = 800;
const NO_TOKENS = 0;
const TOKENS_OUT = 300;
const MODEL = 'fake-model';
const FIRST = 0;

/** A recorded call, so a test can assert what the model was actually asked. */
export interface RecordingCompletionClient extends TextCompletionClient {
  readonly calls: readonly AiCompletionRequest[];
  /** Queues one answer; the client hands them out in order and repeats the last. */
  readonly answerWith: (...answers: readonly string[]) => void;
  /**
   * Makes every call from now on reject, standing in for a provider that is
   * down rather than one that answered badly. The two are billed differently:
   * a provider that never answered consumed nothing, and charging somebody's
   * allowance for our outage would take the app away for a reason that was
   * never theirs.
   */
  readonly failWith: (error: Error) => void;
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
  let failure: Error | null = null;
  const calls: AiCompletionRequest[] = [];

  return {
    calls,

    answerWith: (...answers: readonly string[]): void => {
      queue = [...answers];
      failure = null;
    },

    failWith: (error: Error): void => {
      failure = error;
    },

    reset: (): void => {
      queue = [];
      failure = null;
      calls.length = FIRST;
    },

    complete: (request: AiCompletionRequest): Promise<AiCompletion> => {
      calls.push(request);

      if (failure !== null) {
        return Promise.reject(failure);
      }

      const answer = queue.length > 1 ? (queue.shift() ?? '') : (queue[FIRST] ?? '');

      return Promise.resolve({
        text: answer,
        model: MODEL,
        usage: {
          tokensIn: TOKENS_IN,
          cacheWriteTokens: NO_TOKENS,
          /** A stand-in for the cached system prompt the real client marks. */
          cacheReadTokens: CACHE_READ_TOKENS,
          tokensOut: TOKENS_OUT,
        },
      });
    },
  };
};

export {
  TOKENS_IN as FAKE_TOKENS_IN,
  CACHE_READ_TOKENS as FAKE_CACHE_READ_TOKENS,
  TOKENS_OUT as FAKE_TOKENS_OUT,
  MODEL as FAKE_MODEL,
};
