import { ONBOARDING_FLOW_VERSION } from './onboardingSteps';

/**
 * How a questionnaire submission identifies itself.
 *
 * The flow version travels with the fingerprint: the same taps against a
 * different set of questions are different evidence, and must not be mistaken
 * for a retry of the old one.
 */
export const QUESTIONNAIRE_SOURCE_REF = {
  prefix: 'q',
  separator: '-',
  version: String(ONBOARDING_FLOW_VERSION),
} as const;
