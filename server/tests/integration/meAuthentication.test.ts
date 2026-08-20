import {
  API_ROUTES,
  AUTH_HEADER_SEPARATOR,
  AUTH_SCHEME_BEARER,
  ERROR_CODES,
  HTTP_HEADERS,
  errorResponseSchema,
} from '@brewmate/shared';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { HTTP_METHODS } from '../../src/constants/httpMethods.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { FORGED_ID_TOKEN, RETURNING_IDENTITY } from '../fixtures/testIdentities.js';
import { authorizationHeaderFor } from '../setup/authorizationHeader.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';
import { createTestIdToken } from '../setup/testIdToken.js';

const WRONG_SCHEME = 'Basic';

describe('GET /me authentication', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContext();
  });

  beforeEach(async () => {
    await context.reset();
  });

  afterAll(async () => {
    await context.close();
  });

  it('rejects a request without an Authorization header', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unauthorized);

    const body = errorResponseSchema.parse(response.json());

    expect(body.error.code).toBe(ERROR_CODES.unauthorized);
    expect(body.requestId).not.toBe('');
  });

  it('rejects an Authorization header that does not use the Bearer scheme', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
      headers: {
        [HTTP_HEADERS.authorization]: [WRONG_SCHEME, createTestIdToken(RETURNING_IDENTITY)].join(
          AUTH_HEADER_SEPARATOR,
        ),
      },
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unauthorized);
    expect(errorResponseSchema.parse(response.json()).error.code).toBe(ERROR_CODES.unauthorized);
  });

  it('rejects a token the verifier cannot validate', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
      headers: {
        [HTTP_HEADERS.authorization]: [AUTH_SCHEME_BEARER, FORGED_ID_TOKEN].join(
          AUTH_HEADER_SEPARATOR,
        ),
      },
    });

    expect(response.statusCode).toBe(HTTP_STATUS.unauthorized);
    expect(errorResponseSchema.parse(response.json()).error.code).toBe(ERROR_CODES.unauthorized);
  });

  it('accepts a valid token', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.me,
      headers: authorizationHeaderFor(RETURNING_IDENTITY),
    });

    expect(response.statusCode).toBe(HTTP_STATUS.ok);
  });
});
