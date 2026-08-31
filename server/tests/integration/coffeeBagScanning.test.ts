import {
  aiUsageLogSchema,
  API_ROUTES,
  LABEL_PHOTO_ISSUES,
  listResponseSchema,
  lowConfidenceFieldNames,
  parseCoffeeBagResponseSchema,
  PARSED_CONFIDENCE_LOW_THRESHOLD,
  type ParseCoffeeBagResponse,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import {
  MALFORMED_ANSWER,
  OTHER_IMAGE_URL,
  OTHER_PHOTO_ANSWER,
  TEST_IMAGE_URL,
  TEST_LABEL_ANSWER,
} from '../fixtures/testAiAnswers.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const ONE_CALL = 1;
const TWO_CALLS = 2;
const NO_CALLS = 0;
const NOTHING = 0;
const UNREADABLE_PHOTO = {
  text: '',
  issues: [LABEL_PHOTO_ISSUES.noText, LABEL_PHOTO_ISSUES.tooDark],
} as const;

describe('coffee bag scanning', () => {
  let context: TestContext;
  let api: TestApi;

  const parse = async (
    identity: VerifiedToken,
    imageUrl: string,
  ): Promise<ParseCoffeeBagResponse> =>
    parseCoffeeBagResponseSchema.parse(
      (await api.post(API_ROUTES.aiParseCoffeeBag, identity, { imageUrl })).json(),
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

  it('reads a label into the fields a bag is stored with', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);

    const { fields, fromCache } = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(fromCache).toBe(false);
    expect(fields.name.value).toBe('Kiamugumo AA');
    expect(fields.tastingNotes.value).toEqual(['čierne ríbezle', 'grep']);
    expect(fields.farm.value).toBeNull();
  });

  /**
   * A field read badly and saved silently is a coffee that misreports itself in
   * every recipe afterwards, so the ones worth a second look are named.
   */
  it('marks the fields that were read too uncertainly to trust', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);

    const { fields } = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(lowConfidenceFieldNames(fields)).toEqual(['roastLevel']);
    expect(fields.name.confidence).toBeGreaterThanOrEqual(PARSED_CONFIDENCE_LOW_THRESHOLD);
    expect(lowConfidenceFieldNames(fields)).not.toContain('farm');
  });

  it('reads the same photograph once, however often it is sent', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);

    await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);
    const again = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(again.fromCache).toBe(true);
    expect(context.completionClient.calls).toHaveLength(ONE_CALL);
  });

  /**
   * The expensive case: the same coffee, in another shop, photographed by
   * somebody else. The label keys are normalised, so spacing and capitals do
   * not make it a different bag - and the stored reading wins over this
   * photograph's, because somebody has had the chance to correct it.
   */
  it('answers a coffee it has read before from the stored reading', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER, OTHER_PHOTO_ANSWER);

    const first = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);
    const second = await parse(SECOND_IDENTITY, OTHER_IMAGE_URL);

    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
    expect(second.fromCache).toBe(true);
    expect(second.fields.originCountry.value).toBe(first.fields.originCountry.value);
  });

  /**
   * Once, because the second attempt is what tells a model that slipped apart
   * from a photograph nothing can be read from.
   */
  it('retries a malformed answer exactly once, then gives up', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER, TEST_LABEL_ANSWER);

    const recovered = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(recovered.fields.name.value).toBe('Kiamugumo AA');
    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);

    context.completionClient.reset();
    context.completionClient.answerWith(MALFORMED_ANSWER);

    const refused = await api.post(API_ROUTES.aiParseCoffeeBag, RETURNING_IDENTITY, {
      imageUrl: OTHER_IMAGE_URL,
    });

    expect(refused.statusCode).toBe(HTTP_STATUS.badRequest);
    expect(context.completionClient.calls).toHaveLength(TWO_CALLS);
  });

  /**
   * The whole point of looking at the photograph first. A picture nothing
   * could be read off produces twelve nulls and an empty form whatever it
   * costs, and somebody standing in a shop reads that as the app being broken
   * rather than as the light being bad.
   */
  it('refuses a photograph nothing could be read off before asking a model', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);
    context.labelTextReader.answerWith(UNREADABLE_PHOTO);

    const refused = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(refused.photoIssues).toEqual([LABEL_PHOTO_ISSUES.noText, LABEL_PHOTO_ISSUES.tooDark]);
    expect(refused.fields.name.value).toBeNull();
    expect(context.completionClient.calls).toHaveLength(NO_CALLS);
  });

  /**
   * A refused photograph is not a reading, so it is not cached as one. The
   * next attempt at the same bad picture has to be able to reach the model
   * once the reader has been fixed or replaced.
   */
  it('does not remember a photograph it refused', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);
    context.labelTextReader.answerWith(UNREADABLE_PHOTO);
    await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    context.labelTextReader.reset();
    const read = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(read.photoIssues).toEqual([]);
    expect(read.fields.name.value).toBe('Kiamugumo AA');
  });

  /**
   * The reader is an aid to reading a label, never the reading itself. Letting
   * a third party's bad afternoon refuse somebody's scan would make the
   * feature less reliable than it was before the aid existed.
   */
  it('reads the label anyway when the photograph could not be inspected', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);
    context.labelTextReader.failWith(new Error('vision is down'));

    const read = await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(read.photoIssues).toBeNull();
    expect(read.fields.name.value).toBe('Kiamugumo AA');
  });

  /** The transcript is what the reader is for: the small print on the seam. */
  it('hands the transcript to the model alongside the photograph', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);
    context.labelTextReader.answerWith({ text: 'Praženo 2025-01-04', issues: [] });

    await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(context.completionClient.calls[NOTHING]?.prompt).toContain('Praženo 2025-01-04');
  });

  /** Those bytes were read once and kept; inspecting them again buys nothing. */
  it('does not inspect a photograph it has already read', async () => {
    context.completionClient.answerWith(TEST_LABEL_ANSWER);

    await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);
    await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    expect(context.labelTextReader.calls).toHaveLength(ONE_CALL);
  });

  it('records what the reading cost, retry included', async () => {
    context.completionClient.answerWith(MALFORMED_ANSWER, TEST_LABEL_ANSWER);

    await parse(RETURNING_IDENTITY, TEST_IMAGE_URL);

    const usage = listResponseSchema(aiUsageLogSchema).parse(
      (await api.get(API_ROUTES.aiUsage, RETURNING_IDENTITY)).json(),
    );

    expect(usage.items).toHaveLength(ONE_CALL);
    expect(usage.items[NOTHING]?.tokensIn).toBeGreaterThan(NOTHING);
    expect(Number(usage.items[NOTHING]?.costEstimate)).toBeGreaterThan(NOTHING);
  });
});
