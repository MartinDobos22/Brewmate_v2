import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentProps, JSX } from 'react';

import { BAR_STYLES, SCREEN_ANIMATIONS, SCREEN_PRESENTATIONS } from '../../../constants';
import { useReducedMotion } from '../../../hooks';
import { COLOR_SCHEMES, useTheme } from '../../../theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

const TABS_SEGMENT = '(tabs)';
const AUTH_SEGMENT = '(auth)';
const VERIFY_EMAIL_SEGMENT = 'verify-email';
const DESIGN_SYSTEM_SEGMENT = 'design-system';
const GRINDERS_SEGMENT = 'grinders';
const ONBOARDING_SEGMENT = 'onboarding';
const QUICK_BREW_SEGMENT = 'quick-brew';
const BREW_MODE_SEGMENT = 'brew-mode';
const CHAT_SEGMENT = 'chat';
const SCAN_SEGMENT = 'scan';

/**
 * The root navigator. Screen transitions are the only place the app animates
 * navigation, and they collapse to a cut when the system asks for less motion.
 */
export const RootStack = (): JSX.Element => {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();

  const screenOptions: StackScreenOptions = {
    headerShown: false,
    animation: reduceMotion ? SCREEN_ANIMATIONS.none : SCREEN_ANIMATIONS.slide,
    animationDuration: theme.duration.long,
    contentStyle: { backgroundColor: theme.colors.background },
  };

  return (
    <>
      <StatusBar style={theme.scheme === COLOR_SCHEMES.dark ? BAR_STYLES.light : BAR_STYLES.dark} />
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name={AUTH_SEGMENT} />
        <Stack.Screen name={TABS_SEGMENT} />
        <Stack.Screen name={VERIFY_EMAIL_SEGMENT} />
        <Stack.Screen name={GRINDERS_SEGMENT} />
        <Stack.Screen name={ONBOARDING_SEGMENT} />
        <Stack.Screen name={QUICK_BREW_SEGMENT} />
        {/*
          Brew mode does not swipe away. It is the one screen somebody uses
          with wet hands at arm's length, and a stray edge swipe halfway
          through a pour would lose the timer the whole feature is built on.
        */}
        <Stack.Screen name={BREW_MODE_SEGMENT} options={{ gestureEnabled: false }} />
        <Stack.Screen name={CHAT_SEGMENT} />
        <Stack.Screen name={SCAN_SEGMENT} />
        <Stack.Screen
          name={DESIGN_SYSTEM_SEGMENT}
          options={{
            presentation: SCREEN_PRESENTATIONS.modal,
            animation: reduceMotion ? SCREEN_ANIMATIONS.none : SCREEN_ANIMATIONS.modal,
          }}
        />
      </Stack>
    </>
  );
};
