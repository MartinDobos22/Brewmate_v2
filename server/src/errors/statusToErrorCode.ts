import { ERROR_CODES, type ErrorCode } from '@brewmate/shared';

import { HTTP_STATUS } from '../constants/httpStatus.js';

const CODE_BY_STATUS: ReadonlyMap<number, ErrorCode> = new Map<number, ErrorCode>([
  [HTTP_STATUS.badRequest, ERROR_CODES.badRequest],
  [HTTP_STATUS.unauthorized, ERROR_CODES.unauthorized],
  [HTTP_STATUS.forbidden, ERROR_CODES.forbidden],
  [HTTP_STATUS.notFound, ERROR_CODES.notFound],
  [HTTP_STATUS.conflict, ERROR_CODES.conflict],
  [HTTP_STATUS.unprocessableEntity, ERROR_CODES.validationFailed],
  [HTTP_STATUS.tooManyRequests, ERROR_CODES.tooManyRequests],
  [HTTP_STATUS.serviceUnavailable, ERROR_CODES.serviceUnavailable],
]);

/** Falls back to INTERNAL_ERROR for any status the API does not model explicitly. */
export const statusToErrorCode = (statusCode: number): ErrorCode =>
  CODE_BY_STATUS.get(statusCode) ?? ERROR_CODES.internalError;
