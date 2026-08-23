import type { ImageFetcher } from '../ai/imageFetcher.js';
import type { TextCompletionClient } from '../ai/textCompletionClient.js';

/**
 * Everything the two AI routes need, present or absent as a pair.
 *
 * One nullable field rather than two, because a model with no way to fetch the
 * photograph and a photograph with nothing to read it are both half a feature -
 * and two fields that must agree are two fields that eventually will not.
 */
export interface AiDependencies {
  readonly completionClient: TextCompletionClient;
  readonly imageFetcher: ImageFetcher;
}
