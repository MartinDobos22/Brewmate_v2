import { z } from 'zod';

import { bagEvaluationSchema } from './bagEvaluationSchema.js';

/**
 * Body of `PATCH /bag-evaluations/:id`.
 *
 * Only the outcome is editable. The verdict and its reasoning are a record of
 * what was said at the time and must not be rewritten after the fact.
 */
export const updateBagEvaluationRequestSchema = bagEvaluationSchema
  .pick({ wasPurchased: true, linkedBagId: true })
  .partial()
  .strict();

export type UpdateBagEvaluationRequest = z.infer<typeof updateBagEvaluationRequestSchema>;
