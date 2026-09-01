import { z } from 'zod';

import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  FLAVOR_AFFINITY_DELTA_MAX,
  FLAVOR_AFFINITY_DELTA_MIN,
  FLAVOR_TAG_MAX_LENGTH,
  TASTE_AXIS_DELTA_MAX,
  TASTE_AXIS_DELTA_MIN,
} from './tasteProfileFieldLimits.js';

/**
 * How far one event moved an axis, in either direction.
 *
 * Deliberately not `partialTasteAxesSchema`, which describes where a value
 * sits rather than how far it travelled. A move is a difference: an event that
 * takes somebody from the middle of the scale down to "as little bitterness as
 * possible" is an ordinary observation, and its delta is a negative number the
 * axis schema would refuse - taking the whole response down with it, after the
 * event had already been stored.
 */
const axisDelta = (): z.ZodNumber => z.number().min(TASTE_AXIS_DELTA_MIN).max(TASTE_AXIS_DELTA_MAX);

const deltaAxesSchema = z
  .object({
    acidity: axisDelta(),
    sweetness: axisDelta(),
    body: axisDelta(),
    bitterness: axisDelta(),
    intensity: axisDelta(),
  })
  .partial();

/** A tag's affinity moves the same way, across its own narrower scale. */
const deltaAffinitiesSchema = z.record(
  z.string().max(FLAVOR_TAG_MAX_LENGTH),
  z.number().min(FLAVOR_AFFINITY_DELTA_MIN).max(FLAVOR_AFFINITY_DELTA_MAX),
);

/**
 * What the reducer actually did with one event.
 *
 * Stored next to the event so a replay can be compared with what happened at
 * the time, instead of being taken on faith.
 */
export const tasteProfileDeltaSchema = z.object({
  axes: deltaAxesSchema,
  flavorAffinities: deltaAffinitiesSchema,
  /** The share of the new observation that was blended into the profile. */
  weight: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
});

export type TasteProfileDelta = z.infer<typeof tasteProfileDeltaSchema>;
