import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Indirect, and the one question that seeds most of the flavour vocabulary.
 * Smell is where a preference is felt before it is reasoned about, so the
 * options are four aromas rather than four descriptions of a cup.
 */
export const AROMA_QUESTION: TasteQuestion = {
  id: 'aroma',
  promptKey: TRANSLATION_KEYS.tqAromaPrompt,
  helpKey: TRANSLATION_KEYS.tqAromaHelp,
  weight: QUESTION_WEIGHTS.indirect,
  options: [
    {
      id: 'citrus',
      labelKey: TRANSLATION_KEYS.tqAromaCitrus,
      effect: {
        axes: { acidity: 8 },
        flavorAffinities: {
          [FLAVOR_TAGS.citrus]: 0.8,
          [FLAVOR_TAGS.berry]: 0.6,
          [FLAVOR_TAGS.fruity]: 0.5,
        },
      },
    },
    {
      id: 'nutty',
      labelKey: TRANSLATION_KEYS.tqAromaNutty,
      effect: {
        axes: { acidity: 4, sweetness: 7 },
        flavorAffinities: { [FLAVOR_TAGS.nutty]: 0.7, [FLAVOR_TAGS.caramel]: 0.7 },
      },
    },
    {
      id: 'floral',
      labelKey: TRANSLATION_KEYS.tqAromaFloral,
      effect: {
        axes: { acidity: 7, body: 4 },
        flavorAffinities: {
          [FLAVOR_TAGS.floral]: 0.8,
          [FLAVOR_TAGS.herbal]: 0.5,
          [FLAVOR_TAGS.teaLike]: 0.4,
        },
      },
    },
    {
      id: 'cocoa',
      labelKey: TRANSLATION_KEYS.tqAromaCocoa,
      effect: {
        axes: { body: 7, bitterness: 6 },
        flavorAffinities: { [FLAVOR_TAGS.chocolate]: 0.7, [FLAVOR_TAGS.spice]: 0.5 },
      },
    },
  ],
};
