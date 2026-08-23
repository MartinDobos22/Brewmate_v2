import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_WEIGHTS } from './questionWeights';

/** Last, and deliberately open: what the person is actually chasing in a cup. */
export const GOAL_QUESTION: TasteQuestion = {
  id: 'goal',
  promptKey: TRANSLATION_KEYS.tqGoalPrompt,
  helpKey: TRANSLATION_KEYS.tqGoalHelp,
  weight: QUESTION_WEIGHTS.indirect,
  options: [
    {
      id: 'sweet',
      labelKey: TRANSLATION_KEYS.tqGoalSweet,
      effect: {
        axes: { sweetness: 8.5 },
        flavorAffinities: { [FLAVOR_TAGS.caramel]: 0.4, [FLAVOR_TAGS.chocolate]: 0.3 },
      },
    },
    {
      id: 'bright',
      labelKey: TRANSLATION_KEYS.tqGoalBright,
      effect: {
        axes: { acidity: 8.5 },
        flavorAffinities: { [FLAVOR_TAGS.fruity]: 0.6, [FLAVOR_TAGS.citrus]: 0.4 },
      },
    },
    {
      id: 'strong',
      labelKey: TRANSLATION_KEYS.tqGoalStrong,
      effect: { axes: { body: 8, intensity: 8 } },
    },
    {
      id: 'clean',
      labelKey: TRANSLATION_KEYS.tqGoalClean,
      effect: {
        axes: { acidity: 6.5, body: 3.5, bitterness: 3 },
        flavorAffinities: { [FLAVOR_TAGS.floral]: 0.4, [FLAVOR_TAGS.teaLike]: 0.4 },
      },
    },
  ],
};
