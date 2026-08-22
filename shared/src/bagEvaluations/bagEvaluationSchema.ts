import { z } from 'zod';

import { IMAGE_URL_MAX_LENGTH } from '../coffeeBags/coffeeBagFieldLimits.js';
import { CONFIDENCE_MAX, CONFIDENCE_MIN } from '../tasteProfiles/tasteProfileFieldLimits.js';

import { VERDICT_TEXT_MAX_LENGTH } from './bagEvaluationFieldLimits.js';
import {
  evaluationReasoningSchema,
  evaluationUncertaintiesSchema,
} from './evaluationReasoningSchema.js';
import { parsedBagDataSchema } from './parsedBagDataSchema.js';

/**
 * "Should I buy this bag?", asked in a shop and answered.
 *
 * `profileConfidenceAtTime` is stored rather than looked up later: the answer
 * was only as good as what Brewmate knew that afternoon, and reading today's
 * confidence would quietly rewrite how much that advice was worth.
 *
 * `wasPurchased` and `linkedBagId` close the loop - they are how the app finds
 * out whether its advice was any good.
 */
export const bagEvaluationSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  imageUrl: z.url().max(IMAGE_URL_MAX_LENGTH).nullable(),
  parsedData: parsedBagDataSchema,
  verdictText: z.string().max(VERDICT_TEXT_MAX_LENGTH).nullable(),
  reasoning: evaluationReasoningSchema,
  uncertainties: evaluationUncertaintiesSchema,
  profileConfidenceAtTime: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX).nullable(),
  wasPurchased: z.boolean().nullable(),
  linkedBagId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
});

export type BagEvaluation = z.infer<typeof bagEvaluationSchema>;
