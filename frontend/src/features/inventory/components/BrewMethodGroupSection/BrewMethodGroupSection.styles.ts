import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewMethodGroupSectionStyleMap = ViewStyles<'group' | 'item'>;

export const createBrewMethodGroupSectionStyles = (theme: Theme): BrewMethodGroupSectionStyleMap =>
  StyleSheet.create({
    group: { gap: theme.spacing.sm, alignSelf: 'stretch' },
    item: { gap: theme.spacing.xxs },
  });
