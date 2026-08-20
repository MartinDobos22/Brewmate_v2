import { API_ROUTES, userSchema } from '@brewmate/shared';
import type { LightMyRequestResponse } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_METHODS } from '../../src/constants/httpMethods.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { usersTable } from '../../src/db/schema/usersTable.js';
import {
  ANONYMOUS_IDENTITY,
  RETURNING_IDENTITY,
  SECOND_IDENTITY,
} from '../fixtures/testIdentities.js';
import { authorizationHeaderFor } from '../setup/authorizationHeader.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';

const SINGLE_ROW = 1;
const TWO_ROWS = 2;

describe('user auto-provisioning through GET /me', () => {
  let context: TestContext;

  const getMe = async (identity: VerifiedToken): Promise<LightMyRequestResponse> =>
    context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
      headers: authorizationHeaderFor(identity),
    });

  beforeAll(async () => {
    context = await createTestContext();
  });

  beforeEach(async () => {
    await context.reset();
  });

  afterAll(async () => {
    await context.close();
  });

  it('creates an internal user on the first authenticated request', async () => {
    const response = await getMe(RETURNING_IDENTITY);

    expect(response.statusCode).toBe(HTTP_STATUS.ok);

    const user = userSchema.parse(response.json());

    expect(user.firebaseUid).toBe(RETURNING_IDENTITY.firebaseUid);
    expect(user.email).toBe(RETURNING_IDENTITY.email);
    expect(user.displayName).toBeNull();

    const rows = await context.db.select().from(usersTable);

    expect(rows).toHaveLength(SINGLE_ROW);
  });

  it('reuses the same internal user on subsequent requests', async () => {
    const first = userSchema.parse((await getMe(RETURNING_IDENTITY)).json());
    const second = userSchema.parse((await getMe(RETURNING_IDENTITY)).json());

    expect(second.id).toBe(first.id);

    const rows = await context.db.select().from(usersTable);

    expect(rows).toHaveLength(SINGLE_ROW);
  });

  it('provisions a user whose Firebase identity carries no email', async () => {
    const user = userSchema.parse((await getMe(ANONYMOUS_IDENTITY)).json());

    expect(user.firebaseUid).toBe(ANONYMOUS_IDENTITY.firebaseUid);
    expect(user.email).toBeNull();
  });

  it('keeps separate users for separate Firebase identities', async () => {
    const first = userSchema.parse((await getMe(RETURNING_IDENTITY)).json());
    const second = userSchema.parse((await getMe(SECOND_IDENTITY)).json());

    expect(second.id).not.toBe(first.id);

    const rows = await context.db.select().from(usersTable);

    expect(rows).toHaveLength(TWO_ROWS);
  });

  it('backfills an email that was missing at first login', async () => {
    const beforeBackfill = userSchema.parse((await getMe(ANONYMOUS_IDENTITY)).json());

    expect(beforeBackfill.email).toBeNull();

    const afterBackfill = userSchema.parse(
      (
        await getMe({
          firebaseUid: ANONYMOUS_IDENTITY.firebaseUid,
          email: RETURNING_IDENTITY.email,
        })
      ).json(),
    );

    expect(afterBackfill.id).toBe(beforeBackfill.id);
    expect(afterBackfill.email).toBe(RETURNING_IDENTITY.email);
  });
});
