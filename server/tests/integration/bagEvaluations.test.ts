import {
  API_ROUTES,
  bagEvaluationSchema,
  buildApiPath,
  coffeeBagSchema,
  listResponseSchema,
  TASTE_PROFILE_SOURCES,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { TEST_BAG_NAME } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const HIGH_ACIDITY = 9;
const NO_CONFIDENCE = 0;
const SINGLE_ITEM = 1;
const VERDICT = 'Kupuj, sedi to na tvoj profil.';

describe('bag evaluations', () => {
  let context: TestContext;
  let api: TestApi;

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

  /**
   * The advice was only as good as what Brewmate knew that afternoon, so the
   * confidence is stamped on rather than looked up again later.
   */
  it('records how confident the profile was at the time', async () => {
    const beforeAnyEvidence = bagEvaluationSchema.parse(
      (
        await api.post(API_ROUTES.bagEvaluations, RETURNING_IDENTITY, {
          verdictText: VERDICT,
          parsedData: { name: TEST_BAG_NAME },
        })
      ).json(),
    );

    expect(beforeAnyEvidence.profileConfidenceAtTime).toBe(NO_CONFIDENCE);

    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    });

    const afterEvidence = bagEvaluationSchema.parse(
      (
        await api.post(API_ROUTES.bagEvaluations, RETURNING_IDENTITY, { verdictText: VERDICT })
      ).json(),
    );

    expect(afterEvidence.profileConfidenceAtTime).toBeGreaterThan(NO_CONFIDENCE);

    const untouched = bagEvaluationSchema.parse(
      (
        await api.get(
          buildApiPath(API_ROUTES.bagEvaluationById, { id: beforeAnyEvidence.id }),
          RETURNING_IDENTITY,
        )
      ).json(),
    );

    expect(untouched.profileConfidenceAtTime).toBe(NO_CONFIDENCE);
  });

  it('closes the loop when the bag is actually bought', async () => {
    const evaluation = bagEvaluationSchema.parse(
      (
        await api.post(API_ROUTES.bagEvaluations, RETURNING_IDENTITY, { verdictText: VERDICT })
      ).json(),
    );

    const bag = coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name: TEST_BAG_NAME })).json(),
    );

    const linked = bagEvaluationSchema.parse(
      (
        await api.patch(
          buildApiPath(API_ROUTES.bagEvaluationById, { id: evaluation.id }),
          RETURNING_IDENTITY,
          { wasPurchased: true, linkedBagId: bag.id },
        )
      ).json(),
    );

    expect(linked.wasPurchased).toBe(true);
    expect(linked.linkedBagId).toBe(bag.id);
  });

  it('refuses to link a bag belonging to somebody else', async () => {
    const evaluation = bagEvaluationSchema.parse(
      (
        await api.post(API_ROUTES.bagEvaluations, RETURNING_IDENTITY, { verdictText: VERDICT })
      ).json(),
    );

    const foreignBag = coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, SECOND_IDENTITY, { name: TEST_BAG_NAME })).json(),
    );

    const response = await api.patch(
      buildApiPath(API_ROUTES.bagEvaluationById, { id: evaluation.id }),
      RETURNING_IDENTITY,
      { linkedBagId: foreignBag.id },
    );

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  /** The verdict is a record of what was said, not a draft to be rewritten. */
  it('does not accept a rewritten verdict', async () => {
    const evaluation = bagEvaluationSchema.parse(
      (
        await api.post(API_ROUTES.bagEvaluations, RETURNING_IDENTITY, { verdictText: VERDICT })
      ).json(),
    );

    const response = await api.patch(
      buildApiPath(API_ROUTES.bagEvaluationById, { id: evaluation.id }),
      RETURNING_IDENTITY,
      { verdictText: 'Nekupuj.' },
    );

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  it('lists only the caller s own evaluations', async () => {
    await api.post(API_ROUTES.bagEvaluations, RETURNING_IDENTITY, { verdictText: VERDICT });
    await api.post(API_ROUTES.bagEvaluations, SECOND_IDENTITY, { verdictText: VERDICT });

    const mine = listResponseSchema(bagEvaluationSchema).parse(
      (await api.get(API_ROUTES.bagEvaluations, RETURNING_IDENTITY)).json(),
    );

    expect(mine.items).toHaveLength(SINGLE_ITEM);
  });
});
