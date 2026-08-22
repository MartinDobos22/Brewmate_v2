import {
  API_ROUTES,
  grinderSchema,
  listResponseSchema,
  GRINDER_UNIT_TYPES,
  GRINDER_TYPICAL_USES,
  type Grinder,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const MIN_SETTING = 0;
const MAX_SETTING = 50;
const STEP = 1;
const FINE_MICRONS = 300;
const COARSE_MICRONS = 1000;
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;

/** Two entries far enough apart that a search can only return one of them. */
const OTHER_GRINDER = {
  brand: '1Zpresso',
  model: 'JX-Pro',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: MIN_SETTING,
  maxSetting: MAX_SETTING,
  step: STEP,
  typicalUse: GRINDER_TYPICAL_USES.espresso,
};

const SEARCH_BY_MODEL = 'c40';
const SEARCH_WORDS_REORDERED = 'mk4 comandante';
const SEARCH_WITH_WILDCARD = '%';

const CONTRIBUTED_GRINDER = {
  brand: 'Comandante',
  model: 'C40 MK4',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: MIN_SETTING,
  maxSetting: MAX_SETTING,
  step: STEP,
  typicalUse: GRINDER_TYPICAL_USES.both,
  micronCalibration: {
    points: [
      { setting: MIN_SETTING, microns: FINE_MICRONS },
      { setting: MAX_SETTING, microns: COARSE_MICRONS },
    ],
  },
};

describe('grinder catalogue', () => {
  let context: TestContext;
  let api: TestApi;

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

  it('accepts a grinder somebody adds themselves, unverified', async () => {
    const response = await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, CONTRIBUTED_GRINDER);

    expect(response.statusCode).toBe(HTTP_STATUS.created);

    const grinder = grinderSchema.parse(response.json());

    expect(grinder.isVerified).toBe(false);
    expect(grinder.micronCalibration?.points).toHaveLength(SINGLE_ITEM + SINGLE_ITEM);
  });

  /** One person's typo must not end up in everybody else's picker. */
  it('shows an unverified contribution only to the person who added it', async () => {
    await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, CONTRIBUTED_GRINDER);

    const mine = listResponseSchema(grinderSchema).parse(
      (await api.get(API_ROUTES.grinders, RETURNING_IDENTITY)).json(),
    );

    expect(mine.items).toHaveLength(SINGLE_ITEM);

    const theirs = listResponseSchema(grinderSchema).parse(
      (await api.get(API_ROUTES.grinders, SECOND_IDENTITY)).json(),
    );

    expect(theirs.items).toHaveLength(NO_ITEMS);
  });

  it('refuses a range whose minimum is above its maximum', async () => {
    const response = await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, {
      ...CONTRIBUTED_GRINDER,
      minSetting: MAX_SETTING,
      maxSetting: MIN_SETTING,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  it('will not let a client verify its own contribution', async () => {
    const response = await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, {
      ...CONTRIBUTED_GRINDER,
      isVerified: true,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  describe('search', () => {
    beforeEach(async () => {
      await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, CONTRIBUTED_GRINDER);
      await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, OTHER_GRINDER);
    });

    const search = async (term: string): Promise<readonly Grinder[]> =>
      listResponseSchema(grinderSchema).parse(
        (
          await api.get(
            `${API_ROUTES.grinders}?search=${encodeURIComponent(term)}`,
            RETURNING_IDENTITY,
          )
        ).json(),
      ).items;

    it('matches the model, whatever case it was typed in', async () => {
      const found = await search(SEARCH_BY_MODEL);

      expect(found).toHaveLength(SINGLE_ITEM);
      expect(found[0]?.model).toBe(CONTRIBUTED_GRINDER.model);
    });

    /** Nobody remembers whether the brand or the model comes first. */
    it('matches the brand and the model together, in any order', async () => {
      const found = await search(SEARCH_WORDS_REORDERED);

      expect(found).toHaveLength(SINGLE_ITEM);
      expect(found[0]?.brand).toBe(CONTRIBUTED_GRINDER.brand);
    });

    it('narrows the search with the typical use filter', async () => {
      const found = listResponseSchema(grinderSchema).parse(
        (
          await api.get(
            `${API_ROUTES.grinders}?typicalUse=${GRINDER_TYPICAL_USES.espresso}`,
            RETURNING_IDENTITY,
          )
        ).json(),
      ).items;

      expect(found).toHaveLength(SINGLE_ITEM);
      expect(found[0]?.model).toBe(OTHER_GRINDER.model);
    });

    /** A wildcard typed into the box is a character, not a query. */
    it('treats an SQL wildcard as text', async () => {
      expect(await search(SEARCH_WITH_WILDCARD)).toHaveLength(NO_ITEMS);
    });
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.grinders)).statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
