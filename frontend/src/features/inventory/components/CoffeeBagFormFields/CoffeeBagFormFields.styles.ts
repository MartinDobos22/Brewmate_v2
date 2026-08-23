import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagFormFieldsStyleMap = ViewStyles<'wrapper' | 'chips'>;

export const createCoffeeBagFormFieldsStyles = (theme: Theme): CoffeeBagFormFieldsStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
