import { MILK_USAGE_LEVELS } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * The first thing a beginner is asked, and the only one that starts from what
 * they already drink rather than from what they might want.
 *
 * Somebody whose coffee has always come out of a capsule machine has a palate
 * that was built on it - dark, thick, bitter by design - and the honest
 * reading of that is not "they like bitterness" but "this is the reference
 * point everything I recommend will be judged against". So it lands as a
 * moderate position rather than a strong one, and the questions after it are
 * what pull it in either direction.
 *
 * It sets `milkUsage` only where the answer names it outright: a latte drinker
 * has told us, a "z kaviarne, neviem aké" has not.
 */
export const EVERYDAY_COFFEE_QUESTION: TasteQuestion = {
  id: 'everydayCoffee',
  promptKey: TRANSLATION_KEYS.tqEverydayPrompt,
  helpKey: TRANSLATION_KEYS.tqEverydayHelp,
  weight: QUESTION_WEIGHTS.behaviour,
  levels: QUESTION_LEVELS.beginnerOnly,
  options: [
    {
      id: 'instant',
      labelKey: TRANSLATION_KEYS.tqEverydayInstant,
      noteKey: TRANSLATION_KEYS.tqEverydayInstantNote,
      effect: { axes: { acidity: 4, body: 4.5, bitterness: 6, intensity: 5 } },
    },
    {
      id: 'capsule',
      labelKey: TRANSLATION_KEYS.tqEverydayCapsule,
      noteKey: TRANSLATION_KEYS.tqEverydayCapsuleNote,
      effect: {
        axes: { acidity: 3.5, body: 7, bitterness: 6.5, intensity: 7.5 },
        flavorAffinities: { [FLAVOR_TAGS.chocolate]: 0.3, [FLAVOR_TAGS.nutty]: 0.2 },
      },
    },
    {
      id: 'milkDrink',
      labelKey: TRANSLATION_KEYS.tqEverydayMilkDrink,
      noteKey: TRANSLATION_KEYS.tqEverydayMilkDrinkNote,
      effect: {
        axes: { acidity: 3.5, sweetness: 7.5, body: 7.5, intensity: 6.5 },
        flavorAffinities: { [FLAVOR_TAGS.caramel]: 0.4, [FLAVOR_TAGS.chocolate]: 0.4 },
        milkUsage: MILK_USAGE_LEVELS.always,
      },
    },
    {
      id: 'filter',
      labelKey: TRANSLATION_KEYS.tqEverydayFilter,
      noteKey: TRANSLATION_KEYS.tqEverydayFilterNote,
      effect: { axes: { acidity: 6, body: 4.5, bitterness: 4, intensity: 4.5 } },
    },
    { id: 'rarely', labelKey: TRANSLATION_KEYS.tqEverydayRarely, effect: {} },
  ],
};
