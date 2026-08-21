import { StyleSheet } from 'react-native';

import type { TextStyles, Theme, ViewStyles } from '../../../theme';

type TabsStyleMap = ViewStyles<'tabBar'> & TextStyles<'tabLabel'>;

/**
 * The tab bar is a surface, not a floating element: it is told apart by colour
 * and a hairline, never by a shadow.
 */
export const createTabsStyles = (theme: Theme): TabsStyleMap =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: theme.borderWidth.thin,
      borderTopColor: theme.colors.outlineVariant,
    },
    tabLabel: { ...theme.typography.labelSmall },
  });
