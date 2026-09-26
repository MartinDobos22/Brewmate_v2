import type { TranslationKey } from '../../../i18n';
import type { BagScanField } from '../constants/bagScan';

/**
 * One argument the verdict makes, and whether it counts for or against.
 *
 * It also carries the fact it was argued from. The rule that produced it knows
 * - the roast rule argued from a roast level, the freshness rule from a date -
 * and carrying that through is what lets the screen mark each line with the
 * kind of argument it is rather than with one bullet for all of them.
 */
export interface BagVerdictPoint {
  readonly key: TranslationKey;
  readonly field: BagScanField;
  readonly isAgainst: boolean;
}

/** Something the verdict could not see, kept apart from what it concluded. */
export interface BagUncertainty {
  readonly field: string;
  readonly reasonKey: TranslationKey;
}

export interface BagVerdictParts {
  readonly points: readonly BagVerdictPoint[];
  readonly uncertainties: readonly BagUncertainty[];
}
