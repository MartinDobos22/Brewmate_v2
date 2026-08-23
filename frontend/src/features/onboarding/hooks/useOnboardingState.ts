import type { OnboardingState } from '@brewmate/shared';

import { useCurrentUser } from '../../auth';
import { useUpdateCurrentUser } from '../../profile/hooks';
import { readOnboardingState } from '../services/onboardingState';

export interface OnboardingStateStore {
  readonly state: OnboardingState;
  /** False until `/me` has answered, so the flow never resumes at the wrong step. */
  readonly isReady: boolean;
  readonly save: (next: OnboardingState) => void;
  readonly isSaving: boolean;
  readonly hasFailed: boolean;
}

/**
 * Onboarding progress, as the server holds it.
 *
 * The state lives in `users.onboarding_state` rather than on the device: a
 * user who reinstalls the app, or signs in on a second phone, is the same
 * person halfway through the same flow.
 *
 * The write is optimistic, which is why the flow can move to the next screen
 * immediately - `PATCH /me` has nothing to decide here, it only records what
 * the user already did.
 */
export const useOnboardingState = (): OnboardingStateStore => {
  const { data: user, isSuccess } = useCurrentUser();
  const update = useUpdateCurrentUser();

  return {
    state: readOnboardingState(user),
    isReady: isSuccess,
    isSaving: update.isPending,
    hasFailed: update.isError,
    save: (next: OnboardingState): void => {
      update.mutate({ onboardingState: next });
    },
  };
};
