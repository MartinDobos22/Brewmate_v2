import { z } from 'zod';

/**
 * Body of a successful `DELETE /me`. The account and every row belonging to it
 * are gone by the time this is sent; the timestamp is what the client shows
 * and logs.
 */
export const deleteAccountResponseSchema = z.object({
  deletedAt: z.iso.datetime(),
});

export type DeleteAccountResponse = z.infer<typeof deleteAccountResponseSchema>;
