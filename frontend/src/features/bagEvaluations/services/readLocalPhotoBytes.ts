import { File } from 'expo-file-system';

const EMPTY_FILE = 0;
const MISSING_PHOTO_MESSAGE = 'The picked photograph could not be read off local storage.';
const EMPTY_PHOTO_MESSAGE = 'The picked photograph read back as zero bytes.';

/**
 * A photograph that never came off the phone.
 *
 * Its own class so the screen above can tell it from a bucket that refused the
 * bytes and from a connection that dropped them. All three used to arrive as
 * one unnamed failure, and they ask for three different things: pick again,
 * go and fix the project, walk a few steps.
 */
export class LocalPhotoError extends Error {}

/**
 * Reads a photograph the picker has already written to the phone's own disk.
 *
 * Through the file system rather than `fetch(file://...)`, which is what this
 * used to do. The picker hands back a path to a file in the app's own cache,
 * and asking the networking stack to make an HTTP request for it puts React
 * Native's blob layer between those bytes and the upload for no reason at all.
 * That layer is the one link in this chain that fails quietly: depending on
 * the platform and the scheme the picker chose, it either refuses outright -
 * which is a photograph that never reaches the API, on a screen that only
 * knows something went wrong - or hands back a blob of nothing, which uploads
 * perfectly and then arrives as a picture with no label in it.
 *
 * @throws Error when the file is not there or holds nothing. Both reach the
 * caller as an upload that would not go, which lands on the form - the same
 * place every other failure on this path lands.
 */
export const readLocalPhotoBytes = async (localUri: string): Promise<Uint8Array> => {
  const file = new File(localUri);

  if (!file.exists) {
    throw new LocalPhotoError(MISSING_PHOTO_MESSAGE);
  }

  const bytes = await file.bytes();

  if (bytes.length === EMPTY_FILE) {
    throw new LocalPhotoError(EMPTY_PHOTO_MESSAGE);
  }

  return bytes;
};
