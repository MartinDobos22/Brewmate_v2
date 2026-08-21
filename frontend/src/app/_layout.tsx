import * as SplashScreen from 'expo-splash-screen';
import type { JSX } from 'react';

import { AppProviders, RootStack } from '../components/layout';
import { AuthGate, AuthProvider } from '../features/auth';
import { useAppFonts } from '../hooks';

void SplashScreen.preventAutoHideAsync();

/**
 * App entry point. The splash screen stays up until the fonts are loaded and
 * Firebase has said whether anyone is signed in - the gate hides it, so the
 * first screen the user sees is already the right one.
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
          <RootStack />
        </AuthGate>
      </AuthProvider>
    </AppProviders>
  );
}
