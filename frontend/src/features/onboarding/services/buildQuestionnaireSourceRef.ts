import { fingerprint } from '../../../lib/fingerprint';

import { QUESTIONNAIRE_SOURCE_REF } from '../constants/fingerprint';
import type { TasteExperienceLevel } from '../constants/tasteExperienceLevels';

/**
 * What makes submitting the questionnaire safe to retry.
 *
 * Identical answers produce an identical reference, and the API answers with
 * the event it already stored instead of counting the same opinion twice. A
 * genuinely different set of answers produces a different reference, which is
 * what makes retaking the questionnaire mean something.
 *
 * The level is part of the identity rather than part of the fingerprint. The
 * same taps against a different set of questions are a different statement
 * about somebody - an expert answering five technical questions has said
 * something a beginner's five plain ones never could - and coming back to
 * answer properly must count as the new evidence it is, not be turned away as
 * a retry of the old submission.
 */
export const buildQuestionnaireSourceRef = (
  answers: Readonly<Record<string, string>>,
  level: TasteExperienceLevel,
): string =>
  [
    QUESTIONNAIRE_SOURCE_REF.prefix,
    QUESTIONNAIRE_SOURCE_REF.version,
    level,
    fingerprint(answers),
  ].join(QUESTIONNAIRE_SOURCE_REF.separator);
