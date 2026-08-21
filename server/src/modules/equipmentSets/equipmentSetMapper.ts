import type { EquipmentSet } from '@brewmate/shared';

import type { EquipmentSetRow } from '../../db/schema/equipmentSetsTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toEquipmentSet = (row: EquipmentSetRow): EquipmentSet => ({
  id: row.id,
  userId: row.userId,
  name: row.name,
  equipmentIds: [...row.equipmentIds],
  defaultConstraints: row.defaultConstraints,
  isDefault: row.isDefault,
  sortOrder: row.sortOrder,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});
