import { BAG_PHOTO_FAILURES, type BagPhotoFailure } from '../constants/bagPhoto';
import { ApiClientError, API_CLIENT_ERROR_CODES } from '../../../lib/apiClient';

import { LocalPhotoError } from './readLocalPhoto';

/**
 * Turns whatever a scan threw into the one thing worth saying about it.
 *
 * Three outcomes and one default. A picture that never came off the phone
 * names itself; a request that never left names itself through the API
 * client's own code, which is the same distinction `resolveRequestErrorKeys`
 * already draws everywhere else - being offline outranks whatever the server
 * would have said.
 *
 * Everything else is the reading: a 503 with no model configured, a spent
 * allowance, a label the model would not answer about. All of them end on the
 * form, which is why they share a sentence.
 */
export const resolvePhotoFailure = (error: unknown): BagPhotoFailure => {
  if (error instanceof LocalPhotoError) {
    return BAG_PHOTO_FAILURES.file;
  }

  if (error instanceof ApiClientError && isTransportFailure(error.code)) {
    return BAG_PHOTO_FAILURES.network;
  }

  return BAG_PHOTO_FAILURES.read;
};

const isTransportFailure = (code: string): boolean =>
  code === API_CLIENT_ERROR_CODES.network || code === API_CLIENT_ERROR_CODES.timeout;
