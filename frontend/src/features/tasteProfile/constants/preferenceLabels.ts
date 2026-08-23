import { MILK_USAGE_LEVELS, ROAST_LEVELS, type MilkUsage, type RoastLevel } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export const ROAST_LEVEL_LABEL_KEYS: Record<RoastLevel, TranslationKey> = {
  [ROAST_LEVELS.light]: TRANSLATION_KEYS.profileRoastLight,
  [ROAST_LEVELS.mediumLight]: TRANSLATION_KEYS.profileRoastMediumLight,
  [ROAST_LEVELS.medium]: TRANSLATION_KEYS.profileRoastMedium,
  [ROAST_LEVELS.mediumDark]: TRANSLATION_KEYS.profileRoastMediumDark,
  [ROAST_LEVELS.dark]: TRANSLATION_KEYS.profileRoastDark,
};

export const MILK_USAGE_LABEL_KEYS: Record<MilkUsage, TranslationKey> = {
  [MILK_USAGE_LEVELS.never]: TRANSLATION_KEYS.profileMilkNever,
  [MILK_USAGE_LEVELS.sometimes]: TRANSLATION_KEYS.profileMilkSometimes,
  [MILK_USAGE_LEVELS.often]: TRANSLATION_KEYS.profileMilkOften,
  [MILK_USAGE_LEVELS.always]: TRANSLATION_KEYS.profileMilkAlways,
};
