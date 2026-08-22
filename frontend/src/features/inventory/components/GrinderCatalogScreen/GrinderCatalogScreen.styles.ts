import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderCatalogScreenStyleMap = ViewStyles<'header' | 'list'>;

export const createGrinderCatalogScreenStyles = (theme: Theme): GrinderCatalogScreenStyleMap =>
  StyleSheet.create({
    header: { gap: theme.spacing.md },
    list: { flex: 1 },
  });
