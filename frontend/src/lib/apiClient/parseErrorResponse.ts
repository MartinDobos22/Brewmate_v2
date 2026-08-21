import { ERROR_CODES, errorResponseSchema } from '@brewmate/shared';

import { ApiClientError } from './ApiClientError';

/**
 * Turns a non-2xx response into an ApiClientError. A body that does not match
 * the shared error envelope is reported as an internal error rather than
 * trusted, so a proxy's HTML page can never masquerade as an API answer.
 */
export const parseErrorResponse = async (response: Response): Promise<ApiClientError> => {
  const body: unknown = await response.json().catch((): null => null);
  const parsed = errorResponseSchema.safeParse(body);

  if (!parsed.success) {
    return new ApiClientError(
      ERROR_CODES.internalError,
      response.statusText,
      response.status,
      null,
    );
  }

  return new ApiClientError(
    parsed.data.error.code,
    parsed.data.error.message,
    response.status,
    parsed.data.requestId,
  );
};
