import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Direct. The help line separates strength from caffeine on purpose: asked
 * without it, half the answers are about how tired the person is.
 */
export const STRENGTH_QUESTION: TasteQuestion = {
  id: 'strength',
  promptKey: TRANSLATION_KEYS.tqStrengthPrompt,
  helpKey: TRANSLATION_KEYS.tqStrengthHelp,
  weight: QUESTION_WEIGHTS.direct,
  options: [
    {
      id: 'high',
      labelKey: TRANSLATION_KEYS.tqStrengthHigh,
      noteKey: TRANSLATION_KEYS.tqStrengthHighNote,
      effect: { axes: { body: 7, intensity: 8.5 } },
    },
    {
      id: 'medium',
      labelKey: TRANSLATION_KEYS.tqStrengthMedium,
      noteKey: TRANSLATION_KEYS.tqStrengthMediumNote,
      effect: { axes: { intensity: 5.5 } },
    },
    {
      id: 'low',
      labelKey: TRANSLATION_KEYS.tqStrengthLow,
      noteKey: TRANSLATION_KEYS.tqStrengthLowNote,
      effect: { axes: { body: 4, intensity: 3 } },
    },
  ],
};
