import { z } from 'zod';

/**
 * Image formats a model will look at.
 *
 * In the contract rather than in the server, because it is now the app that
 * decides what it is sending: a format the API would refuse has to be a type
 * error where the photograph is read off the phone, not a 422 somebody
 * receives in a shop after spending their signal on the bytes.
 */
export const PHOTO_MEDIA_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
} as const;

export type PhotoMediaType = (typeof PHOTO_MEDIA_TYPES)[keyof typeof PHOTO_MEDIA_TYPES];

export const PHOTO_MEDIA_TYPE_VALUES = [
  PHOTO_MEDIA_TYPES.jpeg,
  PHOTO_MEDIA_TYPES.png,
  PHOTO_MEDIA_TYPES.gif,
  PHOTO_MEDIA_TYPES.webp,
] as const;

/**
 * The largest photograph that may be sent, counted in base-64 characters.
 *
 * Four characters carry three bytes, so this is the eight mebibytes the server
 * has always allowed an image to weigh, written in the unit the field actually
 * holds. Stated in the contract so the phone can refuse an oversized picture
 * before it spends a shop's signal on it, rather than finding out afterwards.
 */
export const PHOTO_BASE64_MAX_LENGTH = 11184812;

/**
 * A photograph on its way to a model.
 *
 * It travels in the request body rather than as a link to a bucket. The bytes
 * have to reach this API either way - the hash that makes a repeated scan free
 * can only be taken from them, and the provider is handed base-64 in the end
 * regardless - so putting a bucket in between sent the same photograph across
 * the network twice, for a URL that nothing in the app ever displayed. What it
 * bought instead was a second service to configure, a paid storage plan, and a
 * whole class of failure between the camera and the label.
 */
export const photoSchema = z
  .object({
    mediaType: z.enum(PHOTO_MEDIA_TYPE_VALUES),
    data: z.string().min(1).max(PHOTO_BASE64_MAX_LENGTH),
  })
  .strict();

export type Photo = z.infer<typeof photoSchema>;
