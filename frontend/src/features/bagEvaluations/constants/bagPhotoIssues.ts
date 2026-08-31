import { LABEL_PHOTO_ISSUES, type LabelPhotoIssue } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * What to do about each way a photograph can come back refused.
 *
 * A sentence per reason rather than one general "skús to znova", because the
 * reasons ask for different things: nothing to aim at, a hand that moved, a
 * shelf in the dark and a laminated bag under a spotlight are four different
 * five-second fixes. Total over the contract's own list, so a reason the API
 * learns to give is a type error here rather than a blank line in a shop.
 */
export const BAG_PHOTO_ISSUE_KEYS: Record<LabelPhotoIssue, TranslationKey> = {
  [LABEL_PHOTO_ISSUES.noText]: TRANSLATION_KEYS.scanPhotoIssueNoText,
  [LABEL_PHOTO_ISSUES.unsharp]: TRANSLATION_KEYS.scanPhotoIssueUnsharp,
  [LABEL_PHOTO_ISSUES.tooDark]: TRANSLATION_KEYS.scanPhotoIssueTooDark,
  [LABEL_PHOTO_ISSUES.tooBright]: TRANSLATION_KEYS.scanPhotoIssueTooBright,
};
