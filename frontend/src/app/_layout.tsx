import * as SplashScreen from 'expo-splash-screen';
import type { JSX } from 'react';

import { AppProviders, RootStack } from '../components/layout';
import { AuthGate, AuthProvider } from '../features/auth';
import { OnboardingGate } from '../features/onboarding';
import { useAppFonts } from '../hooks';

void SplashScreen.preventAutoHideAsync();

/**
 * App entry point. The splash screen stays up until the fonts are loaded and
 * Firebase has said whether anyone is signed in - the auth gate hides it, so
 * the first screen the user sees is already the right one. The onboarding gate
 * sits inside it, because who the user is has to be settled before the app can
 * ask whether they ever finished setting themselves up.
 */
export default function RootLayout(): JSX.Element | null {
  const fontsReady = useAppFonts();

  if (!fontsReady) {
    return null;
  }

  return (
    <AppProviders>
      <AuthProvider>
        <AuthGate>
          <OnboardingGate>
            <RootStack />
          </OnboardingGate>
        </AuthGate>
      </AuthProvider>
    </AppProviders>
  );
}
