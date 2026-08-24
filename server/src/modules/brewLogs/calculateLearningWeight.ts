import {
  BREW_CONSTRAINT_NAMES,
  type BrewConstraintName,
  type BrewConstraints,
} from '@brewmate/shared';

import {
  CONSTRAINT_WEIGHT_FACTORS,
  FULL_LEARNING_WEIGHT,
  MIN_LEARNING_WEIGHT,
  OTHER_CONSTRAINT_FACTOR,
} from './constants/learningWeights.js';

const NO_OTHERS = 0;

/**
 * Prices the constraints of one brew into the weight its outcome carries.
 *
 * Deterministic and computed once, on the way in. The result is stored on the
 * brew log rather than derived later, so buying a better kettle next year
 * cannot retroactively turn a disappointing cup at a cabin into evidence about
 * somebody's preferences.
 *
 * The same weight is what a remark in the post-brew chat is worth: somebody
 * complaining that a cup was flat when they had no way to measure the water
 * is describing their kettle, not their taste.
 */
export const calculateLearningWeight = (constraints: BrewConstraints): number => {
  const named = BREW_CONSTRAINT_NAMES.reduce(
    (weight: number, constraint: BrewConstraintName): number =>
      constraints[constraint] === true ? weight * CONSTRAINT_WEIGHT_FACTORS[constraint] : weight,
    FULL_LEARNING_WEIGHT,
  );

  const otherCount = constraints.other?.length ?? NO_OTHERS;
  const withOthers = named * OTHER_CONSTRAINT_FACTOR ** otherCount;

  return Math.max(withOthers, MIN_LEARNING_WEIGHT);
};
