import type { BagEvaluation } from '@brewmate/shared';

import { SCAN_OUTCOMES, type ScanOutcome } from '../constants/scanOutcomes';

const NAME_SEPARATOR = ' · ';
const EMPTY = '';
const VERDICT_PREVIEW_START = 0;
const VERDICT_PREVIEW_LENGTH = 90;

/** What a past verdict was about, as it was written on the label. */
export const scanHistoryTitle = (evaluation: BagEvaluation, fallback: string): string => {
  const name = [evaluation.parsedData.roaster, evaluation.parsedData.name]
    .filter(
      (part: string | null | undefined): part is string =>
        part !== null && part !== undefined && part.trim() !== EMPTY,
    )
    .join(NAME_SEPARATOR);

  return name === EMPTY ? fallback : name;
};

/**
 * What the app said, cut short.
 *
 * The point of the list is recognising a bag, not re-reading the argument -
 * which is why this is a preview rather than the whole verdict wrapped over
 * four lines.
 */
export const scanVerdictPreview = (evaluation: BagEvaluation): string =>
  (evaluation.verdictText ?? EMPTY).slice(VERDICT_PREVIEW_START, VERDICT_PREVIEW_LENGTH);

/**
 * What happened after the advice, as a value the screen can colour and label
 * rather than a sentence already joined into the subtitle.
 *
 * This is the only thing the app ever learns about whether it was any good at
 * this, so it is worth being able to see at a glance down a list.
 */
export const resolveScanOutcome = (evaluation: BagEvaluation): ScanOutcome => {
  if (evaluation.wasPurchased === null) {
    return SCAN_OUTCOMES.undecided;
  }

  return evaluation.wasPurchased ? SCAN_OUTCOMES.bought : SCAN_OUTCOMES.left;
};
