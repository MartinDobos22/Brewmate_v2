import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewModeScreenStyleMap = ViewStyles<'wrapper' | 'intro' | 'facts' | 'grind'>;

export const createBrewModeScreenStyles = (theme: Theme): BrewModeScreenStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xl, flexGrow: 1, justifyContent: 'space-between' },
    intro: { gap: theme.spacing.md },
    facts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xl,
      marginTop: theme.spacing.md,
    },
    grind: { gap: theme.spacing.xxs },
  });
