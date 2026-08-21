import type { ZodType } from 'zod';

import { HTTP_METHODS, HTTP_STATUS, type HttpMethod } from '../../constants/http';
import { LIMITS } from '../../constants/limits';

import { ApiClientError } from './ApiClientError';
import { API_CLIENT_ERROR_CODES } from './apiClientErrorCodes';
import { anonymousTokenProvider, type AuthTokenProvider } from './authTokenProvider';
import { parseErrorResponse } from './parseErrorResponse';
import { runAuthenticatedRequest } from './runAuthenticatedRequest';

export interface ApiRequest<TResponse> {
  readonly path: string;
  readonly method?: HttpMethod;
  readonly body?: unknown;
  /** The shared schema the response must satisfy. */
  readonly schema: ZodType<TResponse>;
}

export interface ApiClient {
  readonly request: <TResponse>(request: ApiRequest<TResponse>) => Promise<TResponse>;
}

export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly getAuthToken?: AuthTokenProvider;
}

const isSuccessful = (status: number): boolean =>
  status >= HTTP_STATUS.successMin && status <= HTTP_STATUS.successMax;

/**
 * The only place the app talks to the API. Paths come from @brewmate/shared and
 * every response is validated against the shared schema before it is returned -
 * a body that violates the contract is an error, not a silent success.
 */
export const createApiClient = ({
  baseUrl,
  getAuthToken = anonymousTokenProvider,
}: ApiClientOptions): ApiClient => ({
  request: async <TResponse>({
    path,
    method = HTTP_METHODS.get,
    body,
    schema,
  }: ApiRequest<TResponse>): Promise<TResponse> => {
    const response = await runAuthenticatedRequest({
      url: `${baseUrl}${path}`,
      method,
      body,
      timeoutMs: LIMITS.requestTimeoutMs,
      getAuthToken,
    });

    if (!isSuccessful(response.status)) {
      throw await parseErrorResponse(response);
    }

    const payload: unknown = await response.json().catch((): null => null);
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      throw new ApiClientError(
        API_CLIENT_ERROR_CODES.invalidResponse,
        parsed.error.message,
        response.status,
        null,
      );
    }

    return parsed.data;
  },
});
