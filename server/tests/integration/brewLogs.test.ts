import {
  API_ROUTES,
  brewLogSchema,
  buildApiPath,
  coffeeBagSchema,
  equipmentSetSchema,
  recipeSchema,
  WATER_TYPES,
} from '@brewmate/shared';
import type { BrewLog } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { TEST_BAG_NAME, TEST_BREW_PARAMS, TEST_SET_NAME } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const FULL_WEIGHT = 1;
const BREW_SECONDS = 175;

describe('brew logs', () => {
  let context: TestContext;
  let api: TestApi;
  let methodId: string;
  let bagId: string;
  let recipeId: string;

  const createLog = async (payload: Record<string, unknown>): Promise<BrewLog> =>
    brewLogSchema.parse((await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, payload)).json());

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    methodId = (await insertTestBrewMethods(context.db)).v60.id;
    bagId = coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name: TEST_BAG_NAME })).json(),
    ).id;
    recipeId = recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          bagId,
          methodId,
          params: TEST_BREW_PARAMS,
        })
      ).json(),
    ).id;
  });

  afterAll(async () => {
    await context.close();
  });

  /** Nothing in the way means the cup counts for everything it is worth. */
  it('trusts an unconstrained brew fully', async () => {
    const log = await createLog({ recipeId, durationSeconds: BREW_SECONDS });

    expect(log.profileLearningWeight).toBe(FULL_WEIGHT);
    expect(log.durationSeconds).toBe(BREW_SECONDS);
  });

  /**
   * The reason the column exists: a cup nobody could control says less about
   * what its drinker likes than one they could.
   */
  it('discounts a brew made without temperature control', async () => {
    const log = await createLog({ recipeId, constraints: { noTemperatureControl: true } });

    expect(log.profileLearningWeight).toBeLessThan(FULL_WEIGHT);
  });

  it('discounts a brew with several handicaps further than one', async () => {
    const single = await createLog({ recipeId, constraints: { noTemperatureControl: true } });
    const several = await createLog({
      recipeId,
      constraints: { noTemperatureControl: true, noScale: true, borrowedEquipment: true },
    });

    expect(several.profileLearningWeight).toBeLessThan(single.profileLearningWeight);
  });

  it('never discounts a brew away to nothing', async () => {
    const log = await createLog({
      recipeId,
      constraints: {
        noTemperatureControl: true,
        noScale: true,
        noGrinder: true,
        fixedGrindSetting: true,
        borrowedEquipment: true,
        unknownWater: true,
        limitedTime: true,
      },
    });

    expect(log.profileLearningWeight).toBeGreaterThan(0);
  });

  /** Correcting the record re-prices it; the weight is nothing but a function. */
  it('re-prices the evidence when the constraints are corrected', async () => {
    const log = await createLog({ recipeId, constraints: { noTemperatureControl: true } });

    const corrected = brewLogSchema.parse(
      (
        await api.patch(buildApiPath(API_ROUTES.brewLogById, { id: log.id }), RETURNING_IDENTITY, {
          constraints: {},
        })
      ).json(),
    );

    expect(corrected.profileLearningWeight).toBe(FULL_WEIGHT);
  });

  /** A client that could set its own weight could quietly poison the profile. */
  it('refuses a client-supplied learning weight', async () => {
    const response = await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, {
      recipeId,
      profileLearningWeight: FULL_WEIGHT,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  it('takes the bag from the recipe rather than from the body', async () => {
    const log = await createLog({ recipeId });

    expect(log.bagId).toBe(bagId);
  });

  it('refuses a log claiming a different bag than its recipe', async () => {
    const otherBag = coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name: 'Another' })).json(),
    );

    const response = await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, {
      recipeId,
      bagId: otherBag.id,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
  });

  it('falls back to the water the account normally uses', async () => {
    await api.patch(API_ROUTES.me, RETURNING_IDENTITY, { waterType: WATER_TYPES.remineralized });

    const log = await createLog({ recipeId });

    expect(log.waterType).toBe(WATER_TYPES.remineralized);
  });

  it('records the equipment set the brew was made with', async () => {
    const set = equipmentSetSchema.parse(
      (
        await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
          name: TEST_SET_NAME,
          equipmentIds: [],
        })
      ).json(),
    );

    const log = await createLog({ recipeId, equipmentSetId: set.id });

    expect(log.equipmentSetId).toBe(set.id);
  });

  it('refuses a log against somebody else s recipe', async () => {
    const response = await api.post(API_ROUTES.brewLogs, SECOND_IDENTITY, { recipeId });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  /** A brew log without its recipe is a log of nothing. */
  it('refuses to delete a recipe that has already been brewed', async () => {
    await createLog({ recipeId });

    const response = await api.remove(
      buildApiPath(API_ROUTES.recipeById, { id: recipeId }),
      RETURNING_IDENTITY,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.conflict);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.brewLogs)).statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
