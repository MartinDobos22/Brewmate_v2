import {
  API_ROUTES,
  buildApiPath,
  equipmentSchema,
  equipmentSetSchema,
  listResponseSchema,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import {
  OTHER_SET_NAME,
  TEST_GRINDER_EQUIPMENT,
  TEST_KETTLE_EQUIPMENT,
  TEST_SET_NAME,
} from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NO_ITEMS = 0;
const SINGLE_ITEM = 1;

describe('equipment sets', () => {
  let context: TestContext;
  let api: TestApi;

  const createEquipment = async (
    identity: VerifiedToken,
    payload: typeof TEST_GRINDER_EQUIPMENT,
  ): Promise<string> =>
    equipmentSchema.parse((await api.post(API_ROUTES.equipment, identity, payload)).json()).id;

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

  it('saves a named combination of gear the caller already owns', async () => {
    const grinderId = await createEquipment(RETURNING_IDENTITY, TEST_GRINDER_EQUIPMENT);
    const kettleId = await createEquipment(RETURNING_IDENTITY, TEST_KETTLE_EQUIPMENT);

    const response = await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
      name: TEST_SET_NAME,
      equipmentIds: [grinderId, kettleId],
    });

    expect(response.statusCode).toBe(HTTP_STATUS.created);
    expect(equipmentSetSchema.parse(response.json()).equipmentIds).toEqual([grinderId, kettleId]);
  });

  /** The jsonb array has no foreign key, so this rule only exists in the service. */
  it('refuses a set naming equipment that belongs to somebody else', async () => {
    const foreignId = await createEquipment(SECOND_IDENTITY, TEST_GRINDER_EQUIPMENT);

    const response = await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
      name: TEST_SET_NAME,
      equipmentIds: [foreignId],
    });

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
  });

  it('refuses a set naming equipment that does not exist', async () => {
    const response = await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
      name: TEST_SET_NAME,
      equipmentIds: [crypto.randomUUID()],
    });

    expect(response.statusCode).toBe(HTTP_STATUS.badRequest);
  });

  it('keeps at most one default set per account', async () => {
    const first = equipmentSetSchema.parse(
      (
        await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
          name: TEST_SET_NAME,
          equipmentIds: [],
          isDefault: true,
        })
      ).json(),
    );

    const second = equipmentSetSchema.parse(
      (
        await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
          name: OTHER_SET_NAME,
          equipmentIds: [],
          isDefault: true,
        })
      ).json(),
    );

    expect(second.isDefault).toBe(true);

    const reloadedFirst = equipmentSetSchema.parse(
      (
        await api.get(
          buildApiPath(API_ROUTES.equipmentSetById, { id: first.id }),
          RETURNING_IDENTITY,
        )
      ).json(),
    );

    expect(reloadedFirst.isDefault).toBe(false);
  });

  /** Deleting gear must not leave a set pointing at something that is gone. */
  it('prunes deleted equipment out of the sets that named it', async () => {
    const grinderId = await createEquipment(RETURNING_IDENTITY, TEST_GRINDER_EQUIPMENT);
    const kettleId = await createEquipment(RETURNING_IDENTITY, TEST_KETTLE_EQUIPMENT);

    const set = equipmentSetSchema.parse(
      (
        await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
          name: TEST_SET_NAME,
          equipmentIds: [grinderId, kettleId],
        })
      ).json(),
    );

    await api.remove(buildApiPath(API_ROUTES.equipmentById, { id: grinderId }), RETURNING_IDENTITY);

    const reloaded = equipmentSetSchema.parse(
      (
        await api.get(buildApiPath(API_ROUTES.equipmentSetById, { id: set.id }), RETURNING_IDENTITY)
      ).json(),
    );

    expect(reloaded.equipmentIds).toEqual([kettleId]);
  });

  it('lists only the caller s own sets', async () => {
    await api.post(API_ROUTES.equipmentSets, SECOND_IDENTITY, {
      name: TEST_SET_NAME,
      equipmentIds: [],
    });

    const mine = listResponseSchema(equipmentSetSchema).parse(
      (await api.get(API_ROUTES.equipmentSets, RETURNING_IDENTITY)).json(),
    );

    expect(mine.items).toHaveLength(NO_ITEMS);

    await api.post(API_ROUTES.equipmentSets, RETURNING_IDENTITY, {
      name: OTHER_SET_NAME,
      equipmentIds: [],
    });

    const updated = listResponseSchema(equipmentSetSchema).parse(
      (await api.get(API_ROUTES.equipmentSets, RETURNING_IDENTITY)).json(),
    );

    expect(updated.items).toHaveLength(SINGLE_ITEM);
  });
});
