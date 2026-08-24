import { z } from 'zod';

import { BREW_CONSTRAINT_NAMES } from './brewConstraintsSchema.js';
import { CONSTRAINT_HINT_MAX_LENGTH } from './brewingFieldLimits.js';

/**
 * What to do about one thing the brewer does not have.
 *
 * Attached to the constraint by name rather than written into the rationale,
 * so the interface can print it beside the checkbox that caused it and brew
 * mode can repeat it at the step it applies to. A paragraph that mentions
 * three missing things is a paragraph nobody maps back onto their own kitchen.
 *
 * A hint is advice, never an apology: "zovri a nechaj 45 sekúnd odstáť" is a
 * hint, "bez teplomera to bude presnejšie iba odhadom" is not.
 */
export const constraintHintSchema = z.object({
  constraint: z.enum(BREW_CONSTRAINT_NAMES),
  hint: z.string().min(1).max(CONSTRAINT_HINT_MAX_LENGTH),
});

export type ConstraintHint = z.infer<typeof constraintHintSchema>;
