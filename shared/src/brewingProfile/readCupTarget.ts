import type { CupExtraction } from '../enums/cupExtractions.js';

import type { BrewedCup } from './brewedCup.js';
import {
  READING_GRIND_CORRECTION,
  READING_RATIO_CORRECTION,
  READING_TEMPERATURE_CORRECTION,
} from './brewingProfileFieldLimits.js';
import type { HabitFigure } from './constants/habitBlindSpots.js';
import {
  EXTRACTION_GRIND_DIRECTION,
  EXTRACTION_TEMPERATURE_DIRECTION,
  STRENGTH_RATIO_DIRECTION,
} from './constants/readingCorrections.js';

const UNMOVED = 0;
const WHOLE = 1;

const extractionOf = (cup: BrewedCup): CupExtraction | null => cup.reading?.extraction ?? null;

/**
 * Where each figure of one cup should have been, as far as anybody said.
 *
 * A cup nobody commented on is its own target: the numbers that happened are
 * the best guess at the numbers wanted. A cup called sour moves its grind a
 * tasteable step finer and its temperature a step hotter; a watery one moves
 * its ratio tighter. The dose is never moved - it is what was weighed, and a
 * cup that was too weak is fixed by the water rather than by weighing twice.
 *
 * This is what lets the profile learn from "bola kyslá" without anybody
 * brewing again: the complaint is a statement about where the cup should have
 * sat, and the next start is drawn towards that rather than towards the cup
 * that disappointed.
 */
const TARGETS: Record<HabitFigure, (cup: BrewedCup) => number | null> = {
  doseGrams: (cup): number | null => cup.doseGrams,
  ratio: (cup): number | null => {
    const strength = cup.reading?.strength ?? null;
    const direction = strength === null ? UNMOVED : STRENGTH_RATIO_DIRECTION[strength];

    return cup.ratio === null ? null : cup.ratio * (WHOLE + direction * READING_RATIO_CORRECTION);
  },
  waterTempC: (cup): number | null => {
    const extraction = extractionOf(cup);
    const direction = extraction === null ? UNMOVED : EXTRACTION_TEMPERATURE_DIRECTION[extraction];

    return cup.waterTempC === null
      ? null
      : cup.waterTempC + direction * READING_TEMPERATURE_CORRECTION;
  },
  grind: (cup): number | null => {
    const extraction = extractionOf(cup);
    const direction = extraction === null ? UNMOVED : EXTRACTION_GRIND_DIRECTION[extraction];

    return cup.grindShift === null ? null : cup.grindShift + direction * READING_GRIND_CORRECTION;
  },
};

export const readCupTarget = (cup: BrewedCup, figure: HabitFigure): number | null =>
  TARGETS[figure](cup);
