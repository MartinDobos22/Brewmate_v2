import type { StateGround, TileGlyph } from '../../../components/ui';
import { BREW_RATIO, DOSE_GRAMS, GRIND_SETTING, WATER_TEMPERATURE_C } from '../../../constants';

/** Sample values used to demonstrate the components. Never shown in production. */
export const PREVIEW_VALUES = {
  doseGrams: DOSE_GRAMS.default,
  brewTimeSeconds: 185,
  temperatureCelsius: WATER_TEMPERATURE_C.default,
  ratio: BREW_RATIO.filterDefault,
  grind: GRIND_SETTING.default,
} as const;

export const GRIND_RANGE = {
  min: GRIND_SETTING.min,
  max: GRIND_SETTING.max,
  step: GRIND_SETTING.step,
} as const;

/**
 * Something for the empty state's mark to draw in the catalogue.
 *
 * The rings are optional on `EmptyState` - a state that is a confirmation
 * rather than an absence draws none - so a preview that left the icon out
 * would show the one shape this screen exists to let somebody check.
 */
export const DS_EMPTY_STATE_ICON = 'tray-remove' satisfies TileGlyph;

/** The dark ground brew mode and the signed-out screens are drawn on. */
export const DS_STATE_GROUND: StateGround = 'espresso';
