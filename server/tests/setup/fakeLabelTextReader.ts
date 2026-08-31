import type { LabelPhotoIssue } from '@brewmate/shared';

import type { AiImage } from '../../src/ai/aiImage.js';
import type { LabelPhotoReading, LabelTextReader } from '../../src/ai/labelTextReader.js';

/** What a photograph nobody has said anything about is transcribed as. */
const DEFAULT_TRANSCRIPT = 'Kiamugumo AA\nKeňa\npražené 2025-01-04';

const NO_ISSUES: readonly LabelPhotoIssue[] = [];

export interface RecordingLabelTextReader extends LabelTextReader {
  /** How many photographs were inspected, so a cached scan can be proved free. */
  readonly calls: readonly AiImage[];
  /** The next photograph reads back as this. */
  readonly answerWith: (reading: LabelPhotoReading) => void;
  /** The next photograph cannot be inspected at all. */
  readonly failWith: (failure: Error) => void;
  readonly reset: () => void;
}

/**
 * Stands in for the optical reader.
 *
 * Real annotation calls cannot be made in CI, cost money and are not
 * deterministic - and none of the behaviour worth testing is Google's. What is
 * worth testing is everything around it: that a refused photograph never
 * reaches the model, that a reader nobody can reach takes nothing away, and
 * that a photograph already read is not inspected a second time.
 */
export const createFakeLabelTextReader = (): RecordingLabelTextReader => {
  const calls: AiImage[] = [];
  let reading: LabelPhotoReading = { text: DEFAULT_TRANSCRIPT, issues: NO_ISSUES };
  let failure: Error | null = null;

  return {
    calls,

    read: (image: AiImage): Promise<LabelPhotoReading> => {
      calls.push(image);

      return failure === null ? Promise.resolve(reading) : Promise.reject(failure);
    },

    answerWith: (next: LabelPhotoReading): void => {
      reading = next;
      failure = null;
    },

    failWith: (next: Error): void => {
      failure = next;
    },

    reset: (): void => {
      calls.length = 0;
      reading = { text: DEFAULT_TRANSCRIPT, issues: NO_ISSUES };
      failure = null;
    },
  };
};
