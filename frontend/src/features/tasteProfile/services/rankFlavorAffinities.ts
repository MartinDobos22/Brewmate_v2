import type { FlavorAffinities } from '@brewmate/shared';

import { FLAVOR_AFFINITY_DISPLAY_MAX, FLAVOR_AFFINITY_DISPLAY_MIN } from '../constants/flavorTags';

export interface FlavorAffinityEntry {
  readonly tag: string;
  readonly affinity: number;
}

/**
 * The flavours worth mentioning, strongest feeling first.
 *
 * Ranked by distance from indifference rather than by value, because a tag
 * somebody actively dislikes is as much a fact about them as one they love.
 */
export const rankFlavorAffinities = (
  affinities: FlavorAffinities,
): readonly FlavorAffinityEntry[] =>
  Object.entries(affinities)
    .map(([tag, affinity]: readonly [string, number]): FlavorAffinityEntry => ({ tag, affinity }))
    .filter(
      ({ affinity }: FlavorAffinityEntry): boolean =>
        Math.abs(affinity) >= FLAVOR_AFFINITY_DISPLAY_MIN,
    )
    .sort(
      (first: FlavorAffinityEntry, second: FlavorAffinityEntry): number =>
        Math.abs(second.affinity) - Math.abs(first.affinity),
    )
    .slice(0, FLAVOR_AFFINITY_DISPLAY_MAX);
