import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type VerifyEmailScreenStyleMap = ViewStyles<'account' | 'status' | 'actions'>;

export const createVerifyEmailScreenStyles = (theme: Theme): VerifyEmailScreenStyleMap =>
  StyleSheet.create({
    /** The address being verified, in the inset block this screen's ground takes. */
    account: {
      gap: theme.spacing.xxs,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.espressoDeep,
    },
    /** The glyph and its words are one statement, so they sit tighter. */
    status: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    actions: { gap: theme.spacing.md },
  });
