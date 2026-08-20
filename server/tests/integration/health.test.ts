import {
  API_ROUTES,
  DEPENDENCY_STATUS,
  HEALTH_STATUS,
  healthResponseSchema,
} from '@brewmate/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { HTTP_METHODS } from '../../src/constants/httpMethods.js';
import { HTTP_STATUS } from '../../src/constants/httpStatus.js';
import { createTestContext, type TestContext } from '../setup/createTestContext.js';

describe('GET /health', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContext();
  });

  afterAll(async () => {
    await context.close();
  });

  it('reports the service and its database as healthy', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.health,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.ok);

    const body = healthResponseSchema.parse(response.json());

    expect(body.status).toBe(HEALTH_STATUS.ok);
    expect(body.dependencies.database).toBe(DEPENDENCY_STATUS.up);
  });

  it('does not require authentication', async () => {
    const response = await context.app.inject({
      method: HTTP_METHODS.get,
      url: API_ROUTES.health,
    });

    expect(response.statusCode).not.toBe(HTTP_STATUS.unauthorized);
  });
});
