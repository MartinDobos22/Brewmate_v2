import type { Equipment } from '@brewmate/shared';

import type { EquipmentRow } from '../../db/schema/equipmentTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toEquipment = (row: EquipmentRow): Equipment => ({
  id: row.id,
  userId: row.userId,
  type: row.type,
  catalogGrinderId: row.catalogGrinderId,
  brand: row.brand,
  model: row.model,
  params: row.params,
  isActive: row.isActive,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});
