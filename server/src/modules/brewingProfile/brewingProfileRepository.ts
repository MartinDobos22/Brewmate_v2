import type {
  BrewConstraints,
  BrewMethodCategory,
  BrewParams,
  CupReading,
  PartialBrewParams,
  RoastLevel,
} from '@brewmate/shared';
import { and, desc, eq, or } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import { brewLogsTable } from '../../db/schema/brewLogsTable.js';
import { brewMethodsTable } from '../../db/schema/brewMethodsTable.js';
import { coffeeBagsTable } from '../../db/schema/coffeeBagsTable.js';
import { equipmentTable } from '../../db/schema/equipmentTable.js';
import type { GrinderRow } from '../../db/schema/grindersCatalogTable.js';
import { grindersCatalogTable } from '../../db/schema/grindersCatalogTable.js';
import { recipesTable } from '../../db/schema/recipesTable.js';

import { BREWING_PROFILE_CUP_LIMIT } from './constants/brewingProfileLimits.js';

const VERIFIED = true;

/**
 * One cup, with the recipe it followed and the coffee it was ground from.
 *
 * Only the columns the profile reads. The bag's three columns are all that
 * moves a grind, and they are read as they stand today: a roast date does not
 * change, and a label somebody corrected since is the better description of
 * the coffee they brewed then.
 */
export interface BrewedCupRow {
  readonly recipeId: string;
  readonly parentRecipeId: string | null;
  readonly methodId: string;
  readonly methodCategory: BrewMethodCategory;
  readonly bagId: string | null;
  readonly learningWeight: number;
  readonly constraints: BrewConstraints;
  readonly actualParams: PartialBrewParams;
  readonly cupReading: CupReading | null;
  readonly recipeParams: BrewParams;
  readonly equipmentIds: readonly string[];
  readonly createdAt: Date;
  readonly roastLevel: RoastLevel | null;
  readonly process: string | null;
  readonly roastDate: string | null;
}

/** A grinder somebody owns, beside the catalogue entry its numbers are read through. */
export interface OwnedGrinderRow {
  readonly equipmentId: string;
  readonly grinder: GrinderRow;
}

export interface BrewingProfileRepository {
  listRecentCups(userId: string): Promise<readonly BrewedCupRow[]>;
  /**
   * Every grinder they have ever owned that the catalogue knows, retired ones
   * included - a cup ground last spring on a grinder since sold was still
   * ground on it.
   */
  listOwnedGrinders(userId: string): Promise<readonly OwnedGrinderRow[]>;
}

export const createBrewingProfileRepository = (db: Database): BrewingProfileRepository => ({
  /**
   * A left join on the bag, so a quick brew with nothing written down is still
   * a cup: its dose and its ratio are as real as anybody's, and only its grind
   * has nothing to be measured against but the middle of the window.
   */
  listRecentCups: async (userId) =>
    db
      .select({
        recipeId: recipesTable.id,
        parentRecipeId: recipesTable.parentRecipeId,
        methodId: recipesTable.methodId,
        methodCategory: brewMethodsTable.category,
        bagId: brewLogsTable.bagId,
        learningWeight: brewLogsTable.profileLearningWeight,
        constraints: brewLogsTable.constraints,
        actualParams: brewLogsTable.actualParams,
        cupReading: brewLogsTable.cupReading,
        recipeParams: recipesTable.params,
        equipmentIds: recipesTable.equipmentIds,
        createdAt: brewLogsTable.createdAt,
        roastLevel: coffeeBagsTable.roastLevel,
        process: coffeeBagsTable.process,
        roastDate: coffeeBagsTable.roastDate,
      })
      .from(brewLogsTable)
      .innerJoin(recipesTable, eq(brewLogsTable.recipeId, recipesTable.id))
      .innerJoin(brewMethodsTable, eq(recipesTable.methodId, brewMethodsTable.id))
      .leftJoin(coffeeBagsTable, eq(brewLogsTable.bagId, coffeeBagsTable.id))
      .where(eq(brewLogsTable.userId, userId))
      .orderBy(desc(brewLogsTable.createdAt))
      .limit(BREWING_PROFILE_CUP_LIMIT),

  listOwnedGrinders: async (userId) =>
    db
      .select({ equipmentId: equipmentTable.id, grinder: grindersCatalogTable })
      .from(equipmentTable)
      .innerJoin(grindersCatalogTable, eq(equipmentTable.catalogGrinderId, grindersCatalogTable.id))
      .where(
        and(
          eq(equipmentTable.userId, userId),
          or(
            eq(grindersCatalogTable.isVerified, VERIFIED),
            eq(grindersCatalogTable.createdByUserId, userId),
          ),
        ),
      ),
});
