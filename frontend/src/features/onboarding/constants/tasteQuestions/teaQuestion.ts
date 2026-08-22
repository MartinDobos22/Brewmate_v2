import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Indirect: tea is the closest thing most people drink to a filter coffee, so
 * which one they reach for says more about acidity and body than any question
 * about coffee they have never had brewed properly.
 */
export const TEA_QUESTION: TasteQuestion = {
  id: 'tea',
  promptKey: TRANSLATION_KEYS.tqTeaPrompt,
  helpKey: TRANSLATION_KEYS.tqTeaHelp,
  weight: QUESTION_WEIGHTS.indirect,
  options: [
    {
      id: 'fruit',
      labelKey: TRANSLATION_KEYS.tqTeaFruit,
      effect: {
        axes: { acidity: 8 },
        flavorAffinities: {
          [FLAVOR_TAGS.fruity]: 0.7,
          [FLAVOR_TAGS.citrus]: 0.4,
          [FLAVOR_TAGS.berry]: 0.3,
        },
      },
    },
    {
      id: 'black',
      labelKey: TRANSLATION_KEYS.tqTeaBlack,
      effect: {
        axes: { acidity: 4, body: 6.5, bitterness: 6 },
        flavorAffinities: { [FLAVOR_TAGS.nutty]: 0.3, [FLAVOR_TAGS.chocolate]: 0.3 },
      },
    },
    {
      id: 'green',
      labelKey: TRANSLATION_KEYS.tqTeaGreen,
      effect: {
        axes: { acidity: 6.5, body: 3.5 },
        flavorAffinities: {
          [FLAVOR_TAGS.floral]: 0.6,
          [FLAVOR_TAGS.herbal]: 0.5,
          [FLAVOR_TAGS.teaLike]: 0.6,
        },
      },
    },
    { id: 'none', labelKey: TRANSLATION_KEYS.tqTeaNone, effect: {} },
  ],
};
