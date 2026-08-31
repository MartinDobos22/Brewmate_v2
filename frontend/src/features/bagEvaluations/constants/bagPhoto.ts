/**
 * How a photograph of a bag is taken, and how hard the app tries to deliver it.
 *
 * Everything here is tuned for the place this happens: a shop, one-handed, on
 * whatever signal is left inside a building. Nothing about the numbers is
 * about image quality for its own sake.
 */

/**
 * JPEG quality. Well below the maximum on purpose - a label has to be legible,
 * not printable, and every megabyte is another chance for the upload to time
 * out somewhere between the shelves.
 */
export const BAG_PHOTO_QUALITY = 0.6;

/** The picker only ever offers stills. */
export const BAG_PHOTO_MEDIA_TYPES = ['images'] as const;

/**
 * How many times an upload is attempted before the app stops and offers the
 * form instead.
 *
 * Three, because the failure this is built for is a signal that comes and goes
 * rather than one that is gone: a shop's dead spot is often over by the time
 * the second backoff has elapsed.
 */
export const BAG_PHOTO_UPLOAD_ATTEMPTS = 3;

/** The first wait between attempts; each one after it doubles. */
export const BAG_PHOTO_RETRY_BASE_MS = 800;
export const BAG_PHOTO_RETRY_FACTOR = 2;

/**
 * How a capture ended.
 *
 * `cancelled` and `read` have to be told apart: somebody who backs out of the
 * camera meant to stay where they were, and dumping them into a form is the
 * app not listening. `unavailable` covers a refused permission and an upload
 * that would not go - both of which land on the form, because that is the way
 * forward rather than a dead end.
 *
 * `refused` is the fourth, and the only one that stays put. The photograph
 * reached the API and came back with reasons nothing could be read off it, and
 * every one of those reasons is something somebody can do differently in the
 * next five seconds. Dropping them onto an empty form instead would throw away
 * the one useful thing that was learned - and ask them to type in a label they
 * are still holding a camera at.
 */
export const BAG_CAPTURE_RESULTS = {
  read: 'read',
  cancelled: 'cancelled',
  unavailable: 'unavailable',
  refused: 'refused',
} as const;

/** Where a photograph is filed in the bucket. */
export const BAG_PHOTO_FOLDER = 'bag-scans';
export const BAG_PHOTO_EXTENSION = '.jpg';
export const BAG_PHOTO_CONTENT_TYPE = 'image/jpeg';
export const BAG_PHOTO_PATH_SEPARATOR = '/';
