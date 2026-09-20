import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SocialAuthButtonsStyleMap = ViewStyles<'wrapper' | 'divider' | 'rule'>;

export const createSocialAuthButtonsStyles = (theme: Theme): SocialAuthButtonsStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    divider: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    /** The line the espresso block draws everywhere else, doing the same job. */
    rule: {
      flex: 1,
      height: theme.borderWidth.thin,
      backgroundColor: theme.colors.espressoLine,
    },
  });
