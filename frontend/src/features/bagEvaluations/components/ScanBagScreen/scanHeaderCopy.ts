import { TRANSLATION_KEYS, type TranslationKey } from '../../../../i18n';
import { BAG_SCAN_STAGES, type BagScanStage } from '../../constants/bagScan';

export interface ScanHeaderCopy {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
}

/**
 * What the block at the top says at each stage, or nothing where the screen
 * has become the answer.
 *
 * It changes rather than disappearing between the stages that are still
 * questions: standing in a shop with a bag in one hand, what is worth keeping
 * on screen is what this screen is about, and a block that vanished after the
 * first tap would leave two stages looking like two unrelated forms.
 *
 * The first thing it says is "ukáž mi ten balíček". It used to introduce the
 * scanner and ask what somebody had come to do, which is a paragraph between
 * a person holding a bag and the camera they opened the tab for.
 *
 * The verdict and what happened afterwards get none. By then the screen is an
 * opinion about one coffee, and a block above it saying what a scanner is for
 * would be the app introducing itself over its own answer.
 */
export const readScanHeaderCopy = (stage: BagScanStage): ScanHeaderCopy | null => {
  if (stage === BAG_SCAN_STAGES.capture) {
    return {
      titleKey: TRANSLATION_KEYS.scanCaptureTitle,
      bodyKey: TRANSLATION_KEYS.scanCaptureBody,
    };
  }

  if (stage === BAG_SCAN_STAGES.label) {
    return {
      titleKey: TRANSLATION_KEYS.scanLabelTitle,
      bodyKey: TRANSLATION_KEYS.scanLabelBody,
    };
  }

  return null;
};
