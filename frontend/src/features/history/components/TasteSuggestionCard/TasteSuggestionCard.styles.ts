import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SuggestionStyleMap = ViewStyles<'body' | 'changes' | 'actions' | 'source'>;

export const createTasteSuggestionStyles = (theme: Theme): SuggestionStyleMap =>
  StyleSheet.create({
    body: { gap: theme.spacing.xs, marginBottom: theme.spacing.sm },
    changes: {
      gap: theme.spacing.xxs,
      borderLeftWidth: theme.borderWidth.thick,
      borderLeftColor: theme.colors.outlineVariant,
      paddingLeft: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    /**
     * Both answers side by side and the same size. Refusing has to look like a
     * reasonable thing to do - people buy what the shop had, and an app that
     * made "no" the small grey option would be pressing for agreement it has
     * not earned.
     */
    actions: { flexDirection: 'row', gap: theme.spacing.sm },
    source: { marginTop: theme.spacing.xs },
  });
