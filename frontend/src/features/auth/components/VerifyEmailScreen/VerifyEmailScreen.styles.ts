import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type VerifyEmailScreenStyleMap = ViewStyles<'actions'>;

export const createVerifyEmailScreenStyles = (theme: Theme): VerifyEmailScreenStyleMap =>
  StyleSheet.create({
    actions: { gap: theme.spacing.md },
  });
