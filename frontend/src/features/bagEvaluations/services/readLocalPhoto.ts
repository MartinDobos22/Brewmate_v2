import { PHOTO_MEDIA_TYPES, PHOTO_BASE64_MAX_LENGTH, type Photo } from '@brewmate/shared';
import { File } from 'expo-file-system';

const EMPTY_FILE = 0;
const MISSING_PHOTO_MESSAGE = 'The picked photograph could not be read off local storage.';
const EMPTY_PHOTO_MESSAGE = 'The picked photograph read back as nothing.';
const OVERSIZED_PHOTO_MESSAGE = 'The picked photograph is larger than the API will accept.';

/**
 * A photograph that never left the phone.
 *
 * Its own class so the screen above can tell it from a request that did not
 * get through. They ask for different things: pick again, or try again in a
 * moment.
 */
export class LocalPhotoError extends Error {}

/**
 * Reads a picked photograph into the shape the API takes.
 *
 * Straight off the phone's own disk and into the request body. There is no
 * upload step any more and no bucket for one to go to: the bytes have to reach
 * the API either way - it hashes them for the cache and hands the provider
 * base-64 at the end - so putting storage in between sent the same picture
 * across the network twice, for a URL nothing in this app ever displayed.
 *
 * The picker is configured to return JPEG, and that is what is declared. It is
 * not sniffed from the bytes: the contract accepts four formats and the one
 * the picker was asked for is the one it produced.
 *
 * @throws LocalPhotoError when the file is gone, empty, or too big to send.
 * The size is checked here rather than found out by the API, because on the
 * screen this runs on the alternative is spending a shop's signal to be told
 * no.
 */
export const readLocalPhoto = async (localUri: string): Promise<Photo> => {
  const file = new File(localUri);

  if (!file.exists) {
    throw new LocalPhotoError(MISSING_PHOTO_MESSAGE);
  }

  const data = await file.base64();

  if (data.length === EMPTY_FILE) {
    throw new LocalPhotoError(EMPTY_PHOTO_MESSAGE);
  }

  if (data.length > PHOTO_BASE64_MAX_LENGTH) {
    throw new LocalPhotoError(OVERSIZED_PHOTO_MESSAGE);
  }

  return { mediaType: PHOTO_MEDIA_TYPES.jpeg, data };
};
