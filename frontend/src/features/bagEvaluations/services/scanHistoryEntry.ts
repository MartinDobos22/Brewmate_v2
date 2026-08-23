import type { BagEvaluation } from '@brewmate/shared';

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

export interface ScanOutcomeLabels {
  readonly bought: string;
  readonly left: string;
  readonly undecided: string;
}

const outcomeLabel = (wasPurchased: boolean | null, labels: ScanOutcomeLabels): string => {
  if (wasPurchased === null) {
    return labels.undecided;
  }

  return wasPurchased ? labels.bought : labels.left;
};

/**
 * The line under a past verdict: what the app said, and what happened next.
 *
 * The verdict is cut short rather than wrapped over four lines - the point of
 * the list is recognising a bag, and the full argument is one tap away on the
 * screen that produced it.
 */
export const scanHistorySubtitle = (
  evaluation: BagEvaluation,
  labels: ScanOutcomeLabels,
): string => {
  const preview = (evaluation.verdictText ?? EMPTY).slice(
    VERDICT_PREVIEW_START,
    VERDICT_PREVIEW_LENGTH,
  );

  return [outcomeLabel(evaluation.wasPurchased, labels), preview]
    .filter((part: string): boolean => part !== EMPTY)
    .join(NAME_SEPARATOR);
};
