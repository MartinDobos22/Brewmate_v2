export { MATCH_DIRECTIONS, MATCH_BANDS } from './coffeeMatchTypes.js';
export type { MatchDirection, MatchBand, AxisMatch, CoffeeMatch } from './coffeeMatchTypes.js';
export { matchCoffeeToProfile } from './matchCoffeeToProfile.js';
export type { DrinkerTaste } from './matchCoffeeToProfile.js';
export { applyMilkToCoffee } from './applyMilkToCoffee.js';
export { MILK_SHIFT, MILK_SHARE } from './constants/milkAdjustment.js';
export {
  MAX_MEANINGFUL_GAP,
  ALIGNED_GAP,
  MIN_COMPARABLE_WEIGHT,
  MATCH_FIT_GOOD,
  MATCH_FIT_POOR,
  MIN_MATCH_COVERAGE,
} from './constants/matchLimits.js';
