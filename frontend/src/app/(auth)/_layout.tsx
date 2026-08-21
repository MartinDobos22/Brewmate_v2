import { Stack } from 'expo-router';
import type { ComponentProps, JSX } from 'react';

import { SCREEN_ANIMATIONS } from '../../constants';
import { useReducedMotion } from '../../hooks';
import { useTheme } from '../../theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

/** The screens a signed-out visitor may see. `useProtectedRoute` guards them. */
export default function AuthLayout(): JSX.Element {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();

  const screenOptions: StackScreenOptions = {
    headerShown: false,
    animation: reduceMotion ? SCREEN_ANIMATIONS.none : SCREEN_ANIMATIONS.slide,
    animationDuration: theme.duration.long,
    contentStyle: { backgroundColor: theme.colors.background },
  };

  return <Stack screenOptions={screenOptions} />;
}
