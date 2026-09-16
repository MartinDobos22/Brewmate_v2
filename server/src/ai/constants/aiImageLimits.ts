/**
 * How large a photograph of a bag may be, in bytes.
 *
 * Well above what a phone camera produces and far below anything that would
 * tie up the server. The contract states the same ceiling in base-64
 * characters, so a picture too big to send is refused on the phone before it
 * costs anybody their signal; this is the backstop for whatever else finds
 * the endpoint.
 */
export const AI_IMAGE_MAX_BYTES = 8388608;

/** The base-64 encoding the provider expects the bytes in. */
export const AI_IMAGE_ENCODING = 'base64';
