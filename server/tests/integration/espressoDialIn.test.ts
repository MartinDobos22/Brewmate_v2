import {
  API_ROUTES,
  RECIPE_SOURCES,
  TASTE_PROFILE_SOURCES,
  WATER_TYPES,
  espressoDialInResponseSchema,
  listResponseSchema,
  recipeSchema,
  tasteProfileEventSchema,
  type EspressoDialInRequest,
  type EspressoDialInResponse,
  type Recipe,
  type TasteProfileEvent,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { MALFORMED_ANSWER } from '../fixtures/testAiAnswers.js';
import {
  FINER_GRIND_SETTING,
  LOW_ACIDITY,
  SETTLED_DIAL_IN_ANSWER,
  TEST_DIAL_IN_ANSWER,
  TEST_DIAL_IN_REPLY,
  TWO_CHANGE_DIAL_IN_ANSWER,
} from '../fixtures/testConversionAnswers.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const SHOT_DOSE_GRAMS = 18;
const SHOT_YIELD_GRAMS = 36;
const SHOT_SECONDS = 18;
const RECIPE_RATIO = 2;
const START_GRIND_SETTING = 20;
const GROUP_TEMP_C = 93;
const TWO_CALLS = 2;
const ONE_EVENT = 1;
const FIRST = 0;
const NOTHING = 0;
const SHOT_MESSAGE = 'Vytieklo to za 18 sekúnd a chutí to kyslo.';

describe('dialling in an espresso', () => {
  let context: TestContext;
  let api: TestApi;
  let espressoId: string;
  let v60Id: string;
  let recipe: Recipe;

  const createRecipe = async (methodId: string): Promise<Recipe> =>
    recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          methodId,
          source: RECIPE_SOURCES.ai,
          params: {
            doseGrams: SHOT_DOSE_GRAMS,
            waterGrams: SHOT_YIELD_GRAMS,
            ratio: RECIPE_RATIO,
            grindSetting: START_GRIND_SETTING,
            waterTempC: GROUP_TEMP_C,
            waterType: WATER_TYPES.filtered,
            steps: [],
          },
        })
      ).json(),
    );

  const request = (overrides: Partial<EspressoDialInRequest>): EspressoDialInRequest => ({
    recipeId: recipe.id,
    shot: { yieldGrams: SHOT_YIELD_GRAMS, timeSeconds: SHOT_SECONDS },
    message: SHOT_MESSAGE,
    ...overrides,
  });

  const pull = async (body: EspressoDialInRequest): Promise<EspressoDialInResponse> =>
    espressoDialInResponseSchema.parse(
      (await api.post(API_ROUTES.aiEspressoDialIn, RETURNING_IDENTITY, body)).json(),
    );

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methods = await insertTestBrewMethods(context.db);

    espressoId = methods.espresso.id;
    v60Id = methods.v60.id;
    recipe = await createRecipe(espressoId);
  });

  afterAll(async () => {
    await context.close();
  });

  /**
   * A dial-in is a sequence and its whole value is in the sequence, so the
   * shot goes into the record before the model is asked anything. A shot that
   * was pulled but never written down is a hole in the one thing the next
   * answer reasons about.
   */
  it('records the shot as a brew log against the recipe', async () => {
    context.completionClient.answerWith(TEST_DIAL_IN_ANSWER);

    const { shot } = await pull(request({}));

    expect(shot.recipeId).toBe(recipe.id);
    expect(shot.actualParams.waterGrams).toBe(SHOT_YIELD_GRAMS);
    expect(shot.actualParams.totalTimeSeconds).toBe(SHOT_SECONDS);
    expect(shot.actualParams.doseGrams).toBe(SHOT_DOSE_GRAMS);
  });

  it('answers with one change, stored on the message that argued for it', async () => {
    context.completionClient.answerWith(TEST_DIAL_IN_ANSWER);

    const { assistantMessage } = await pull(request({}));

    expect(assistantMessage.content).toBe(TEST_DIAL_IN_REPLY);
    expect(assistantMessage.recipePatch?.params.grindSetting).toBe(FINER_GRIND_SETTING);
    expect(assistantMessage.recipePatch?.params.doseGrams).toBeUndefined();
  });

  /**
   * The rule the whole mode is built on. A shot where two things moved carries
   * no information, so an answer that moves both is a validation failure the
   * single retry is told about - rather than something the service has to
   * refuse afterwards, in a message somebody reads as the app not listening.
   */
  it('refuses an answer that changes the grind and the dose together', async () => {
    context.completionClient.answerWith(TWO_CHANGE_DIAL_IN_ANSWER, TEST_DIAL_IN_ANSWER);

    const { assistantMessage } = await pull(request({}));

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
    expect(assistantMessage.recipePatch?.params.doseGrams).toBeUndefined();
  });

  /** A patch is stored, never applied: the recipe somebody pulled stays as it was. */
  it('leaves the recipe untouched until somebody takes the suggestion', async () => {
    context.completionClient.answerWith(TEST_DIAL_IN_ANSWER);

    await pull(request({}));

    const stored = recipeSchema.parse(
      (await api.get(`${API_ROUTES.recipes}/${recipe.id}`, RETURNING_IDENTITY)).json(),
    );

    expect(stored.params.grindSetting).toBe(START_GRIND_SETTING);
  });

  /** Ending a dial-in is an answer, and it carries no change at all. */
  it('stores no patch when the shot was good enough to stop', async () => {
    context.completionClient.answerWith(SETTLED_DIAL_IN_ANSWER);

    const { assistantMessage } = await pull(request({}));

    expect(assistantMessage.recipePatch).toBeNull();
  });

  /**
   * What a shot teaches the profile is weighed by what the shot was worth,
   * priced from its constraints on the way in - never recomputed here.
   */
  it('teaches the profile from the shot, pointing at the message it came from', async () => {
    context.completionClient.answerWith(TEST_DIAL_IN_ANSWER);

    const { assistantMessage, shot } = await pull(request({}));
    const events = listResponseSchema(tasteProfileEventSchema).parse(
      (await api.get(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY)).json(),
    );
    const event: TasteProfileEvent | undefined = events.items[FIRST];

    expect(events.items).toHaveLength(ONE_EVENT);
    expect(event?.source).toBe(TASTE_PROFILE_SOURCES.brewChat);
    expect(event?.sourceRef).toBe(assistantMessage.id);
    expect(event?.payload.weight).toBe(shot.profileLearningWeight);
    expect(event?.payload.axes.acidity).toBe(LOW_ACIDITY);
  });

  /** Dialling in is a machine exercise; a dripper has no shot to read. */
  it('refuses a recipe that is not brewed on an espresso machine', async () => {
    context.completionClient.answerWith(TEST_DIAL_IN_ANSWER);

    const pourOver = await createRecipe(v60Id);
    const response = await api.post(
      API_ROUTES.aiEspressoDialIn,
      RETURNING_IDENTITY,
      request({ recipeId: pourOver.id }),
    );

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
    expect(context.completionClient.calls).toHaveLength(NOTHING);
  });

  /**
   * The run is what the advice depends on: a grind that has already gone finer
   * twice without moving the time is the case where the answer has to stop
   * grinding, and a model shown only the last shot cannot see it.
   */
  it('sends every shot of the dial-in, oldest first', async () => {
    context.completionClient.answerWith(TEST_DIAL_IN_ANSWER);

    await pull(request({}));
    await pull(request({}));

    const [, secondCall] = context.completionClient.calls;

    expect(secondCall?.prompt).toContain('Shot 1');
    expect(secondCall?.prompt).toContain('Shot 2');
  });

  it('leaves the shot recorded even when the answer never comes', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER);

    const response = await api.post(API_ROUTES.aiEspressoDialIn, RETURNING_IDENTITY, request({}));

    expect(response.statusCode).toBe(HTTP_STATUS.serviceUnavailable);

    const logs = await api.get(`${API_ROUTES.brewLogs}?recipeId=${recipe.id}`, RETURNING_IDENTITY);

    expect(logs.statusCode).toBe(HTTP_STATUS.ok);
  });
});
