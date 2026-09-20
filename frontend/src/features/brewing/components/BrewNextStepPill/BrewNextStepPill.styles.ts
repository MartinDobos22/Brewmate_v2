import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';
import { BREW_NEXT_PILL } from '../../constants';

type BrewNextStepPillStyleMap = ViewStyles<'pill'>;

export const createBrewNextStepPillStyles = (theme: Theme): BrewNextStepPillStyleMap =>
  StyleSheet.create({
    pill: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      height: BREW_NEXT_PILL.height,
      gap: BREW_NEXT_PILL.gap,
      paddingHorizontal: BREW_NEXT_PILL.paddingHorizontal,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.brewSurface,
    },
  });
