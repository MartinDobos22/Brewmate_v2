import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeHeaderStyleMap = ViewStyles<'greeting'>;

export const createHomeHeaderStyles = (theme: Theme): HomeHeaderStyleMap =>
  StyleSheet.create({
    greeting: { gap: theme.spacing.xs },
  });
