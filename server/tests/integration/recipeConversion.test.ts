import {
  API_ROUTES,
  CONVERSION_PRECISIONS,
  CONVERSION_REASONS,
  RECIPE_SOURCES,
  WATER_TYPES,
  convertRecipeResponseSchema,
  grinderSchema,
  parseRecipeResponseSchema,
  resolveRatio,
  type ConversionNote,
  type ConvertRecipeRequest,
  type ConvertRecipeResponse,
  type CreateGrinderRequest,
  type Grinder,
  type ParseRecipeResponse,
  type SourceRecipe,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { MALFORMED_ANSWER } from '../fixtures/testAiAnswers.js';
import {
  BLOOM_WATER_GRAMS,
  EXPECTED_TARGET_SETTING,
  OVERREACHING_CONVERSION_ANSWER,
  RESCHEDULED_CONVERSION_ANSWER,
  REWRITTEN_STEP_LABEL,
  SOURCE_DOSE_GRAMS,
  SOURCE_GRINDER,
  SOURCE_TEMP_C,
  SOURCE_WATER_GRAMS,
  SPARSE_PARSE_ANSWER,
  TARGET_GRINDER,
  TEST_CONVERSION_ANSWER,
  TEST_CONVERSION_RATIONALE,
  TEST_PARSED_LABEL,
  TEST_PARSE_ANSWER,
  TEST_SOURCE_RECIPE,
} from '../fixtures/testConversionAnswers.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const TWO_CALLS = 2;
const ONE_STEP = 1;
const ONE_CALL = 1;
const FIRST = 0;
const NOTHING = 0;
const PASTED_TEXT = '30 g coffee, 500 g water, 20 clicks, 92 C, 3:00 total';

describe('converting somebody else recipe onto this person equipment', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;
  let espressoId: string;
  let sourceGrinder: Grinder;
  let targetGrinder: Grinder;

  const addGrinder = async (input: CreateGrinderRequest): Promise<Grinder> =>
    grinderSchema.parse((await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, input)).json());

  const request = (overrides: Partial<ConvertRecipeRequest>): ConvertRecipeRequest => ({
    source: { ...TEST_SOURCE_RECIPE, grinderId: sourceGrinder.id },
    methodId: v60Id,
    constraints: {},
    waterType: WATER_TYPES.filtered,
    ...overrides,
  });

  const convert = async (body: ConvertRecipeRequest): Promise<ConvertRecipeResponse> =>
    convertRecipeResponseSchema.parse(
      (await api.post(API_ROUTES.aiConvertRecipe, RETURNING_IDENTITY, body)).json(),
    );

  const parse = async (text: string): Promise<ParseRecipeResponse> =>
    parseRecipeResponseSchema.parse(
      (await api.post(API_ROUTES.aiParseRecipe, RETURNING_IDENTITY, { text })).json(),
    );

  const reasons = (notes: readonly ConversionNote[]): readonly string[] =>
    notes.map((note: ConversionNote): string => note.reason);

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methods = await insertTestBrewMethods(context.db);

    v60Id = methods.v60.id;
    espressoId = methods.espresso.id;
    sourceGrinder = await addGrinder(SOURCE_GRINDER);
    targetGrinder = await addGrinder(TARGET_GRINDER);
  });

  afterAll(async () => {
    await context.close();
  });

  /**
   * The parse is the only place a model touches an import apart from writing
   * the explanation, and it is handed straight back to the person who pasted
   * the text in before anything is converted.
   */
  it('reads a pasted recipe into fields and resolves the grinder it named', async () => {
    context.completionClient.answerWith(TEST_PARSE_ANSWER);

    const { source } = await parse(PASTED_TEXT);

    expect(source.label).toBe(TEST_PARSED_LABEL);
    expect(source.doseGrams).toBe(SOURCE_DOSE_GRAMS);
    expect(source.grinderId).toBe(sourceGrinder.id);
  });

  /** Anything the source did not state stays null rather than being filled in. */
  it('leaves a hole where the source stated nothing', async () => {
    context.completionClient.answerWith(SPARSE_PARSE_ANSWER);

    const { source } = await parse(PASTED_TEXT);

    expect(source.waterGrams).toBeNull();
    expect(source.waterTempC).toBeNull();
    expect(source.grinderId).toBeNull();
    expect(source.grindLabel).not.toBeNull();
  });

  it('stores the converted recipe as imported', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));

    expect(recipe.source).toBe(RECIPE_SOURCES.imported);
    expect(recipe.rationale).toBe(TEST_CONVERSION_RATIONALE);
    expect(recipe.isSaved).toBe(false);
    expect(recipe.isPinned).toBe(false);
  });

  /**
   * The conversion is arithmetic and runs before the model is asked anything.
   * The answer schema has no field for a dose, a water weight or a grind
   * setting, so an answer carrying them changes nothing - which is the whole
   * guarantee this feature rests on.
   */
  it('keeps the computed amounts whatever the model tries to add', async () => {
    context.completionClient.answerWith(OVERREACHING_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));

    expect(recipe.params.doseGrams).toBe(SOURCE_DOSE_GRAMS);
    expect(recipe.params.waterGrams).toBe(SOURCE_WATER_GRAMS);
    expect(recipe.params.ratio).toBe(resolveRatio(SOURCE_DOSE_GRAMS, SOURCE_WATER_GRAMS));
  });

  /**
   * Two collars are only comparable through microns, and this is the whole
   * arithmetic: 20 clicks on a curve worth 30 microns a click is 700 microns,
   * which is 50 clicks on a collar worth 10.
   */
  it('translates the grind through both calibration curves', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));

    expect(recipe.params.grindSetting).toBe(EXPECTED_TARGET_SETTING);
    expect(recipe.params.conversion?.grindMicrons).not.toBeNull();
    expect(targetGrinder.micronCalibration?.isEstimated).toBe(true);
  });

  /**
   * The spec is explicit: an estimated curve, and an entry that is one
   * person's contribution rather than part of the shared catalogue, both have
   * to be said out loud rather than folded into a general hedge.
   */
  it('records that a calibration was an estimate and an entry unverified', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));
    const notes = recipe.params.conversion?.notes ?? [];

    expect(reasons(notes)).toContain(CONVERSION_REASONS.calibrationEstimated);
    expect(reasons(notes)).toContain(CONVERSION_REASONS.grinderUnverified);
  });

  /** Every converted grind is a starting point, whatever the curves said. */
  it('never marks the grind as exact', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));
    const grindNotes = (recipe.params.conversion?.notes ?? []).filter(
      (note: ConversionNote): boolean => note.field === 'grind',
    );

    expect(grindNotes.length).toBeGreaterThan(NOTHING);
    expect(
      grindNotes.every(
        (note: ConversionNote): boolean => note.precision !== CONVERSION_PRECISIONS.exact,
      ),
    ).toBe(true);
  });

  /** A temperature converts perfectly, so it comes across untouched and says so. */
  it('carries the temperature across and reports it as exact', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));
    const temperature = (recipe.params.conversion?.notes ?? []).find(
      (note: ConversionNote): boolean => note.field === 'temperature',
    );

    expect(recipe.params.waterTempC).toBe(SOURCE_TEMP_C);
    expect(temperature?.precision).toBe(CONVERSION_PRECISIONS.exact);
  });

  /**
   * A schedule that carried over intact is arithmetic, and the model has no
   * field to rewrite it with. An answer that tries anyway fails validation,
   * gets its one retry with the reason, and the well-behaved answer is stored.
   */
  it('refuses a rewritten schedule when the original carried over', async () => {
    context.completionClient.answerWith(RESCHEDULED_CONVERSION_ANSWER, TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
    expect(recipe.params.steps).toHaveLength(TEST_SOURCE_RECIPE.steps.length);
    expect(recipe.params.steps[FIRST]?.waterGrams).toBe(BLOOM_WATER_GRAMS);
  });

  /**
   * A V60 pour schedule means nothing in a portafilter, so the conversion
   * drops it and reports the hole - and that is exactly when the model is
   * allowed to write one.
   */
  it('takes a rewritten schedule when the brewer family changed', async () => {
    context.completionClient.answerWith(RESCHEDULED_CONVERSION_ANSWER);

    const { recipe } = await convert(request({ methodId: espressoId }));

    expect(context.completionClient.calls).toHaveLength(ONE_CALL);
    expect(recipe.params.steps).toHaveLength(ONE_STEP);
    expect(recipe.params.steps[FIRST]?.label).toBe(REWRITTEN_STEP_LABEL);
  });

  /** The source is kept whole, because "what did the original say?" is the first question. */
  it('stores the source recipe on the converted one', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const { recipe } = await convert(request({}));
    const source: SourceRecipe | undefined = recipe.params.conversion?.source;

    expect(source?.doseGrams).toBe(SOURCE_DOSE_GRAMS);
    expect(source?.label).toBe(TEST_PARSED_LABEL);
  });

  it('retries a malformed explanation exactly once', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER, TEST_CONVERSION_ANSWER);

    await convert(request({}));

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
  });

  it('refuses to convert into a method that does not exist', async () => {
    context.completionClient.answerWith(TEST_CONVERSION_ANSWER);

    const response = await api.post(
      API_ROUTES.aiConvertRecipe,
      RETURNING_IDENTITY,
      request({ methodId: sourceGrinder.id }),
    );

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });
});
