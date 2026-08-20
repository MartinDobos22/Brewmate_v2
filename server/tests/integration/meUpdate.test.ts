import { API_ROUTES, ERROR_CODES, errorResponseSchema, userSchema } from '@brewmate/shared';
import type { LightMyRequestResponse } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_METHODS } from '../../src/constants/httpMethods.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import {
  NEW_DISPLAY_NAME,
  RETURNING_IDENTITY,
  TOO_SHORT_DISPLAY_NAME,
  UNKNOWN_FIELD_NAME,
  UNKNOWN_FIELD_VALUE,
} from '../fixtures/testIdentities.js';
import { authorizationHeaderFor } from '../setup/authorizationHeader.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';

type PatchPayload = Record<string, unknown>;

const EMPTY_PATCH: PatchPayload = {};

describe('PATCH /me', () => {
  let context: TestContext;

  const patchMe = async (payload: PatchPayload): Promise<LightMyRequestResponse> =>
    context.app.inject({
      method: HTTP_METHODS.patch,
      url: API_ROUTES.me,
      headers: authorizationHeaderFor(RETURNING_IDENTITY),
      payload,
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

  it('updates the display name of the authenticated user', async () => {
    const response = await patchMe({ displayName: NEW_DISPLAY_NAME });

    expect(response.statusCode).toBe(HTTP_STATUS.ok);

    const user = userSchema.parse(response.json());

    expect(user.displayName).toBe(NEW_DISPLAY_NAME);
    expect(user.firebaseUid).toBe(RETURNING_IDENTITY.firebaseUid);
  });

  it('persists the update across requests', async () => {
    await patchMe({ displayName: NEW_DISPLAY_NAME });

    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
      headers: authorizationHeaderFor(RETURNING_IDENTITY),
    });

    expect(userSchema.parse(response.json()).displayName).toBe(NEW_DISPLAY_NAME);
  });

  it('clears the display name when null is sent', async () => {
    await patchMe({ displayName: NEW_DISPLAY_NAME });

    const response = await patchMe({ displayName: null });

    expect(userSchema.parse(response.json()).displayName).toBeNull();
  });

  it('leaves the user untouched for an empty patch', async () => {
    const created = userSchema.parse((await patchMe({ displayName: NEW_DISPLAY_NAME })).json());
    const response = await patchMe(EMPTY_PATCH);

    expect(response.statusCode).toBe(HTTP_STATUS.ok);

    const unchanged = userSchema.parse(response.json());

    expect(unchanged.id).toBe(created.id);
    expect(unchanged.displayName).toBe(NEW_DISPLAY_NAME);
  });

  it('rejects a display name shorter than the contract allows', async () => {
    const response = await patchMe({ displayName: TOO_SHORT_DISPLAY_NAME });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
    expect(errorResponseSchema.parse(response.json()).error.code).toBe(
      ERROR_CODES.validationFailed,
    );
  });

  it('rejects fields that are not part of the contract', async () => {
    const response = await patchMe({ [UNKNOWN_FIELD_NAME]: UNKNOWN_FIELD_VALUE });

    expect(response.statusCode).toBe(HTTP_STATUS.unprocessableEntity);
    expect(errorResponseSchema.parse(response.json()).error.code).toBe(
      ERROR_CODES.validationFailed,
    );
  });

  it('requires authentication', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.patch,
      url: API_ROUTES.me,
      payload: { displayName: NEW_DISPLAY_NAME },
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unauthorized);
  });
});
