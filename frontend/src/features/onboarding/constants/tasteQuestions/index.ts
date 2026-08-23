import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { ACIDITY_QUESTION } from './acidityQuestion';
import { AROMA_QUESTION } from './aromaQuestion';
import { BODY_QUESTION } from './bodyQuestion';
import { CHOCOLATE_QUESTION } from './chocolateQuestion';
import { DISLIKE_QUESTION } from './dislikeQuestion';
import { GOAL_QUESTION } from './goalQuestion';
import { MILK_QUESTION } from './milkQuestion';
import { ROAST_QUESTION } from './roastQuestion';
import { STRENGTH_QUESTION } from './strengthQuestion';
import { TEA_QUESTION } from './teaQuestion';

/**
 * The questionnaire, in the order it is asked.
 *
 * Direct and indirect questions alternate deliberately. Ten questions about
 * coffee in a row turn into an exam somebody feels unqualified to sit; a
 * question about tea or chocolate between them keeps it a conversation, and
 * happens to be the better evidence of the two.
 */
export const TASTE_QUESTIONS = [
  ACIDITY_QUESTION,
  TEA_QUESTION,
  CHOCOLATE_QUESTION,
  ROAST_QUESTION,
  MILK_QUESTION,
  BODY_QUESTION,
  AROMA_QUESTION,
  STRENGTH_QUESTION,
  DISLIKE_QUESTION,
  GOAL_QUESTION,
] as const satisfies readonly TasteQuestion[];
