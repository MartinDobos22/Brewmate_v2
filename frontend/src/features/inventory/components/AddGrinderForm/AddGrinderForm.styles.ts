import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AddGrinderFormStyleMap = ViewStyles<'scroll' | 'form'>;

export const createAddGrinderFormStyles = (theme: Theme): AddGrinderFormStyleMap =>
  StyleSheet.create({
    /** The sheet caps its own height, so the form scrolls inside it. */
    scroll: { flexShrink: 1 },
    form: { gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  });
