import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

import { BAG_PHOTO_FAILURES, type BagPhotoFailure } from './bagPhoto';

/**
 * What to say about each of the four ways a photograph can fail.
 *
 * One sentence per failure rather than the single "poslať alebo prečítať" they
 * all used to share. That sentence was written to cover everything and
 * therefore told nobody anything: it named two causes and left the reader to
 * guess which had happened, which on the one screen used inside a building on
 * one bar is exactly the fact they could act on. Total over the failures, so
 * a new way for this to go wrong is a type error here rather than a blank
 * line in a shop.
 */
export const BAG_PHOTO_FAILURE_KEYS: Record<BagPhotoFailure, TranslationKey> = {
  [BAG_PHOTO_FAILURES.file]: TRANSLATION_KEYS.scanPhotoFileFailed,
  [BAG_PHOTO_FAILURES.network]: TRANSLATION_KEYS.scanPhotoUploadFailed,
  [BAG_PHOTO_FAILURES.storage]: TRANSLATION_KEYS.scanPhotoStorageFailed,
  [BAG_PHOTO_FAILURES.read]: TRANSLATION_KEYS.scanPhotoReadFailed,
};
