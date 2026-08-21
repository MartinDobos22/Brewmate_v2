import { z } from 'zod';

import { bagEvaluationSchema } from './bagEvaluationSchema.js';

/**
 * Body of `POST /bag-evaluations`.
 *
 * `profileConfidenceAtTime` is not accepted from the client: it is read off
 * the caller's own profile at the moment the evaluation is stored.
 */
export const createBagEvaluationRequestSchema = bagEvaluationSchema
  .omit({
    id: true,
    userId: true,
    profileConfidenceAtTime: true,
    createdAt: true,
  })
  .partial()
  .strict();

export type CreateBagEvaluationRequest = z.infer<typeof createBagEvaluationRequestSchema>;
