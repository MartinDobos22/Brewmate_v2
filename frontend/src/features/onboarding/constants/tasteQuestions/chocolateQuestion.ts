import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Indirect: chocolate is the one place where almost everybody has already
 * decided how much bitterness they trade for sweetness, and can say so without
 * being taught a vocabulary first.
 */
export const CHOCOLATE_QUESTION: TasteQuestion = {
  id: 'chocolate',
  promptKey: TRANSLATION_KEYS.tqChocolatePrompt,
  helpKey: TRANSLATION_KEYS.tqChocolateHelp,
  weight: QUESTION_WEIGHTS.indirect,
  levels: QUESTION_LEVELS.plainLanguage,
  options: [
    {
      id: 'milk',
      labelKey: TRANSLATION_KEYS.tqChocolateMilk,
      effect: {
        axes: { sweetness: 8, bitterness: 3 },
        flavorAffinities: { [FLAVOR_TAGS.chocolate]: 0.5, [FLAVOR_TAGS.caramel]: 0.5 },
      },
    },
    {
      id: 'dark',
      labelKey: TRANSLATION_KEYS.tqChocolateDark,
      effect: {
        axes: { sweetness: 4, bitterness: 7.5, intensity: 7.5 },
        flavorAffinities: { [FLAVOR_TAGS.chocolate]: 0.6, [FLAVOR_TAGS.spice]: 0.2 },
      },
    },
    {
      id: 'both',
      labelKey: TRANSLATION_KEYS.tqChocolateBoth,
      effect: {
        axes: { sweetness: 6.5, bitterness: 5.5 },
        flavorAffinities: { [FLAVOR_TAGS.chocolate]: 0.5 },
      },
    },
  ],
};
