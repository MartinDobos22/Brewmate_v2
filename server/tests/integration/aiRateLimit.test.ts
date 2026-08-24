import {
  AI_DAILY_CALL_LIMIT,
  AI_LIMIT_KINDS,
  AI_MONTHLY_COST_LIMIT,
  AI_USAGE_WINDOWS,
  API_ROUTES,
  ERROR_CODES,
  WATER_TYPES,
  aiRateLimitDetailsSchema,
  aiUsageSummarySchema,
  errorResponseSchema,
  type AiUsageSummary,
  type GenerateRecipeRequest,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { AI_COST_DECIMAL_PLACES } from '../../src/ai/constants/aiModels.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { aiUsageLogsTable } from '../../src/db/schema/aiUsageLogsTable.js';
import { usersTable } from '../../src/db/schema/usersTable.js';
import { eq } from 'drizzle-orm';
import { TEST_RECIPE_ANSWER } from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const DOSE_GRAMS = 17;
const WATER_GRAMS = 280;
const CHOSEN_RATIO = 16.5;
const SPENT_MODEL = 'claude-sonnet-5';
const FREE_CALL_COST = '0.000000';
const TOKENS = 100;
const OVER_MONTHLY_COST = (AI_MONTHLY_COST_LIMIT + 1).toFixed(AI_COST_DECIMAL_PLACES);
const NO_CALLS = 0;

describe('the model allowance', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;

  const request = (): GenerateRecipeRequest => ({
    methodId: v60Id,
    constraints: {},
    waterType: WATER_TYPES.filtered,
    doseGrams: DOSE_GRAMS,
    waterGrams: WATER_GRAMS,
    ratio: CHOSEN_RATIO,
  });

  /**
   * Usage is written straight into the table.
   *
   * Making forty real calls would test the fake model rather than the rule,
   * and would take a minute to say something one insert says immediately. What
   * matters is that the limiter reads these rows and that the dashboard reads
   * the same ones.
   */
  const spend = async (calls: number, costEstimate = FREE_CALL_COST): Promise<void> => {
    const [user] = await context.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.firebaseUid, RETURNING_IDENTITY.firebaseUid));

    if (user === undefined) {
      throw new Error(RETURNING_IDENTITY.firebaseUid);
    }

    await context.db.insert(aiUsageLogsTable).values(
      Array.from({ length: calls }, () => ({
        userId: user.id,
        functionName: API_ROUTES.aiGenerateRecipe,
        model: SPENT_MODEL,
        tokensIn: TOKENS,
        tokensOut: TOKENS,
        costEstimate,
      })),
    );
  };

  const readSummary = async (): Promise<AiUsageSummary> =>
    aiUsageSummarySchema.parse(
      (await api.get(API_ROUTES.aiUsageSummary, RETURNING_IDENTITY)).json(),
    );

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
    context.completionClient.answerWith(TEST_RECIPE_ANSWER);

    v60Id = (await insertTestBrewMethods(context.db)).v60.id;

    /** Provisions the account, which every write below hangs off. */
    await api.get(API_ROUTES.me, RETURNING_IDENTITY);
  });

  afterAll(async () => {
    await context.close();
  });

  it('lets a call through while there is room', async () => {
    const response = await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, request());

    expect(response.statusCode).toBe(HTTP_STATUS.created);
  });

  it('refuses one more call once the day is spent', async () => {
    await spend(AI_DAILY_CALL_LIMIT);

    const response = await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, request());

    expect(response.statusCode).toBe(HTTP_STATUS.tooManyRequests);
    expect(errorResponseSchema.parse(response.json()).error.code).toBe(ERROR_CODES.tooManyRequests);
  });

  /**
   * A refusal has to be actionable: which ceiling, over which window, and when
   * it lifts. "Skús to neskôr" is not an answer somebody can act on.
   */
  it('says which ceiling was reached and when it comes back', async () => {
    await spend(AI_DAILY_CALL_LIMIT);

    const response = await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, request());
    const details = aiRateLimitDetailsSchema.parse(
      errorResponseSchema.parse(response.json()).error.details,
    );

    expect(details.window).toBe(AI_USAGE_WINDOWS.day);
    expect(details.limit).toBe(AI_LIMIT_KINDS.calls);
    expect(new Date(details.resetsAt).getTime()).toBeGreaterThan(Date.now());
  });

  /** Money runs out as well as calls, and it is the one that actually hurts. */
  it('refuses on cost even with calls to spare', async () => {
    await spend(1, OVER_MONTHLY_COST);

    const response = await api.post(API_ROUTES.aiGenerateRecipe, RETURNING_IDENTITY, request());
    const details = aiRateLimitDetailsSchema.parse(
      errorResponseSchema.parse(response.json()).error.details,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.tooManyRequests);
    expect(details.window).toBe(AI_USAGE_WINDOWS.month);
    expect(details.limit).toBe(AI_LIMIT_KINDS.cost);
  });

  /**
   * The rule this whole feature is judged on. An account at its ceiling has
   * lost the things that ask a model a question and nothing else.
   */
  it('leaves everything that needs no model working', async () => {
    await spend(AI_DAILY_CALL_LIMIT);

    expect((await api.get(API_ROUTES.brewMethods, RETURNING_IDENTITY)).statusCode).toBe(
      HTTP_STATUS.ok,
    );
    expect((await api.get(API_ROUTES.coffeeBags, RETURNING_IDENTITY)).statusCode).toBe(
      HTTP_STATUS.ok,
    );
    expect((await api.get(API_ROUTES.recipes, RETURNING_IDENTITY)).statusCode).toBe(HTTP_STATUS.ok);
    expect((await api.get(API_ROUTES.brewLogs, RETURNING_IDENTITY)).statusCode).toBe(
      HTTP_STATUS.ok,
    );
    expect((await api.get(API_ROUTES.insights, RETURNING_IDENTITY)).statusCode).toBe(
      HTTP_STATUS.ok,
    );
  });

  it('holds one account s spending against that account alone', async () => {
    await spend(AI_DAILY_CALL_LIMIT);

    const theirs = await api.post(API_ROUTES.aiGenerateRecipe, SECOND_IDENTITY, request());

    expect(theirs.statusCode).toBe(HTTP_STATUS.created);
  });

  /**
   * The dashboard and the limiter read the same rows, so the number somebody
   * is shown cannot disagree with the one that refuses their next scan.
   */
  it('shows the spending the limiter is enforcing', async () => {
    await spend(AI_DAILY_CALL_LIMIT);

    const summary = await readSummary();

    expect(summary.day.calls).toBe(AI_DAILY_CALL_LIMIT);
    expect(summary.day.exhaustedBy).toBe(AI_LIMIT_KINDS.calls);
    expect(summary.month.calls).toBe(AI_DAILY_CALL_LIMIT);
    expect(summary.byFunction).not.toHaveLength(NO_CALLS);
  });

  it('starts an untouched account at nothing spent', async () => {
    const summary = await readSummary();

    expect(summary.day.calls).toBe(NO_CALLS);
    expect(summary.day.exhaustedBy).toBeNull();
    expect(summary.byFunction).toHaveLength(NO_CALLS);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.aiUsageSummary)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
