import {
  API_ROUTES,
  buildApiPath,
  recipeTimelineSchema,
  type RecipeTimeline,
  type RecipeTimelineEntry,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { createHistoryBag, createHistoryRecipe, logBrew } from '../fixtures/testHistory.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const FIRST = 0;
const SECOND = 1;
const TWO_VERSIONS = 2;
const NOTHING = 0;
const CHAT_MESSAGE = 'Bola príliš kyslá.';

const METHOD_QUERY = '?methodId=';
const BAG_QUERY = '&bagId=';

describe('the recipe timeline', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;
  let aeropressId: string;

  const timelineUrl = (methodId: string, bagId?: string): string =>
    `${API_ROUTES.historyTimeline}${METHOD_QUERY}${methodId}${bagId === undefined ? '' : `${BAG_QUERY}${bagId}`}`;

  const readTimeline = async (methodId: string, bagId?: string): Promise<RecipeTimeline> =>
    recipeTimelineSchema.parse(
      (await api.get(timelineUrl(methodId, bagId), RETURNING_IDENTITY)).json(),
    );

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    const methods = await insertTestBrewMethods(context.db);

    v60Id = methods.v60.id;
    aeropressId = methods.aeropress.id;
  });

  afterAll(async () => {
    await context.close();
  });

  it('is empty for a pair nobody has brewed', async () => {
    const timeline = await readTimeline(v60Id);

    expect(timeline.methodId).toBe(v60Id);
    expect(timeline.bagId).toBeNull();
    expect(timeline.entries).toHaveLength(NOTHING);
  });

  /** Read as a story, so it starts at the beginning. */
  it('reads oldest version first', async () => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);
    const first = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);
    const second = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id, first.id);

    const timeline = await readTimeline(v60Id, bag.id);

    expect(timeline.entries).toHaveLength(TWO_VERSIONS);
    expect(timeline.entries[FIRST]?.recipe.id).toBe(first.id);
    expect(timeline.entries[SECOND]?.recipe.id).toBe(second.id);
    expect(timeline.entries[SECOND]?.recipe.parentRecipeId).toBe(first.id);
  });

  it('hangs the cups and the notes off the version they belong to', async () => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);
    const recipe = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);

    await logBrew(api, RETURNING_IDENTITY, recipe.id);
    await api.post(buildApiPath(API_ROUTES.recipeMessages, { id: recipe.id }), RETURNING_IDENTITY, {
      role: 'user',
      content: CHAT_MESSAGE,
    });

    const entry = (await readTimeline(v60Id, bag.id)).entries[FIRST];

    expect(entry?.brewCount).toBe(SECOND);
    expect(entry?.messageCount).toBe(SECOND);
    expect(entry?.messages.at(FIRST)?.content).toBe(CHAT_MESSAGE);
  });

  /**
   * The badge this feature exists for. Read from the cup rather than from the
   * recipe: what a recipe was written around and what was missing on the
   * morning somebody brewed it are different facts.
   */
  it('marks a version whose cup was brewed with something missing', async () => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);
    const plain = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);
    const constrained = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id, plain.id);

    await logBrew(api, RETURNING_IDENTITY, plain.id);
    await logBrew(api, RETURNING_IDENTITY, constrained.id, { noScale: true });

    const entries = (await readTimeline(v60Id, bag.id)).entries;
    const marked = entries.find((entry: RecipeTimelineEntry): boolean => entry.hasConstrainedBrew);

    expect(marked?.recipe.id).toBe(constrained.id);
    expect(
      entries.filter((entry: RecipeTimelineEntry): boolean => entry.hasConstrainedBrew),
    ).toHaveLength(SECOND);
  });

  /** A recipe belongs to the pair, so another method's line is another line. */
  it('keeps one method s line out of another s', async () => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);

    await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);

    expect((await readTimeline(aeropressId, bag.id)).entries).toHaveLength(NOTHING);
  });

  /** An absent bag is the quick-brew line, not "any bag". */
  it('keeps the bagless line separate from a bag s', async () => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);

    await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);

    const quickBrew = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, null);
    const bagless = await readTimeline(v60Id);

    expect(bagless.entries).toHaveLength(SECOND);
    expect(bagless.entries[FIRST]?.recipe.id).toBe(quickBrew.id);
  });

  /** The same 404 as a bag that does not exist: not an oracle for other ids. */
  it('refuses a bag belonging to somebody else', async () => {
    const theirs = await createHistoryBag(api, SECOND_IDENTITY);

    const response = await api.get(timelineUrl(v60Id, theirs.id), RETURNING_IDENTITY);

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(timelineUrl(v60Id))).statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
