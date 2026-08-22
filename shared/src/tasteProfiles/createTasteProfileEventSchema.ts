import { z } from 'zod';

import { TASTE_PROFILE_SOURCES } from '../enums/tasteProfileSources.js';

import { tasteProfileEventPayloadSchema } from './tasteProfileEventPayloadSchema.js';
import { SOURCE_REF_MAX_LENGTH } from './tasteProfileFieldLimits.js';

/**
 * Body of `POST /taste-profile/events`.
 *
 * Sending the same `source` and `sourceRef` twice is safe: the API answers
 * with the event that already exists instead of counting the evidence again.
 */
export const createTasteProfileEventRequestSchema = z
  .object({
    source: z.enum(TASTE_PROFILE_SOURCES),
    sourceRef: z.string().max(SOURCE_REF_MAX_LENGTH).nullable().optional(),
    payload: tasteProfileEventPayloadSchema,
  })
  .strict();

export type CreateTasteProfileEventRequest = z.infer<typeof createTasteProfileEventRequestSchema>;
