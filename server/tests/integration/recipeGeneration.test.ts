import {
  API_ROUTES,
  aiUsageLogSchema,
  equipmentSchema,
  generateRecipeResponseSchema,
  grinderSchema,
  listResponseSchema,
  recipeSchema,
  resolveRatio,
  CALIBRATION_ESTIMATED_BY_DEFAULT,
  EQUIPMENT_TYPES,
  GRINDER_TYPICAL_USES,
  GRINDER_UNIT_TYPES,
  RECIPE_SOURCES,
  WATER_TYPES,
  type CreateGrinderRequest,
  type GenerateRecipeRequest,
  type GenerateRecipeResponse,
  type Grinder,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { AI_MODELS } from '../../src/ai/constants/aiModels.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import {
  MALFORMED_ANSWER,
  TEST_ESPRESSO_RECIPE_ANSWER,
  TEST_RECIPE_ANSWER,
  TEST_RECIPE_GRIND_SETTING,
  TEST_RECIPE_RATIONALE,
  TEST_RECIPE_TOTAL_TIME_SECONDS,
  TEST_PRE_INFUSION_SECONDS,
} from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const DOSE_GRAMS = 17;
const WATER_GRAMS = 280;
const CHOSEN_RATIO = 16.5;
const ONE_CALL = 1;
const TWO_CALLS = 2;
const TWO_HINTS = 2;
const TWO_STEPS = 2;
const NOTHING = 0;
const FIRST = 0;

const COLLAR_MIN = 0;
const COLLAR_MAX = 60;
/** Five clicks between detents, so a number the model picks is usually not one of them. */
const COLLAR_STEP = 5;
const COLLAR_FINE_MICRONS = 200;
const COLLAR_COARSE_MICRONS = 1400;
/** 22 rounded onto a collar that only stops every five clicks, counting from zero. */
const SNAPPED_GRIND_SETTING = 20;

const CLICKED_COLLAR: CreateGrinderRequest = {
  brand: 'Testovaci',
  model: 'Po piatich',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: COLLAR_MIN,
  maxSetting: COLLAR_MAX,
  step: COLLAR_STEP,
  micronCalibration: {
    points: [
      { setting: COLLAR_MIN, microns: COLLAR_FINE_MICRONS },
      { setting: COLLAR_MAX, microns: COLLAR_COARSE_MICRONS },
    ],
    isEstimated: CALIBRATION_ESTIMATED_BY_DEFAULT,
  },
  typicalUse: GRINDER_TYPICAL_USES.both,
};

/**
 * A second collar, deliberately stopping at different places from the first.
 *
 * The model answers 22 whichever grinder it is asked about, so the only thing
 * that can say which one the recipe was written for is where that 22 lands: 20
 * on a collar that stops every five clicks, 21 on one that stops every three.
 */
const SECOND_COLLAR_STEP = 3;
const SECOND_COLLAR_SNAPPED = 21;

const SECOND_CLICKED_COLLAR: CreateGrinderRequest = {
  ...CLICKED_COLLAR,
  model: 'Po troch',
  step: SECOND_COLLAR_STEP,
};

const UNOWNED_EQUIPMENT_ID = '33333333-3333-4333-8333-333333333333';
const ONE_GRINDER = 1;

const GRIND_SECTION_HEADING = 'Where to start the grind';
const NOTHING_KNOWN_ABOUT_THE_COFFEE = 'nothing is known about this coffee';
const COLLAR_HEADING = 'on their own collar';

describe('recipe generation', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;
  let espressoId: string;

  const request = (overrides: Partial<GenerateRecipeRequest>): GenerateRecipeRequest => ({
    methodId: v60Id,
    constraints: {},
    waterType: WATER_TYPES.filtered,
    doseGrams: DOSE_GRAMS,
    waterGrams: WATER_GRAMS,
    ratio: CHOSEN_RATIO,
    ...overrides,
  });

  const generate = async (body: GenerateRecipeRequest): Promise<GenerateRecipeResponse> =>
    generateRecipeResponseSchema.parse(
      (await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, body)).json(),
    );

  /** Contributes a collar to the catalogue and owns one, answering with the equipment id. */
  const ownGrinder = async (collar: CreateGrinderRequest): Promise<string> => {
    const grinder: Grinder = grinderSchema.parse(
      (await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, collar)).json(),
    );

    return equipmentSchema.parse(
      (
        await api.post(API_ROUTES.equipment, RETURNING_IDENTITY, {
          type: EQUIPMENT_TYPES.grinder,
          catalogGrinderId: grinder.id,
          brand: collar.brand,
          model: collar.model,
        })
      ).json(),
    ).id;
  };

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methods = await insertTestBrewMethods(context.db);

    v60Id = methods.v60.id;
    espressoId = methods.espresso.id;
  });

  afterAll(async () => {
    await context.close();
  });

  /**
   * A recipe is an argument about somebody's coffee, so it goes to the larger
   * model. The routing table is total over the function names, which is what
   * keeps a new feature from quietly defaulting to the expensive one - or, as
   * here, to the cheap one.
   */
  it('asks the larger model for a recipe', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    await generate(request({}));

    expect(context.completionClient.calls[FIRST]?.model).toBe(AI_MODELS.sonnet);
  });

  it('stores the recipe the model wrote, unsaved and unpinned', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(request({}));

    expect(recipe.source).toBe(RECIPE_SOURCES.ai);
    expect(recipe.rationale).toBe(TEST_RECIPE_RATIONALE);
    expect(recipe.params.grindSetting).toBe(TEST_RECIPE_GRIND_SETTING);
    expect(recipe.params.totalTimeSeconds).toBe(TEST_RECIPE_TOTAL_TIME_SECONDS);
    expect(recipe.params.steps).toHaveLength(TWO_STEPS);
    expect(recipe.isSaved).toBe(false);
    expect(recipe.isPinned).toBe(false);
  });

  /**
   * The numbers were chosen by a person on the screen before this one. The
   * answer schema has no field for them at all, so this is really a test that
   * the schema stayed that way.
   */
  it('keeps the dose and the water exactly as they were chosen', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(request({}));

    expect(recipe.params.doseGrams).toBe(DOSE_GRAMS);
    expect(recipe.params.waterGrams).toBe(WATER_GRAMS);
  });

  /**
   * The ratio is arithmetic over the two weights rather than a third number
   * carried along beside them, so a request whose ratio does not divide is
   * corrected rather than printed next to grams that contradict it.
   */
  it('recomputes the ratio from the grams rather than trusting the one sent', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(request({}));

    expect(recipe.params.ratio).toBe(resolveRatio(DOSE_GRAMS, WATER_GRAMS));
    expect(recipe.params.ratio).not.toBe(CHOSEN_RATIO);
  });

  /**
   * A constraint is not a footnote - the model is told about it by machine
   * name, and the hint it writes back is stored with the recipe so it survives
   * to the morning somebody reopens it.
   */
  it('tells the model what is missing and keeps the hints on the recipe', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(
      request({ constraints: { noTemperatureControl: true, noScale: true } }),
    );
    const [call] = context.completionClient.calls;

    expect(call?.prompt).toContain('noTemperatureControl');
    expect(call?.prompt).toContain('noScale');
    const [hint] = recipe.params.constraintHints ?? [];

    expect(recipe.params.constraintHints).toHaveLength(TWO_HINTS);
    expect(hint?.constraint).toBe('noTemperatureControl');
  });

  /**
   * The taste profile is about which coffee to buy, not how to brew one, so a
   * recipe is written without it - a questionnaire answer about chocolate has
   * no business deciding a grind.
   */
  it('writes a recipe without the taste profile', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    await generate(request({}));

    expect(context.completionClient.calls[FIRST]?.prompt).not.toContain('confidence band');
  });

  /**
   * An espresso answered as a pour-over is a recipe with a bloom in it for
   * somebody standing at a machine that has no bloom to give.
   */
  it('refuses a pour-over answer for an espresso method', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const response = await api.post(
      API_ROUTES.aiGenerateRecipe,
      RETURNING_IDENTITY,
      request({ methodId: espressoId }),
    );

    expect(response.statusCode).toBe(HTTP_STATUS.serviceUnavailable);
    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);

    const stored = listResponseSchema(recipeSchema).parse(
      (await api.get(API_ROUTES.recipes, RETURNING_IDENTITY)).json(),
    );

    expect(stored.items).toHaveLength(NOTHING);
  });

  it('stores the espresso shape for an espresso method', async () => {
    context.completionClient.answerWith(TEST_ESPRESSO_RECIPE_ANSWER);

    const { recipe } = await generate(request({ methodId: espressoId }));

    expect(recipe.params.espresso?.preInfusionSeconds).toBe(TEST_PRE_INFUSION_SECONDS);
    expect(recipe.params.steps).toHaveLength(NOTHING);
  });

  /**
   * The grind used to be the one number in a recipe with nothing behind it:
   * the model was told the collar runs 0 to 60 and had to invent a place on
   * it, which is how the same coffee in the same brewer came back at 18 one
   * morning and 26 the next. It is now worked out from the method window, the
   * bag and the grinder curve before the model is asked anything.
   */
  it('works the grind starting point out before asking the model for anything', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    await generate(request({}));

    expect(context.completionClient.calls[FIRST]?.prompt).toContain(GRIND_SECTION_HEADING);
  });

  /**
   * A quick brew has no bag behind it, and the starting point has to say so
   * rather than reading as if a roast date had been found somewhere.
   */
  it('says the starting point is the method middle when nothing is known about the coffee', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    await generate(request({}));

    expect(context.completionClient.calls[FIRST]?.prompt).toContain(NOTHING_KNOWN_ABOUT_THE_COFFEE);
  });

  /**
   * The number is only worth having on somebody's own collar, so a catalogued
   * grinder turns the micron figure into one - and the stored recipe carries a
   * setting that collar can actually be left at. A clicked grinder has detents;
   * 22 on a collar that stops every five clicks is a number that makes somebody
   * guess which of two neighbours was meant.
   */
  it('reads the starting point onto their own collar and stores a setting they can dial', async () => {
    await ownGrinder(CLICKED_COLLAR);

    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(request({}));

    expect(context.completionClient.calls[FIRST]?.prompt).toContain(COLLAR_HEADING);
    expect(recipe.params.grindSetting).toBe(SNAPPED_GRIND_SETTING);
  });

  /**
   * Which of their grinders is turning this morning is an answer, not an
   * accident.
   *
   * Both of these are catalogued, so the rule that settles it when nobody says
   * would pick the first one - and it is the second one being named that has
   * to win, because the app has already drawn a band and a click size off that
   * collar and the recipe coming back for the other one would be the two
   * screens disagreeing about the same brew.
   */
  it('writes the recipe for the grinder that was named rather than the default one', async () => {
    await ownGrinder(CLICKED_COLLAR);
    const second = await ownGrinder(SECOND_CLICKED_COLLAR);

    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(request({ grinderEquipmentId: second }));

    expect(recipe.params.grindSetting).toBe(SECOND_COLLAR_SNAPPED);
  });

  /**
   * A kitchen may hold two grinders; a brew is ground on one of them. Storing
   * both would leave the conversation afterwards free to reason about the
   * machine this cup was not made on.
   */
  it('stores only the grinder the brew was ground on', async () => {
    const first = await ownGrinder(CLICKED_COLLAR);
    const second = await ownGrinder(SECOND_CLICKED_COLLAR);

    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const { recipe } = await generate(request({ grinderEquipmentId: second }));

    expect(recipe.equipmentIds).toHaveLength(ONE_GRINDER);
    expect(recipe.equipmentIds).toContain(second);
    expect(recipe.equipmentIds).not.toContain(first);
  });

  /**
   * Falling back to another grinder would be the quieter failure and much the
   * worse one: the screen has already printed a band off the collar they chose,
   * and a recipe written for a different collar is a number they would dial.
   */
  it('refuses a grinder that does not belong to the caller', async () => {
    await ownGrinder(CLICKED_COLLAR);

    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    const response = await api.post(
      API_ROUTES.aiGenerateRecipe,
      RETURNING_IDENTITY,
      request({ grinderEquipmentId: UNOWNED_EQUIPMENT_ID }),
    );

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
    expect(context.completionClient.calls).toHaveLength(NOTHING);
  });

  /** A retry is spent money, and a usage log that hides it disagrees with the invoice. */
  it('retries a malformed answer exactly once and bills both attempts', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER, TEST_RECIPE_ANSWER);

    await generate(request({}));

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);

    const usage = listResponseSchema(aiUsageLogSchema).parse(
      (await api.get(API_ROUTES.aiUsage, RETURNING_IDENTITY)).json(),
    );

    expect(usage.items[FIRST]?.tokensIn).toBeGreaterThan(NOTHING);
    expect(Number(usage.items[FIRST]?.costEstimate)).toBeGreaterThan(NOTHING);
  });

  /*
   * The ceiling does not move between attempts, so a second call meets it
   * again - and the correction only makes the prompt longer. Retrying spends a
   * second call to be told the same thing, and arrives at "the answer is not
   * the agreed shape", which is the sentence that sends everybody to read the
   * prompt rather than the ceiling.
   */
  it('does not retry an answer that ran out of room, and bills the one call', async () => {
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);
    context.completionClient.truncateAnswers();

    const response = await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, request({}));

    expect(response.statusCode).toBe(HTTP_STATUS.serviceUnavailable);
    expect(context.completionClient.calls).toHaveLength(ONE_CALL);

    const usage = listResponseSchema(aiUsageLogSchema).parse(
      (await api.get(API_ROUTES.aiUsage, RETURNING_IDENTITY)).json(),
    );

    expect(usage.items).toHaveLength(ONE_CALL);
    expect(Number(usage.items[FIRST]?.costEstimate)).toBeGreaterThan(NOTHING);
  });
});
