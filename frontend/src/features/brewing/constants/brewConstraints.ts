import { BREW_CONSTRAINT_NAMES, type BrewConstraintName } from '@brewmate/shared';

import type { TileGlyph } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export interface BrewConstraintOption {
  readonly name: BrewConstraintName;
  readonly labelKey: TranslationKey;
  /** One line saying what the absence actually means in a kitchen. */
  readonly hintKey: TranslationKey;
  /**
   * The missing thing, drawn.
   *
   * A history badge is read sideways off a card rather than down a list of
   * checkboxes, and "Bez váhy" and "Bez teplomeru" are the same shape at that
   * size. Struck-through glyphs where one exists, because what is being said
   * is the absence of the object rather than the object.
   */
  readonly icon: TileGlyph;
}

const LABEL_KEYS: Record<BrewConstraintName, TranslationKey> = {
  noTemperatureControl: TRANSLATION_KEYS.constraintNoTemperatureControl,
  noScale: TRANSLATION_KEYS.constraintNoScale,
  noGooseneck: TRANSLATION_KEYS.constraintNoGooseneck,
  unknownWater: TRANSLATION_KEYS.constraintUnknownWater,
  noTimer: TRANSLATION_KEYS.constraintNoTimer,
  noGrinder: TRANSLATION_KEYS.constraintNoGrinder,
  fixedGrindSetting: TRANSLATION_KEYS.constraintFixedGrindSetting,
  borrowedEquipment: TRANSLATION_KEYS.constraintBorrowedEquipment,
  limitedTime: TRANSLATION_KEYS.constraintLimitedTime,
};

const HINT_KEYS: Record<BrewConstraintName, TranslationKey> = {
  noTemperatureControl: TRANSLATION_KEYS.constraintNoTemperatureControlHint,
  noScale: TRANSLATION_KEYS.constraintNoScaleHint,
  noGooseneck: TRANSLATION_KEYS.constraintNoGooseneckHint,
  unknownWater: TRANSLATION_KEYS.constraintUnknownWaterHint,
  noTimer: TRANSLATION_KEYS.constraintNoTimerHint,
  noGrinder: TRANSLATION_KEYS.constraintNoGrinderHint,
  fixedGrindSetting: TRANSLATION_KEYS.constraintFixedGrindSettingHint,
  borrowedEquipment: TRANSLATION_KEYS.constraintBorrowedEquipmentHint,
  limitedTime: TRANSLATION_KEYS.constraintLimitedTimeHint,
};

const ICONS: Record<BrewConstraintName, TileGlyph> = {
  noTemperatureControl: 'thermometer-off',
  noScale: 'scale-off',
  noGooseneck: 'kettle-outline',
  unknownWater: 'water-off-outline',
  noTimer: 'timer-off-outline',
  noGrinder: 'grain',
  fixedGrindSetting: 'lock-outline',
  borrowedEquipment: 'hand-extended-outline',
  limitedTime: 'timer-sand',
};

/**
 * Every constraint the app offers, in the order it offers them.
 *
 * Built from the contract's own list rather than written out, so a constraint
 * added to the API cannot quietly go missing from the screen. That matters
 * more than it sounds: a set can carry any of these as its default, and a flag
 * that was set somewhere else but has no checkbox here would be a state
 * somebody cannot see and cannot turn off.
 *
 * The order is the contract's, and the contract's order is this screen's: the
 * five things people are actually missing on a given morning come first.
 */
export const BREW_CONSTRAINT_OPTIONS: readonly BrewConstraintOption[] = BREW_CONSTRAINT_NAMES.map(
  (name: BrewConstraintName): BrewConstraintOption => ({
    name,
    labelKey: LABEL_KEYS[name],
    hintKey: HINT_KEYS[name],
    icon: ICONS[name],
  }),
);
