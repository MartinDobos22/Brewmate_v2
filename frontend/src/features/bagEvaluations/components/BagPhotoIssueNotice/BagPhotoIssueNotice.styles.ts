import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagPhotoIssueNoticeStyleMap = ViewStyles<'reasons'>;

export const createBagPhotoIssueNoticeStyles = (theme: Theme): BagPhotoIssueNoticeStyleMap =>
  StyleSheet.create({
    reasons: { gap: theme.spacing.xs },
  });
