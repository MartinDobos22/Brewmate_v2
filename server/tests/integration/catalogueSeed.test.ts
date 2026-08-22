import {
  API_ROUTES,
  BREW_METHOD_CATEGORIES,
  brewMethodSchema,
  grinderSchema,
  listResponseSchema,
  LIST_LIMIT_MAX,
  type Grinder,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { runSeed } from '../../src/db/seed/runSeed.js';
import { BREW_METHOD_SEEDS } from '../../src/db/seed/seedData/brewMethodSeeds.js';
import { GRINDER_SEEDS } from '../../src/db/seed/seedData/grinderSeeds.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NONE = 0;
const WHOLE_CATALOGUE = `?limit=${String(LIST_LIMIT_MAX)}`;

describe('the shipped catalogues', () => {
  let context: TestContext;
  let api: TestApi;

  const listGrinders = async (query: string): Promise<readonly Grinder[]> =>
    listResponseSchema(grinderSchema).parse(
      (await api.get(`${API_ROUTES.grinders}${query}`, RETURNING_IDENTITY)).json(),
    ).items;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
    await runSeed(context.db);
  });

  afterAll(async () => {
    await context.close();
  });

  it('serves every shipped brewing method through the API', async () => {
    const methods = listResponseSchema(brewMethodSchema).parse(
      (await api.get(`${API_ROUTES.brewMethods}${WHOLE_CATALOGUE}`, RETURNING_IDENTITY)).json(),
    );

    expect(methods.items).toHaveLength(BREW_METHOD_SEEDS.length);
    expect(methods.items.map((method): string => method.key)).toEqual(
      expect.arrayContaining(BREW_METHOD_SEEDS.map((seed): string => seed.key)),
    );
  });

  /** Batch brewing is its own family, not a pour over somebody walked away from. */
  it('carries the batch brewer in a category of its own', async () => {
    const methods = listResponseSchema(brewMethodSchema).parse(
      (
        await api.get(
          `${API_ROUTES.brewMethods}?category=${BREW_METHOD_CATEGORIES.batch}`,
          RETURNING_IDENTITY,
        )
      ).json(),
    );

    expect(methods.items).not.toHaveLength(NONE);
  });

  /** The seed runs on every deploy, so running it twice has to change nothing. */
  it('is idempotent', async () => {
    await runSeed(context.db);

    const methods = listResponseSchema(brewMethodSchema).parse(
      (await api.get(`${API_ROUTES.brewMethods}${WHOLE_CATALOGUE}`, RETURNING_IDENTITY)).json(),
    );

    expect(methods.items).toHaveLength(BREW_METHOD_SEEDS.length);
    expect(await listGrinders(WHOLE_CATALOGUE)).toHaveLength(GRINDER_SEEDS.length);
  });

  /** The catalogue belongs to nobody, so it is there before anyone contributes. */
  it('offers the grinders to an account that has contributed nothing', async () => {
    const theirs = listResponseSchema(grinderSchema).parse(
      (await api.get(`${API_ROUTES.grinders}${WHOLE_CATALOGUE}`, SECOND_IDENTITY)).json(),
    );

    expect(theirs.items).toHaveLength(GRINDER_SEEDS.length);
  });

  /**
   * Published micron figures are approximate and burr alignment moves them, so
   * no shipped curve may claim to have been measured.
   */
  it('presents every shipped micron curve as an estimate', async () => {
    const calibrated = (await listGrinders(WHOLE_CATALOGUE)).filter(
      (grinder): boolean => grinder.micronCalibration !== null,
    );

    expect(calibrated).not.toHaveLength(NONE);
    expect(
      calibrated.every((grinder): boolean => grinder.micronCalibration?.isEstimated === true),
    ).toBe(true);
  });

  /** Where no figure is published, none is invented: the app says so instead. */
  it('leaves the grinders nobody publishes a figure for without a curve', async () => {
    const uncalibrated = (await listGrinders(WHOLE_CATALOGUE)).filter(
      (grinder): boolean => grinder.micronCalibration === null,
    );

    expect(uncalibrated).not.toHaveLength(NONE);
  });
});
