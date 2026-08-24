import {
  ACCOUNT_EXPORT_FORMAT_VERSION,
  ANALYTICS_EVENT_NAMES,
  API_ROUTES,
  TASTE_PROFILE_SOURCES,
  accountExportSchema,
  type AccountExport,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { createHistoryBag, createHistoryRecipe, logBrew } from '../fixtures/testHistory.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { insertTestBrewMethods } from '../fixtures/testBrewMethods.js';
import { TEST_GRINDER_EQUIPMENT } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NOTHING = 0;
const ONE = 1;
const HIGH_ACIDITY = 9;

describe('the account export', () => {
  let context: TestContext;
  let api: TestApi;
  let v60Id: string;

  const readExport = async (identity = RETURNING_IDENTITY): Promise<AccountExport> =>
    accountExportSchema.parse((await api.get(API_ROUTES.meExport, identity)).json());

  /** One of everything an account can own. */
  const fillAccount = async (): Promise<void> => {
    const bag = await createHistoryBag(api, RETURNING_IDENTITY);
    const recipe = await createHistoryRecipe(api, RETURNING_IDENTITY, v60Id, bag.id);

    await logBrew(api, RETURNING_IDENTITY, recipe.id);
    await api.post(API_ROUTES.equipment, RETURNING_IDENTITY, TEST_GRINDER_EQUIPMENT);
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    });
    await api.post(API_ROUTES.analyticsEvents, RETURNING_IDENTITY, {
      events: [
        {
          name: ANALYTICS_EVENT_NAMES.brewCompleted,
          occurredAt: new Date().toISOString(),
        },
      ],
    });
  };

  beforeAll(async () => {
    context = await createTestContext();
    api = createTestApi(context.app);
  });

  beforeEach(async () => {
    await context.reset();

    v60Id = (await insertTestBrewMethods(context.db)).v60.id;
  });

  afterAll(async () => {
    await context.close();
  });

  /**
   * An export is only an export if it is complete. Every user-owned table is
   * here, including the two nobody thinks of as theirs - the model usage
   * recorded against them and the events their phone sent.
   */
  it('carries every table this account owns', async () => {
    await fillAccount();

    const exported = await readExport();

    expect(exported.formatVersion).toBe(ACCOUNT_EXPORT_FORMAT_VERSION);
    expect(exported.account.email).toBe(RETURNING_IDENTITY.email);
    expect(exported.tasteProfile).not.toBeNull();
    expect(exported.tasteProfileEvents).toHaveLength(ONE);
    expect(exported.equipment).toHaveLength(ONE);
    expect(exported.coffeeBags).toHaveLength(ONE);
    expect(exported.recipes).toHaveLength(ONE);
    expect(exported.brewLogs).toHaveLength(ONE);
    expect(exported.analyticsEvents).toHaveLength(ONE);
  });

  it('answers an untouched account with an empty document rather than an error', async () => {
    const exported = await readExport();

    expect(exported.coffeeBags).toHaveLength(NOTHING);
    expect(exported.brewLogs).toHaveLength(NOTHING);
    expect(exported.analyticsEvents).toHaveLength(NOTHING);
  });

  /**
   * Export and deletion answer the same question about what this account is.
   * If the two lists ever disagreed, one of them would be lying.
   */
  it('describes exactly what deleting the account erases', async () => {
    await fillAccount();
    await api.remove(API_ROUTES.me, RETURNING_IDENTITY);

    const afterDeletion = await readExport();

    expect(afterDeletion.coffeeBags).toHaveLength(NOTHING);
    expect(afterDeletion.recipes).toHaveLength(NOTHING);
    expect(afterDeletion.brewLogs).toHaveLength(NOTHING);
    expect(afterDeletion.tasteProfileEvents).toHaveLength(NOTHING);
    expect(afterDeletion.analyticsEvents).toHaveLength(NOTHING);
  });

  it('never carries somebody else s rows', async () => {
    await fillAccount();

    const theirs = await readExport(SECOND_IDENTITY);

    expect(theirs.coffeeBags).toHaveLength(NOTHING);
    expect(theirs.recipes).toHaveLength(NOTHING);
    expect(theirs.account.email).toBe(SECOND_IDENTITY.email);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.meExport)).statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
