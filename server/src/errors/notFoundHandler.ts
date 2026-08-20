import { ERROR_CODES } from '@brewmate/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { HTTP_STATUS } from '../constants/httpStatus.js';

import { ERROR_MESSAGES } from './errorMessages.js';
import { toErrorResponse } from './toErrorResponse.js';

/** Unknown routes answer with the same envelope as every other failure. */
export const notFoundHandler = (request: FastifyRequest, reply: FastifyReply): FastifyReply =>
  reply
    .status(HTTP_STATUS.notFound)
    .send(toErrorResponse(ERROR_CODES.notFound, ERROR_MESSAGES.routeNotFound, request.id));
