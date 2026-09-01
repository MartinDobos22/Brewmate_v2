import { MILK_USAGE_LEVELS } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * A habit rather than a preference, and the single most useful answer here:
 * milk hides acidity and adds sweetness, so a coffee chosen for somebody who
 * always drinks a flat white is a different coffee entirely.
 */
export const MILK_QUESTION: TasteQuestion = {
  id: 'milk',
  promptKey: TRANSLATION_KEYS.tqMilkPrompt,
  helpKey: TRANSLATION_KEYS.tqMilkHelp,
  weight: QUESTION_WEIGHTS.habit,
  levels: QUESTION_LEVELS.everyone,
  options: [
    {
      id: 'never',
      labelKey: TRANSLATION_KEYS.tqMilkNever,
      effect: { axes: { body: 5, intensity: 5.5 }, milkUsage: MILK_USAGE_LEVELS.never },
    },
    {
      id: 'sometimes',
      labelKey: TRANSLATION_KEYS.tqMilkSometimes,
      effect: { axes: { body: 5.5, intensity: 6 }, milkUsage: MILK_USAGE_LEVELS.sometimes },
    },
    {
      id: 'often',
      labelKey: TRANSLATION_KEYS.tqMilkOften,
      effect: {
        axes: { acidity: 4, body: 7, intensity: 7 },
        milkUsage: MILK_USAGE_LEVELS.often,
      },
    },
    {
      id: 'always',
      labelKey: TRANSLATION_KEYS.tqMilkAlways,
      effect: {
        axes: { acidity: 3.5, sweetness: 7, body: 8, intensity: 7.5 },
        milkUsage: MILK_USAGE_LEVELS.always,
      },
    },
  ],
};
