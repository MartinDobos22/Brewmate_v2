import type { BrewMethod } from '@brewmate/shared';

import type { BrewMethodRow } from '../../db/schema/brewMethodsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toBrewMethod = (row: BrewMethodRow): BrewMethod => ({
  id: row.id,
  key: row.key,
  nameSk: row.nameSk,
  category: row.category,
  defaultRatioRange: row.defaultRatioRange,
  requiresEquipmentType: row.requiresEquipmentType,
  sortOrder: row.sortOrder,
  isActive: row.isActive,
});
