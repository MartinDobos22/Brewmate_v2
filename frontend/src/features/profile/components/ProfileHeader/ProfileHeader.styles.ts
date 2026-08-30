import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ProfileHeaderStyleMap = ViewStyles<'wrapper'>;

export const createProfileHeaderStyles = (theme: Theme): ProfileHeaderStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xxs, paddingBottom: theme.spacing.xs },
  });
