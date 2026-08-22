import type { FlavorAffinities, MilkUsage, PartialTasteAxes, RoastLevel } from '@brewmate/shared';

import type { TranslationKey } from '../../../i18n';

/**
 * What one answer claims about the person who gave it.
 *
 * The axis values are absolute readings on the 0-10 scale - "this person's
 * cup sits here" - not nudges. Averaging readings is meaningful; averaging
 * nudges is not, and the whole questionnaire is folded into a single
 * observation before it reaches the API.
 */
export interface TasteAnswerEffect {
  readonly axes?: PartialTasteAxes;
  readonly flavorAffinities?: FlavorAffinities;
  readonly roastPreference?: RoastLevel;
  readonly milkUsage?: MilkUsage;
}

/** One tappable card. An option may claim nothing, which is how "neviem" works. */
export interface TasteQuestionOption {
  readonly id: string;
  readonly labelKey: TranslationKey;
  readonly noteKey?: TranslationKey;
  readonly effect: TasteAnswerEffect;
}

export interface TasteQuestion {
  readonly id: string;
  readonly promptKey: TranslationKey;
  readonly helpKey: TranslationKey;
  /** How far this question's answer is trusted against the others, 0..1. */
  readonly weight: number;
  readonly options: readonly TasteQuestionOption[];
}
