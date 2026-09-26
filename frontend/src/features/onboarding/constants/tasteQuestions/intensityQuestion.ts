import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Direct, and about the bean rather than the brew.
 *
 * It used to ask how strong somebody wanted their coffee, with a help line
 * about concentration - which is a question about the ratio, and the answer
 * was folded into the intensity of the coffee they should buy. A person who
 * likes a gentle Ethiopian brewed thick and a person who likes a heavy Brazil
 * brewed thin were told the same thing. The questionnaire exists so somebody
 * can pick a good bag off a shelf from their first day, so it asks what the
 * coffee itself should taste like and leaves how to brew it to the brewing.
 */
export const INTENSITY_QUESTION: TasteQuestion = {
  id: 'intensity',
  promptKey: TRANSLATION_KEYS.tqIntensityPrompt,
  helpKey: TRANSLATION_KEYS.tqIntensityHelp,
  weight: QUESTION_WEIGHTS.direct,
  levels: QUESTION_LEVELS.informed,
  options: [
    {
      id: 'high',
      icon: 'flash-outline',
      labelKey: TRANSLATION_KEYS.tqIntensityHigh,
      noteKey: TRANSLATION_KEYS.tqIntensityHighNote,
      effect: { axes: { body: 7, intensity: 8.5 } },
    },
    {
      id: 'medium',
      icon: 'scale-balance',
      labelKey: TRANSLATION_KEYS.tqIntensityMedium,
      noteKey: TRANSLATION_KEYS.tqIntensityMediumNote,
      effect: { axes: { intensity: 5.5 } },
    },
    {
      id: 'low',
      icon: 'feather',
      labelKey: TRANSLATION_KEYS.tqIntensityLow,
      noteKey: TRANSLATION_KEYS.tqIntensityLowNote,
      effect: { axes: { body: 4, intensity: 3 } },
    },
  ],
};
