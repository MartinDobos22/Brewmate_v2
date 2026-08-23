import type { BagEvaluation } from '@brewmate/shared';

/** Something the verdict could not see, as a sentence somebody can read. */
export interface BagVerdictUncertainty {
  readonly field: string;
  readonly reason: string;
}

/**
 * A verdict as the screen shows it, whoever wrote it.
 *
 * One shape for both paths on purpose. The card must not look different
 * depending on whether the sentences came from a model or from the three
 * offline rules - what changes is what it says about itself, which is `isLocal`
 * and `isFromHistory` and nothing else.
 */
export interface BagVerdictView {
  /** Only the offline rules produce a headline; a written verdict is its own. */
  readonly headline: string | null;
  readonly text: string;
  readonly reasons: readonly string[];
  readonly uncertainties: readonly BagVerdictUncertainty[];
  /** True when this verdict was given on an earlier afternoon. */
  readonly isFromHistory: boolean;
  readonly writtenAt: string | null;
  /** True when the three offline rules wrote it because nothing else could. */
  readonly isLocal: boolean;
}

const NOT_LOCAL = false;

/** A stored evaluation, as the card reads it. */
export const toBagVerdictView = (
  evaluation: BagEvaluation,
  isFromHistory: boolean,
  fallbackText: string,
): BagVerdictView => ({
  headline: null,
  text: evaluation.verdictText ?? fallbackText,
  reasons: evaluation.reasoning.points,
  uncertainties: evaluation.uncertainties.items,
  isFromHistory,
  writtenAt: evaluation.createdAt,
  isLocal: NOT_LOCAL,
});
