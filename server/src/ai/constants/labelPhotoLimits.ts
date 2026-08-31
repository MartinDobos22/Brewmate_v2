/**
 * What the optical reader has to see before a photograph is worth spending a
 * model call on.
 *
 * Every number here is a threshold on evidence the reader actually reports,
 * and every one of them is deliberately forgiving. The failure this guards
 * against is a wasted call and a bad reading; the failure it must not cause is
 * somebody standing in a shop being told to retake a photograph that would
 * have been read perfectly well. When those two are in tension, the second one
 * wins - which is why a photograph is refused only when there is almost
 * nothing on it, or when the reader itself could barely make out what it did
 * find.
 */

/**
 * How many characters have to come off a label before it counts as one.
 *
 * A bag of specialty coffee prints a roaster and a name at the very least, so
 * a dozen characters is well under the floor of any real label - and well
 * above the stray one or two an optical reader hallucinates out of a shelf
 * edge or a fold in the paper.
 */
export const LABEL_TEXT_MIN_CHARACTERS = 12;

/**
 * How sure the reader has to be, on average, of the words it did make out.
 *
 * Below this a photograph is unsharp: the words came back, but as guesses. A
 * model handed that transcript reads it as fact, which is worse than handing
 * it none - and the photograph it would be reading alongside is the same
 * blurred one.
 */
export const LABEL_TEXT_MIN_CONFIDENCE = 0.6;

/** How much of the transcript travels into the prompt. */
export const LABEL_TEXT_MAX_CHARACTERS = 4000;

/**
 * The luminance band a photograph has to fall in before darkness or glare
 * stops being a plausible explanation for an unreadable label.
 *
 * Never a reason to refuse a photograph on its own: a dim picture whose text
 * came out legible is a good picture, and telling somebody to retake it would
 * be the app arguing with its own reading.
 */
export const LABEL_LUMINANCE_MIN = 0.16;
export const LABEL_LUMINANCE_MAX = 0.93;

/** Coefficients of the sRGB luminance formula, and the range one channel spans. */
export const LUMINANCE_RED_WEIGHT = 0.2126;
export const LUMINANCE_GREEN_WEIGHT = 0.7152;
export const LUMINANCE_BLUE_WEIGHT = 0.0722;
export const COLOR_CHANNEL_MAX = 255;

/**
 * How long the optical reader may take.
 *
 * Shorter than the image download it follows, because this call is an aid
 * rather than the feature: a reader that has gone slow must give up quickly
 * and let the photograph go to the model unaccompanied, which is exactly what
 * a deployment without a reader does anyway.
 */
export const LABEL_VISION_TIMEOUT_MS = 8000;

/** The path the annotation request is sent to, under the configured endpoint. */
export const VISION_ANNOTATE_PATH = '/v1/images:annotate';

/** The feature names Google's API knows the two questions by. */
export const VISION_FEATURES = {
  documentText: 'DOCUMENT_TEXT_DETECTION',
  imageProperties: 'IMAGE_PROPERTIES',
} as const;

/** Query parameter carrying the API key. */
export const VISION_KEY_PARAM = 'key';
