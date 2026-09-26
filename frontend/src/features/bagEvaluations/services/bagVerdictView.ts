import type { BagEvaluation } from '@brewmate/shared';

import type { BagScanField } from '../constants/bagScan';

/** Something the verdict could not see, as a sentence somebody can read. */
export interface BagVerdictUncertainty {
  readonly field: string;
  readonly reason: string;
}

/**
 * One line of the argument, and the fact it was argued from.
 *
 * `field` is null for a verdict a model wrote, because the contract carries
 * its reasons as prose and nothing in a sentence says which fact produced it.
 * Guessing at that by matching Slovak keywords would be the screen inventing a
 * classification nobody made, so those lines get a neutral mark instead - and
 * the offline rules, which do know, get the mark of the argument they made.
 */
export interface BagVerdictReason {
  readonly text: string;
  readonly field: BagScanField | null;
}

/**
 * A verdict as the screen shows it, whoever wrote it.
 *
 * One shape for both paths on purpose. The card must not look different
 * depending on whether the sentences came from a model or from the four
 * offline rules - what changes is what it says about itself, which is
 * `isLocal` and `isFromHistory` and nothing else.
 */
export interface BagVerdictView {
  /** Only the offline rules produce a headline; a written verdict is its own. */
  readonly headline: string | null;
  readonly text: string;
  readonly reasons: readonly BagVerdictReason[];
  readonly uncertainties: readonly BagVerdictUncertainty[];
  /** True when this verdict was given on an earlier afternoon. */
  readonly isFromHistory: boolean;
  readonly writtenAt: string | null;
  /** True when the offline rules wrote it because nothing else could. */
  readonly isLocal: boolean;
}

const NOT_LOCAL = false;
const UNTYPED = null;

/** A stored evaluation, as the card reads it. */
export const toBagVerdictView = (
  evaluation: BagEvaluation,
  isFromHistory: boolean,
  fallbackText: string,
): BagVerdictView => ({
  headline: null,
  text: evaluation.verdictText ?? fallbackText,
  reasons: evaluation.reasoning.points.map((text: string): BagVerdictReason => ({
    text,
    field: UNTYPED,
  })),
  uncertainties: evaluation.uncertainties.items,
  isFromHistory,
  writtenAt: evaluation.createdAt,
  isLocal: NOT_LOCAL,
});
