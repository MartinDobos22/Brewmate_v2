import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ForgotPasswordScreenStyleMap = ViewStyles<'form'>;

export const createForgotPasswordScreenStyles = (theme: Theme): ForgotPasswordScreenStyleMap =>
  StyleSheet.create({
    form: { gap: theme.spacing.lg },
  });
