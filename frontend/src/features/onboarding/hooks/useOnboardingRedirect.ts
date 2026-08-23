import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

import { AUTH_GROUP_SEGMENT, ROUTES } from '../../../constants';
import { AUTH_STATUS, useAuthSession, useCurrentUser } from '../../auth';
import { ONBOARDING_ROUTE_SEGMENT } from '../constants/onboardingSteps';
import { isOnboardingFinished, readOnboardingState } from '../services/onboardingState';

const FIRST_SEGMENT = 0;

/**
 * Takes a user who has never finished onboarding to it, once per account.
 *
 * Only ever a redirect *into* the flow: leaving is the flow's own business,
 * and a gate that also pushed people out would fight the step machine every
 * time it moved. Somebody who skipped has `completedAt` set, so they are never
 * dragged back - the invitation to finish belongs in the profile screen, not
 * in a redirect they cannot refuse.
 *
 * Once per account is what keeps the last screen of the flow from bouncing
 * back into it: finishing writes the new state optimistically, and this effect
 * can run in the gap before that write lands. The account id is what the ref
 * holds rather than a plain flag, so signing in as somebody else still gets
 * their own first run.
 */
export const useOnboardingRedirect = (): void => {
  const { status, needsEmailVerification } = useAuthSession();
  const { data: user, isSuccess } = useCurrentUser();
  const segments = useSegments();
  const router = useRouter();
  const redirectedFor = useRef<string | null>(null);

  useEffect((): void => {
    const settled = status === AUTH_STATUS.authenticated && !needsEmailVerification && isSuccess;
    const inAuthGroup = segments[FIRST_SEGMENT] === AUTH_GROUP_SEGMENT;
    const inOnboarding = segments.includes(ONBOARDING_ROUTE_SEGMENT);

    if (!settled || inAuthGroup || inOnboarding) {
      return;
    }

    if (redirectedFor.current === user.id || isOnboardingFinished(readOnboardingState(user))) {
      return;
    }

    redirectedFor.current = user.id;
    router.replace(ROUTES.onboarding);
  }, [status, needsEmailVerification, isSuccess, user, segments, router]);
};
