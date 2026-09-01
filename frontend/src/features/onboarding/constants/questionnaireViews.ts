/**
 * The three things the taste step can be showing.
 *
 * Named rather than inferred from which fields happen to be null, because the
 * difference between them is a promise to the person answering: on `summary`
 * nothing they tap can change what the profile was taught, and that guarantee
 * is worth stating as a value rather than reconstructing from three booleans
 * at every call site.
 */
export const QUESTIONNAIRE_VIEWS = {
  /** Question zero: which set of questions this person gets asked. */
  level: 'level',
  /** One question, answered by tapping a card. */
  question: 'question',
  /** Everything that was answered, read-only until somebody asks to edit it. */
  summary: 'summary',
} as const;

export type QuestionnaireView = (typeof QUESTIONNAIRE_VIEWS)[keyof typeof QUESTIONNAIRE_VIEWS];
