import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_WEIGHTS } from './questionWeights';

/** Direct: body has no everyday word, so the options describe it rather than name it. */
export const BODY_QUESTION: TasteQuestion = {
  id: 'body',
  promptKey: TRANSLATION_KEYS.tqBodyPrompt,
  helpKey: TRANSLATION_KEYS.tqBodyHelp,
  weight: QUESTION_WEIGHTS.direct,
  options: [
    {
      id: 'light',
      labelKey: TRANSLATION_KEYS.tqBodyLight,
      noteKey: TRANSLATION_KEYS.tqBodyLightNote,
      effect: { axes: { body: 2.5, intensity: 4 } },
    },
    {
      id: 'balanced',
      labelKey: TRANSLATION_KEYS.tqBodyBalanced,
      noteKey: TRANSLATION_KEYS.tqBodyBalancedNote,
      effect: { axes: { body: 5.5 } },
    },
    {
      id: 'heavy',
      labelKey: TRANSLATION_KEYS.tqBodyHeavy,
      noteKey: TRANSLATION_KEYS.tqBodyHeavyNote,
      effect: { axes: { body: 8.5, intensity: 7.5 } },
    },
  ],
};
