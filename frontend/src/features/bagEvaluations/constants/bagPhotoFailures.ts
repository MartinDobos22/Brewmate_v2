import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

import { BAG_PHOTO_FAILURES, type BagPhotoFailure } from './bagPhoto';

/**
 * What to say about each of the two ways a photograph can fail.
 *
 * One sentence per failure rather than the single "poslať alebo prečítať" both
 * used to share. That sentence was written to cover everything and therefore
 * told nobody anything: it named two causes and left the reader to guess which
 * of them had happened, which on the one screen used inside a building on one
 * bar is exactly the fact they could act on. An upload that would not go is a
 * reason to step towards a window and press the tile again; a label nothing
 * could be read from is not, and the form underneath is the whole answer.
 */
export const BAG_PHOTO_FAILURE_KEYS: Record<BagPhotoFailure, TranslationKey> = {
  [BAG_PHOTO_FAILURES.upload]: TRANSLATION_KEYS.scanPhotoUploadFailed,
  [BAG_PHOTO_FAILURES.read]: TRANSLATION_KEYS.scanPhotoReadFailed,
};
