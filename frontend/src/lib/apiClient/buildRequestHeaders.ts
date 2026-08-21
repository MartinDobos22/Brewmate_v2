import { AUTH_HEADER_SEPARATOR, AUTH_SCHEME_BEARER, HTTP_HEADERS } from '@brewmate/shared';

import { CONTENT_TYPE_JSON } from '../../constants/http';

/** Builds the header set for one request. The token is omitted when absent. */
export const buildRequestHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = { [HTTP_HEADERS.contentType]: CONTENT_TYPE_JSON };

  if (token !== null) {
    headers[HTTP_HEADERS.authorization] = `${AUTH_SCHEME_BEARER}${AUTH_HEADER_SEPARATOR}${token}`;
  }

  return headers;
};
