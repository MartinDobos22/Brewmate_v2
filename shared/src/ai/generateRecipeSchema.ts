import { z } from 'zod';

import { brewConstraintsSchema } from '../brewing/brewConstraintsSchema.js';
import {
  BREW_RATIO_MAX,
  BREW_RATIO_MIN,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
} from '../brewing/brewingFieldLimits.js';
import { WATER_TYPES } from '../enums/waterTypes.js';
import { recipeSchema } from '../recipes/recipeSchema.js';

import { COFFEE_DESCRIPTION_MAX_LENGTH } from './aiFieldLimits.js';

/**
 * Body of `POST /ai/generate-recipe`.
 *
 * Two things are deliberately absent. Nothing about the person travels here -
 * the taste profile, the brew history for this coffee and this method, and how
 * much any of it is worth are read off the caller's own rows, for the same
 * reason the shop verdict reads them: a profile a client could declare is a
 * profile anybody could declare. And no gear is *described* here either: what
 * travels is which set and which grinder, both as ids the API looks up against
 * the caller's own rows, because a client that could describe a kettle could
 * describe one it does not own.
 *
 * What does travel is everything the person decided on the screen before this
 * one: the dose, the water, the ratio between them, the water they are using,
 * what they are missing today and which grinder is going to grind it. Those
 * are answers, not suggestions.
 */
export const generateRecipeRequestSchema = z
  .object({
    methodId: z.uuid(),
    /** The coffee from the cupboard, or null for a brew with beans nobody wrote down. */
    bagId: z.uuid().nullable().optional(),
    /** Whatever the drinker could say about beans that are not in the cupboard. */
    coffeeDescription: z.string().max(COFFEE_DESCRIPTION_MAX_LENGTH).nullable().optional(),
    /** The set the brew is being made from; null means whatever is owned. */
    equipmentSetId: z.uuid().nullable().optional(),
    /**
     * The grinder this is being ground on, where the drinker chose one.
     *
     * Null is not "no grinder" - it is "nobody said", and the API then picks
     * the same one the app drew its own grind guidance off, through the same
     * function. It has to be askable because a kitchen with a hand grinder and
     * an electric one has two right answers, and which of them is turning this
     * morning changes the number on the collar and what one click of it is
     * worth. Absent, that was decided by whichever row happened to come back
     * first.
     */
    grinderEquipmentId: z.uuid().nullable().optional(),
    constraints: brewConstraintsSchema,
    waterType: z.enum(WATER_TYPES),
    doseGrams: z.number().min(DOSE_GRAMS_MIN).max(DOSE_GRAMS_MAX),
    waterGrams: z.number().min(WATER_GRAMS_MIN).max(WATER_GRAMS_MAX),
    ratio: z.number().min(BREW_RATIO_MIN).max(BREW_RATIO_MAX),
  })
  .strict();

export type GenerateRecipeRequest = z.infer<typeof generateRecipeRequestSchema>;

/**
 * The recipe, already stored.
 *
 * The row is written before the response leaves, rather than handed back for
 * the app to save afterwards. Everything downstream needs an id: brew mode
 * logs against it, the conversation hangs off it, and a chat patch becomes a
 * child of it. A recipe that only existed in a response would be a recipe that
 * a lost connection turned into a cup nobody can trace.
 */
export const generateRecipeResponseSchema = z.object({ recipe: recipeSchema });

export type GenerateRecipeResponse = z.infer<typeof generateRecipeResponseSchema>;
