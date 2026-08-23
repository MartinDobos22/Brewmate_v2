/** Image formats the provider accepts as vision input. */
export const AI_IMAGE_MEDIA_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
} as const;

export type AiImageMediaType = (typeof AI_IMAGE_MEDIA_TYPES)[keyof typeof AI_IMAGE_MEDIA_TYPES];

export const AI_IMAGE_MEDIA_TYPE_VALUES = [
  AI_IMAGE_MEDIA_TYPES.jpeg,
  AI_IMAGE_MEDIA_TYPES.png,
  AI_IMAGE_MEDIA_TYPES.gif,
  AI_IMAGE_MEDIA_TYPES.webp,
] as const;

/**
 * How large a photograph of a bag may be.
 *
 * Well above what a phone camera produces after the app has resized it, and
 * far below anything that would tie up the server: the URL is supplied by a
 * client, so this is the ceiling that keeps a pasted link to a film from
 * becoming a download.
 */
export const AI_IMAGE_MAX_BYTES = 8388608;

/** How long the image download may take before it is abandoned. */
export const AI_IMAGE_FETCH_TIMEOUT_MS = 15000;

/** The base-64 encoding the provider expects the bytes in. */
export const AI_IMAGE_ENCODING = 'base64';
