/**
 * How much a brew teaches Brewmate about the person who made it.
 *
 * A cup made without temperature control says far more about the kettle than
 * about anyone's taste, so each declared constraint discounts the evidence.
 * The factors multiply, because two handicaps really are worse than one, and
 * the floor keeps a constrained brew from being thrown away entirely - a
 * weekend at a cabin is still a weekend of drinking coffee.
 */
export const FULL_LEARNING_WEIGHT = 1;
export const MIN_LEARNING_WEIGHT = 0.15;

export const CONSTRAINT_WEIGHT_FACTORS = {
  noTemperatureControl: 0.5,
  noScale: 0.6,
  noGrinder: 0.4,
  fixedGrindSetting: 0.6,
  borrowedEquipment: 0.7,
  unknownWater: 0.8,
  limitedTime: 0.85,
} as const;

/** Anything the named vocabulary does not cover yet, priced conservatively. */
export const OTHER_CONSTRAINT_FACTOR = 0.9;
