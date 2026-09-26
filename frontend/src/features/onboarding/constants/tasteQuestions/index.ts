import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { ACIDITY_QUESTION } from './acidityQuestion';
import { AROMA_QUESTION } from './aromaQuestion';
import { BODY_QUESTION } from './bodyQuestion';
import { CHOCOLATE_QUESTION } from './chocolateQuestion';
import { DISLIKE_QUESTION } from './dislikeQuestion';
import { EVERYDAY_COFFEE_QUESTION } from './everydayCoffeeQuestion';
import { FRUIT_QUESTION } from './fruitQuestion';
import { GOAL_QUESTION } from './goalQuestion';
import { INTENSITY_QUESTION } from './intensityQuestion';
import { MILK_QUESTION } from './milkQuestion';
import { ORIGIN_QUESTION } from './originQuestion';
import { PROCESS_QUESTION } from './processQuestion';
import { ROAST_QUESTION } from './roastQuestion';
import { TEA_QUESTION } from './teaQuestion';

/**
 * Every question the app knows, in the order they are asked.
 *
 * One catalogue rather than one list per level. The three levels overlap
 * heavily - everybody is asked what ruins a cup for them and how they take
 * their milk - and each question already names its own audience, so the order
 * is stated once here and a level is a filter over it rather than a fourth
 * place the same question has to be kept in step.
 *
 * The order alternates deliberately. Ten questions about coffee in a row turn
 * into an exam somebody feels unqualified to sit; a question about tea, fruit
 * or chocolate between them keeps it a conversation, and for anybody below the
 * expert level happens to be the better evidence of the two. It opens with
 * something answerable without thinking and closes with what the person is
 * actually chasing.
 *
 * Every question is about the coffee somebody should buy, never about how to
 * brew it. The answers are what the shop verdict argues from on an account's
 * first day, and a question about extraction or concentration would be
 * evidence about a kitchen folded into advice about a shelf.
 */
export const TASTE_QUESTIONS = [
  EVERYDAY_COFFEE_QUESTION,
  ACIDITY_QUESTION,
  TEA_QUESTION,
  FRUIT_QUESTION,
  ORIGIN_QUESTION,
  CHOCOLATE_QUESTION,
  ROAST_QUESTION,
  PROCESS_QUESTION,
  MILK_QUESTION,
  BODY_QUESTION,
  AROMA_QUESTION,
  INTENSITY_QUESTION,
  DISLIKE_QUESTION,
  GOAL_QUESTION,
] as const satisfies readonly TasteQuestion[];
