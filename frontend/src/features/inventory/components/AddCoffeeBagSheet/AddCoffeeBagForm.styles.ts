import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AddCoffeeBagFormStyleMap = ViewStyles<'scroll' | 'form'>;

export const createAddCoffeeBagFormStyles = (theme: Theme): AddCoffeeBagFormStyleMap =>
  StyleSheet.create({
    /** The sheet caps its own height, so the form scrolls inside it. */
    scroll: { flexShrink: 1 },
    form: { gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  });
