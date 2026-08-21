import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type ListItemStyleMap = ViewStyles<'base' | 'pressed' | 'content' | 'trailing' | 'divider'>;

/** List items share the button radius, so the app reads as one shape family. */
export const createListItemStyles = (theme: Theme): ListItemStyleMap =>
  StyleSheet.create({
    base: {
      minHeight: theme.size.listItemMinHeight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.shape.listItem,
      backgroundColor: theme.colors.surface,
    },
    pressed: { backgroundColor: theme.colors.surfaceContainer },
    content: { flex: 1, gap: theme.spacing.xxs },
    trailing: { alignItems: 'flex-end', justifyContent: 'center' },
    divider: {
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.outlineVariant,
      borderBottomLeftRadius: theme.radius.none,
      borderBottomRightRadius: theme.radius.none,
    },
  });
