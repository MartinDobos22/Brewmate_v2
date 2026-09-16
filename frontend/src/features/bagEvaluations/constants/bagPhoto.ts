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
 * How many times a scan is sent before the app stops and offers the form
 * instead.
 *
 * Three, because the failure this is built for is a signal that comes and goes
 * rather than one that is gone: a shop's dead spot is often over by the time
 * the second backoff has elapsed. It used to sit around the upload to the
 * storage bucket; with the bucket gone it belongs around the request that
 * carries the photograph, which is the same walk through the same shop.
 */
export const BAG_PHOTO_SEND_ATTEMPTS = 3;

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

/**
 * Where a photograph stopped, when it stopped.
 *
 * Three, because they ask three different things of the person reading them.
 * The picture never came off the phone; it never reached the API; or it
 * arrived and no label could be made of it. These used to be one message
 * naming two causes, which on the one screen in this app used inside a
 * building on one bar told nobody anything they could act on.
 *
 * There is no fourth for a bucket that refused the bytes, because there is no
 * bucket: the photograph travels in the request now.
 *
 * The values double as the name each failure is reported under, so the label
 * on the report and the sentence on the screen cannot describe different
 * failures.
 */
export const BAG_PHOTO_FAILURES = {
  file: 'bag-photo-file',
  network: 'bag-photo-network',
  read: 'bag-photo-read',
} as const;

export type BagPhotoFailure = (typeof BAG_PHOTO_FAILURES)[keyof typeof BAG_PHOTO_FAILURES];
