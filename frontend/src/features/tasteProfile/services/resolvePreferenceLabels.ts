import type { MilkUsage, RoastLevel } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { MILK_USAGE_LABEL_KEYS, ROAST_LEVEL_LABEL_KEYS } from '../constants/preferenceLabels';

/**
 * "Bez preferencie" rather than a guess.
 *
 * Both fields are nullable in the contract because not stating a preference is
 * a real answer, and the profile screen says so out loud instead of quietly
 * printing the middle of the scale.
 */
export const roastPreferenceLabelKey = (roast: RoastLevel | null): TranslationKey =>
  roast === null ? TRANSLATION_KEYS.profileRoastNone : ROAST_LEVEL_LABEL_KEYS[roast];

export const milkUsageLabelKey = (milk: MilkUsage | null): TranslationKey =>
  milk === null ? TRANSLATION_KEYS.profileMilkNone : MILK_USAGE_LABEL_KEYS[milk];
