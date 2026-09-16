import type { LabelTextReader } from '../ai/labelTextReader.js';
import type { TextCompletionClient } from '../ai/textCompletionClient.js';

/**
 * Everything the AI routes need.
 *
 * It used to carry an image fetcher beside the model, as a pair that had to be
 * present or absent together: the app put a photograph in a bucket and this
 * server went and got it, which is a third party and therefore a port. The
 * bytes arrive in the request now, so reading one is arithmetic and there is
 * nothing left to inject.
 *
 * The optical reader is the exception, and nullable inside the pair, because
 * it is genuinely a third thing: reading a label has always been the model's
 * job, and this only makes it better at small print and cheaper on the
 * photographs that were never going to work. A deployment without one reads
 * labels exactly as this application did before there was one.
 */
export interface AiDependencies {
  readonly completionClient: TextCompletionClient;
  readonly labelTextReader: LabelTextReader | null;
}
