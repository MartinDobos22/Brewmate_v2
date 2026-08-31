import type { ImageFetcher } from '../ai/imageFetcher.js';
import type { LabelTextReader } from '../ai/labelTextReader.js';
import type { TextCompletionClient } from '../ai/textCompletionClient.js';

/**
 * Everything the AI routes need, present or absent as a pair.
 *
 * One nullable field rather than two, because a model with no way to fetch the
 * photograph and a photograph with nothing to read it are both half a feature -
 * and two fields that must agree are two fields that eventually will not.
 *
 * The optical reader is the exception, and nullable inside the pair, because
 * it is genuinely a third thing: reading a label has always been the model's
 * job, and this only makes it better at small print and cheaper on the
 * photographs that were never going to work. A deployment without one reads
 * labels exactly as this application did before there was one.
 */
export interface AiDependencies {
  readonly completionClient: TextCompletionClient;
  readonly imageFetcher: ImageFetcher;
  readonly labelTextReader: LabelTextReader | null;
}
