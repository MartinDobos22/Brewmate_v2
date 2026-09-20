import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OfflineNoticeStyleMap = ViewStyles<'block' | 'body'>;

export const createOfflineNoticeStyles = (theme: Theme): OfflineNoticeStyleMap =>
  StyleSheet.create({
    block: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.espressoDeep,
    },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
  });
