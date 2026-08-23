import { z } from 'zod';

import { IMAGE_URL_MAX_LENGTH } from '../coffeeBags/coffeeBagFieldLimits.js';

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
 * What the label said, and whether anybody had to be asked.
 *
 * `fromCache` is reported rather than hidden: the same photograph and the same
 * roaster-and-name pair are answered from a stored reading, and an app that
 * says so is one whose speed is explainable.
 */
export const parseCoffeeBagResponseSchema = z.object({
  fields: parsedBagFieldsSchema,
  fromCache: z.boolean(),
});

export type ParseCoffeeBagResponse = z.infer<typeof parseCoffeeBagResponseSchema>;
