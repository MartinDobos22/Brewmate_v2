import { z } from 'zod';

import { DISPLAY_NAME_MAX_LENGTH, DISPLAY_NAME_MIN_LENGTH } from './userFieldLimits.js';

/**
 * Body of `PATCH /me`. Only fields the user owns are editable;
 * identity fields (id, firebaseUid, email) are managed by the auth provider.
 */
export const updateUserRequestSchema = z
  .object({
    displayName: z
      .string()
      .min(DISPLAY_NAME_MIN_LENGTH)
      .max(DISPLAY_NAME_MAX_LENGTH)
      .nullable()
      .optional(),
  })
  .strict();

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
