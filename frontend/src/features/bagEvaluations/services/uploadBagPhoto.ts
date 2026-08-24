import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { getFirebaseStorage } from '../../../lib/firebase';
import {
  BAG_PHOTO_CONTENT_TYPE,
  BAG_PHOTO_EXTENSION,
  BAG_PHOTO_FOLDER,
  BAG_PHOTO_PATH_SEPARATOR,
  BAG_PHOTO_RETRY_BASE_MS,
  BAG_PHOTO_RETRY_FACTOR,
  BAG_PHOTO_UPLOAD_ATTEMPTS,
} from '../constants/bagPhoto';

const FIRST_ATTEMPT = 0;
const LAST_ATTEMPT = BAG_PHOTO_UPLOAD_ATTEMPTS - 1;

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve: () => void): void => {
    setTimeout(resolve, ms);
  });

const backoffFor = (attempt: number): number =>
  BAG_PHOTO_RETRY_BASE_MS * BAG_PHOTO_RETRY_FACTOR ** attempt;

/** A path nobody else can collide with, and nothing can be guessed from. */
const photoPath = (folder: string, userId: string, takenAt: number): string =>
  [folder, userId, `${String(takenAt)}${BAG_PHOTO_EXTENSION}`].join(BAG_PHOTO_PATH_SEPARATOR);

const readLocalFile = async (localUri: string): Promise<Blob> => {
  const response = await fetch(localUri);

  return response.blob();
};

/**
 * Puts one photograph in the bucket and hands back its URL.
 *
 * Retried with a widening wait rather than once, because the failure this is
 * built for is a signal that comes and goes: inside a shop an upload fails,
 * and then a few seconds later it does not. The waits double so three attempts
 * span several seconds of walking rather than three tries in one dead spot.
 *
 * When all of them fail the error reaches the caller, which puts the label
 * form in front of the user. Somebody standing in front of a shelf must never
 * be stuck behind a photograph that will not send.
 *
 * The folder is a parameter because the same walk-and-retry is what a
 * photographed recipe needs too, and two copies of a backoff loop are two
 * places for it to drift.
 */
export const uploadBagPhoto = async (
  localUri: string,
  userId: string,
  folder: string = BAG_PHOTO_FOLDER,
): Promise<string> => {
  const file = await readLocalFile(localUri);
  const target = ref(getFirebaseStorage(), photoPath(folder, userId, Date.now()));
  let lastError: unknown = null;

  for (let attempt = FIRST_ATTEMPT; attempt < BAG_PHOTO_UPLOAD_ATTEMPTS; attempt += 1) {
    try {
      await uploadBytes(target, file, { contentType: BAG_PHOTO_CONTENT_TYPE });

      return await getDownloadURL(target);
    } catch (error: unknown) {
      lastError = error;

      if (attempt < LAST_ATTEMPT) {
        await wait(backoffFor(attempt));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};
