import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AuthNavigationLinkStyleMap = ViewStyles<'row' | 'pressed'>;

export const createAuthNavigationLinkStyles = (theme: Theme): AuthNavigationLinkStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      minHeight: theme.size.minTouchTarget,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
