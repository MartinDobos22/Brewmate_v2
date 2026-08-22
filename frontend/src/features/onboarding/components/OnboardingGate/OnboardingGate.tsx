import type { JSX, ReactNode } from 'react';

import { useOnboardingRedirect } from '../../hooks/useOnboardingRedirect';

export interface OnboardingGateProps {
  readonly children: ReactNode;
}

/**
 * Sends a brand new account into onboarding before it sees an empty home
 * screen. Everything else it renders untouched.
 */
export const OnboardingGate = ({ children }: OnboardingGateProps): JSX.Element => {
  useOnboardingRedirect();

  return <>{children}</>;
};
