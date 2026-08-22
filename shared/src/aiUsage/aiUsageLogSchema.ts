import { z } from 'zod';

import {
  AI_FUNCTION_NAME_MAX_LENGTH,
  AI_MODEL_NAME_MAX_LENGTH,
  AI_TOKENS_MIN,
} from './aiUsageFieldLimits.js';

/**
 * One model call, recorded for cost.
 *
 * Read-only over HTTP: an endpoint that lets a client declare its own token
 * usage is a number nobody can trust. These rows are written by the server
 * services that actually make the calls.
 */
export const aiUsageLogSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  functionName: z.string().max(AI_FUNCTION_NAME_MAX_LENGTH),
  model: z.string().max(AI_MODEL_NAME_MAX_LENGTH),
  tokensIn: z.number().int().min(AI_TOKENS_MIN),
  tokensOut: z.number().int().min(AI_TOKENS_MIN),
  /** A decimal string, so summing it stays exact. */
  costEstimate: z.string(),
  createdAt: z.iso.datetime(),
});

export type AiUsageLog = z.infer<typeof aiUsageLogSchema>;
