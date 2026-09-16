import { FirebaseError } from 'firebase/app';

import { BAG_PHOTO_FAILURES, type BagPhotoFailure } from '../constants/bagPhoto';
import { STORAGE_RETRYABLE_ERROR_CODES } from '../constants/storageErrorCodes';

import { LocalPhotoError } from './readLocalPhotoBytes';

/**
 * Turns whatever an upload threw into the one thing worth saying about it.
 *
 * This is the only place in the feature that reads a Firebase Storage code,
 * the way `resolveAuthErrorKey` is the only place that reads an Auth one -
 * which is what keeps `storage/unauthorized` off a screen somebody is reading
 * in front of a shelf.
 *
 * The default is `storage` rather than `network`, and that is the decision
 * here. The upload has already tried three times with a doubling wait by the
 * time anything reaches this function, so a connection that is genuinely
 * coming and going arrives with a code that says so. Everything else is the
 * application being wrong about its own bucket, and an app that blamed the
 * shop's signal for that would send somebody walking around looking for a
 * window over a mistake they cannot do anything about.
 */
export const resolveUploadFailure = (error: unknown): BagPhotoFailure => {
  if (error instanceof LocalPhotoError) {
    return BAG_PHOTO_FAILURES.file;
  }

  if (error instanceof FirebaseError && isRetryable(error.code)) {
    return BAG_PHOTO_FAILURES.network;
  }

  return BAG_PHOTO_FAILURES.storage;
};

const isRetryable = (code: string): boolean =>
  STORAGE_RETRYABLE_ERROR_CODES.some((retryable: string): boolean => retryable === code);
