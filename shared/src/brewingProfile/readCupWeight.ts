import { CUP_EXTRACTIONS } from '../enums/cupExtractions.js';
import { CUP_STRENGTHS } from '../enums/cupStrengths.js';

import type { BrewedCup } from './brewedCup.js';
import { CONFIRMED_CUP_WEIGHT, SUPERSEDED_CUP_WEIGHT } from './brewingProfileFieldLimits.js';
import { HABIT_BLIND_SPOTS, type HabitFigure } from './constants/habitBlindSpots.js';

const FULL = 1;

/**
 * Whether somebody said this figure was right.
 *
 * Strength speaks for the dose and the ratio, extraction for the grind and the
 * temperature; a cup praised for being strong enough has said nothing about
 * whether it was ground well.
 */
const CONFIRMS: Record<HabitFigure, (cup: BrewedCup) => boolean> = {
  doseGrams: (cup): boolean => cup.reading?.strength === CUP_STRENGTHS.right,
  ratio: (cup): boolean => cup.reading?.strength === CUP_STRENGTHS.right,
  waterTempC: (cup): boolean => cup.reading?.extraction === CUP_EXTRACTIONS.balanced,
  grind: (cup): boolean => cup.reading?.extraction === CUP_EXTRACTIONS.balanced,
};

/**
 * What one cup is worth to one figure: the weight it was priced at, less for a
 * version somebody later corrected and brewed, more where they said it was
 * right.
 */
export const readCupWeight = (cup: BrewedCup, figure: HabitFigure): number =>
  cup.learningWeight *
  (cup.isSuperseded ? SUPERSEDED_CUP_WEIGHT : FULL) *
  (CONFIRMS[figure](cup) ? CONFIRMED_CUP_WEIGHT : FULL);

/** Whether this cup was brewed without the thing that figure depends on. */
export const isBlindTo = (cup: BrewedCup, figure: HabitFigure): boolean =>
  HABIT_BLIND_SPOTS[figure].some((name): boolean => cup.constraints[name] === true);
