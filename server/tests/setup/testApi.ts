import type { FastifyInstance, InjectOptions, LightMyRequestResponse } from 'fastify';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { HTTP_METHODS } from '../../src/constants/httpMethods.js';

import { authorizationHeaderFor } from './authorizationHeader.js';

type RequestPayload = InjectOptions['payload'];

export interface TestApi {
  get(url: string, identity: VerifiedToken): Promise<LightMyRequestResponse>;
  post(
    url: string,
    identity: VerifiedToken,
    payload: RequestPayload,
  ): Promise<LightMyRequestResponse>;
  patch(
    url: string,
    identity: VerifiedToken,
    payload: RequestPayload,
  ): Promise<LightMyRequestResponse>;
  remove(url: string, identity: VerifiedToken): Promise<LightMyRequestResponse>;
  /** Without an Authorization header, to prove a route refuses anonymous callers. */
  anonymousGet(url: string): Promise<LightMyRequestResponse>;
}

const inject = async (
  app: FastifyInstance,
  options: InjectOptions,
): Promise<LightMyRequestResponse> => app.inject(options);

/** Cuts the `app.inject` boilerplate out of every test. */
export const createTestApi = (app: FastifyInstance): TestApi => ({
  get: async (url, identity) =>
    inject(app, { method: HTTP_METHODS.get, url, headers: authorizationHeaderFor(identity) }),

  post: async (url, identity, payload) =>
    inject(app, {
      method: HTTP_METHODS.post,
      url,
      headers: authorizationHeaderFor(identity),
      payload,
    }),

  patch: async (url, identity, payload) =>
    inject(app, {
      method: HTTP_METHODS.patch,
      url,
      headers: authorizationHeaderFor(identity),
      payload,
    }),

  remove: async (url, identity) =>
    inject(app, { method: HTTP_METHODS.delete, url, headers: authorizationHeaderFor(identity) }),

  anonymousGet: async (url) => inject(app, { method: HTTP_METHODS.get, url }),
});
