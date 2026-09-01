import {
  API_ROUTES,
  COFFEE_ESTIMATE_SOURCES,
  COFFEE_SIGNAL_SOURCES,
  ROAST_LEVELS,
  TASTE_AXIS_NEUTRAL,
  estimateCoffeeTasteResponseSchema,
  type EstimateCoffeeTasteRequest,
  type EstimateCoffeeTasteResponse,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  MALFORMED_ANSWER,
  OVERCONFIDENT_TASTE_ANSWER,
  TEST_TASTE_READING_ANSWER,
  TEST_TASTE_SUMMARY,
} from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const ONE_CALL = 1;
const TWO_CALLS = 2;
const NO_CONFIDENCE = 0;

const BRIGHT_COFFEE: EstimateCoffeeTasteRequest = {
  parsedData: {
    roaster: 'Cafe Sladko',
    name: 'Kiamugumo AA',
    originCountry: 'Keňa',
    process: 'praná',
    roastLevel: ROAST_LEVELS.light,
    tastingNotes: ['ríbezle', 'grep'],
  },
};

/** The same coffee, typed by somebody in a hurry. */
const SAME_COFFEE_RETYPED: EstimateCoffeeTasteRequest = {
  parsedData: { ...BRIGHT_COFFEE.parsedData, roaster: '  cafe   SLADKO' },
};

/** What a shelf in a supermarket actually offers: a name and nothing else. */
const BARE_COFFEE: EstimateCoffeeTasteRequest = {
  parsedData: { name: 'Espresso zmes' },
};

const DARK_COFFEE: EstimateCoffeeTasteRequest = {
  parsedData: {
    roaster: 'Tmavá pražiareň',
    name: 'Nočná zmes',
    roastLevel: ROAST_LEVELS.dark,
    process: 'natural',
  },
};

describe('estimating what a coffee tastes like', () => {
  let context: TestContext;
  let api: TestApi;

  const estimate = async (body: EstimateCoffeeTasteRequest): Promise<EstimateCoffeeTasteResponse> =>
    estimateCoffeeTasteResponseSchema.parse(
      (await api.post(API_ROUTES.aiEstimateCoffeeTaste, RETURNING_IDENTITY, body)).json(),
    );

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();
    context.completionClient.answerWith(TEST_TASTE_READING_ANSWER);
  });

  afterAll(async () => {
    await context.close();
  });

  it('reads the label and the model into one estimate', async () => {
    const { estimate: result, summary, flavourNotes } = await estimate(BRIGHT_COFFEE);

    expect(result.axes.acidity).toBeGreaterThan(TASTE_AXIS_NEUTRAL);
    expect(result.axes.bitterness).toBeLessThan(TASTE_AXIS_NEUTRAL);
    expect(result.source).toBe(COFFEE_ESTIMATE_SOURCES.model);
    expect(summary).toBe(TEST_TASTE_SUMMARY);
    expect(flavourNotes.length).toBeGreaterThan(NO_CONFIDENCE);
  });

  /**
   * The rule this whole module is arranged around. The model contributes one
   * weighted observation and then has to survive the same fold as the label;
   * it cannot assert a flavour over a printed roast level. A dark roast that
   * came back as the brightest coffee ever measured would mean a model had
   * overwritten the one fact on the bag that moves a cup furthest.
   */
  it('does not let the model overrule the label', async () => {
    context.completionClient.answerWith(OVERCONFIDENT_TASTE_ANSWER);

    const { estimate: result } = await estimate(DARK_COFFEE);

    expect(result.axes.acidity).toBeLessThan(TASTE_AXIS_NEUTRAL);
    expect(result.axes.bitterness).toBeGreaterThan(TASTE_AXIS_NEUTRAL);
  });

  /**
   * A model that will not answer is not a failure here: the tables have
   * already produced a complete estimate, and letting the call take the
   * request down with it would turn a richer answer into a missing one. This
   * is the shop-with-one-bar case, and it has to work.
   */
  it('still answers from the label alone when the model will not', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER);

    const { estimate: result, summary } = await estimate(BRIGHT_COFFEE);

    expect(result.source).toBe(COFFEE_ESTIMATE_SOURCES.label);
    expect(result.axes.acidity).toBeGreaterThan(TASTE_AXIS_NEUTRAL);
    expect(result.signals).toContain(COFFEE_SIGNAL_SOURCES.roastLevel);
    expect(summary).toBeNull();
  });

  /** Five middles that admit to being five middles, rather than a confident nothing. */
  it('admits it knows nothing about a bag that says nothing', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER);

    const { estimate: result } = await estimate(BARE_COFFEE);

    expect(result.axes.acidity).toBe(TASTE_AXIS_NEUTRAL);
    expect(result.axisConfidence.acidity).toBe(NO_CONFIDENCE);
  });

  /**
   * The same coffee tastes the same for everybody, which is what makes the
   * reading shared rather than personal - and the second scan of a popular bag
   * free, for whoever scans it next.
   */
  it('reads one coffee once, however many people scan it', async () => {
    await estimate(BRIGHT_COFFEE);
    await estimate(SAME_COFFEE_RETYPED);

    expect(context.completionClient.calls).toHaveLength(ONE_CALL);

    const theirs = estimateCoffeeTasteResponseSchema.parse(
      (await api.post(API_ROUTES.aiEstimateCoffeeTaste, SECOND_IDENTITY, BRIGHT_COFFEE)).json(),
    );

    expect(context.completionClient.calls).toHaveLength(ONE_CALL);
    expect(theirs.summary).toBe(TEST_TASTE_SUMMARY);
  });

  /**
   * Several unreadable labels are several different bags. Caching them under
   * one blank key would hand somebody another coffee's estimate.
   */
  it('does not cache a coffee whose label could not be read', async () => {
    await estimate(BARE_COFFEE);
    await estimate(BARE_COFFEE);

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
  });
});
