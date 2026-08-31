import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Expert only, and the question that separates two people who would otherwise
 * answer everything else identically.
 *
 * Processing moves a cup further than origin does, and it is the axis along
 * which specialty drinkers actually disagree with each other: the same person
 * who wants a bright Ethiopian may want it washed and clean or natural and
 * jammy, and those are close to opposite cups. Nobody who has not tasted both
 * has an opinion here, which is why it is asked of nobody else.
 */
export const PROCESS_QUESTION: TasteQuestion = {
  id: 'process',
  promptKey: TRANSLATION_KEYS.tqProcessPrompt,
  helpKey: TRANSLATION_KEYS.tqProcessHelp,
  weight: QUESTION_WEIGHTS.direct,
  levels: QUESTION_LEVELS.expertOnly,
  options: [
    {
      id: 'washed',
      labelKey: TRANSLATION_KEYS.tqProcessWashed,
      noteKey: TRANSLATION_KEYS.tqProcessWashedNote,
      effect: {
        axes: { acidity: 8, sweetness: 5.5, body: 4, bitterness: 3.5 },
        flavorAffinities: {
          [FLAVOR_TAGS.citrus]: 0.5,
          [FLAVOR_TAGS.floral]: 0.5,
          [FLAVOR_TAGS.teaLike]: 0.4,
        },
      },
    },
    {
      id: 'natural',
      labelKey: TRANSLATION_KEYS.tqProcessNatural,
      noteKey: TRANSLATION_KEYS.tqProcessNaturalNote,
      effect: {
        axes: { acidity: 6, sweetness: 9, body: 7.5 },
        flavorAffinities: { [FLAVOR_TAGS.berry]: 0.7, [FLAVOR_TAGS.fruity]: 0.8 },
      },
    },
    {
      id: 'experimental',
      labelKey: TRANSLATION_KEYS.tqProcessExperimental,
      noteKey: TRANSLATION_KEYS.tqProcessExperimentalNote,
      effect: {
        axes: { acidity: 6.5, sweetness: 9, body: 7, intensity: 8 },
        flavorAffinities: {
          [FLAVOR_TAGS.fruity]: 0.8,
          [FLAVOR_TAGS.spice]: 0.5,
          [FLAVOR_TAGS.berry]: 0.5,
        },
      },
    },
    { id: 'noPreference', labelKey: TRANSLATION_KEYS.tqProcessNone, effect: {} },
  ],
};
