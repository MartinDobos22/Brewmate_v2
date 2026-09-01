import { z } from 'zod';

import {
  ONBOARDING_ANSWER_MAX_LENGTH,
  ONBOARDING_STEP_MAX_LENGTH,
  ONBOARDING_VERSION_MIN,
} from './userFieldLimits.js';

/**
 * How far through onboarding the user got.
 *
 * Stored as `jsonb` rather than columns: it is read whole by exactly one
 * client, never queried across users, and its steps change every time the
 * flow is redesigned.
 *
 * Three fields carry two facts, and the combination is the whole state
 * machine:
 *
 * - `completedAt === null` - the user is still inside the flow, or has never
 *   opened it.
 * - `completedAt` set and `currentStep === null` - they went all the way to
 *   the end.
 * - `completedAt` set and `currentStep` still named - they left early. The
 *   step is where they were standing, so "continue" resumes rather than
 *   restarts.
 *
 * There is deliberately no `skipped` flag: it would be a third field
 * restating what these two already say, and two of them could disagree.
 *
 * `questionnaireAnswers` maps a question to the option that was tapped. It is
 * what makes an interrupted questionnaire resumable, and what lets the profile
 * screen reopen the questionnaire with the previous answers already in place.
 *
 * `questionnaireLevel` is which set of questions those answers belong to. It
 * has to be stored beside them rather than inferred: the same option id can
 * exist in two levels, and a questionnaire resumed against the wrong set would
 * read somebody's answers as evidence for questions they were never asked.
 * Held as a plain string here for the same reason the steps are - the levels
 * belong to the flow, which is the app's business, and the API only ever
 * stores this and hands it back.
 */
export const onboardingStateSchema = z.object({
  version: z.number().int().min(ONBOARDING_VERSION_MIN),
  completedSteps: z.array(z.string().max(ONBOARDING_STEP_MAX_LENGTH)),
  currentStep: z.string().max(ONBOARDING_STEP_MAX_LENGTH).nullable(),
  completedAt: z.iso.datetime().nullable(),
  questionnaireAnswers: z
    .record(
      z.string().max(ONBOARDING_STEP_MAX_LENGTH),
      z.string().max(ONBOARDING_ANSWER_MAX_LENGTH),
    )
    .default({}),
  questionnaireLevel: z.string().max(ONBOARDING_STEP_MAX_LENGTH).nullable().default(null),
});

export type OnboardingState = z.infer<typeof onboardingStateSchema>;
