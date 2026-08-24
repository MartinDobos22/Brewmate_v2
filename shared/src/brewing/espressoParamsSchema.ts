import { z } from 'zod';

import { PRE_INFUSION_SECONDS_MAX, PRE_INFUSION_SECONDS_MIN } from './brewingFieldLimits.js';

/**
 * The one thing an espresso needs that the pour-over vocabulary has no word
 * for.
 *
 * Everything else an espresso is described by already has a home: the dose is
 * `doseGrams`, the yield is `waterGrams` - it is literally what ends up on the
 * scale - the ratio between them is `ratio`, the target time is
 * `totalTimeSeconds` and the group temperature is `waterTempC`. Giving
 * espresso its own parallel set of columns would mean every screen that reads
 * a recipe had to ask which kind it was holding first.
 *
 * Pre-infusion has no such counterpart, so it gets a field. Optional
 * throughout: a lever machine has no pre-infusion to declare, and a machine
 * nobody has measured is still a machine.
 */
export const espressoParamsSchema = z.object({
  preInfusionSeconds: z
    .number()
    .min(PRE_INFUSION_SECONDS_MIN)
    .max(PRE_INFUSION_SECONDS_MAX)
    .nullable()
    .optional(),
});

export type EspressoParams = z.infer<typeof espressoParamsSchema>;
