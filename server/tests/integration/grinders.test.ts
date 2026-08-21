import { API_ROUTES, grinderSchema, listResponseSchema, GRINDER_UNIT_TYPES, GRINDER_TYPICAL_USES } from '@brewmate/shared';
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

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.grinders)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
