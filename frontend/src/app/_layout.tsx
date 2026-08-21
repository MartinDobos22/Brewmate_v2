import { useEffect, type JSX } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { AppProviders, RootStack } from '../components/layout';
import { useAppFonts } from '../hooks';

void SplashScreen.preventAutoHideAsync();

/** App entry point: hold the splash screen until the fonts are ready. */
export default function RootLayout(): JSX.Element | null {
  const fontsReady = useAppFonts();

  useEffect((): void => {
    if (fontsReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) {
    return null;
  }

  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
