import { z } from 'zod';

import { brewLogSchema } from './brewLogSchema.js';

/**
 * Body of `POST /brew-logs`.
 *
 * `profileLearningWeight` is absent on purpose: a client that could set how
 * much its own brew teaches the profile could quietly poison it. The API
 * prices the declared constraints itself.
 */
export const createBrewLogRequestSchema = brewLogSchema
  .omit({ id: true, userId: true, profileLearningWeight: true, createdAt: true })
  .partial()
  .required({ recipeId: true })
  .strict();

export type CreateBrewLogRequest = z.infer<typeof createBrewLogRequestSchema>;
