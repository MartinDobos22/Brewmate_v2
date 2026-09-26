import {
  API_ROUTES,
  FLAVOR_TAGS,
  TASTE_PROFILE_SOURCES,
  listResponseSchema,
  tasteProfileEventSchema,
  tasteProfileSchema,
  type TasteProfile,
  type TasteProfileEvent,
} from '@brewmate/shared';
import { and, eq } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { tasteProfileEventsTable } from '../../src/db/schema/tasteProfileEventsTable.js';
import { createCoffeeTasteReadingRepository } from '../../src/modules/ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';
import {
  backfillPurchases,
  createPurchaseBackfillRepository,
  type PurchaseBackfillSummary,
} from '../../src/modules/bagRatings/index.js';
import { createTasteProfileEventRepository } from '../../src/modules/tasteProfiles/tasteProfileEventRepository.js';
import { createTasteProfileRepository } from '../../src/modules/tasteProfiles/tasteProfileRepository.js';
import { createTasteProfileService } from '../../src/modules/tasteProfiles/tasteProfileService.js';
import { createHistoryBag } from '../fixtures/testHistory.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const ONE = 1;
const NOTHING = 0;
const CHOCOLATE_NOTES = ['Horká čokoláda'];

describe('recording purchases for bags already in the cupboard', () => {
  let context: TestContext;
  let api: TestApi;

  const run = async (): Promise<PurchaseBackfillSummary> => {
    const eventRepository = createTasteProfileEventRepository(context.db);

    return backfillPurchases({
      repository: createPurchaseBackfillRepository(context.db),
      eventRepository,
      readings: createCoffeeTasteReadingRepository(context.db),
      tasteProfileService: createTasteProfileService(
        createTasteProfileRepository(context.db),
        eventRepository,
      ),
    });
  };

  const readPurchases = async (): Promise<readonly TasteProfileEvent[]> =>
    listResponseSchema(tasteProfileEventSchema)
      .parse((await api.get(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY)).json())
      .items.filter(
        (event: TasteProfileEvent): boolean => event.source === TASTE_PROFILE_SOURCES.purchase,
      );

  const readProfile = async (): Promise<TasteProfile> =>
    tasteProfileSchema.parse((await api.get(API_ROUTES.tasteProfile, RETURNING_IDENTITY)).json());

  /** A bag as it stood before purchases were learned from: written down, with no event. */
  const createOldBag = async (): Promise<string> => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY, { tastingNotes: CHOCOLATE_NOTES });

    await context.db
      .delete(tasteProfileEventsTable)
      .where(
        and(
          eq(tasteProfileEventsTable.source, TASTE_PROFILE_SOURCES.purchase),
          eq(tasteProfileEventsTable.sourceRef, bag.id),
        ),
      );
    await api.post(API_ROUTES.tasteProfileRecompute, RETURNING_IDENTITY, {});

    return bag.id;
  };

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
  });

  afterAll(async () => {
    await context.close();
  });

  it('records the purchase of a bag written down before purchases were learned from', async () => {
    const bagId = await createOldBag();

    expect(await readPurchases()).toHaveLength(NOTHING);

    const summary = await run();
    const purchases = await readPurchases();

    expect(summary.purchasesRecorded).toBe(ONE);
    expect(purchases).toHaveLength(ONE);
    expect(purchases[NOTHING]?.sourceRef).toBe(bagId);
    expect((await readProfile()).flavorAffinities[FLAVOR_TAGS.chocolate]).toBeGreaterThan(NOTHING);
  });

  it('records nothing the second time', async () => {
    await createOldBag();
    await run();

    const again = await run();

    expect(again.bagsWithoutPurchase).toBe(NOTHING);
    expect(await readPurchases()).toHaveLength(ONE);
  });

  it('leaves a bag bought after the change alone', async () => {
    await createHistoryBag(api, RETURNING_IDENTITY);

    expect((await run()).bagsWithoutPurchase).toBe(NOTHING);
  });
});
