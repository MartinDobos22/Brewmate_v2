import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Indirect, and the beginner's replacement for being asked about acidity.
 *
 * "Kyslosť" is the single most misunderstood word in coffee: to somebody who
 * has never had a light roast brewed properly it means the taste of a cup that
 * has gone off, so asked whether they want an acidic coffee they say no, and
 * mean something entirely different from what got recorded. Fruit skips the
 * word. Everybody knows whether they reach for a lemon or a banana, and the
 * answer is about the same axis.
 */
export const FRUIT_QUESTION: TasteQuestion = {
  id: 'fruit',
  promptKey: TRANSLATION_KEYS.tqFruitPrompt,
  helpKey: TRANSLATION_KEYS.tqFruitHelp,
  weight: QUESTION_WEIGHTS.indirect,
  levels: QUESTION_LEVELS.beginnerOnly,
  options: [
    {
      id: 'citrus',
      labelKey: TRANSLATION_KEYS.tqFruitCitrus,
      effect: {
        axes: { acidity: 8.5, sweetness: 5 },
        flavorAffinities: { [FLAVOR_TAGS.citrus]: 0.7, [FLAVOR_TAGS.fruity]: 0.5 },
      },
    },
    {
      id: 'berry',
      labelKey: TRANSLATION_KEYS.tqFruitBerry,
      effect: {
        axes: { acidity: 7, sweetness: 7 },
        flavorAffinities: { [FLAVOR_TAGS.berry]: 0.7, [FLAVOR_TAGS.fruity]: 0.6 },
      },
    },
    {
      id: 'stone',
      labelKey: TRANSLATION_KEYS.tqFruitStone,
      effect: {
        axes: { acidity: 5.5, sweetness: 8 },
        flavorAffinities: { [FLAVOR_TAGS.fruity]: 0.4, [FLAVOR_TAGS.caramel]: 0.3 },
      },
    },
    {
      id: 'none',
      labelKey: TRANSLATION_KEYS.tqFruitNone,
      noteKey: TRANSLATION_KEYS.tqFruitNoneNote,
      effect: { axes: { acidity: 3 } },
    },
  ],
};
