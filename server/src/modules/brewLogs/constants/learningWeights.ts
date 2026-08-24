import { BREW_CONSTRAINT_NAMES, type BrewConstraintName } from '@brewmate/shared';

/**
 * How much a brew teaches Brewmate about the person who made it.
 *
 * A cup made without temperature control says far more about the kettle than
 * about anyone's taste, so each declared constraint discounts the evidence.
 * The factors multiply, because two handicaps really are worse than one, and
 * the floor keeps a constrained brew from being thrown away entirely - a
 * weekend at a cabin is still a weekend of drinking coffee.
 *
 * A total map over the constraint names in the contract, so adding a
 * constraint is a type error here rather than a flag that silently costs
 * nothing. The severities are ordered by how much of the cup the missing thing
 * decides: a grinder nobody can adjust changes almost everything, a stopwatch
 * changes the repeatability rather than the cup, and unknown water is a
 * suspicion rather than a handicap.
 */
export const FULL_LEARNING_WEIGHT = 1;
export const MIN_LEARNING_WEIGHT = 0.15;

export const CONSTRAINT_WEIGHT_FACTORS: Record<BrewConstraintName, number> = {
  noGrinder: 0.4,
  noTemperatureControl: 0.5,
  noScale: 0.6,
  fixedGrindSetting: 0.6,
  borrowedEquipment: 0.7,
  noTimer: 0.7,
  noGooseneck: 0.75,
  unknownWater: 0.8,
  limitedTime: 0.85,
};

/** Anything the named vocabulary does not cover yet, priced conservatively. */
export const OTHER_CONSTRAINT_FACTOR = 0.9;

export { BREW_CONSTRAINT_NAMES };
export type { BrewConstraintName };
