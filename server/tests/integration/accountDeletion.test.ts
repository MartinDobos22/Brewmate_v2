import {
  API_ROUTES,
  buildApiPath,
  CHAT_ROLES,
  coffeeBagSchema,
  GRINDER_TYPICAL_USES,
  GRINDER_UNIT_TYPES,
  recipeSchema,
  TASTE_PROFILE_SOURCES,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { brewLogsTable } from '../../src/db/schema/brewLogsTable.js';
import { coffeeBagsTable } from '../../src/db/schema/coffeeBagsTable.js';
import { equipmentTable } from '../../src/db/schema/equipmentTable.js';
import { grindersCatalogTable } from '../../src/db/schema/grindersCatalogTable.js';
import { recipeChatMessagesTable } from '../../src/db/schema/recipeChatMessagesTable.js';
import { recipesTable } from '../../src/db/schema/recipesTable.js';
import { tasteProfileEventsTable } from '../../src/db/schema/tasteProfileEventsTable.js';
import { tasteProfilesTable } from '../../src/db/schema/tasteProfilesTable.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import {
  TEST_BAG_NAME,
  TEST_BREW_PARAMS,
  TEST_GRINDER_EQUIPMENT,
} from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NO_ROWS = 0;
const SINGLE_ROW = 1;
const GRINDER_MIN_SETTING = 0;
const GRINDER_MAX_SETTING = 10;
const GRINDER_STEP = 0.5;

const CONTRIBUTED_GRINDER = {
  brand: 'Kinu',
  model: 'M47',
  unitType: GRINDER_UNIT_TYPES.numbers,
  minSetting: GRINDER_MIN_SETTING,
  maxSetting: GRINDER_MAX_SETTING,
  step: GRINDER_STEP,
  typicalUse: GRINDER_TYPICAL_USES.both,
};

describe('DELETE /me erases the whole account', () => {
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
   * Everything a user owns cascades from `users`, which is what makes the
   * promise in `DELETE /me` true rather than aspirational.
   */
  it('takes every row the user owned with it', async () => {
    const methodId = (await insertTestBrewMethods(context.db)).v60.id;

    const bag = coffeeBagSchema.parse(
      (await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name: TEST_BAG_NAME })).json(),
    );
    const recipe = recipeSchema.parse(
      (
        await api.post(API_ROUTES.recipes, RETURNING_IDENTITY, {
          bagId: bag.id,
          methodId,
          params: TEST_BREW_PARAMS,
        })
      ).json(),
    );

    await api.post(API_ROUTES.equipment, RETURNING_IDENTITY, TEST_GRINDER_EQUIPMENT);
    await api.post(API_ROUTES.brewLogs, RETURNING_IDENTITY, { recipeId: recipe.id });
    await api.post(buildApiPath(API_ROUTES.recipeMessages, { id: recipe.id }), RETURNING_IDENTITY, {
      role: CHAT_ROLES.user,
      content: 'Ako to zlepsim?',
    });
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: {} },
    });

    expect((await api.remove(API_ROUTES.me, RETURNING_IDENTITY)).statusCode).toBe(HTTP_STATUS.ok);

    expect(await context.db.select().from(coffeeBagsTable)).toHaveLength(NO_ROWS);
    expect(await context.db.select().from(recipesTable)).toHaveLength(NO_ROWS);
    expect(await context.db.select().from(brewLogsTable)).toHaveLength(NO_ROWS);
    expect(await context.db.select().from(equipmentTable)).toHaveLength(NO_ROWS);
    expect(await context.db.select().from(recipeChatMessagesTable)).toHaveLength(NO_ROWS);
    expect(await context.db.select().from(tasteProfilesTable)).toHaveLength(NO_ROWS);
    expect(await context.db.select().from(tasteProfileEventsTable)).toHaveLength(NO_ROWS);
  });

  /**
   * The one thing that stays: a catalogue entry is shared data other people's
   * equipment points at, so only the attribution goes.
   */
  it('leaves a contributed catalogue entry behind, without its author', async () => {
    await api.post(API_ROUTES.grinders, RETURNING_IDENTITY, CONTRIBUTED_GRINDER);

    await api.remove(API_ROUTES.me, RETURNING_IDENTITY);

    const catalogue = await context.db.select().from(grindersCatalogTable);

    expect(catalogue).toHaveLength(SINGLE_ROW);
    expect(catalogue[0]?.createdByUserId).toBeNull();
  });

  it('leaves other accounts untouched', async () => {
    await api.post(API_ROUTES.coffeeBags, RETURNING_IDENTITY, { name: TEST_BAG_NAME });
    await api.post(API_ROUTES.coffeeBags, SECOND_IDENTITY, { name: TEST_BAG_NAME });

    await api.remove(API_ROUTES.me, RETURNING_IDENTITY);

    const remaining = await context.db.select().from(coffeeBagsTable);

    expect(remaining).toHaveLength(SINGLE_ROW);
  });
});
