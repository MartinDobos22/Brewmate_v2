import { z } from 'zod';

import {
  REASONING_POINTS_MAX,
  REASONING_POINT_MAX_LENGTH,
  UNCERTAINTIES_MAX,
  UNCERTAINTY_FIELD_MAX_LENGTH,
  UNCERTAINTY_REASON_MAX_LENGTH,
} from './bagEvaluationFieldLimits.js';

/** Why the verdict came out the way it did, in the order it was argued. */
export const evaluationReasoningSchema = z.object({
  points: z.array(z.string().max(REASONING_POINT_MAX_LENGTH)).max(REASONING_POINTS_MAX),
});

export type EvaluationReasoning = z.infer<typeof evaluationReasoningSchema>;

/**
 * What the verdict could not see. Kept separate from the reasoning so the app
 * can show honestly which parts of the advice rest on a guess.
 */
export const evaluationUncertaintiesSchema = z.object({
  items: z
    .array(
      z.object({
        field: z.string().max(UNCERTAINTY_FIELD_MAX_LENGTH),
        reason: z.string().max(UNCERTAINTY_REASON_MAX_LENGTH),
      }),
    )
    .max(UNCERTAINTIES_MAX),
});

export type EvaluationUncertainties = z.infer<typeof evaluationUncertaintiesSchema>;
