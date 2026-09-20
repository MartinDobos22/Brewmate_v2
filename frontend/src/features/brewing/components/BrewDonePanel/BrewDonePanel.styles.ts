import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewDonePanelStyleMap = ViewStyles<'wrapper'>;

/**
 * Pads itself, because brew mode lays itself out against the full height and
 * the screen under it no longer pads anything.
 */
export const createBrewDonePanelStyles = (theme: Theme): BrewDonePanelStyleMap =>
  StyleSheet.create({
    wrapper: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lgPlus,
      justifyContent: 'center',
      flexGrow: 1,
    },
  });
