import type { CoffeeBag } from '@brewmate/shared';

import type { CoffeeBagRow } from '../../db/schema/coffeeBagsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toCoffeeBag = (row: CoffeeBagRow): CoffeeBag => ({
  id: row.id,
  userId: row.userId,
  roaster: row.roaster,
  name: row.name,
  originCountry: row.originCountry,
  region: row.region,
  farm: row.farm,
  variety: row.variety,
  process: row.process,
  roastLevel: row.roastLevel,
  roastDate: row.roastDate,
  altitude: row.altitude,
  tastingNotes: [...row.tastingNotes],
  weightGrams: row.weightGrams,
  remainingGrams: row.remainingGrams,
  imageUrl: row.imageUrl,
  isArchived: row.isArchived,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});
