import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AvailableMethodListStyleMap = ViewStyles<'row'>;

export const createAvailableMethodListStyles = (theme: Theme): AvailableMethodListStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  });
