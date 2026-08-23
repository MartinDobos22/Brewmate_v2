import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ConfidenceNoticeStyleMap = ViewStyles<'wrapper'>;

export const createConfidenceNoticeStyles = (theme: Theme): ConfidenceNoticeStyleMap =>
  StyleSheet.create({
    wrapper: {
      alignSelf: 'stretch',
      gap: theme.spacing.xxs,
      borderLeftWidth: theme.borderWidth.thick,
      borderLeftColor: theme.colors.outlineVariant,
      paddingLeft: theme.spacing.md,
    },
  });
