import { z } from 'zod';

/**
 * The answer to a successful delete.
 *
 * A body rather than a bare 204, matching `DELETE /me`: the client gets back
 * the id it just removed and the moment it happened, which is what a cache
 * eviction and an undo notice both need.
 */
export const deletedResponseSchema = z.object({
  id: z.uuid(),
  deletedAt: z.iso.datetime(),
});

export type DeletedResponse = z.infer<typeof deletedResponseSchema>;
