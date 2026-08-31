import { ROAST_LEVELS } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Direct, and the only question that sets `roastPreference`.
 *
 * "Neviem posúdiť" claims nothing at all rather than quietly recording
 * "stredné": an assumed preference would follow the user into every
 * recommendation without them ever having said it.
 */
export const ROAST_QUESTION: TasteQuestion = {
  id: 'roast',
  promptKey: TRANSLATION_KEYS.tqRoastPrompt,
  helpKey: TRANSLATION_KEYS.tqRoastHelp,
  weight: QUESTION_WEIGHTS.direct,
  levels: QUESTION_LEVELS.informed,
  options: [
    {
      id: 'light',
      labelKey: TRANSLATION_KEYS.tqRoastLight,
      noteKey: TRANSLATION_KEYS.tqRoastLightNote,
      effect: {
        axes: { acidity: 8, body: 4, bitterness: 2.5 },
        roastPreference: ROAST_LEVELS.light,
      },
    },
    {
      id: 'medium',
      labelKey: TRANSLATION_KEYS.tqRoastMedium,
      noteKey: TRANSLATION_KEYS.tqRoastMediumNote,
      effect: {
        axes: { acidity: 5.5, sweetness: 6.5, body: 5.5, bitterness: 4.5 },
        roastPreference: ROAST_LEVELS.medium,
      },
    },
    {
      id: 'dark',
      labelKey: TRANSLATION_KEYS.tqRoastDark,
      noteKey: TRANSLATION_KEYS.tqRoastDarkNote,
      effect: {
        axes: { acidity: 2.5, body: 8, bitterness: 7.5, intensity: 8 },
        roastPreference: ROAST_LEVELS.dark,
      },
    },
    {
      id: 'unknown',
      labelKey: TRANSLATION_KEYS.tqRoastUnknown,
      noteKey: TRANSLATION_KEYS.tqRoastUnknownNote,
      effect: {},
    },
  ],
};
