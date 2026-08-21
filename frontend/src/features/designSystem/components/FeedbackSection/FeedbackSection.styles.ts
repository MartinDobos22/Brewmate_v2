import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type FeedbackSectionStyleMap = ViewStyles<'box'>;

export const createFeedbackSectionStyles = (theme: Theme): FeedbackSectionStyleMap =>
  StyleSheet.create({
    box: {
      height: theme.size.previewBoxHeight,
      borderRadius: theme.shape.card,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
      overflow: 'hidden',
    },
  });
