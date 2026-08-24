import {
  ANALYTICS_BATCH_MAX,
  ANALYTICS_EVENT_NAMES,
  API_ROUTES,
  accountExportSchema,
  createAnalyticsEventsResponseSchema,
  type AnalyticsEvent,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NOTHING = 0;
const TWO = 2;
const OVER_THE_BATCH = ANALYTICS_BATCH_MAX + 1;
const YESTERDAY_MS = 86400000;
const METHOD_KEY = 'v60';
const TYPED_SENTENCE = 'Bola príliš kyslá a chcem ju sladšiu.';

describe('analytics events', () => {
  let context: TestContext;
  let api: TestApi;

  const event = (overrides: Partial<AnalyticsEvent> = {}): AnalyticsEvent => ({
    name: ANALYTICS_EVENT_NAMES.brewStarted,
    occurredAt: new Date().toISOString(),
    ...overrides,
  });

  const send = async (
    events: readonly AnalyticsEvent[],
    identity = RETURNING_IDENTITY,
  ): Promise<number> =>
    createAnalyticsEventsResponseSchema.parse(
      (await api.post(API_ROUTES.analyticsEvents, identity, { events })).json(),
    ).accepted;

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

  it('records a whole flushed batch', async () => {
    const accepted = await send([
      event(),
      event({ name: ANALYTICS_EVENT_NAMES.brewCompleted, properties: { method: METHOD_KEY } }),
    ]);

    expect(accepted).toBe(TWO);
  });

  /**
   * The phone's clock, kept as the phone reported it. Stamping on arrival
   * would report a morning's brewing as having happened all at once that
   * evening.
   */
  it('keeps the time the phone said it happened', async () => {
    const occurredAt = new Date(Date.now() - YESTERDAY_MS).toISOString();

    await send([event({ occurredAt })]);

    const exported = accountExportSchema.parse(
      (await api.get(API_ROUTES.meExport, RETURNING_IDENTITY)).json(),
    );

    expect(new Date(exported.analyticsEvents[NOTHING]?.occurredAt ?? '').toISOString()).toBe(
      occurredAt,
    );
  });

  it('refuses a batch larger than the contract allows', async () => {
    const response = await api.post(API_ROUTES.analyticsEvents, RETURNING_IDENTITY, {
      events: Array.from({ length: OVER_THE_BATCH }, () => event()),
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  it('refuses a name the contract does not know', async () => {
    const response = await api.post(API_ROUTES.analyticsEvents, RETURNING_IDENTITY, {
      events: [{ name: 'made_up_event', occurredAt: new Date().toISOString() }],
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  /**
   * The one rule worth enforcing at the edge: anything somebody typed belongs
   * to them, and a property long enough to hold a sentence is a property that
   * will eventually hold one.
   */
  it('refuses a property long enough to be free text', async () => {
    const response = await api.post(API_ROUTES.analyticsEvents, RETURNING_IDENTITY, {
      events: [event({ properties: { note: TYPED_SENTENCE.repeat(TWO) } })],
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
  });

  it('files events against the caller rather than against a body', async () => {
    await send([event()], SECOND_IDENTITY);

    const mine = accountExportSchema.parse(
      (await api.get(API_ROUTES.meExport, RETURNING_IDENTITY)).json(),
    );

    expect(mine.analyticsEvents).toHaveLength(NOTHING);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.analyticsEvents)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
