import { z } from 'zod';

import { labelPhotoIssueSchema } from './labelPhotoIssues.js';
import { parsedBagFieldsSchema } from './parsedBagFieldsSchema.js';
import { photoSchema } from './photoSchema.js';

/**
 * Body of `POST /ai/parse-coffee-bag`.
 *
 * The photograph itself, in the body. It used to be a link into a storage
 * bucket the app had uploaded to first, which sent the same bytes across the
 * network twice: the server has to hold them either way, both to hash them for
 * the cache and to hand the provider base-64 at the end. See `photoSchema` for
 * what that bucket cost and what it bought.
 */
export const parseCoffeeBagRequestSchema = z.object({ photo: photoSchema }).strict();

export type ParseCoffeeBagRequest = z.infer<typeof parseCoffeeBagRequestSchema>;

/**
 * What the label said, whether anybody had to be asked, and what the optical
 * reader made of the photograph itself.
 *
 * `fromCache` is reported rather than hidden: the same photograph and the same
 * roaster-and-name pair are answered from a stored reading, and an app that
 * says so is one whose speed is explainable.
 *
 * `photoIssues` has three states and they mean three different things. `null`
 * is nobody looked - no optical reader is configured, or the one that is could
 * not be reached; the fields are whatever the model made of the picture, as
 * they always were. An empty list is somebody looked and had no complaint. A
 * non-empty list is the photograph was refused before a single token was
 * spent, and every name in it is a reason the app can turn into an instruction
 * about how to take the next one. The fields are then empty, because nothing
 * was read - not because nothing was printed.
 */
export const parseCoffeeBagResponseSchema = z.object({
  fields: parsedBagFieldsSchema,
  fromCache: z.boolean(),
  photoIssues: z.array(labelPhotoIssueSchema).nullable(),
});

export type ParseCoffeeBagResponse = z.infer<typeof parseCoffeeBagResponseSchema>;
