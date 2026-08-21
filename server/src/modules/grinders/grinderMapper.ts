import type { Grinder } from '@brewmate/shared';

import type { GrinderRow } from '../../db/schema/grindersCatalogTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toGrinder = (row: GrinderRow): Grinder => ({
  id: row.id,
  brand: row.brand,
  model: row.model,
  unitType: row.unitType,
  minSetting: row.minSetting,
  maxSetting: row.maxSetting,
  step: row.step,
  micronCalibration: row.micronCalibration ?? null,
  typicalUse: row.typicalUse,
  isVerified: row.isVerified,
  createdByUserId: row.createdByUserId,
  createdAt: row.createdAt.toISOString(),
});
