import { API_ROUTES, buildApiPath, equipmentSchema, listResponseSchema } from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { TEST_GRINDER_EQUIPMENT, TEST_KETTLE_EQUIPMENT } from '../fixtures/testPayloads.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestApi, type TestApi } from '../setup/testApi.js';

const NEW_MODEL = 'C40 MK4';
const SINGLE_ITEM = 1;
const NO_ITEMS = 0;

describe('equipment', () => {
  let context: TestContext;
  let api: TestApi;

  const createGrinder = async (): Promise<string> =>
    equipmentSchema.parse(
      (await api.post(API_ROUTES.equipment, RETURNING_IDENTITY, TEST_GRINDER_EQUIPMENT)).json(),
    ).id;

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

  it('creates equipment owned by the caller', async () => {
    const response = await api.post(
      API_ROUTES.equipment,
      RETURNING_IDENTITY,
      TEST_GRINDER_EQUIPMENT,
    );

    expect(response.statusCode).toBe(HTTP_STATUS.created);

    const created = equipmentSchema.parse(response.json());

    expect(created.type).toBe(TEST_GRINDER_EQUIPMENT.type);
    expect(created.isActive).toBe(true);
  });

  it('lists only the callers own equipment', async () => {
    await createGrinder();
    await api.post(API_ROUTES.equipment, SECOND_IDENTITY, TEST_KETTLE_EQUIPMENT);

    const mine = listResponseSchema(equipmentSchema).parse(
      (await api.get(API_ROUTES.equipment, RETURNING_IDENTITY)).json(),
    );

    expect(mine.items).toHaveLength(SINGLE_ITEM);
    expect(mine.items[0]?.type).toBe(TEST_GRINDER_EQUIPMENT.type);
    expect(mine.hasMore).toBe(false);
  });

  it('hides another account s equipment behind the same 404 as a missing row', async () => {
    const id = await createGrinder();

    const foreign = await api.get(buildApiPath(API_ROUTES.equipmentById, { id }), SECOND_IDENTITY);

    expect(foreign.statusCode).toBe(HTTP_STATUS.notFound);
  });

  it('updates equipment the caller owns', async () => {
    const id = await createGrinder();

    const response = await api.patch(
      buildApiPath(API_ROUTES.equipmentById, { id }),
      RETURNING_IDENTITY,
      {
        model: NEW_MODEL,
      },
    );

    expect(equipmentSchema.parse(response.json()).model).toBe(NEW_MODEL);
  });

  it('refuses to update equipment belonging to somebody else', async () => {
    const id = await createGrinder();

    const response = await api.patch(
      buildApiPath(API_ROUTES.equipmentById, { id }),
      SECOND_IDENTITY,
      {
        model: NEW_MODEL,
      },
    );

    expect(response.statusCode).toBe(HTTP_STATUS.notFound);

    const unchanged = equipmentSchema.parse(
      (await api.get(buildApiPath(API_ROUTES.equipmentById, { id }), RETURNING_IDENTITY)).json(),
    );

    expect(unchanged.model).toBe(TEST_GRINDER_EQUIPMENT.model);
  });

  it('deletes equipment the caller owns', async () => {
    const id = await createGrinder();

    expect(
      (await api.remove(buildApiPath(API_ROUTES.equipmentById, { id }), RETURNING_IDENTITY))
        .statusCode,
    ).toBe(HTTP_STATUS.ok);

    const remaining = listResponseSchema(equipmentSchema).parse(
      (await api.get(API_ROUTES.equipment, RETURNING_IDENTITY)).json(),
    );

    expect(remaining.items).toHaveLength(NO_ITEMS);
  });

  it('requires authentication', async () => {
    expect((await api.anonymousGet(API_ROUTES.equipment)).statusCode).toBe(
      HTTP_STATUS.unauthorized,
    );
  });
});
