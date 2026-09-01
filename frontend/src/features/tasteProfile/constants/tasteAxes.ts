import { TASTE_AXIS_NAMES, type TasteAxisName } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export type { TasteAxisName };

/**
 * The order the five axes are always shown in.
 *
 * The contract's own list, not a second copy of it. Three things now walk this
 * order - the fold on the server, the web on the profile screen and the
 * confidence beside it - and a sixth axis added to the schema has to reach all
 * of them or reach none.
 *
 * Fixed rather than sorted by value: a chart whose vertices swap places every
 * time the profile shifts is unreadable, and the point of the chart is to be
 * recognised at a glance a month later.
 */
export const TASTE_AXIS_ORDER: readonly TasteAxisName[] = TASTE_AXIS_NAMES;

export const TASTE_AXIS_LABEL_KEYS: Record<TasteAxisName, TranslationKey> = {
  acidity: TRANSLATION_KEYS.axisAcidity,
  sweetness: TRANSLATION_KEYS.axisSweetness,
  body: TRANSLATION_KEYS.axisBody,
  bitterness: TRANSLATION_KEYS.axisBitterness,
  intensity: TRANSLATION_KEYS.axisIntensity,
};
