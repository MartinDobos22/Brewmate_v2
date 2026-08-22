import { ESPRESSO_GRINDER_SEEDS } from './grinders/espressoGrinderSeeds.js';
import { FILTER_GRINDER_SEEDS } from './grinders/filterGrinderSeeds.js';
import type { GrinderSeed } from './grinders/grinderSeed.js';
import { HAND_GRINDER_SEEDS } from './grinders/handGrinderSeeds.js';
import { HOUSEHOLD_GRINDER_SEEDS } from './grinders/householdGrinderSeeds.js';

export type { GrinderSeed } from './grinders/grinderSeed.js';

/**
 * The grinders Brewmate ships with, in four groups that are only a way of
 * keeping the lists readable - nothing branches on which file an entry is in.
 *
 * Two things are deliberately conservative here:
 *
 * - `minSetting`, `maxSetting` and `step` describe the collar as the app has
 *   to draw it. They are the usual usable range of the model, not a promise
 *   about the last click at either end.
 * - `micronCalibration` is present only where the manufacturer publishes a
 *   microns-per-click figure, and even then it is flagged as an estimate. Most
 *   entries carry no curve at all, which the app reports as "conversions will
 *   be less precise" rather than papering over with an invented number.
 *
 * Anybody whose grinder is missing adds it themselves through `POST /grinders`;
 * that entry stays unverified and visible only to them.
 */
export const GRINDER_SEEDS: readonly GrinderSeed[] = [
  ...HAND_GRINDER_SEEDS,
  ...FILTER_GRINDER_SEEDS,
  ...ESPRESSO_GRINDER_SEEDS,
  ...HOUSEHOLD_GRINDER_SEEDS,
];
