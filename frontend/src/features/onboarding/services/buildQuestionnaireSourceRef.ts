import { QUESTIONNAIRE_SOURCE_REF } from '../constants/fingerprint';

import { fingerprint } from '../../../lib/fingerprint';

/**
 * What makes submitting the questionnaire safe to retry.
 *
 * Identical answers produce an identical reference, and the API answers with
 * the event it already stored instead of counting the same opinion twice. A
 * genuinely different set of answers produces a different reference, which is
 * what makes retaking the questionnaire mean something.
 */
export const buildQuestionnaireSourceRef = (answers: Readonly<Record<string, string>>): string =>
  [QUESTIONNAIRE_SOURCE_REF.prefix, QUESTIONNAIRE_SOURCE_REF.version, fingerprint(answers)].join(
    QUESTIONNAIRE_SOURCE_REF.separator,
  );
