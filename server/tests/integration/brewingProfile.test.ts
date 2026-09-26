import {
  API_ROUTES,
  brewLogSchema,
  brewingProfileSchema,
  coffeeBagSchema,
  equipmentSchema,
  grinderSchema,
  recipeSchema,
  BREW_METHOD_CATEGORIES,
  EQUIPMENT_TYPES,
  GRINDER_TYPICAL_USES,
  GRINDER_UNIT_TYPES,
  HABIT_SHIFT_LIMIT,
  WATER_TYPES,
  type BrewConstraints,
  type BrewingProfile,
  type CreateGrinderRequest,
  type GenerateRecipeRequest,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { TEST_CHAT_ANSWER, TEST_RECIPE_ANSWER } from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { TEST_BREW_PARAMS } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const THREE_CUPS = 3;
const TWO_CUPS = 2;
const FOUR_CUPS = 4;
const TWO_COFFEES = 2;
const FIRST = 0;
const USUAL_DOSE = 18;
/** The fixture's 1:16.6, in the half parts the form moves in. */
const USUAL_RATIO = 16.5;
const USUAL_TEMPERATURE = 94;
/** Two degrees hotter than the cups were, because every one of them was called sour. */
const WANTED_TEMPERATURE = 96;

const COLLAR_MIN = 0;
const COLLAR_MAX = 60;
const COLLAR_STEP = 1;
const COLLAR_FINE_MICRONS = 200;
const COLLAR_COARSE_MICRONS = 1400;
/**
 * Twenty microns a click, so this is 580 µm - well below the middle of the
 * pour-over window, and further than the habit allowance lets a start move.
 */
const FINE_HABIT_SETTING = 19;

const FINE_COLLAR: CreateGrinderRequest = {
  brand: 'Testovaci',
  model: 'Navyk',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: COLLAR_MIN,
  maxSetting: COLLAR_MAX,
  step: COLLAR_STEP,
  micronCalibration: {
    points: [
      { setting: COLLAR_MIN, microns: COLLAR_FINE_MICRONS },
      { setting: COLLAR_MAX, microns: COLLAR_COARSE_MICRONS },
    ],
    isEstimated: false,
  },
  typicalUse: GRINDER_TYPICAL_USES.both,
};

const TEMPERATURE_HABIT_LINE = 'Water temperature they settle at';
const GRIND_HABIT_REASON = 'where this person has ended up on their own cups';

describe('the brewing profile', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;

  const readProfile = async (identity = RETURNING_IDENTITY): Promise<BrewingProfile> =>
    brewingProfileSchema.parse((await api.get(API_ROUTES.brewingProfile, identity)).json());

  const createBag = async (name: string): Promise<string> =>
    coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name })).json(),
    ).id;

  const createRecipe = async (body: Record<string, unknown>): Promise<string> =>
    recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          methodId: v60Id,
          params: TEST_BREW_PARAMS,
          ...body,
        })
      ).json(),
    ).id;

  const brew = async (
    recipeId: string,
    cups: number,
    constraints: BrewConstraints = {},
  ): Promise<void> => {
    for (let cup = FIRST; cup < cups; cup += 1) {
      await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, { recipeId, constraints });
    }
  };

  const brewOne = async (recipeId: string): Promise<string> =>
    brewLogSchema.parse(
      (await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, { recipeId })).json(),
    ).id;

  const ownFineCollar = async (): Promise<string> => {
    const grinder = grinderSchema.parse(
      (await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, FINE_COLLAR)).json(),
    );

    return equipmentSchema.parse(
      (
        await api.post(API_ROUTES.equipment, RETURNING_IDENTITY, {
          type: EQUIPMENT_TYPES.grinder,
          catalogGrinderId: grinder.id,
          brand: FINE_COLLAR.brand,
          model: FINE_COLLAR.model,
        })
      ).json(),
    ).id;
  };

  const recipeRequest = (): GenerateRecipeRequest => ({
    methodId: v60Id,
    constraints: {},
    waterType: WATER_TYPES.filtered,
    doseGrams: USUAL_DOSE,
    waterGrams: TEST_BREW_PARAMS.waterGrams,
    ratio: TEST_BREW_PARAMS.ratio,
  });

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
    v60Id = (await insertTestBrewMethods(context.db)).v60.id;
  });

  afterAll(async () => {
    await context.close();
  });

  it('is empty before anything has been brewed', async () => {
    expect(await readProfile()).toEqual({ methods: [], grind: [] });
  });

  it('counts two cups without claiming a habit from them', async () => {
    await brew(await createRecipe({}), TWO_CUPS);

    expect((await readProfile()).methods).toEqual([
      { methodId: v60Id, cupCount: TWO_CUPS, doseGrams: null, ratio: null, waterTempC: null },
    ]);
  });

  it('reads the dose, the ratio and the temperature off the third cup', async () => {
    await brew(await createRecipe({}), THREE_CUPS);

    expect((await readProfile()).methods).toEqual([
      {
        methodId: v60Id,
        cupCount: THREE_CUPS,
        doseGrams: USUAL_DOSE,
        ratio: USUAL_RATIO,
        waterTempC: USUAL_TEMPERATURE,
      },
    ]);
  });

  it('learns no temperature from cups brewed without a thermometer, and keeps their dose', async () => {
    await brew(await createRecipe({}), THREE_CUPS, { noTemperatureControl: true });

    const [habit] = (await readProfile()).methods;

    expect(habit?.doseGrams).toBe(USUAL_DOSE);
    expect(habit?.waterTempC).toBeNull();
  });

  it('never reads another account’s cups', async () => {
    await brew(await createRecipe({}), THREE_CUPS);

    expect(await readProfile(SECOND_IDENTITY)).toEqual({ methods: [], grind: [] });
  });

  it('measures where the grind ended up against the bag, once two coffees agree', async () => {
    const grinderId = await ownFineCollar();
    const params = { ...TEST_BREW_PARAMS, grindSetting: FINE_HABIT_SETTING };

    for (const name of ['Prvá', 'Druhá']) {
      await brew(
        await createRecipe({ bagId: await createBag(name), equipmentIds: [grinderId], params }),
        TWO_CUPS,
      );
    }

    expect((await readProfile()).grind).toEqual([
      {
        grinderEquipmentId: grinderId,
        methodCategory: BREW_METHOD_CATEGORIES.pourOver,
        cupCount: FOUR_CUPS,
        coffeeCount: TWO_COFFEES,
        shift: -HABIT_SHIFT_LIMIT,
      },
    ]);
  });

  it('hands the temperature and the grind habit to the recipe engine', async () => {
    const grinderId = await ownFineCollar();
    const params = { ...TEST_BREW_PARAMS, grindSetting: FINE_HABIT_SETTING };

    for (const name of ['Prvá', 'Druhá']) {
      await brew(
        await createRecipe({ bagId: await createBag(name), equipmentIds: [grinderId], params }),
        TWO_CUPS,
      );
    }

    context.completionClient.answerWith(TEST_RECIPE_ANSWER);
    await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, recipeRequest());

    const prompt = context.completionClient.calls[FIRST]?.prompt ?? '';

    expect(prompt).toContain(TEMPERATURE_HABIT_LINE);
    expect(prompt).toContain(GRIND_HABIT_REASON);
  });

  it('learns from a cup called sour that the water should have been hotter', async () => {
    const recipeId = await createRecipe({});

    for (let cup = FIRST; cup < THREE_CUPS; cup += 1) {
      const brewLogId = await brewOne(recipeId);

      context.completionClient.answerWith(TEST_CHAT_ANSWER);
      await api.post(API_ROUTES.aiRecipeChat, RETURNING_IDENTITY, {
        recipeId,
        message: 'Bola kyslá.',
        brewLogId,
      });
    }

    expect((await readProfile()).methods[FIRST]?.waterTempC).toBe(WANTED_TEMPERATURE);
  });
});
