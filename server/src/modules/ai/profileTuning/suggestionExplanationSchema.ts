import { INSIGHT_EXPLANATION_MAX_LENGTH } from '@brewmate/shared';
import { z } from 'zod';

/**
 * The only thing this model is allowed to give back.
 *
 * One string, and no field anywhere for a roast level, an affinity, a count or
 * a share. Every number in this suggestion was computed in code from the brew
 * logs, and a schema with nowhere to put a different one is a guarantee rather
 * than a request - the same guarantee the recipe engine gets about a dose and
 * the conversion gets about a grind setting.
 *
 * A model that disagrees with the arithmetic can say so inside the paragraph,
 * which is the honest version of the same disagreement and reaches the person
 * who can actually act on it.
 */
export const suggestionExplanationSchema = z.object({
  explanation: z.string().min(1).max(INSIGHT_EXPLANATION_MAX_LENGTH),
});

export type SuggestionExplanation = z.infer<typeof suggestionExplanationSchema>;
