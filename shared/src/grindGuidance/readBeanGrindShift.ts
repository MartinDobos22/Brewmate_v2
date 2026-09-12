import { normalizeSignalText } from '../coffeeTaste/normalizeSignalText.js';
import type { RoastLevel } from '../enums/roastLevels.js';

import { PROCESS_GRIND_SHIFTS } from './constants/processGrindShifts.js';
import {
  REST_GRIND_BANDS,
  STALE_GRIND_SHIFT,
  type RestGrindBand,
} from './constants/restGrindShifts.js';
import { ROAST_GRIND_SHIFTS } from './constants/roastGrindShifts.js';
import { GRIND_SHIFT_SOURCES, type GrindShift } from './grindShiftSources.js';
import type { GrindCoffeeFacts } from './grindCoffeeFacts.js';

const NO_SHIFT = 0;

const shift = (source: GrindShift['source'], amount: number | null): readonly GrindShift[] =>
  amount === null || amount === NO_SHIFT ? [] : [{ source, amount }];

const readRoast = (roastLevel: RoastLevel | null): readonly GrindShift[] =>
  roastLevel === null ? [] : shift(GRIND_SHIFT_SOURCES.roastLevel, ROAST_GRIND_SHIFTS[roastLevel]);

/**
 * The first stem that appears in the label, exactly as the taste signals are
 * read. A coffee has one process, and the table is ordered so the specific
 * rows come before the general ones they contain.
 */
const readProcess = (process: string | null): readonly GrindShift[] => {
  if (process === null) {
    return [];
  }

  const text = normalizeSignalText(process);
  const row = PROCESS_GRIND_SHIFTS.find(([stem]: readonly [string, number]): boolean =>
    text.includes(stem),
  );

  return shift(GRIND_SHIFT_SOURCES.process, row === undefined ? null : row[1]);
};

/** The first band the coffee is still young enough for, or the stale shift. */
const readRest = (daysSinceRoast: number | null): readonly GrindShift[] => {
  if (daysSinceRoast === null) {
    return [];
  }

  const band = REST_GRIND_BANDS.find(
    (candidate: RestGrindBand): boolean => daysSinceRoast <= candidate.untilDays,
  );

  return shift(GRIND_SHIFT_SOURCES.restDays, band === undefined ? STALE_GRIND_SHIFT : band.shift);
};

/**
 * Everything the bag says about where in its window this coffee should be
 * ground, as fractions of that window's half-width.
 *
 * Deterministic and offline, like the taste signals it is modelled on. Three
 * facts, read independently and returned separately rather than summed here,
 * because the caller needs both the total and the reasons: a starting point
 * that moved because the coffee is dark and eleven days old is a different
 * thing to explain than one that moved because it is a natural, and the
 * product's whole claim is that it can say which.
 *
 * A coffee with nothing written down produces an empty list, which is the
 * honest answer and lands in the middle of the method's own window.
 */
export const readBeanGrindShift = (coffee: GrindCoffeeFacts): readonly GrindShift[] => [
  ...readRoast(coffee.roastLevel),
  ...readProcess(coffee.process),
  ...readRest(coffee.daysSinceRoast),
];
