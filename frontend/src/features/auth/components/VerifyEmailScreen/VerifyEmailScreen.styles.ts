import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type VerifyEmailScreenStyleMap = ViewStyles<'account' | 'actions'>;

export const createVerifyEmailScreenStyles = (theme: Theme): VerifyEmailScreenStyleMap =>
  StyleSheet.create({
    /** The address being verified, in the inset block this screen's ground takes. */
    account: {
      gap: theme.spacing.xxs,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.espressoDeep,
    },
    actions: { gap: theme.spacing.md },
  });
