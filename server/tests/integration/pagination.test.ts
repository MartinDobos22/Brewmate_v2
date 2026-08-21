import { API_ROUTES, coffeeBagSchema, listResponseSchema } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const TOTAL_BAGS = 5;
const PAGE_SIZE = 2;
const LAST_PAGE_OFFSET = 4;
const LAST_PAGE_SIZE = 1;
const OVER_THE_LIMIT = 1000;

describe('list pagination', () => {
  let context: TestContext;
  let api: TestApi;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    for (let index = 0; index < TOTAL_BAGS; index += 1) {
      await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name: `Bag ${String(index)}` });
    }
  });

  afterAll(async () => {
    await context.close();
  });

  /** `hasMore` comes from over-fetching one row, not from a second count query. */
  it('reports that another page exists', async () => {
    const page = listResponseSchema(coffeeBagSchema).parse(
      (
        await api.get(
          `${API_ROUTES.coffeeBags}?limit=${String(PAGE_SIZE)}&offset=0`,
          RETURNING_IDENTITY,
        )
      ).json(),
    );

    expect(page.items).toHaveLength(PAGE_SIZE);
    expect(page.hasMore).toBe(true);
    expect(page.offset).toBe(0);
  });

  it('reports the last page as the last one', async () => {
    const page = listResponseSchema(coffeeBagSchema).parse(
      (
        await api.get(
          `${API_ROUTES.coffeeBags}?limit=${String(PAGE_SIZE)}&offset=${String(LAST_PAGE_OFFSET)}`,
          RETURNING_IDENTITY,
        )
      ).json(),
    );

    expect(page.items).toHaveLength(LAST_PAGE_SIZE);
    expect(page.hasMore).toBe(false);
  });

  it('refuses a page larger than the contract allows', async () => {
    const response = await api.get(
      `${API_ROUTES.coffeeBags}?limit=${String(OVER_THE_LIMIT)}`,
      RETURNING_IDENTITY,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });
});
