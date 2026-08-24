import { z } from 'zod';

import { ANALYTICS_EVENT_NAMES } from './analyticsEventNames.js';
import {
  ANALYTICS_BATCH_MAX,
  ANALYTICS_PROPERTIES_MAX,
  ANALYTICS_PROPERTY_KEY_MAX_LENGTH,
  ANALYTICS_PROPERTY_VALUE_MAX_LENGTH,
} from './analyticsFieldLimits.js';

/**
 * What may travel beside an event name.
 *
 * Short machine values only - a method key, a count, a flag - and never free
 * text. Anything somebody typed belongs to them: a coffee's name, a note about
 * a cup and a search term are all things this table has no business holding,
 * and a schema that accepted them would eventually hold one.
 */
export const analyticsPropertiesSchema = z
  .record(
    z.string().max(ANALYTICS_PROPERTY_KEY_MAX_LENGTH),
    z.union([z.string().max(ANALYTICS_PROPERTY_VALUE_MAX_LENGTH), z.number(), z.boolean()]),
  )
  .refine(
    (properties: Record<string, string | number | boolean>): boolean =>
      Object.keys(properties).length <= ANALYTICS_PROPERTIES_MAX,
  );

export type AnalyticsProperties = z.infer<typeof analyticsPropertiesSchema>;

/**
 * One thing that happened, timed by the phone it happened on.
 *
 * The client's clock rather than the server's, because these are queued while
 * offline and flushed later - stamping them on arrival would report a morning's
 * brewing as having happened all at once that evening.
 */
export const analyticsEventSchema = z.object({
  name: z.enum(ANALYTICS_EVENT_NAMES),
  occurredAt: z.iso.datetime(),
  properties: analyticsPropertiesSchema.optional(),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export const createAnalyticsEventsRequestSchema = z.object({
  events: z.array(analyticsEventSchema).min(1).max(ANALYTICS_BATCH_MAX),
});

export type CreateAnalyticsEventsRequest = z.infer<typeof createAnalyticsEventsRequestSchema>;

/** How many rows were written, so a flush knows what it may drop from its queue. */
export const createAnalyticsEventsResponseSchema = z.object({
  accepted: z.number().int().nonnegative(),
});

export type CreateAnalyticsEventsResponse = z.infer<typeof createAnalyticsEventsResponseSchema>;

/** One stored row, as it comes back in a GDPR export. */
export const storedAnalyticsEventSchema = analyticsEventSchema.extend({
  id: z.uuid(),
  userId: z.uuid(),
  createdAt: z.iso.datetime(),
});

export type StoredAnalyticsEvent = z.infer<typeof storedAnalyticsEventSchema>;
