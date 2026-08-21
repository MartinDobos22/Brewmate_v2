import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type EmailPasswordFormStyleMap = ViewStyles<'form' | 'footer'>;

export const createEmailPasswordFormStyles = (theme: Theme): EmailPasswordFormStyleMap =>
  StyleSheet.create({
    form: { gap: theme.spacing.lg },
    footer: { alignItems: 'flex-start' },
  });
