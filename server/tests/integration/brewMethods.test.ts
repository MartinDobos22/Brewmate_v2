import { API_ROUTES, brewMethodSchema, listResponseSchema } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { AEROPRESS_KEY, RETIRED_KEY, V60_KEY, insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const ACTIVE_METHOD_COUNT = 2;
const ALL_METHOD_COUNT = 3;
const SINGLE_ITEM = 1;

describe('brew methods', () => {
  let context: TestContext;
  let api: TestApi;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
    await insertTestBrewMethods(context.db);
  });

  afterAll(async () => {
    await context.close();
  });

  /** Methods are data: the catalogue is read, never branched on. */
  it('lists the active catalogue', async () => {
    const methods = listResponseSchema(brewMethodSchema).parse(
      (await api.get(API_ROUTES.brewMethods, RETURNING_IDENTITY)).json(),
    );

    expect(methods.items).toHaveLength(ACTIVE_METHOD_COUNT);
    expect(methods.items.map((method): string => method.key)).toEqual(
      expect.arrayContaining([V60_KEY, AEROPRESS_KEY]),
    );
    expect(methods.items.map((method): string => method.key)).not.toContain(RETIRED_KEY);
  });

  it('can be asked for retired methods too', async () => {
    const methods = listResponseSchema(brewMethodSchema).parse(
      (await api.get(`${API_ROUTES.brewMethods}?includeInactive=true`, RETURNING_IDENTITY)).json(),
    );

    expect(methods.items).toHaveLength(ALL_METHOD_COUNT);
  });

  it('filters by category', async () => {
    const methods = listResponseSchema(brewMethodSchema).parse(
      (await api.get(`${API_ROUTES.brewMethods}?category=immersion`, RETURNING_IDENTITY)).json(),
    );

    expect(methods.items).toHaveLength(SINGLE_ITEM);
    expect(methods.items[0]?.key).toBe(AEROPRESS_KEY);
  });

  it('carries the ratio range as one value rather than two columns', async () => {
    const methods = listResponseSchema(brewMethodSchema).parse(
      (await api.get(API_ROUTES.brewMethods, RETURNING_IDENTITY)).json(),
    );
    const v60 = methods.items.find((method): boolean => method.key === V60_KEY);

    expect(v60?.defaultRatioRange.min).toBeLessThan(v60?.defaultRatioRange.max ?? 0);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.brewMethods)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
