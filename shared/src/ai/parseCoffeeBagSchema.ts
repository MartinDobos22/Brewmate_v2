import { z } from 'zod';

import { IMAGE_URL_MAX_LENGTH } from '../coffeeBags/coffeeBagFieldLimits.js';

import { labelPhotoIssueSchema } from './labelPhotoIssues.js';
import { parsedBagFieldsSchema } from './parsedBagFieldsSchema.js';

/**
 * Body of `POST /ai/parse-coffee-bag`.
 *
 * The app uploads the photograph to storage and sends the URL; the image bytes
 * never travel through this API. That keeps a request small enough to survive
 * a shop's signal, and it is what lets a retry cost one short request rather
 * than a second upload.
 */
export const parseCoffeeBagRequestSchema = z
  .object({ imageUrl: z.url().max(IMAGE_URL_MAX_LENGTH) })
  .strict();

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
