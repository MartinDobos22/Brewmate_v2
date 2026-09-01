import { AI_MODELS, type AiModelId } from '../../../ai/constants/aiModels.js';

import { AI_FUNCTION_NAMES, type AiFunctionName } from './aiFunctionNames.js';

/**
 * Which model answers which question.
 *
 * The split is by what the answer has to be, not by how long it is. Reading a
 * label, working out what is in the bag from it, writing a shop verdict,
 * writing a recipe, answering what somebody said about a cup, reading and
 * converting somebody else's recipe and dialling an espresso in are all cases
 * where being wrong costs a bag of coffee or a morning, and where the answer
 * is an argument rather than a transcription. They go to Sonnet.
 *
 * `estimate-coffee-taste` is on the larger model even though the arithmetic
 * around it is in code, and deliberately: what it is asked for is precisely
 * the part a lookup table cannot do - what Yirgacheffe implies, what an
 * unfamiliar note tastes like, what a label in another language says - and a
 * cheaper model asked that question does not decline to answer, it guesses.
 *
 * `tune-profile` is the auxiliary case, and the only one. Every number in that
 * answer has already been computed in code from the brew logs - the model is
 * handed the finished arithmetic and asked for two Slovak sentences about it,
 * with no field anywhere in its schema for a figure it could move. That is
 * typing, not reasoning, and Haiku does it at a third of the price.
 *
 * The record is total over `AiFunctionName`, so adding a function is a type
 * error here rather than a call that quietly defaults to the expensive model.
 */
export const AI_MODEL_ROUTES: Record<AiFunctionName, AiModelId> = {
  [AI_FUNCTION_NAMES.parseCoffeeBag]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.evaluateCoffee]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.estimateCoffeeTaste]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.generateRecipe]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.recipeChat]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.parseRecipe]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.convertRecipe]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.espressoDialIn]: AI_MODELS.sonnet,
  [AI_FUNCTION_NAMES.tuneProfile]: AI_MODELS.haiku,
};
