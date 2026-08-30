import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeGreetingStyleMap = ViewStyles<'wrapper'>;

export const createHomeGreetingStyles = (theme: Theme): HomeGreetingStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xxs, paddingBottom: theme.spacing.xs },
  });
