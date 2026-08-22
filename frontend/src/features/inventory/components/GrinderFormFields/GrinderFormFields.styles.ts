import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type GrinderFormFieldsStyleMap = ViewStyles<'fields'>;

export const createGrinderFormFieldsStyles = (theme: Theme): GrinderFormFieldsStyleMap =>
  StyleSheet.create({
    fields: { gap: theme.spacing.lg },
  });
