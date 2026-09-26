import type { BrewedCup } from './brewedCup.js';
import { SUPERSEDED_CUP_WEIGHT } from './brewingProfileFieldLimits.js';
import { HABIT_BLIND_SPOTS, type HabitFigure } from './constants/habitBlindSpots.js';

const FULL = 1;

/**
 * What one cup is worth to the profile: the weight it was priced at, less for
 * a version somebody later corrected and brewed.
 */
export const readCupWeight = (cup: BrewedCup): number =>
  cup.learningWeight * (cup.isSuperseded ? SUPERSEDED_CUP_WEIGHT : FULL);

/** Whether this cup was brewed without the thing that figure depends on. */
export const isBlindTo = (cup: BrewedCup, figure: HabitFigure): boolean =>
  HABIT_BLIND_SPOTS[figure].some((name): boolean => cup.constraints[name] === true);
