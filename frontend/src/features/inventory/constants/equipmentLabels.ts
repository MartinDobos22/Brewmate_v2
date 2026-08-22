import {
  BREW_METHOD_CATEGORIES,
  EQUIPMENT_TYPES,
  WATER_TYPES,
  type BrewMethodCategory,
  type EquipmentType,
  type WaterType,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export const EQUIPMENT_TYPE_LABEL_KEYS: Record<EquipmentType, TranslationKey> = {
  [EQUIPMENT_TYPES.grinder]: TRANSLATION_KEYS.profileTypeGrinder,
  [EQUIPMENT_TYPES.brewer]: TRANSLATION_KEYS.profileTypeBrewer,
  [EQUIPMENT_TYPES.kettle]: TRANSLATION_KEYS.profileTypeKettle,
  [EQUIPMENT_TYPES.scale]: TRANSLATION_KEYS.profileTypeScale,
};

export const BREW_METHOD_CATEGORY_LABEL_KEYS: Record<BrewMethodCategory, TranslationKey> = {
  [BREW_METHOD_CATEGORIES.pourOver]: TRANSLATION_KEYS.methodCategoryPourOver,
  [BREW_METHOD_CATEGORIES.immersion]: TRANSLATION_KEYS.methodCategoryImmersion,
  [BREW_METHOD_CATEGORIES.espresso]: TRANSLATION_KEYS.methodCategoryEspresso,
  [BREW_METHOD_CATEGORIES.cold]: TRANSLATION_KEYS.methodCategoryCold,
  [BREW_METHOD_CATEGORIES.stovetop]: TRANSLATION_KEYS.methodCategoryStovetop,
  [BREW_METHOD_CATEGORIES.batch]: TRANSLATION_KEYS.methodCategoryBatch,
};

export interface WaterTypeOption {
  readonly waterType: WaterType;
  readonly labelKey: TranslationKey;
  readonly noteKey: TranslationKey;
}

/**
 * The five answers to "what comes out of your tap", in the order offered.
 *
 * "Neviem" is last and carries a reassuring note rather than a warning: it is
 * the honest answer for most people, and an app that punishes it gets a made
 * up one instead.
 */
export const WATER_TYPE_OPTIONS: readonly WaterTypeOption[] = [
  {
    waterType: WATER_TYPES.tap,
    labelKey: TRANSLATION_KEYS.setupWaterTap,
    noteKey: TRANSLATION_KEYS.setupWaterTapNote,
  },
  {
    waterType: WATER_TYPES.filtered,
    labelKey: TRANSLATION_KEYS.setupWaterFiltered,
    noteKey: TRANSLATION_KEYS.setupWaterFilteredNote,
  },
  {
    waterType: WATER_TYPES.bottled,
    labelKey: TRANSLATION_KEYS.setupWaterBottled,
    noteKey: TRANSLATION_KEYS.setupWaterBottledNote,
  },
  {
    waterType: WATER_TYPES.remineralized,
    labelKey: TRANSLATION_KEYS.setupWaterRemineralized,
    noteKey: TRANSLATION_KEYS.setupWaterRemineralizedNote,
  },
  {
    waterType: WATER_TYPES.unknown,
    labelKey: TRANSLATION_KEYS.setupWaterUnknown,
    noteKey: TRANSLATION_KEYS.setupWaterUnknownNote,
  },
];
