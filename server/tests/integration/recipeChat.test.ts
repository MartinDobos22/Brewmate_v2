import {
  API_ROUTES,
  buildApiPath,
  CHAT_ROLES,
  listResponseSchema,
  recipeChatMessageSchema,
  recipeSchema,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { TEST_BREW_PARAMS } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const FIRST_QUESTION = 'Preco je to kysle?';
const ANSWER = 'Skus hrubsie mletie.';
const COARSER_GRIND = 26;
const TWO_MESSAGES = 2;

describe('recipe chat', () => {
  let context: TestContext;
  let api: TestApi;
  let recipeId: string;
  let messagesPath: string;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methodId = (await insertTestBrewMethods(context.db)).v60.id;

    recipeId = recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          methodId,
          params: TEST_BREW_PARAMS,
        })
      ).json(),
    ).id;
    messagesPath = buildApiPath(API_ROUTES.recipeMessages, { id: recipeId });
  });

  afterAll(async () => {
    await context.close();
  });

  it('keeps the conversation in the order it happened', async () => {
    await api.post(messagesPath, RETURNING_IDENTITY, {
      role: CHAT_ROLES.user,
      content: FIRST_QUESTION,
    });
    await api.post(messagesPath, RETURNING_IDENTITY, {
      role: CHAT_ROLES.assistant,
      content: ANSWER,
    });

    const messages = listResponseSchema(recipeChatMessageSchema).parse(
      (await api.get(messagesPath, RETURNING_IDENTITY)).json(),
    );

    expect(messages.items).toHaveLength(TWO_MESSAGES);
    expect(messages.items[0]?.content).toBe(FIRST_QUESTION);
    expect(messages.items[1]?.role).toBe(CHAT_ROLES.assistant);
  });

  /** A suggestion is stored next to the message, not applied to the recipe. */
  it('stores a proposed change without touching the recipe', async () => {
    await api.post(messagesPath, RETURNING_IDENTITY, {
      role: CHAT_ROLES.assistant,
      content: ANSWER,
      recipePatch: { params: { grindSetting: COARSER_GRIND } },
    });

    const messages = listResponseSchema(recipeChatMessageSchema).parse(
      (await api.get(messagesPath, RETURNING_IDENTITY)).json(),
    );

    expect(messages.items[0]?.recipePatch?.params.grindSetting).toBe(COARSER_GRIND);

    const recipe = recipeSchema.parse(
      (await api.get(buildApiPath(API_ROUTES.recipeById, { id: recipeId }), RETURNING_IDENTITY)).json(),
    );

    expect(recipe.params.grindSetting).toBe(TEST_BREW_PARAMS.grindSetting);
  });

  /**
   * The table carries no `user_id`; ownership is the recipe's, and this is
   * what proves the extra lookup actually happens.
   */
  it('refuses to read a conversation about somebody else s recipe', async () => {
    await api.post(messagesPath, RETURNING_IDENTITY, {
      role: CHAT_ROLES.user,
      content: FIRST_QUESTION,
    });

    expect((await api.get(messagesPath, SECOND_IDENTITY)).statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('refuses to write into a conversation about somebody else s recipe', async () => {
    const response = await api.post(messagesPath, SECOND_IDENTITY, {
      role: CHAT_ROLES.user,
      content: FIRST_QUESTION,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('takes the conversation with the recipe when it is deleted', async () => {
    await api.post(messagesPath, RETURNING_IDENTITY, {
      role: CHAT_ROLES.user,
      content: FIRST_QUESTION,
    });

    await api.remove(buildApiPath(API_ROUTES.recipeById, { id: recipeId }), RETURNING_IDENTITY);

    expect((await api.get(messagesPath, RETURNING_IDENTITY)).statusCode).toBe(
      HTTP_STATUS.notFound,
    );
  });
});
