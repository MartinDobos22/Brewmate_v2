import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderListStyleMap = ViewStyles<'content'>;

export const createGrinderListStyles = (theme: Theme): GrinderListStyleMap =>
  StyleSheet.create({
    content: { paddingBottom: theme.spacing.xxl },
  });
