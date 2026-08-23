import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Direct, phrased as an aversion.
 *
 * People describe what ruins a cup far more precisely than what makes one
 * good, and each answer here pins down a single axis at its low end - which is
 * exactly the half a list of preferences leaves out.
 */
export const DISLIKE_QUESTION: TasteQuestion = {
  id: 'dislike',
  promptKey: TRANSLATION_KEYS.tqDislikePrompt,
  helpKey: TRANSLATION_KEYS.tqDislikeHelp,
  weight: QUESTION_WEIGHTS.direct,
  options: [
    {
      id: 'sour',
      labelKey: TRANSLATION_KEYS.tqDislikeSour,
      effect: { axes: { acidity: 2.5 } },
    },
    {
      id: 'bitter',
      labelKey: TRANSLATION_KEYS.tqDislikeBitter,
      effect: { axes: { bitterness: 2.5 } },
    },
    {
      id: 'watery',
      labelKey: TRANSLATION_KEYS.tqDislikeWatery,
      effect: { axes: { body: 7.5, intensity: 8 } },
    },
    { id: 'none', labelKey: TRANSLATION_KEYS.tqDislikeNone, effect: {} },
  ],
};
