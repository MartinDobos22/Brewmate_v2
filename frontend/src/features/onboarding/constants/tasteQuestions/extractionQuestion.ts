import { TRANSLATION_KEYS } from '../../../../i18n';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Expert only, and the most directly useful answer in the whole questionnaire:
 * which side of a correct extraction this person likes to sit on.
 *
 * Everything else here describes a coffee; this describes what they want done
 * with it, which is the thing the recipe engine and the conversation after a
 * cup are actually deciding. Somebody who deliberately pulls a touch short is
 * asking for a different recipe from the same beans than somebody who chases a
 * full, heavy extraction - and until now the app could only work that out
 * after several cups had gone wrong.
 *
 * Weighed as a direct statement because it is one, in vocabulary that means
 * exactly one thing to anybody who can answer it at all.
 */
export const EXTRACTION_QUESTION: TasteQuestion = {
  id: 'extraction',
  promptKey: TRANSLATION_KEYS.tqExtractionPrompt,
  helpKey: TRANSLATION_KEYS.tqExtractionHelp,
  weight: QUESTION_WEIGHTS.direct,
  levels: QUESTION_LEVELS.expertOnly,
  options: [
    {
      id: 'bright',
      labelKey: TRANSLATION_KEYS.tqExtractionBright,
      noteKey: TRANSLATION_KEYS.tqExtractionBrightNote,
      effect: { axes: { acidity: 8.5, body: 4.5, bitterness: 2.5, intensity: 5.5 } },
    },
    {
      id: 'balanced',
      labelKey: TRANSLATION_KEYS.tqExtractionBalanced,
      noteKey: TRANSLATION_KEYS.tqExtractionBalancedNote,
      effect: { axes: { acidity: 6, sweetness: 7.5, body: 6, bitterness: 4.5 } },
    },
    {
      id: 'heavy',
      labelKey: TRANSLATION_KEYS.tqExtractionHeavy,
      noteKey: TRANSLATION_KEYS.tqExtractionHeavyNote,
      effect: { axes: { acidity: 4, body: 8.5, bitterness: 6, intensity: 8 } },
    },
  ],
};
