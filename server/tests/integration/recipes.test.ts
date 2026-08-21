import {
  API_ROUTES,
  buildApiPath,
  coffeeBagSchema,
  listResponseSchema,
  recipeSchema,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { OTHER_BAG_NAME, TEST_BAG_NAME, TEST_BREW_PARAMS } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const SINGLE_ITEM = 1;
const TWO_ITEMS = 2;

describe('recipes', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;
  let aeropressId: string;
  let retiredId: string;
  let bagId: string;
  let otherBagId: string;

  const createRecipe = async (payload: Record<string, unknown>): Promise<string> =>
    recipeSchema.parse((await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, payload)).json()).id;

  const readRecipe = async (id: string): Promise<{ isPinned: boolean }> =>
    recipeSchema.parse(
      (await api.get(buildApiPath(API_ROUTES.recipeById, { id }), RETURNING_IDENTITY)).json(),
    );

  const createBag = async (name: string): Promise<string> =>
    coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name })).json(),
    ).id;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methods = await insertTestBrewMethods(context.db);

    v60Id = methods.v60.id;
    aeropressId = methods.aeropress.id;
    retiredId = methods.retired.id;
    bagId = await createBag(TEST_BAG_NAME);
    otherBagId = await createBag(OTHER_BAG_NAME);
  });

  afterAll(async () => {
    await context.close();
  });

  it('creates a recipe for a bag and a method', async () => {
    const response = await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.created);

    const recipe = recipeSchema.parse(response.json());

    expect(recipe.params.doseGrams).toBe(TEST_BREW_PARAMS.doseGrams);
    expect(recipe.isPinned).toBe(false);
  });

  it('creates a quick recipe with no bag at all', async () => {
    const response = await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
    });

    expect(recipeSchema.parse(response.json()).bagId).toBeNull();
  });

  it('refuses a recipe for a bag belonging to somebody else', async () => {
    const foreignBag = coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, SECOND_IDENTITY, { name: OTHER_BAG_NAME })).json(),
    );

    const response = await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
      bagId: foreignBag.id,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('refuses a recipe for a retired method', async () => {
    const response = await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
      methodId: retiredId,
      params: TEST_BREW_PARAMS,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  /** The pin belongs to the pair, so pinning a second one releases the first. */
  it('keeps one pinned recipe per bag and method', async () => {
    const first = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    const second = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    expect((await readRecipe(first)).isPinned).toBe(false);
    expect((await readRecipe(second)).isPinned).toBe(true);
  });

  /** Same coffee, different brewer: both stay pinned. */
  it('pins the same bag separately for each method', async () => {
    const inV60 = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    const inAeropress = await createRecipe({
      bagId,
      methodId: aeropressId,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    expect((await readRecipe(inV60)).isPinned).toBe(true);
    expect((await readRecipe(inAeropress)).isPinned).toBe(true);
  });

  it('pins each bag separately for the same method', async () => {
    const forBag = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    const forOtherBag = await createRecipe({
      bagId: otherBagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    expect((await readRecipe(forBag)).isPinned).toBe(true);
    expect((await readRecipe(forOtherBag)).isPinned).toBe(true);
  });

  /**
   * The one SQL treats differently: two NULL bags are not "equal", so without
   * a rule of its own this pair would allow any number of pinned recipes.
   */
  it('keeps one pinned bagless recipe per method', async () => {
    const first = await createRecipe({
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    const second = await createRecipe({
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    expect((await readRecipe(first)).isPinned).toBe(false);
    expect((await readRecipe(second)).isPinned).toBe(true);
  });

  it('does not let a bagless pin release a pin that belongs to a bag', async () => {
    const forBag = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    await createRecipe({ methodId: v60Id, params: TEST_BREW_PARAMS, isPinned: true });

    expect((await readRecipe(forBag)).isPinned).toBe(true);
  });

  it('pins through a patch as well as at creation', async () => {
    const first = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
      isPinned: true,
    });

    const second = await createRecipe({ bagId, methodId: v60Id, params: TEST_BREW_PARAMS });

    await api.patch(buildApiPath(API_ROUTES.recipeById, { id: second }), RETURNING_IDENTITY, {
      isPinned: true,
    });

    expect((await readRecipe(first)).isPinned).toBe(false);
    expect((await readRecipe(second)).isPinned).toBe(true);
  });

  it('filters the list down to one bag', async () => {
    await createRecipe({ bagId, methodId: v60Id, params: TEST_BREW_PARAMS });
    await createRecipe({ bagId: otherBagId, methodId: v60Id, params: TEST_BREW_PARAMS });

    const all = listResponseSchema(recipeSchema).parse(
      (await api.get(API_ROUTES.recipes, RETURNING_IDENTITY)).json(),
    );

    expect(all.items).toHaveLength(TWO_ITEMS);

    const forBag = listResponseSchema(recipeSchema).parse(
      (await api.get(`${API_ROUTES.recipes}?bagId=${bagId}`, RETURNING_IDENTITY)).json(),
    );

    expect(forBag.items).toHaveLength(SINGLE_ITEM);
    expect(forBag.items[0]?.bagId).toBe(bagId);
  });

  it('records where an adjusted recipe came from', async () => {
    const parentRecipeId = await createRecipe({
      bagId,
      methodId: v60Id,
      params: TEST_BREW_PARAMS,
    });

    const child = recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          bagId,
          methodId: v60Id,
          params: TEST_BREW_PARAMS,
          parentRecipeId,
          source: 'adjusted',
        })
      ).json(),
    );

    expect(child.parentRecipeId).toBe(parentRecipeId);
  });

  it('hides another account s recipe behind the same 404 as a missing one', async () => {
    const id = await createRecipe({ bagId, methodId: v60Id, params: TEST_BREW_PARAMS });

    const response = await api.get(buildApiPath(API_ROUTES.recipeById, { id }), SECOND_IDENTITY);

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('deletes a recipe nothing has been brewed from', async () => {
    const id = await createRecipe({ bagId, methodId: v60Id, params: TEST_BREW_PARAMS });

    expect(
      (await api.remove(buildApiPath(API_ROUTES.recipeById, { id }), RETURNING_IDENTITY)).statusCode,
    ).toBe(HTTP_STATUS.ok);
  });
});
