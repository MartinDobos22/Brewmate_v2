import {
  API_ROUTES,
  listResponseSchema,
  TASTE_AXIS_NEUTRAL,
  TASTE_PROFILE_SOURCES,
  tasteProfileEventSchema,
  tasteProfileSchema,
} from '@brewmate/shared';
import type { TasteProfile } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const HIGH_ACIDITY = 9;
const LOW_BITTERNESS = 2;
const FULL_WEIGHT = 1;
const CONSTRAINED_WEIGHT = 0.3;
const NO_CONFIDENCE = 0;
const SINGLE_EVENT = 1;
const QUESTIONNAIRE_REF = 'onboarding-questionnaire-v1';

describe('taste profile', () => {
  let context: TestContext;
  let api: TestApi;

  const readProfile = async (): Promise<TasteProfile> =>
    tasteProfileSchema.parse((await api.get(API_ROUTES.tasteProfile, RETURNING_IDENTITY)).json());

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

  /** Knowing nothing is a state, not a failure. */
  it('starts neutral, with no confidence at all', async () => {
    const profile = await readProfile();

    expect(profile.acidity).toBe(TASTE_AXIS_NEUTRAL);
    expect(profile.confidenceLevel).toBe(NO_CONFIDENCE);
    expect(profile.brewCount).toBe(NO_CONFIDENCE);
  });

  it('moves the profile towards what an event observed', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY, bitterness: LOW_BITTERNESS } },
    });

    const profile = await readProfile();

    expect(profile.acidity).toBeGreaterThan(TASTE_AXIS_NEUTRAL);
    expect(profile.bitterness).toBeLessThan(TASTE_AXIS_NEUTRAL);
    expect(profile.confidenceLevel).toBeGreaterThan(NO_CONFIDENCE);
  });

  it('records what the reducer did with each event', async () => {
    const response = await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    });

    const event = tasteProfileEventSchema.parse(response.json());

    expect(event.appliedDelta).not.toBeNull();
    expect(event.appliedDelta?.axes.acidity).toBeGreaterThan(NO_CONFIDENCE);
  });

  /** A manual correction is the user overruling us, and it lands in full. */
  it('trusts a manual correction more than a remark in chat', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.brewChat,
      payload: { axes: { acidity: HIGH_ACIDITY } },
      sourceRef: 'chat-1',
    });

    const afterChat = await readProfile();

    await context.reset();

    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.manual,
      payload: { axes: { acidity: HIGH_ACIDITY } },
      sourceRef: 'manual-1',
    });

    const afterManual = await readProfile();

    expect(afterManual.acidity).toBeGreaterThan(afterChat.acidity);
  });

  /**
   * The whole reason `source_ref` exists: a questionnaire submitted twice on a
   * flaky connection must not count its answers twice.
   */
  it('counts a repeated submission once', async () => {
    const body = {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      sourceRef: QUESTIONNAIRE_REF,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    };

    const first = tasteProfileEventSchema.parse(
      (await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, body)).json(),
    );
    const afterFirst = await readProfile();

    const second = tasteProfileEventSchema.parse(
      (await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, body)).json(),
    );
    const afterSecond = await readProfile();

    expect(second.id).toBe(first.id);
    expect(afterSecond.acidity).toBe(afterFirst.acidity);
    expect(afterSecond.confidenceLevel).toBe(afterFirst.confidenceLevel);

    const events = listResponseSchema(tasteProfileEventSchema).parse(
      (await api.get(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY)).json(),
    );

    expect(events.items).toHaveLength(SINGLE_EVENT);
  });

  /** The profile is a projection: replaying the trail has to reproduce it. */
  it('rebuilds exactly the same profile from its events', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY, bitterness: LOW_BITTERNESS } },
    });
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.calibrationBrew,
      payload: { axes: { body: HIGH_ACIDITY }, flavorAffinities: { jasmine: 1 } },
    });

    const before = await readProfile();

    const recomputed = tasteProfileSchema.parse(
      (await api.post(API_ROUTES.tasteProfileRecompute, RETURNING_IDENTITY, {})).json(),
    );

    expect(recomputed.acidity).toBe(before.acidity);
    expect(recomputed.bitterness).toBe(before.bitterness);
    expect(recomputed.body).toBe(before.body);
    expect(recomputed.flavorAffinities).toEqual(before.flavorAffinities);
    expect(recomputed.confidenceLevel).toBe(before.confidenceLevel);
    expect(recomputed.brewCount).toBe(before.brewCount);
  });

  /**
   * Running the fold again must change nothing. It is the invariant the whole
   * append-only trail exists for: the profile is always exactly what its
   * events say, so a second replay cannot drift from the first.
   */
  it('changes nothing when the fold is run a second time', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY, bitterness: LOW_BITTERNESS } },
    });
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.brewChat,
      payload: { axes: { body: HIGH_ACIDITY }, weight: CONSTRAINED_WEIGHT },
      sourceRef: 'chat-weighted',
    });

    const once = tasteProfileSchema.parse(
      (await api.post(API_ROUTES.tasteProfileRecompute, RETURNING_IDENTITY, {})).json(),
    );
    const twice = tasteProfileSchema.parse(
      (await api.post(API_ROUTES.tasteProfileRecompute, RETURNING_IDENTITY, {})).json(),
    );

    expect(twice.acidity).toBe(once.acidity);
    expect(twice.bitterness).toBe(once.bitterness);
    expect(twice.body).toBe(once.body);
    expect(twice.confidenceLevel).toBe(once.confidenceLevel);
    expect(twice.brewCount).toBe(once.brewCount);
    expect(twice.sourceWeights).toEqual(once.sourceWeights);
  });

  /**
   * The weight a brew log was priced at travels on the event and the fold
   * respects it. Somebody complaining that a cup was flat when they had no way
   * to weigh anything is describing their kitchen, not their taste - and this
   * is the arithmetic that makes that true rather than merely intended.
   */
  it('lets a cup brewed with nothing to hand teach the profile less', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.brewChat,
      payload: { axes: { acidity: HIGH_ACIDITY }, weight: CONSTRAINED_WEIGHT },
      sourceRef: 'constrained-brew',
    });

    const constrained = await readProfile();

    await context.reset();

    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.brewChat,
      payload: { axes: { acidity: HIGH_ACIDITY }, weight: FULL_WEIGHT },
      sourceRef: 'measured-brew',
    });

    const measured = await readProfile();

    expect(constrained.acidity).toBeLessThan(measured.acidity);
    expect(constrained.confidenceLevel).toBeLessThan(measured.confidenceLevel);
  });

  it('counts brews, not questionnaires, as brews', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: {} },
    });
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.calibrationBrew,
      payload: { axes: {} },
    });

    expect((await readProfile()).brewCount).toBe(SINGLE_EVENT);
  });

  it('shows where the evidence came from', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    });

    const profile = await readProfile();

    expect(profile.sourceWeights[TASTE_PROFILE_SOURCES.questionnaire]).toBeGreaterThan(
      NO_CONFIDENCE,
    );
  });

  it('keeps one account s profile out of another s', async () => {
    await api.post(API_ROUTES.tasteProfileEvents, RETURNING_IDENTITY, {
      source: TASTE_PROFILE_SOURCES.questionnaire,
      payload: { axes: { acidity: HIGH_ACIDITY } },
    });

    const theirs = tasteProfileSchema.parse(
      (await api.get(API_ROUTES.tasteProfile, SECOND_IDENTITY)).json(),
    );

    expect(theirs.acidity).toBe(TASTE_AXIS_NEUTRAL);
    expect(theirs.confidenceLevel).toBe(NO_CONFIDENCE);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.tasteProfile)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
