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
const FIRST_PAGE = 0;
const WHOLE_CATALOGUE = `?limit=${String(LIST_LIMIT_MAX)}`;

describe('the shipped catalogues', () => {
  let context: TestContext;
  let api: TestApi;

  /**
   * The whole catalogue, a page at a time.
   *
   * It outgrew a single page some time ago, and a test that asked for
   * `limit=LIST_LIMIT_MAX` and counted what came back was really asserting that
   * the catalogue is smaller than one page - which stopped being true the day
   * the long tail was seeded, and would have failed as if the seed were broken.
   */
  const readWholeCatalogue = async (identity = RETURNING_IDENTITY): Promise<readonly Grinder[]> => {
    const all: Grinder[] = [];

    for (let offset = FIRST_PAGE; ; offset += LIST_LIMIT_MAX) {
      const page = listResponseSchema(grinderSchema).parse(
        (
          await api.get(
            `${API_ROUTES.grinders}?limit=${String(LIST_LIMIT_MAX)}&offset=${String(offset)}`,
            identity,
          )
        ).json(),
      ).items;

      all.push(...page);

      if (page.length < LIST_LIMIT_MAX) {
        return all;
      }
    }
  };

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
    expect(await readWholeCatalogue()).toHaveLength(GRINDER_SEEDS.length);
  });

  /** The catalogue belongs to nobody, so it is there before anyone contributes. */
  it('offers the grinders to an account that has contributed nothing', async () => {
    expect(await readWholeCatalogue(SECOND_IDENTITY)).toHaveLength(GRINDER_SEEDS.length);
  });

  /**
   * Published micron figures are approximate and burr alignment moves them, so
   * no shipped curve may claim to have been measured.
   */
  it('presents every shipped micron curve as an estimate', async () => {
    const calibrated = (await readWholeCatalogue()).filter(
      (grinder): boolean => grinder.micronCalibration !== null,
    );

    expect(calibrated).not.toHaveLength(NONE);
    expect(
      calibrated.every((grinder): boolean => grinder.micronCalibration?.isEstimated === true),
    ).toBe(true);
  });

  /**
   * The most direct evidence the catalogue holds: where each family of brewer
   * sits on one exact collar, as somebody published it. The grind guidance
   * reads this before it reads anything else, because reconstructing the same
   * band by converting a generic micron window through a grinder curve landed
   * reliably coarse on every grinder it was measured against.
   */
  it('carries the published per-method ranges for the grinders that have them', async () => {
    const withRanges = (await readWholeCatalogue()).filter(
      (grinder): boolean => grinder.settingRanges !== null,
    );

    expect(withRanges).not.toHaveLength(NONE);
    expect(
      withRanges.every((grinder): boolean =>
        Object.values(grinder.settingRanges ?? {}).every((range): boolean => range.max > range.min),
      ),
    ).toBe(true);
  });

  /** Where no figure is published, none is invented: the app says so instead. */
  it('leaves the grinders nobody publishes a figure for without a curve', async () => {
    const uncalibrated = (await readWholeCatalogue()).filter(
      (grinder): boolean => grinder.micronCalibration === null,
    );

    expect(uncalibrated).not.toHaveLength(NONE);
  });
});
