import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * How high the coffee grew, as bands rather than as a curve.
 *
 * The mechanism is real and physical: cooler air ripens cherries more slowly,
 * the bean ends up denser, and a denser bean carries more acid and more of
 * everything else. It is a band rather than a formula because the effect is
 * not linear and because the number on a bag is usually a range somebody
 * rounded - claiming a difference between 1450 and 1520 metres would be
 * precision nobody measured.
 *
 * Weighted low, because the roast can bury the whole effect: a 2000-metre
 * Ethiopian roasted dark tastes of the roast.
 *
 * Read as "at least this high", so the list runs from the top down and the
 * first band a coffee clears is the one it gets.
 */
export const ALTITUDE_SIGNALS: readonly (readonly [number, PartialTasteAxes])[] = [
  [1800, { acidity: 8, sweetness: 7, body: 5.5, intensity: 6.5 }],
  [1400, { acidity: 7, sweetness: 6.5, body: 5.5 }],
  [1000, { acidity: 5.5, sweetness: 6, body: 6 }],
  [0, { acidity: 4, sweetness: 5.5, body: 6.5, bitterness: 5.5 }],
];
