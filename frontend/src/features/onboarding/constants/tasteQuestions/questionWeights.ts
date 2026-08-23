/**
 * How much each kind of question counts when the answers are folded together.
 *
 * A direct answer is somebody telling us outright and counts fully. An
 * indirect one is an inference from chocolate or tea - a good inference, which
 * is why it is asked at all, but still an inference. Milk sits between the
 * two: it is a fact about how the person drinks, not a guess about their
 * palate, and it changes what a cup should taste like more than any single
 * preference does.
 */
export const QUESTION_WEIGHTS = {
  direct: 1,
  indirect: 0.7,
  habit: 0.9,
} as const;
