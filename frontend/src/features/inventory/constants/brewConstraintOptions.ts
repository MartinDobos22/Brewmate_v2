import type { BrewConstraints } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/** The named flags, minus `other` - free text is not a chip. */
export type BrewConstraintFlag = Exclude<keyof BrewConstraints, 'other'>;

export interface BrewConstraintOption {
  readonly flag: BrewConstraintFlag;
  readonly labelKey: TranslationKey;
}

/**
 * What a place is usually missing, offered as a default for a set.
 *
 * Declaring these is not an apology: the API prices a brew's learning weight
 * from them, so a cup made without a scale at a cabin teaches Brewmate less
 * about somebody's taste than one made at home - which is correct.
 */
export const BREW_CONSTRAINT_OPTIONS: readonly BrewConstraintOption[] = [
  { flag: 'noTemperatureControl', labelKey: TRANSLATION_KEYS.constraintNoTemperatureControl },
  { flag: 'noScale', labelKey: TRANSLATION_KEYS.constraintNoScale },
  { flag: 'noGrinder', labelKey: TRANSLATION_KEYS.constraintNoGrinder },
  { flag: 'fixedGrindSetting', labelKey: TRANSLATION_KEYS.constraintFixedGrindSetting },
  { flag: 'borrowedEquipment', labelKey: TRANSLATION_KEYS.constraintBorrowedEquipment },
  { flag: 'unknownWater', labelKey: TRANSLATION_KEYS.constraintUnknownWater },
  { flag: 'limitedTime', labelKey: TRANSLATION_KEYS.constraintLimitedTime },
];
