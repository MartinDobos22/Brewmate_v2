import { z } from 'zod';

import { CONSTRAINT_LABEL_MAX_LENGTH, CONSTRAINTS_OTHER_MAX } from './brewingFieldLimits.js';

/**
 * What the brewer could not do this time.
 *
 * This is what keeps a weekend at a cabin from rewriting somebody's taste
 * profile: a cup that disappointed because there was no temperature control
 * says nothing about what that person likes, and the API turns these flags
 * into a lower `profileLearningWeight` on the brew log.
 *
 * Named flags rather than free text, because two different things have to read
 * them. The reducer has to price them, and the recipe engine has to reshape
 * the recipe around them - a model cannot be asked to obey "no thermometer"
 * unless the absence has a name it can be told about.
 */
export const brewConstraintsSchema = z.object({
  noTemperatureControl: z.boolean().optional(),
  noScale: z.boolean().optional(),
  noGrinder: z.boolean().optional(),
  fixedGrindSetting: z.boolean().optional(),
  /** A straight-spouted kettle: the pour cannot be aimed or slowed. */
  noGooseneck: z.boolean().optional(),
  /** No clock in reach, so every time in the recipe has to become a sight. */
  noTimer: z.boolean().optional(),
  borrowedEquipment: z.boolean().optional(),
  unknownWater: z.boolean().optional(),
  limitedTime: z.boolean().optional(),
  /** Anything the vocabulary above does not cover yet. */
  other: z.array(z.string().max(CONSTRAINT_LABEL_MAX_LENGTH)).max(CONSTRAINTS_OTHER_MAX).optional(),
});

export type BrewConstraints = z.infer<typeof brewConstraintsSchema>;

/**
 * The named flags, in the order the app offers them.
 *
 * A list rather than `Object.keys`, because both sides walk it: the reducer
 * prices exactly these, the app draws a checkbox for exactly these, and the
 * prompt describes exactly these. Three walks over one list cannot disagree;
 * three separate lists eventually will.
 */
export const BREW_CONSTRAINT_NAMES = [
  'noTemperatureControl',
  'noScale',
  'noGooseneck',
  'unknownWater',
  'noTimer',
  'noGrinder',
  'fixedGrindSetting',
  'borrowedEquipment',
  'limitedTime',
] as const;

export type BrewConstraintName = (typeof BREW_CONSTRAINT_NAMES)[number];

const NOTHING = 0;

/** Whether this brew was made with everything it wanted. */
export const hasAnyConstraint = (constraints: BrewConstraints): boolean =>
  BREW_CONSTRAINT_NAMES.some((name: BrewConstraintName): boolean => constraints[name] === true) ||
  (constraints.other?.length ?? NOTHING) > NOTHING;

/**
 * Which of the named flags were set, in the order the app offers them.
 *
 * Shared rather than derived at each call site, because three places read it
 * for three different purposes - the history marks a cup that was brewed with
 * something missing, the pre-brew screen counts what is folded away, and the
 * prompt tells a model what it may not suggest - and a badge that disagreed
 * with the weight the same brew was priced at would be the app arguing with
 * its own record.
 */
export const readActiveConstraints = (
  constraints: BrewConstraints,
): readonly BrewConstraintName[] =>
  BREW_CONSTRAINT_NAMES.filter((name: BrewConstraintName): boolean => constraints[name] === true);
