import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';
import { GRIND_MICRON_WINDOWS, middleOfWindow } from '../conversion/grindMicronWindows.js';
import { settingToMicrons } from '../conversion/interpolateMicrons.js';
import type { Grinder } from '../grinders/grinderSchema.js';

import { WINDOW_HALF_WIDTH_FRACTION } from './grindGuidanceFieldLimits.js';
import type { GrindCoffeeFacts } from './grindCoffeeFacts.js';
import { readBeanGrindShift } from './readBeanGrindShift.js';
import { readPublishedRange } from './readPublishedRange.js';
import { sumBeanGrindShift } from './sumBeanGrindShift.js';

const NOTHING = 0;

/** Everything a brewed setting is measured against, and nothing about a habit. */
export interface BrewedGrind {
  readonly methodCategory: BrewMethodCategory;
  readonly coffee: GrindCoffeeFacts;
  readonly grinder: Grinder | null;
  /** The setting the cup was actually ground at, on that grinder's own collar. */
  readonly grindSetting: number;
}

/**
 * Where a brewed setting sits in the range the guidance would have stood in,
 * as a fraction of that range's half-width - the frame every shift uses.
 *
 * It has to be the range the guidance itself uses for this grinder, or the
 * reading and the correction it feeds are in two different units: the
 * published range where one exists, the family window read through the curve
 * where it does not.
 */
const readPosition = (
  grinder: Grinder,
  category: BrewMethodCategory,
  grindSetting: number,
): number | null => {
  const range = readPublishedRange(grinder, category);

  if (range !== null) {
    const halfRange = (range.max - range.min) * WINDOW_HALF_WIDTH_FRACTION;

    return (grindSetting - (range.min + range.max) * WINDOW_HALF_WIDTH_FRACTION) / halfRange;
  }

  const microns = settingToMicrons(grinder.micronCalibration, grindSetting);

  if (microns === null) {
    return null;
  }

  const window = GRIND_MICRON_WINDOWS[category];
  const halfWidth = (window.max - window.min) * WINDOW_HALF_WIDTH_FRACTION;

  return halfWidth <= NOTHING ? null : (microns.value - middleOfWindow(window)) / halfWidth;
};

/**
 * How far past the bag's own starting point somebody actually ground a cup.
 *
 * The inverse of the guidance, minus the bag: the position of the setting
 * inside the guidance's range, with everything the coffee itself explains -
 * its roast, its process, its age - taken back off. What is left is the part
 * no label accounts for: this person's grinder, water, pour and palate. Folded
 * over enough cups it is a habit, and handed back to the guidance as one it
 * moves the next starting point towards where their cups end up.
 *
 * Measured against the bag's start and never against the recipe's own, and
 * that is what keeps the loop still. A recipe written after the habit was
 * learned already starts where the habit said; measured against that start, a
 * satisfied cup would read as no habit at all, the next start would fall back
 * to the middle, and the correction would switch itself on and off with every
 * other bag.
 *
 * Null where there is no number to read - no catalogued grinder, or a setting
 * the curve cannot vouch for - because a habit guessed from a grind in words
 * would be a habit nobody had.
 */
export const readGrindHabitShift = ({
  methodCategory,
  coffee,
  grinder,
  grindSetting,
}: BrewedGrind): number | null => {
  if (grinder === null) {
    return null;
  }

  const position = readPosition(grinder, methodCategory, grindSetting);

  return position === null ? null : position - sumBeanGrindShift(readBeanGrindShift(coffee));
};
