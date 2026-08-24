import {
  API_ROUTES,
  brewLogSchema,
  buildApiPath,
  listResponseSchema,
  recipeChatMessageSchema,
  recipeChatResponseSchema,
  recipeSchema,
  resolveRatio,
  tasteProfileEventSchema,
  CHAT_ROLES,
  type BrewLog,
  type RecipeChatResponse,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { calculateLearningWeight } from '../../src/modules/brewLogs/calculateLearningWeight.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import {
  IMPOSSIBLE_CHAT_ANSWER,
  MALFORMED_ANSWER,
  TEST_CHAT_ANSWER,
  TEST_CHAT_GRIND_SETTING,
  TEST_CHAT_REPLY,
  WATER_CHAT_ANSWER,
} from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { TEST_BREW_PARAMS } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NO_THERMOMETER = { noTemperatureControl: true } as const;
const TWO_CALLS = 2;
const TWO_MESSAGES = 2;
const SINGLE_ITEM = 1;
const NOTHING = 0;
const FIRST = 0;
const COMPLAINT = 'Bola dosť kyslá a akási prázdna.';

describe('recipe coaching', () => {
  let context: TestContext;
  let api: TestApi;
  let recipeId: string;
  let otherMethodId: string;

  const createBrewLog = async (constraints: Record<string, boolean>): Promise<BrewLog> =>
    brewLogSchema.parse(
      (await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, { recipeId, constraints })).json(),
    );

  const ask = async (body: Record<string, unknown>): Promise<RecipeChatResponse> =>
    recipeChatResponseSchema.parse(
      (await api.post(API_ROUTES.aiRecipeChat, RETURNING_IDENTITY, body)).json(),
    );

  const readMessages = async (): Promise<readonly unknown[]> =>
    listResponseSchema(recipeChatMessageSchema).parse(
      (
        await api.get(buildApiPath(API_ROUTES.recipeMessages, { id: recipeId }), RETURNING_IDENTITY)
      ).json(),
    ).items;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methods = await insertTestBrewMethods(context.db);

    otherMethodId = methods.aeropress.id;
    recipeId = recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          methodId: methods.v60.id,
          params: TEST_BREW_PARAMS,
        })
      ).json(),
    ).id;
  });

  afterAll(async () => {
    await context.close();
  });

  it('stores both halves of the exchange and the change it proposes', async () => {
    context.completionClient.answerWith(TEST_CHAT_ANSWER);

    const { userMessage, assistantMessage } = await ask({ recipeId, message: COMPLAINT });

    expect(userMessage.role).toBe(CHAT_ROLES.user);
    expect(userMessage.content).toBe(COMPLAINT);
    expect(assistantMessage.content).toBe(TEST_CHAT_REPLY);
    expect(assistantMessage.recipePatch?.params.grindSetting).toBe(TEST_CHAT_GRIND_SETTING);
    expect(await readMessages()).toHaveLength(TWO_MESSAGES);
  });

  /**
   * The patch is stored, never applied. A suggestion nobody took is still part
   * of the record, and the recipe somebody brewed stays the recipe they brewed.
   */
  it('leaves the recipe alone until somebody applies the patch', async () => {
    context.completionClient.answerWith(TEST_CHAT_ANSWER);

    await ask({ recipeId, message: COMPLAINT });

    const recipe = recipeSchema.parse(
      (
        await api.get(buildApiPath(API_ROUTES.recipeById, { id: recipeId }), RETURNING_IDENTITY)
      ).json(),
    );

    expect(recipe.params.grindSetting).toBe(TEST_BREW_PARAMS.grindSetting);
  });

  /**
   * The rule that makes this feature worth having: a suggestion somebody
   * cannot carry out tells them the app was not listening. It is enforced by
   * the shape of the schema the answer is validated against, so an impossible
   * patch becomes a retry rather than a message.
   */
  it('refuses a change the constraints make impossible, and takes the corrected one', async () => {
    const log = await createBrewLog(NO_THERMOMETER);

    context.completionClient.answerWith(IMPOSSIBLE_CHAT_ANSWER, TEST_CHAT_ANSWER);

    const { assistantMessage } = await ask({ recipeId, message: COMPLAINT, brewLogId: log.id });

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
    expect(assistantMessage.recipePatch?.params.waterTempC).toBeUndefined();
    expect(assistantMessage.recipePatch?.params.grindSetting).toBe(TEST_CHAT_GRIND_SETTING);
  });

  /** What the brew was worth is what the remark about it is worth. */
  it('weighs the taste event by the learning weight of the brew it is about', async () => {
    const log = await createBrewLog(NO_THERMOMETER);

    context.completionClient.answerWith(TEST_CHAT_ANSWER);

    const { assistantMessage } = await ask({ recipeId, message: COMPLAINT, brewLogId: log.id });
    const events = listResponseSchema(tasteProfileEventSchema).parse(
      (await api.get(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY)).json(),
    );

    expect(events.items).toHaveLength(SINGLE_ITEM);
    expect(events.items[FIRST]?.payload.weight).toBe(calculateLearningWeight(NO_THERMOMETER));
    expect(events.items[FIRST]?.payload.weight).toBeLessThan(SINGLE_ITEM);
    /** The event points at the sentence it was drawn from, so it counts once. */
    expect(events.items[FIRST]?.sourceRef).toBe(assistantMessage.id);
  });

  /**
   * Grams are the physical fact; a ratio is arithmetic over them. A patch that
   * moved the water and left a stale ratio behind would show a diff whose two
   * rows contradict each other.
   */
  it('moves the ratio with the water it changed', async () => {
    context.completionClient.answerWith(WATER_CHAT_ANSWER);

    const { assistantMessage } = await ask({ recipeId, message: COMPLAINT });
    const patched = assistantMessage.recipePatch?.params;

    expect(patched?.waterGrams).toBeGreaterThan(TEST_BREW_PARAMS.waterGrams);
    expect(patched?.ratio).toBe(
      resolveRatio(TEST_BREW_PARAMS.doseGrams, patched?.waterGrams ?? NOTHING),
    );
  });

  /**
   * The question is written down before the answer is asked for, so a model
   * that will not answer leaves the conversation holding what the person said
   * rather than swallowing it.
   */
  it('keeps the question when the answer cannot be written', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER);

    const response = await api.post(API_ROUTES.aiRecipeChat, RETURNING_IDENTITY, {
      recipeId,
      message: COMPLAINT,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.serviceUnavailable);

    const messages = await readMessages();

    expect(messages).toHaveLength(SINGLE_ITEM);
  });

  /** A brew log from a different recipe is a cup this conversation is not about. */
  it('refuses a brew log that belongs to another recipe', async () => {
    const otherId = recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          methodId: otherMethodId,
          params: TEST_BREW_PARAMS,
        })
      ).json(),
    ).id;
    const log = brewLogSchema.parse(
      (await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, { recipeId: otherId })).json(),
    );

    context.completionClient.answerWith(TEST_CHAT_ANSWER);

    const response = await api.post(API_ROUTES.aiRecipeChat, RETURNING_IDENTITY, {
      recipeId,
      message: COMPLAINT,
      brewLogId: log.id,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
    expect(context.completionClient.calls).toHaveLength(NOTHING);
  });
});
