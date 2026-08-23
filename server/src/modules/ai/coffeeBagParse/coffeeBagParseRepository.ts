import { and, eq, type SQL } from 'drizzle-orm';

import type { Database } from '../../../db/databaseTypes.js';
import { firstRowOrNull } from '../../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../../db/rows/requireRow.js';
import type {
  CoffeeBagParseRow,
  NewCoffeeBagParseRow,
} from '../../../db/schema/coffeeBagParsesTable.js';
import { coffeeBagParsesTable } from '../../../db/schema/coffeeBagParsesTable.js';

export interface LabelKey {
  readonly roasterKey: string;
  readonly nameKey: string;
}

export interface CoffeeBagParseRepository {
  findByImageHash(imageHash: string): Promise<CoffeeBagParseRow | null>;
  findByLabel(key: LabelKey): Promise<CoffeeBagParseRow | null>;
  /** Upserts on the image hash, so two concurrent scans of one photograph cannot race. */
  save(input: NewCoffeeBagParseRow): Promise<CoffeeBagParseRow>;
}

const sameLabel = ({ roasterKey, nameKey }: LabelKey): SQL | undefined =>
  and(eq(coffeeBagParsesTable.roasterKey, roasterKey), eq(coffeeBagParsesTable.nameKey, nameKey));

export const createCoffeeBagParseRepository = (db: Database): CoffeeBagParseRepository => ({
  findByImageHash: async (imageHash) =>
    firstRowOrNull(
      await db
        .select()
        .from(coffeeBagParsesTable)
        .where(eq(coffeeBagParsesTable.imageHash, imageHash)),
    ),

  findByLabel: async (key) =>
    firstRowOrNull(await db.select().from(coffeeBagParsesTable).where(sameLabel(key))),

  save: async (input) =>
    requireRow(
      await db
        .insert(coffeeBagParsesTable)
        .values(input)
        .onConflictDoUpdate({
          target: coffeeBagParsesTable.imageHash,
          set: { fields: input.fields, model: input.model },
        })
        .returning(),
    ),
});
