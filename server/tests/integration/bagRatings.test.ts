import {
  API_ROUTES,
  BAG_IMPRESSIONS,
  BAG_RATING_STAGES,
  FLAVOR_TAGS,
  TASTE_AXIS_NEUTRAL,
  TASTE_PROFILE_SOURCES,
  bagRatingSchema,
  listResponseSchema,
  tasteProfileSchema,
  type BagImpression,
  type CoffeeBag,
  type TasteProfile,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { createHistoryBag } from '../fixtures/testHistory.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const LOW_ACIDITY = 2;
const LOVED = 5;
const SHRUG = 3;
const HATED = 1;
const ONE = 1;
const NOTHING = 0;
const CHOCOLATE_NOTES = ['Horká čokoláda', 'kakao'];

describe('bag ratings', () => {
  let context: TestContext;
  let api: TestApi;

  const readProfile = async (): Promise<TasteProfile> =>
    tasteProfileSchema.parse((await api.get(API_ROUTES.tasteProfile, RETURNING_IDENTITY)).json());

  /** Somebody who said they do not want a sour cup, before anything else. */
  const answerQuestionnaire = async (): Promise<void> => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: LOW_ACIDITY } },
      sourceRef: 'baseline',
    });
  };

  /** A light washed Ethiopian - bright, whatever else its label says. */
  const buyBrightBag = async (): Promise<CoffeeBag> => createHistoryBag(api, RETURNING_IDENTITY);

  const rate = async (
    bag: CoffeeBag,
    stars: number,
    impression?: BagImpression,
  ): Promise<ReturnType<typeof api.put>> =>
    api.put(API_ROUTES.bagRatings, RETURNING_IDENTITY, {
      bagId: bag.id,
      stage: BAG_RATING_STAGES.halfway,
      stars,
      impression,
    });

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
   * Choosing a coffee says something about the person who chose it - a little,
   * because people also buy what the shop had.
   */
  it('lets a bought bag lean the profile a little towards it', async () => {
    await answerQuestionnaire();
    const before = await readProfile();

    await buyBrightBag();
    const after = await readProfile();

    expect(after.acidity).toBeGreaterThan(before.acidity);
    expect(after.acidity).toBeLessThan(TASTE_AXIS_NEUTRAL);
    expect(after.sourceWeights[TASTE_PROFILE_SOURCES.purchase]).toBeDefined();
  });

  /**
   * "Čokoláda" on a bag somebody chose is the roaster's word for what is in
   * it, and a small lean towards liking chocolate.
   */
  it('lets the flavours printed on a bought bag lean the profile towards them', async () => {
    await createHistoryBag(api, RETURNING_IDENTITY, { tastingNotes: CHOCOLATE_NOTES });

    const profile = await readProfile();

    expect(profile.flavorAffinities[FLAVOR_TAGS.chocolate]).toBeGreaterThan(NOTHING);
  });

  it('lets a loved bag move the profile further than buying it did', async () => {
    await answerQuestionnaire();
    const bag = await buyBrightBag();
    const bought = await readProfile();

    expect((await rate(bag, LOVED)).statusCode).toBe(HTTP_STATUS.ok);

    const loved = await readProfile();

    expect(loved.acidity).toBeGreaterThan(bought.acidity);
    expect(loved.ratedBagCount).toBe(ONE);
  });

  /**
   * "Fine, but not what I imagined" is not a no - it is a purchase that turned
   * out to say less about what this person wants than it seemed to.
   */
  it('leaves less of a purchase standing once the coffee tasted different', async () => {
    await answerQuestionnaire();
    await rate(await buyBrightBag(), SHRUG, BAG_IMPRESSIONS.asExpected);
    const asExpected = await readProfile();

    await context.reset();

    await answerQuestionnaire();
    await rate(await buyBrightBag(), SHRUG, BAG_IMPRESSIONS.different);
    const different = await readProfile();

    expect(different.acidity).toBeLessThan(asExpected.acidity);
  });

  /** Two answers for one bag at one stage are one opinion that was corrected. */
  it('replaces an earlier rating of the same bag at the same stage', async () => {
    await answerQuestionnaire();
    const bag = await buyBrightBag();

    await rate(bag, HATED);
    await rate(bag, LOVED);
    const corrected = await readProfile();

    await context.reset();

    await answerQuestionnaire();
    await rate(await buyBrightBag(), LOVED);
    const straight = await readProfile();

    expect(corrected.acidity).toBe(straight.acidity);
    expect(corrected.ratedBagCount).toBe(ONE);

    const ratings = listResponseSchema(bagRatingSchema).parse(
      (await api.get(`${API_ROUTES.bagRatings}?bagId=${bag.id}`, RETURNING_IDENTITY)).json(),
    );

    expect(ratings.items).toHaveLength(ONE);
  });

  it('refuses a rating of somebody else s bag', async () => {
    const bag = await buyBrightBag();

    const response = await api.put(API_ROUTES.bagRatings, SECOND_IDENTITY, {
      bagId: bag.id,
      stage: BAG_RATING_STAGES.finished,
      stars: LOVED,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });
});
