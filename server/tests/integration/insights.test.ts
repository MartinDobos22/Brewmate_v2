import {
  API_ROUTES,
  INSIGHT_ATTRIBUTES,
  INSIGHT_EXPLANATION_SOURCES,
  INSIGHT_REASON_KINDS,
  TASTE_PROFILE_SOURCES,
  acceptTasteSuggestionResponseSchema,
  dismissTasteSuggestionResponseSchema,
  insightsResponseSchema,
  type AttributeInsight,
  type InsightsResponse,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { AI_MODELS } from '../../src/ai/constants/aiModels.js';
import type { VerifiedToken } from '../../src/auth/verifiedToken.js';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { MALFORMED_ANSWER, TEST_SUGGESTION_ANSWER } from '../fixtures/testAiAnswers.js';
import {
  ENOUGH_BREWS,
  HISTORY_ORIGIN,
  HISTORY_ROAST,
  createHistoryBag,
  createHistoryRecipe,
  logBrews,
} from '../fixtures/testHistory.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NOTHING = 0;
const ONE_CALL = 1;
const TOO_FEW_BREWS = 2;
const UNKNOWN_REF = 'ins-1-deadbeef';

describe('insights', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;

  const read = async (identity: VerifiedToken = RETURNING_IDENTITY): Promise<InsightsResponse> =>
    insightsResponseSchema.parse((await api.get(API_ROUTES.insights, identity)).json());

  /** One coffee, brewed enough times for the report to be willing to speak. */
  const brewOneCoffee = async (count: number): Promise<void> => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);
    const recipe = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);

    await logBrews(api, RETURNING_IDENTITY, recipe.id, count);
  };

  const findAttribute = (
    insights: InsightsResponse,
    attribute: string,
  ): AttributeInsight | undefined =>
    insights.attributes.find((entry: AttributeInsight): boolean => entry.attribute === attribute);

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
    context.completionClient.answerWith(TEST_SUGGESTION_ANSWER);

    v60Id = (await insertTestBrewMethods(context.db)).v60.id;
  });

  afterAll(async () => {
    await context.close();
  });

  /** Three cups is not a pattern, and saying so is the whole of this rule. */
  it('says nothing at all until there is something to say', async () => {
    await brewOneCoffee(TOO_FEW_BREWS);

    const insights = await read();

    expect(insights.brewCount).toBe(TOO_FEW_BREWS);
    expect(insights.attributes).toHaveLength(NOTHING);
    expect(insights.suggestion).toBeNull();
  });

  it('counts what was actually brewed, by origin, process and roast', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const insights = await read();
    const origin = findAttribute(insights, INSIGHT_ATTRIBUTES.origin);

    expect(insights.brewCount).toBe(ENOUGH_BREWS);
    expect(origin?.value).toBe(HISTORY_ORIGIN);
    expect(origin?.brewCount).toBe(ENOUGH_BREWS);
    expect(origin?.bagCount).toBe(ONE_CALL);
    expect(findAttribute(insights, INSIGHT_ATTRIBUTES.roastLevel)?.value).toBe(HISTORY_ROAST);
    expect(findAttribute(insights, INSIGHT_ATTRIBUTES.process)).toBeDefined();
  });

  it('proposes the roast the history actually shows, and names its evidence', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();

    expect(suggestion?.roastPreference).toBe(HISTORY_ROAST);
    expect(suggestion?.reasons.at(NOTHING)?.kind).toBe(INSIGHT_REASON_KINDS.roastHistory);
    expect(suggestion?.reasons.at(NOTHING)?.brewCount).toBe(ENOUGH_BREWS);
  });

  /**
   * The auxiliary call, and the only one in the product that goes to the
   * smaller model: the numbers were computed before it was asked anything.
   */
  it('asks the smaller model for the sentence beside the numbers', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();

    expect(suggestion?.explanationSource).toBe(INSIGHT_EXPLANATION_SOURCES.model);
    expect(context.completionClient.calls.at(-ONE_CALL)?.model).toBe(AI_MODELS.haiku);
  });

  /** Written once per piece of evidence, and read back afterwards. */
  it('does not pay for the same paragraph twice', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const first = await read();
    const callsAfterFirst = context.completionClient.calls.length;
    const second = await read();

    expect(second.suggestion?.explanation).toBe(first.suggestion?.explanation);
    expect(context.completionClient.calls).toHaveLength(callsAfterFirst);
  });

  /**
   * A model that will not answer costs the card its paragraph and nothing
   * else. Every number on it is arithmetic, and the app writes its own
   * sentence from the machine-named reasons.
   */
  it('still gives the whole report when no paragraph can be had', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER);

    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();

    expect(suggestion).not.toBeNull();
    expect(suggestion?.explanationSource).toBe(INSIGHT_EXPLANATION_SOURCES.rules);
    expect(suggestion?.explanation).toBe('');
    expect(suggestion?.roastPreference).toBe(HISTORY_ROAST);
  });

  it('writes the accepted conclusion into the profile, from its own source', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();
    const accepted = acceptTasteSuggestionResponseSchema.parse(
      (
        await api.post(API_ROUTES.insightSuggestionAccept, RETURNING_IDENTITY, {
          ref: suggestion?.ref,
        })
      ).json(),
    );

    expect(accepted.event.source).toBe(TASTE_PROFILE_SOURCES.brewHistory);
    expect(accepted.event.sourceRef).toBe(suggestion?.ref);
    expect(accepted.profile.roastPreference).toBe(HISTORY_ROAST);
  });

  /** Agreeing twice is the same agreement, and the audit trail says so. */
  it('counts an accepted suggestion once', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();
    const body = { ref: suggestion?.ref };

    const first = acceptTasteSuggestionResponseSchema.parse(
      (await api.post(API_ROUTES.insightSuggestionAccept, RETURNING_IDENTITY, body)).json(),
    );
    const second = acceptTasteSuggestionResponseSchema.parse(
      (await api.post(API_ROUTES.insightSuggestionAccept, RETURNING_IDENTITY, body)).json(),
    );

    expect(second.event.id).toBe(first.event.id);
    expect(second.profile.roastPreference).toBe(first.profile.roastPreference);
  });

  it('stops offering a suggestion that has been answered', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();

    await api.post(API_ROUTES.insightSuggestionAccept, RETURNING_IDENTITY, {
      ref: suggestion?.ref,
    });

    expect((await read()).suggestion).toBeNull();
  });

  it('remembers a refusal, and writes nothing about anybody s taste', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const { suggestion } = await read();
    const dismissed = dismissTasteSuggestionResponseSchema.parse(
      (
        await api.post(API_ROUTES.insightSuggestionDismiss, RETURNING_IDENTITY, {
          ref: suggestion?.ref,
        })
      ).json(),
    );

    expect(dismissed.ref).toBe(suggestion?.ref);
    expect((await read()).suggestion).toBeNull();
  });

  /**
   * Accepting is checked against the evidence as it stands now. A ref that no
   * longer matches would write a claim the history no longer supports.
   */
  it('refuses to accept evidence it cannot find', async () => {
    await brewOneCoffee(ENOUGH_BREWS);
    await read();

    const response = await api.post(API_ROUTES.insightSuggestionAccept, RETURNING_IDENTITY, {
      ref: UNKNOWN_REF,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('refuses to dismiss a suggestion nobody was shown', async () => {
    const response = await api.post(API_ROUTES.insightSuggestionDismiss, RETURNING_IDENTITY, {
      ref: UNKNOWN_REF,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('keeps one account s history out of another s', async () => {
    await brewOneCoffee(ENOUGH_BREWS);

    const theirs = await read(SECOND_IDENTITY);

    expect(theirs.brewCount).toBe(NOTHING);
    expect(theirs.suggestion).toBeNull();
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.insights)).statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
