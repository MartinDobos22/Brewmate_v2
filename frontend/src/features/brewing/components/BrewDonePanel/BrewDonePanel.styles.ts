import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewDonePanelStyleMap = ViewStyles<'wrapper'>;

export const createBrewDonePanelStyles = (theme: Theme): BrewDonePanelStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.lg, justifyContent: 'center', flexGrow: 1 },
  });
