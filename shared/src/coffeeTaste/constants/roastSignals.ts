import { ROAST_LEVELS, type RoastLevel } from '../../enums/roastLevels.js';
import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * What each roast level does to a cup, on the same five axes the drinker is
 * described on.
 *
 * The strongest single signal on a bag, and the most mechanical: roasting
 * destroys acids and develops bitter compounds and body, monotonically, and
 * the far end of it tastes of the roast rather than of the coffee. That last
 * fact is why a dark roast's origin barely matters and a light roast's
 * matters enormously - the fold sees that as the roast signal simply
 * outweighing the origin one.
 *
 * Sweetness peaks in the middle rather than at either end, which is the one
 * non-monotonic line here and the reason it is a table rather than a formula.
 * A light roast has the sugars but has not developed them; a dark one has
 * burnt them.
 */
export const ROAST_SIGNALS: Record<RoastLevel, PartialTasteAxes> = {
  [ROAST_LEVELS.light]: {
    acidity: 8,
    sweetness: 5.5,
    body: 3.5,
    bitterness: 2,
    intensity: 4.5,
  },
  [ROAST_LEVELS.mediumLight]: {
    acidity: 7,
    sweetness: 6.5,
    body: 4.5,
    bitterness: 3,
    intensity: 5.5,
  },
  [ROAST_LEVELS.medium]: {
    acidity: 5.5,
    sweetness: 7,
    body: 6,
    bitterness: 4.5,
    intensity: 6,
  },
  [ROAST_LEVELS.mediumDark]: {
    acidity: 3.5,
    sweetness: 6,
    body: 7.5,
    bitterness: 6.5,
    intensity: 7.5,
  },
  [ROAST_LEVELS.dark]: {
    acidity: 2,
    sweetness: 4.5,
    body: 8.5,
    bitterness: 8,
    intensity: 8.5,
  },
};
