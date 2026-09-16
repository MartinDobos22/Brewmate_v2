import { and, eq, isNotNull, type SQL } from 'drizzle-orm';

import type { Database } from '../../../db/databaseTypes.js';
import { firstRowOrNull } from '../../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../../db/rows/requireRow.js';
import type {
  CoffeeTasteReadingRow,
  NewCoffeeTasteReadingRow,
} from '../../../db/schema/coffeeTasteReadingsTable.js';
import { coffeeTasteReadingsTable } from '../../../db/schema/coffeeTasteReadingsTable.js';
import type { LabelKey } from '../coffeeBagParse/coffeeBagParseRepository.js';

export interface CoffeeTasteReadingRepository {
  findByLabel(key: LabelKey): Promise<CoffeeTasteReadingRow | null>;
  /**
   * Upserts on the label, so two people scanning the same bag in two shops at
   * the same moment cannot race into a duplicate key error. The later reading
   * wins, which is the right way round: a model that has since been changed or
   * a label that has since been read more completely is the better answer.
   */
  save(input: NewCoffeeTasteReadingRow): Promise<CoffeeTasteReadingRow>;
}

/**
 * The index's own predicate, repeated where the upsert infers it.
 *
 * Postgres will only match `ON CONFLICT (a, b)` against a *partial* unique
 * index when the inference carries the same `WHERE` - and the label index is
 * partial on purpose, because several bags whose roaster or name could not be
 * read are several different bags rather than one. Without it the insert never
 * matched anything and every first reading of a coffee died on "there is no
 * unique or exclusion constraint matching the ON CONFLICT specification",
 * taking a model call that had already been paid for with it.
 */
const labelIndexPredicate = (): SQL | undefined =>
  and(isNotNull(coffeeTasteReadingsTable.roasterKey), isNotNull(coffeeTasteReadingsTable.nameKey));

const sameLabel = ({ roasterKey, nameKey }: LabelKey): SQL | undefined =>
  and(
    eq(coffeeTasteReadingsTable.roasterKey, roasterKey),
    eq(coffeeTasteReadingsTable.nameKey, nameKey),
  );

export const createCoffeeTasteReadingRepository = (db: Database): CoffeeTasteReadingRepository => ({
  findByLabel: async (key) =>
    firstRowOrNull(await db.select().from(coffeeTasteReadingsTable).where(sameLabel(key))),

  save: async (input) =>
    requireRow(
      await db
        .insert(coffeeTasteReadingsTable)
        .values(input)
        .onConflictDoUpdate({
          target: [coffeeTasteReadingsTable.roasterKey, coffeeTasteReadingsTable.nameKey],
          targetWhere: labelIndexPredicate(),
          set: { reading: input.reading, model: input.model },
        })
        .returning(),
    ),
});
