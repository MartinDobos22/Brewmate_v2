import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentProps, JSX } from 'react';

import { BAR_STYLES, SCREEN_ANIMATIONS, SCREEN_PRESENTATIONS } from '../../../constants';
import { useReducedMotion } from '../../../hooks';
import { COLOR_SCHEMES, useTheme } from '../../../theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

const TABS_SEGMENT = '(tabs)';
const DESIGN_SYSTEM_SEGMENT = 'design-system';

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
        <Stack.Screen name={TABS_SEGMENT} />
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
