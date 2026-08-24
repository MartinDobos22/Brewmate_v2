import {
  API_ROUTES,
  RECIPE_SOURCES,
  ROAST_LEVELS,
  brewLogSchema,
  coffeeBagSchema,
  recipeSchema,
  type BrewConstraints,
  type BrewLog,
  type CoffeeBag,
  type Recipe,
} from '@brewmate/shared';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import type { TestApi } from '../setup/testApi.js';

import { TEST_BREW_PARAMS } from './testPayloads.js';

export const HISTORY_ORIGIN = 'Ethiopia';
export const HISTORY_PROCESS = 'Washed';
export const HISTORY_ROAST = ROAST_LEVELS.light;
export const HISTORY_NOTES = ['jasmine', 'bergamot'];

/** How many cups it takes before the report is willing to say anything. */
export const ENOUGH_BREWS = 8;

/**
 * A bag somebody has actually been drinking.
 *
 * Written through the API rather than into the tables, because everything the
 * report reads is derived on the way in - the bag on a brew log comes from its
 * recipe, and the learning weight is priced from the declared constraints.
 * Inserting rows directly would test a history that the API could never have
 * produced.
 */
export const createHistoryBag = async (
  api: TestApi,
  identity: VerifiedToken,
  overrides: Partial<CoffeeBag> = {},
): Promise<CoffeeBag> =>
  coffeeBagSchema.parse(
    (
      await api.post(API_ROUTES.coffeeBags, identity, {
        name: 'Kiamugumo AA',
        originCountry: HISTORY_ORIGIN,
        process: HISTORY_PROCESS,
        roastLevel: HISTORY_ROAST,
        tastingNotes: HISTORY_NOTES,
        ...overrides,
      })
    ).json(),
  );

export const createHistoryRecipe = async (
  api: TestApi,
  identity: VerifiedToken,
  methodId: string,
  bagId: string | null,
  parentRecipeId?: string,
): Promise<Recipe> =>
  recipeSchema.parse(
    (
      await api.post(API_ROUTES.recipes, identity, {
        methodId,
        bagId,
        params: TEST_BREW_PARAMS,
        source: RECIPE_SOURCES.manual,
        ...(parentRecipeId === undefined ? {} : { parentRecipeId }),
      })
    ).json(),
  );

export const logBrew = async (
  api: TestApi,
  identity: VerifiedToken,
  recipeId: string,
  constraints: BrewConstraints = {},
): Promise<BrewLog> =>
  brewLogSchema.parse(
    (await api.post(API_ROUTES.brewLogs, identity, { recipeId, constraints })).json(),
  );

/** Brews the same recipe repeatedly, which is what a report has to count. */
export const logBrews = async (
  api: TestApi,
  identity: VerifiedToken,
  recipeId: string,
  count: number,
): Promise<void> => {
  for (let index = 0; index < count; index += 1) {
    await logBrew(api, identity, recipeId);
  }
};
