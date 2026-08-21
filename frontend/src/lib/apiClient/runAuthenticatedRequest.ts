import { HTTP_STATUS, type HttpMethod } from '../../constants/http';

import type { AuthTokenProvider } from './authTokenProvider';
import { buildRequestHeaders } from './buildRequestHeaders';
import { runRequest } from './runRequest';

const USE_CACHED_TOKEN = false;
const FORCE_TOKEN_REFRESH = true;

export interface AuthenticatedRequestOptions {
  readonly url: string;
  readonly method: HttpMethod;
  readonly body: unknown;
  readonly timeoutMs: number;
  readonly getAuthToken: AuthTokenProvider;
}

/**
 * Sends one request with the caller's ID token and, if the API rejects that
 * token, mints a fresh one and sends the request again exactly once.
 *
 * Firebase renews an ID token on its own shortly before it expires, so the
 * retry only matters for the cases it cannot predict: a token revoked on the
 * server, or a device whose clock made the cached token look valid.
 */
export const runAuthenticatedRequest = async ({
  url,
  method,
  body,
  timeoutMs,
  getAuthToken,
}: AuthenticatedRequestOptions): Promise<Response> => {
  const token = await getAuthToken(USE_CACHED_TOKEN);
  const response = await runRequest({
    url,
    method,
    body,
    headers: buildRequestHeaders(token),
    timeoutMs,
  });

  if (response.status !== HTTP_STATUS.unauthorized || token === null) {
    return response;
  }

  const refreshedToken = await getAuthToken(FORCE_TOKEN_REFRESH);

  if (refreshedToken === null || refreshedToken === token) {
    return response;
  }

  return runRequest({
    url,
    method,
    body,
    headers: buildRequestHeaders(refreshedToken),
    timeoutMs,
  });
};
