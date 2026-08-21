import type { HttpMethod } from '../../constants/http';

import { ApiClientError } from './ApiClientError';
import { API_CLIENT_ERROR_CODES } from './apiClientErrorCodes';

export interface RunRequestOptions {
  readonly url: string;
  readonly method: HttpMethod;
  readonly body: unknown;
  readonly headers: Record<string, string>;
  readonly timeoutMs: number;
}

const TIMEOUT_MESSAGE = 'Request timed out.';
const NETWORK_MESSAGE = 'Request failed before the server answered.';

/** Performs the fetch and turns transport failures into typed errors. */
export const runRequest = async ({
  url,
  method,
  body,
  headers,
  timeoutMs,
}: RunRequestOptions): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout((): void => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      method,
      headers,
      signal: controller.signal,
      body: body === undefined ? null : JSON.stringify(body),
    });
  } catch {
    const timedOut = controller.signal.aborted;

    throw new ApiClientError(
      timedOut ? API_CLIENT_ERROR_CODES.timeout : API_CLIENT_ERROR_CODES.network,
      timedOut ? TIMEOUT_MESSAGE : NETWORK_MESSAGE,
      null,
      null,
    );
  } finally {
    clearTimeout(timeout);
  }
};
