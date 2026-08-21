import { API_ROUTES, buildApiPath, coffeeBagSchema, listResponseSchema } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { OTHER_BAG_NAME, TEST_BAG_NAME } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const BAG_WEIGHT_GRAMS = 250;
const BREWED_AWAY_GRAMS = 232;
const IMPOSSIBLE_REMAINING_GRAMS = 400;
const ROAST_DATE = '2026-08-01';
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;

describe('coffee bags', () => {
  let context: TestContext;
  let api: TestApi;

  const createBag = async (payload: Record<string, unknown>): Promise<string> =>
    coffeeBagSchema.parse((await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, payload)).json())
      .id;

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

  /** A freshly opened bag is full; nobody should have to say so. */
  it('starts a new bag with its full weight remaining', async () => {
    const response = await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, {
      name: TEST_BAG_NAME,
      weightGrams: BAG_WEIGHT_GRAMS,
    });

    expect(coffeeBagSchema.parse(response.json()).remainingGrams).toBe(BAG_WEIGHT_GRAMS);
  });

  it('refuses a bag holding more than it weighs', async () => {
    const response = await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, {
      name: TEST_BAG_NAME,
      weightGrams: BAG_WEIGHT_GRAMS,
      remainingGrams: IMPOSSIBLE_REMAINING_GRAMS,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
  });

  /** The check has to see the row as it will be, not only the half in the body. */
  it('checks the remaining amount against the weight already stored', async () => {
    const id = await createBag({ name: TEST_BAG_NAME, weightGrams: BAG_WEIGHT_GRAMS });

    const response = await api.patch(
      buildApiPath(API_ROUTES.coffeeBagById, { id }),
      RETURNING_IDENTITY,
      { remainingGrams: IMPOSSIBLE_REMAINING_GRAMS },
    );

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
  });

  /** A roast date is a date: it must survive the round trip without shifting. */
  it('stores a roast date without a time or a timezone', async () => {
    const id = await createBag({ name: TEST_BAG_NAME, roastDate: ROAST_DATE });

    const bag = coffeeBagSchema.parse(
      (await api.get(buildApiPath(API_ROUTES.coffeeBagById, { id }), RETURNING_IDENTITY)).json(),
    );

    expect(bag.roastDate).toBe(ROAST_DATE);
  });

  it('records how much is left after brewing', async () => {
    const id = await createBag({ name: TEST_BAG_NAME, weightGrams: BAG_WEIGHT_GRAMS });

    const response = await api.patch(
      buildApiPath(API_ROUTES.coffeeBagById, { id }),
      RETURNING_IDENTITY,
      { remainingGrams: BREWED_AWAY_GRAMS },
    );

    expect(coffeeBagSchema.parse(response.json()).remainingGrams).toBe(BREWED_AWAY_GRAMS);
  });

  /** Deleting archives: brew logs point at this row and the history stays. */
  it('archives a bag instead of erasing it', async () => {
    const id = await createBag({ name: TEST_BAG_NAME });

    const deleted = coffeeBagSchema.parse(
      (await api.remove(buildApiPath(API_ROUTES.coffeeBagById, { id }), RETURNING_IDENTITY)).json(),
    );

    expect(deleted.isArchived).toBe(true);

    const visible = listResponseSchema(coffeeBagSchema).parse(
      (await api.get(API_ROUTES.coffeeBags, RETURNING_IDENTITY)).json(),
    );

    expect(visible.items).toHaveLength(NO_ITEMS);

    const withArchived = listResponseSchema(coffeeBagSchema).parse(
      (await api.get(`${API_ROUTES.coffeeBags}?includeArchived=true`, RETURNING_IDENTITY)).json(),
    );

    expect(withArchived.items).toHaveLength(SINGLE_ITEM);
    expect(withArchived.items[0]?.id).toBe(id);
  });

  it('keeps one account s bags out of another s', async () => {
    const id = await createBag({ name: TEST_BAG_NAME });

    await api.post(API_ROUTES.coffeeBags, SECOND_IDENTITY, { name: OTHER_BAG_NAME });

    const foreign = await api.get(buildApiPath(API_ROUTES.coffeeBagById, { id }), SECOND_IDENTITY);

    expect(foreign.statusCode).toBe(HTTP_STATUS.notFound);

    const theirs = listResponseSchema(coffeeBagSchema).parse(
      (await api.get(API_ROUTES.coffeeBags, SECOND_IDENTITY)).json(),
    );

    expect(theirs.items).toHaveLength(SINGLE_ITEM);
    expect(theirs.items[0]?.name).toBe(OTHER_BAG_NAME);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.coffeeBags)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
