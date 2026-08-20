/** Header names used by the Brewmate API contract. */
export const HTTP_HEADERS = {
  authorization: 'authorization',
  contentType: 'content-type',
  requestId: 'x-request-id',
} as const;

export type HttpHeaderName = (typeof HTTP_HEADERS)[keyof typeof HTTP_HEADERS];
