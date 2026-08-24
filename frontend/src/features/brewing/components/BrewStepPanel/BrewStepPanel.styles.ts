import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewStepPanelStyleMap = ViewStyles<'wrapper'>;

export const createBrewStepPanelStyles = (theme: Theme): BrewStepPanelStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md, alignItems: 'stretch' },
  });
