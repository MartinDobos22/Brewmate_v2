import { z } from 'zod';

import { WATER_TYPES } from '../enums/waterTypes.js';

import { onboardingStateSchema } from './onboardingStateSchema.js';
import {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  FIREBASE_UID_MAX_LENGTH,
  FIREBASE_UID_MIN_LENGTH,
} from './userFieldLimits.js';

/**
 * A Brewmate user as exposed by the API.
 *
 * `waterType` is the account-wide default. A recipe records the water it
 * assumes and a brew log records the water actually used, so moving house
 * never rewrites what happened in the past.
 */
export const userSchema = z.object({
  id: z.uuid(),
  firebaseUid: z.string().min(FIREBASE_UID_MIN_LENGTH).max(FIREBASE_UID_MAX_LENGTH),
  email: z.email().max(EMAIL_MAX_LENGTH).nullable(),
  displayName: z.string().min(DISPLAY_NAME_MIN_LENGTH).max(DISPLAY_NAME_MAX_LENGTH).nullable(),
  waterType: z.enum(WATER_TYPES),
  onboardingState: onboardingStateSchema.nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;
