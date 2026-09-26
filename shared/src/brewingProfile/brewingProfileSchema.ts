import { z } from 'zod';

import { BREW_METHOD_CATEGORY_VALUES } from '../enums/brewMethodCategories.js';

import { BREWING_PROFILE_METHODS_MAX } from './brewingProfileFieldLimits.js';
import { grindHabitSchema } from './grindHabitSchema.js';
import { methodHabitSchema } from './methodHabitSchema.js';

/**
 * How somebody brews, as far as their own cups can say.
 *
 * The counterpart to the taste profile and deliberately not a part of it. The
 * taste profile says which coffee somebody should buy, and it is taught by
 * what they answered, bought and rated. This says how they brew the coffee
 * they have, and it is taught by nothing but the cups: what they weighed, what
 * they poured and where their collar ended up. Neither reads the other.
 *
 * Not stored. It is a fold over the brew logs, recomputed on every read the
 * way the insights are, so it is always exactly what the cups say and there is
 * no row to go stale when a log is corrected or deleted.
 */
export const brewingProfileSchema = z.object({
  methods: z.array(methodHabitSchema).max(BREWING_PROFILE_METHODS_MAX),
  grind: z.array(grindHabitSchema).max(BREW_METHOD_CATEGORY_VALUES.length),
});

export type BrewingProfile = z.infer<typeof brewingProfileSchema>;
