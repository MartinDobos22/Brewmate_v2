import { z } from 'zod';

import {
  FLAVOR_AFFINITY_MAX,
  FLAVOR_AFFINITY_MIN,
  FLAVOR_TAG_MAX_LENGTH,
} from './tasteProfileFieldLimits.js';

/**
 * Flavour tag to affinity. A map rather than columns because the tag
 * vocabulary is data that grows - "jasmine" must not require a migration.
 */
export const flavorAffinitiesSchema = z.record(
  z.string().max(FLAVOR_TAG_MAX_LENGTH),
  z.number().min(FLAVOR_AFFINITY_MIN).max(FLAVOR_AFFINITY_MAX),
);

export type FlavorAffinities = z.infer<typeof flavorAffinitiesSchema>;
