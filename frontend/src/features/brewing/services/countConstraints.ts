import {
  BREW_CONSTRAINT_NAMES,
  type BrewConstraintName,
  type BrewConstraints,
} from '@brewmate/shared';

const NOTHING = 0;

/**
 * How many things are missing, counting the free-text ones too.
 *
 * The number a collapsed section shows, which is the only thing keeping a
 * folded-away control from hiding state somebody set and cannot see.
 */
export const countConstraints = (constraints: BrewConstraints): number =>
  BREW_CONSTRAINT_NAMES.filter((name: BrewConstraintName): boolean => constraints[name] === true)
    .length + (constraints.other?.length ?? NOTHING);
