import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeBagListStyleMap = ViewStyles<'list'>;

export const createCoffeeBagListStyles = (theme: Theme): CoffeeBagListStyleMap =>
  StyleSheet.create({
    list: { gap: theme.spacing.md },
  });
