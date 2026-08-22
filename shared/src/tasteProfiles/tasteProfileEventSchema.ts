import { z } from 'zod';

import { TASTE_PROFILE_SOURCES } from '../enums/tasteProfileSources.js';

import { tasteProfileDeltaSchema } from './tasteProfileDeltaSchema.js';
import { tasteProfileEventPayloadSchema } from './tasteProfileEventPayloadSchema.js';
import { SOURCE_REF_MAX_LENGTH } from './tasteProfileFieldLimits.js';

/**
 * One entry in the append-only audit trail. Never updated, never deleted -
 * the profile is rebuilt from these, not patched in place.
 */
export const tasteProfileEventSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  source: z.enum(TASTE_PROFILE_SOURCES),
  /**
   * Identifies what produced the event - a brew log id, a questionnaire
   * version. Unique per (user, source), so submitting the same questionnaire
   * twice cannot count twice.
   */
  sourceRef: z.string().max(SOURCE_REF_MAX_LENGTH).nullable(),
  payload: tasteProfileEventPayloadSchema,
  appliedDelta: tasteProfileDeltaSchema.nullable(),
  createdAt: z.iso.datetime(),
});

export type TasteProfileEvent = z.infer<typeof tasteProfileEventSchema>;
