import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';
import { BREW_SCALE_CHIP } from '../../constants';

type BrewScaleChipStyleMap = ViewStyles<'chip'>;

export const createBrewScaleChipStyles = (theme: Theme): BrewScaleChipStyleMap =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      height: BREW_SCALE_CHIP.height,
      gap: BREW_SCALE_CHIP.gap,
      paddingHorizontal: BREW_SCALE_CHIP.paddingHorizontal,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.brewChip,
      marginTop: theme.spacing.md,
    },
  });
