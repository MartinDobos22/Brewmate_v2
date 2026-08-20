import { HTTP_STATUS } from '../constants/httpStatus.js';

/** 4xx responses are the caller's problem and are logged at warn level. */
export const isClientError = (statusCode: number): boolean =>
  statusCode >= HTTP_STATUS.badRequest && statusCode < HTTP_STATUS.internalServerError;
