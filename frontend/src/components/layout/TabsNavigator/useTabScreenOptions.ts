import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { useTheme, useThemedStyles } from '../../../theme';

import { createTabsStyles } from './TabsNavigator.styles';

type TabScreenOptions = NonNullable<ComponentProps<typeof Tabs>['screenOptions']>;

/** Every tab shares these options; only the label and the glyph differ. */
export const useTabScreenOptions = (): TabScreenOptions => {
  const styles = useThemedStyles(createTabsStyles);
  const theme = useTheme();

  return {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabLabel,
  };
};
