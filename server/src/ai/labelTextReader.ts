import type { LabelPhotoIssue } from '@brewmate/shared';

import type { AiImage } from './aiImage.js';

/**
 * What an optical reader made of a photographed label.
 *
 * The transcript and the complaint travel together because they are one
 * answer: the reasons a photograph is refused are all facts about how the
 * transcription went, and a reader that reported them separately could report
 * a confident transcript beside a complaint that nothing was legible.
 */
export interface LabelPhotoReading {
  /** What is printed on the label, as far as it could be made out. */
  readonly text: string;
  /**
   * Why the photograph is not worth reading. Empty is the ordinary answer:
   * somebody looked and had no complaint.
   */
  readonly issues: readonly LabelPhotoIssue[];
}

/**
 * Reads the text off a photographed label and judges the photograph itself.
 *
 * An interface for the same reason `ImageFetcher` is one: the real
 * implementation talks to a third party over the network, and neither the
 * tests nor a deployment without a key should have to. Unlike that one it is
 * genuinely optional - the model has always been able to read a label on its
 * own, and this only makes it better at the small print and cheaper on the
 * photographs that were never going to work.
 */
export interface LabelTextReader {
  read(image: AiImage): Promise<LabelPhotoReading>;
}
