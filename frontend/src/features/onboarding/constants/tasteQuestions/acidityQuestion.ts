import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/** Direct: the axis people have the strongest opinion about and the clearest word for. */
export const ACIDITY_QUESTION: TasteQuestion = {
  id: 'acidity',
  promptKey: TRANSLATION_KEYS.tqAcidityPrompt,
  helpKey: TRANSLATION_KEYS.tqAcidityHelp,
  weight: QUESTION_WEIGHTS.direct,
  levels: QUESTION_LEVELS.informed,
  options: [
    {
      id: 'high',
      labelKey: TRANSLATION_KEYS.tqAcidityHigh,
      noteKey: TRANSLATION_KEYS.tqAcidityHighNote,
      effect: { axes: { acidity: 9 } },
    },
    {
      id: 'mild',
      labelKey: TRANSLATION_KEYS.tqAcidityMild,
      noteKey: TRANSLATION_KEYS.tqAcidityMildNote,
      effect: { axes: { acidity: 6 } },
    },
    {
      id: 'low',
      labelKey: TRANSLATION_KEYS.tqAcidityLow,
      noteKey: TRANSLATION_KEYS.tqAcidityLowNote,
      effect: { axes: { acidity: 2 } },
    },
  ],
};
