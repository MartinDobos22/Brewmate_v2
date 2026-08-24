import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewTimerDisplayStyleMap = ViewStyles<'wrapper'>;

export const createBrewTimerDisplayStyles = (theme: Theme): BrewTimerDisplayStyleMap =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xl,
    },
  });
