import { foldBrewingProfile, type BrewingProfile, type Grinder } from '@brewmate/shared';

import { toGrinder } from '../grinders/grinderMapper.js';

import type {
  BrewedCupRow,
  BrewingProfileRepository,
  OwnedGrinderRow,
} from './brewingProfileRepository.js';
import { toBrewedCup } from './toBrewedCup.js';

export interface BrewingProfileService {
  read(userId: string): Promise<BrewingProfile>;
}

/**
 * Every recipe somebody moved away from and then brewed the correction of.
 *
 * Read off the cups themselves: a recipe whose child appears among them was
 * superseded by a version that was actually made, which is the only kind of
 * correction worth counting. A suggestion nobody brewed corrected nothing.
 */
const readSuperseded = (rows: readonly BrewedCupRow[]): ReadonlySet<string> =>
  new Set(
    rows.flatMap((row: BrewedCupRow): readonly string[] =>
      row.parentRecipeId === null ? [] : [row.parentRecipeId],
    ),
  );

const indexGrinders = (rows: readonly OwnedGrinderRow[]): ReadonlyMap<string, Grinder> =>
  new Map(
    rows.map((row: OwnedGrinderRow): [string, Grinder] => [
      row.equipmentId,
      toGrinder(row.grinder),
    ]),
  );

/**
 * How somebody brews, read off their own cups.
 *
 * Computed on every read rather than stored, the way the insights are: it is
 * a fold over recent brew logs, so it is always exactly what those cups say,
 * and a log corrected or deleted is reflected on the next read with no row to
 * go stale. Two queries and some arithmetic - cheap enough to run before every
 * recipe, which is where it is needed.
 *
 * It reads nothing about taste and teaches nothing about it. The taste profile
 * says which coffee somebody should buy; this says how they brew the one they
 * have, and neither is allowed to answer the other's question.
 */
export const createBrewingProfileService = (
  repository: BrewingProfileRepository,
): BrewingProfileService => ({
  read: async (userId): Promise<BrewingProfile> => {
    const [rows, grinders] = await Promise.all([
      repository.listRecentCups(userId),
      repository.listOwnedGrinders(userId),
    ]);
    const owned = indexGrinders(grinders);
    const superseded = readSuperseded(rows);

    return foldBrewingProfile(rows.map((row: BrewedCupRow) => toBrewedCup(row, owned, superseded)));
  },
});
