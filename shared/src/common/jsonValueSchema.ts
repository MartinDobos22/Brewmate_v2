import { z } from 'zod';

/**
 * A free-form map stored in a `jsonb` column.
 *
 * Used only where the vocabulary genuinely belongs to the data rather than to
 * the code - a kettle's parameters are not the same as a scale's, and neither
 * set is finished.
 */
export const jsonObjectSchema = z.record(z.string(), z.unknown());

export type JsonObject = z.infer<typeof jsonObjectSchema>;
