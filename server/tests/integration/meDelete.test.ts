import { API_ROUTES, deleteAccountResponseSchema, userSchema } from '@brewmate/shared';
import type { LightMyRequestResponse } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { HTTP_METHODS } from '../../src/constants/httpMethods.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { usersTable } from '../../src/db/schema/usersTable.js';
import { RETURNING_IDENTITY, SECOND_IDENTITY } from '../fixtures/testIdentities.js';
import { authorizationHeaderFor } from '../setup/authorizationHeader.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';

const NO_ROWS = 0;
const SINGLE_ROW = 1;

describe('DELETE /me', () => {
  let context: TestContext;

  const getMe = async (identity: VerifiedToken): Promise<LightMyRequestResponse> =>
    context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
      headers: authorizationHeaderFor(identity),
    });

  const deleteMe = async (identity: VerifiedToken): Promise<LightMyRequestResponse> =>
    context.app.inject({
      method: HTTP_METHODS.delete,
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

  it('removes the stored user', async () => {
    await getMe(RETURNING_IDENTITY);

    const response = await deleteMe(RETURNING_IDENTITY);

    expect(response.statusCode).toBe(HTTP_STATUS.ok);
    expect(deleteAccountResponseSchema.parse(response.json()).deletedAt).not.toBe('');

    const rows = await context.db.select().from(usersTable);

    expect(rows).toHaveLength(NO_ROWS);
  });

  it('removes the Firebase identity as well as the row', async () => {
    await getMe(RETURNING_IDENTITY);
    await deleteMe(RETURNING_IDENTITY);

    expect(context.identityDeleter.deleted).toEqual([RETURNING_IDENTITY.firebaseUid]);
  });

  it('leaves other accounts untouched', async () => {
    await getMe(RETURNING_IDENTITY);
    await getMe(SECOND_IDENTITY);
    await deleteMe(RETURNING_IDENTITY);

    const rows = await context.db.select().from(usersTable);

    expect(rows).toHaveLength(SINGLE_ROW);
    expect(rows[0]?.firebaseUid).toBe(SECOND_IDENTITY.firebaseUid);
  });

  it('succeeds even when the account was never provisioned', async () => {
    const response = await deleteMe(RETURNING_IDENTITY);

    expect(response.statusCode).toBe(HTTP_STATUS.ok);
    expect(context.identityDeleter.deleted).toEqual([RETURNING_IDENTITY.firebaseUid]);
  });

  it('provisions a brand new account when the same identity signs in again', async () => {
    const before = userSchema.parse((await getMe(RETURNING_IDENTITY)).json());

    await deleteMe(RETURNING_IDENTITY);

    const after = userSchema.parse((await getMe(RETURNING_IDENTITY)).json());

    expect(after.id).not.toBe(before.id);
    expect(after.displayName).toBeNull();
  });

  it('requires authentication', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.delete,
      url: API_ROUTES.me,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
