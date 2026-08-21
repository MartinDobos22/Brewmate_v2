import { z } from 'zod';

import { ONBOARDING_STEP_MAX_LENGTH, ONBOARDING_VERSION_MIN } from './userFieldLimits.js';

/**
 * How far through onboarding the user got.
 *
 * Stored as `jsonb` rather than columns: it is read whole by exactly one
 * client, never queried across users, and its steps change every time the
 * flow is redesigned.
 */
export const onboardingStateSchema = z.object({
  version: z.number().int().min(ONBOARDING_VERSION_MIN),
  completedSteps: z.array(z.string().max(ONBOARDING_STEP_MAX_LENGTH)),
  currentStep: z.string().max(ONBOARDING_STEP_MAX_LENGTH).nullable(),
  completedAt: z.iso.datetime().nullable(),
});

export type OnboardingState = z.infer<typeof onboardingStateSchema>;
