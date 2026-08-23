import {
  API_ROUTES,
  bagEvaluationSchema,
  evaluateCoffeeResponseSchema,
  listResponseSchema,
  ROAST_LEVELS,
  TASTE_PROFILE_SOURCES,
  type EvaluateCoffeeRequest,
  type EvaluateCoffeeResponse,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import {
  MALFORMED_ANSWER,
  TEST_VERDICT_ANSWER,
  TEST_VERDICT_TEXT,
} from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const ONE_CALL = 1;
const SINGLE_ITEM = 1;
const NO_CONFIDENCE = 0;
const NOTHING = 0;
const HIGH_ACIDITY = 9;
const FIRST = 0;

const COFFEE: EvaluateCoffeeRequest = {
  parsedData: {
    roaster: 'Cafe Sladko',
    name: 'Kiamugumo AA',
    roastLevel: ROAST_LEVELS.mediumLight,
    tastingNotes: ['čierne ríbezle'],
  },
};

/** A different coffee, for the second question in one test. */
const OTHER_COFFEE: EvaluateCoffeeRequest = {
  parsedData: { roaster: 'Goriffee', name: 'Finca La Esperanza' },
};

/** The same coffee, typed differently by somebody in a hurry. */
const SAME_COFFEE_RETYPED: EvaluateCoffeeRequest = {
  parsedData: { ...COFFEE.parsedData, roaster: '  cafe   SLADKO', originCountry: 'Keňa' },
};

describe('coffee evaluation', () => {
  let context: TestContext;
  let api: TestApi;

  const evaluate = async (
    identity: VerifiedToken,
    body: EvaluateCoffeeRequest,
  ): Promise<EvaluateCoffeeResponse> =>
    evaluateCoffeeResponseSchema.parse(
      (await api.post(API_ROUTES.aiEvaluateCoffee, identity, body)).json(),
    );

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

  it('stores the verdict, its reasoning and what it could not see', async () => {
    context.completionClient.answerWith(TEST_VERDICT_ANSWER);

    const { evaluation, fromHistory } = await evaluate(RETURNING_IDENTITY, COFFEE);

    expect(fromHistory).toBe(false);
    expect(evaluation.verdictText).toBe(TEST_VERDICT_TEXT);
    expect(evaluation.reasoning.points).toHaveLength(SINGLE_ITEM);
    expect(evaluation.uncertainties.items[FIRST]?.field).toBe('roastDate');
    expect(evaluation.parsedData.name).toBe('Kiamugumo AA');
  });

  /**
   * The profile is read off the caller's own rows, never taken from the body:
   * a profile a client could declare is a profile anybody could declare.
   */
  it('reads the profile itself and stamps how much it was worth', async () => {
    context.completionClient.answerWith(TEST_VERDICT_ANSWER);

    const guessing = await evaluate(RETURNING_IDENTITY, COFFEE);

    expect(guessing.evaluation.profileConfidenceAtTime).toBe(NO_CONFIDENCE);

    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    });

    const informed = await evaluate(RETURNING_IDENTITY, OTHER_COFFEE);

    expect(informed.evaluation.profileConfidenceAtTime).toBeGreaterThan(NO_CONFIDENCE);
  });

  /**
   * Nothing about the person travels in the request, so everything the model
   * is told about them has to have been read off their own rows.
   */
  it('hands the model the profile and the coffee, and nothing the client sent about the person', async () => {
    context.completionClient.answerWith(TEST_VERDICT_ANSWER);

    await evaluate(RETURNING_IDENTITY, COFFEE);

    const [call] = context.completionClient.calls;

    expect(call?.prompt).toContain('confidence band');
    expect(call?.prompt).toContain('Kiamugumo AA');
    expect(call?.image).toBeUndefined();
  });

  /**
   * Advice that comes out differently every time somebody asks is advice
   * nobody can rely on - and the shelf is exactly where the same bag gets
   * picked up twice.
   */
  it('answers a coffee it has already judged from that verdict', async () => {
    context.completionClient.answerWith(TEST_VERDICT_ANSWER);

    const first = await evaluate(RETURNING_IDENTITY, COFFEE);
    const again = await evaluate(RETURNING_IDENTITY, SAME_COFFEE_RETYPED);

    expect(again.fromHistory).toBe(true);
    expect(again.evaluation.id).toBe(first.evaluation.id);
    expect(context.completionClient.calls).toHaveLength(ONE_CALL);

    const stored = listResponseSchema(bagEvaluationSchema).parse(
      (await api.get(API_ROUTES.bagEvaluations, RETURNING_IDENTITY)).json(),
    );

    expect(stored.items).toHaveLength(SINGLE_ITEM);
  });

  it('answers that it cannot write a verdict rather than storing a broken one', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER);

    const response = await api.post(API_ROUTES.aiEvaluateCoffee, RETURNING_IDENTITY, COFFEE);

    expect(response.statusCode).toBe(HTTP_STATUS.serviceUnavailable);

    const stored = listResponseSchema(bagEvaluationSchema).parse(
      (await api.get(API_ROUTES.bagEvaluations, RETURNING_IDENTITY)).json(),
    );

    expect(stored.items).toHaveLength(NOTHING);
  });
});
