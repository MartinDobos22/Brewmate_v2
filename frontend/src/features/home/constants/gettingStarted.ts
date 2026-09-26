import type { TileGlyph } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

import { HOME_TILE_ICONS } from './homeTiles';

/**
 * The three things worth doing first, in the order they pay off.
 *
 * Not the onboarding flow again: those steps set the app up, these three are
 * the first useful things somebody can do with it. Two of them work before
 * Brewmate knows anything at all.
 */
export const GETTING_STARTED_STEPS = {
  taste: 'taste',
  coffee: 'coffee',
  brew: 'brew',
} as const;

export type GettingStartedStepId =
  (typeof GETTING_STARTED_STEPS)[keyof typeof GETTING_STARTED_STEPS];

export const GETTING_STARTED_ORDER: readonly GettingStartedStepId[] = [
  GETTING_STARTED_STEPS.taste,
  GETTING_STARTED_STEPS.coffee,
  GETTING_STARTED_STEPS.brew,
];

export const GETTING_STARTED_LABEL_KEYS: Record<GettingStartedStepId, TranslationKey> = {
  [GETTING_STARTED_STEPS.taste]: TRANSLATION_KEYS.homeStartStepTaste,
  [GETTING_STARTED_STEPS.coffee]: TRANSLATION_KEYS.homeStartStepCoffee,
  [GETTING_STARTED_STEPS.brew]: TRANSLATION_KEYS.homeStartStepBrew,
};

export const GETTING_STARTED_NOTE_KEYS: Record<GettingStartedStepId, TranslationKey> = {
  [GETTING_STARTED_STEPS.taste]: TRANSLATION_KEYS.homeStartStepTasteNote,
  [GETTING_STARTED_STEPS.coffee]: TRANSLATION_KEYS.homeStartStepCoffeeNote,
  [GETTING_STARTED_STEPS.brew]: TRANSLATION_KEYS.homeStartStepBrewNote,
};

/**
 * The glyph on each step, which is the glyph of the thing it leads to.
 *
 * The same mark on the row and on the screen it opens, so the step and its
 * destination are recognisable as one thing rather than as a list item and an
 * unrelated screen.
 */
export const GETTING_STARTED_ICONS: Record<GettingStartedStepId, TileGlyph> = {
  [GETTING_STARTED_STEPS.taste]: HOME_TILE_ICONS.start,
  [GETTING_STARTED_STEPS.coffee]: HOME_TILE_ICONS.scan,
  [GETTING_STARTED_STEPS.brew]: HOME_TILE_ICONS.brew,
};
