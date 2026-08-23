import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { readStorageBucket } from '../../config';

import { getFirebaseApp } from './getFirebaseApp';

let storage: FirebaseStorage | null = null;

/**
 * The bucket a photographed bag is uploaded to.
 *
 * The photo never travels through the Brewmate API: the app puts it in storage
 * and sends the URL, which keeps a request small enough to survive a shop's
 * signal and means a retry costs one short call rather than a second upload.
 *
 * @throws Error when the build has no bucket configured - the caller checks
 * `isPhotoScanningConfigured` first and offers the form instead.
 */
export const getFirebaseStorage = (): FirebaseStorage => {
  storage ??= getStorage(getFirebaseApp(), readStorageBucket());

  return storage;
};
