import type { TasteAxes } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export type TasteAxisName = keyof TasteAxes;

/**
 * The order the five axes are always shown in.
 *
 * Fixed rather than sorted by value: a chart whose bars swap places every time
 * the profile shifts is unreadable, and the point of the chart is to be
 * recognised at a glance a month later.
 */
export const TASTE_AXIS_ORDER: readonly TasteAxisName[] = [
  'acidity',
  'sweetness',
  'body',
  'bitterness',
  'intensity',
];

export const TASTE_AXIS_LABEL_KEYS: Record<TasteAxisName, TranslationKey> = {
  acidity: TRANSLATION_KEYS.axisAcidity,
  sweetness: TRANSLATION_KEYS.axisSweetness,
  body: TRANSLATION_KEYS.axisBody,
  bitterness: TRANSLATION_KEYS.axisBitterness,
  intensity: TRANSLATION_KEYS.axisIntensity,
};
