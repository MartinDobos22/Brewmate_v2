import { BREW_METHOD_CATEGORIES, EQUIPMENT_TYPES } from '@brewmate/shared';

import type { Database } from '../../src/db/databaseTypes.js';
import { requireRow } from '../../src/db/rows/requireRow.js';
import type { BrewMethodRow } from '../../src/db/schema/brewMethodsTable.js';
import { brewMethodsTable } from '../../src/db/schema/brewMethodsTable.js';

const V60_RATIO_MIN = 14;
const V60_RATIO_MAX = 18;
const AEROPRESS_RATIO_MIN = 12;
const AEROPRESS_RATIO_MAX = 16;
const RETIRED_RATIO_MIN = 10;
const RETIRED_RATIO_MAX = 20;

const V60_RATIO = { min: V60_RATIO_MIN, max: V60_RATIO_MAX } as const;
const AEROPRESS_RATIO = { min: AEROPRESS_RATIO_MIN, max: AEROPRESS_RATIO_MAX } as const;
const RETIRED_RATIO = { min: RETIRED_RATIO_MIN, max: RETIRED_RATIO_MAX } as const;

export const V60_KEY = 'v60';
export const AEROPRESS_KEY = 'aeropress';
export const RETIRED_KEY = 'chemex-classic';

/**
 * The catalogue a test needs.
 *
 * Written straight into the table rather than through an endpoint, because
 * methods are reference data - no client is allowed to create one.
 */
export const insertTestBrewMethods = async (
  db: Database,
): Promise<{
  readonly v60: BrewMethodRow;
  readonly aeropress: BrewMethodRow;
  readonly retired: BrewMethodRow;
}> => ({
  v60: requireRow(
    await db
      .insert(brewMethodsTable)
      .values({
        key: V60_KEY,
        nameSk: 'V60',
        category: BREW_METHOD_CATEGORIES.pourOver,
        defaultRatioRange: V60_RATIO,
        requiresEquipmentType: EQUIPMENT_TYPES.brewer,
      })
      .returning(),
  ),
  aeropress: requireRow(
    await db
      .insert(brewMethodsTable)
      .values({
        key: AEROPRESS_KEY,
        nameSk: 'AeroPress',
        category: BREW_METHOD_CATEGORIES.immersion,
        defaultRatioRange: AEROPRESS_RATIO,
      })
      .returning(),
  ),
  retired: requireRow(
    await db
      .insert(brewMethodsTable)
      .values({
        key: RETIRED_KEY,
        nameSk: 'Chemex Classic',
        category: BREW_METHOD_CATEGORIES.pourOver,
        defaultRatioRange: RETIRED_RATIO,
        isActive: false,
      })
      .returning(),
  ),
});
