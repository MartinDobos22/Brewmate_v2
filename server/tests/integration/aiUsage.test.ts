import { API_ROUTES, aiUsageLogSchema, listResponseSchema } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createServices } from '../../src/app/createServices.js';
import { HTTP_METHODS } from '../../src/constants/httpMethods.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { authorizationHeaderFor } from '../setup/authorizationHeader.js';
import { createFakeIdentityDeleter } from '../setup/fakeIdentityDeleter.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';
import { userSchema } from '@brewmate/shared';

const TOKENS_IN = 1200;
const TOKENS_OUT = 340;
const COST_ESTIMATE = '0.004200';
const FUNCTION_NAME = 'evaluateBag';
const MODEL_NAME = 'test-model';
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;

describe('ai usage', () => {
  let context: TestContext;
  let api: TestApi;

  const recordUsageFor = async (userId: string): Promise<void> => {
    await createServices({
      db: context.db,
      identityDeleter: createFakeIdentityDeleter(),
      ai: null,
    }).aiUsageService.record({
      userId,
      functionName: FUNCTION_NAME,
      model: MODEL_NAME,
      tokensIn: TOKENS_IN,
      tokensOut: TOKENS_OUT,
      costEstimate: COST_ESTIMATE,
    });
  };

  const currentUserId = async (): Promise<string> =>
    userSchema.parse((await api.get(API_ROUTES.me, RETURNING_IDENTITY)).json()).id;

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
  });

  afterAll(async () => {
    await context.close();
  });

  /** Cost is a decimal string end to end; a float would round it away. */
  it('reports the caller s own usage without losing a fraction of a cent', async () => {
    await recordUsageFor(await currentUserId());

    const usage = listResponseSchema(aiUsageLogSchema).parse(
      (await api.get(API_ROUTES.aiUsage, RETURNING_IDENTITY)).json(),
    );

    expect(usage.items).toHaveLength(SINGLE_ITEM);
    expect(usage.items[0]?.costEstimate).toBe(COST_ESTIMATE);
    expect(usage.items[0]?.tokensIn).toBe(TOKENS_IN);
  });

  it('shows nobody else s usage', async () => {
    await recordUsageFor(await currentUserId());

    const theirs = listResponseSchema(aiUsageLogSchema).parse(
      (await api.get(API_ROUTES.aiUsage, SECOND_IDENTITY)).json(),
    );

    expect(theirs.items).toHaveLength(NO_ITEMS);
  });

  /** No client may declare its own token usage. */
  it('offers no way to write a usage row over HTTP', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.post,
      url: API_ROUTES.aiUsage,
      headers: authorizationHeaderFor(RETURNING_IDENTITY),
      payload: { functionName: FUNCTION_NAME, model: MODEL_NAME },
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.aiUsage)).statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
