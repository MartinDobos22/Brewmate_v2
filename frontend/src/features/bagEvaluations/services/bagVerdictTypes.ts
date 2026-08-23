import type { TranslationKey } from '../../../i18n';

/** One argument the verdict makes, and whether it counts for or against. */
export interface BagVerdictPoint {
  readonly key: TranslationKey;
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
