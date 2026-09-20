import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeActionsStyleMap = ViewStyles<'row' | 'lead' | 'round' | 'quiet' | 'pressed'>;

/**
 * The row that starts something, at the bottom of the espresso block.
 *
 * One action is the answer and the others are alternatives to it, so the first
 * is cream on brown and takes the width, and the rest are the lifted brown and
 * take only themselves. Three equally coloured buttons would be a screen
 * declining to say which one it thinks you want.
 *
 * Everything here is 56 high - bigger than a pill anywhere else in the app -
 * because this is the one control somebody reaches for without having read
 * anything on the screen first.
 */
export const createHomeActionsStyles = (theme: Theme): HomeActionsStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: theme.spacing.md },
    lead: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.homeActionSize,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.cream,
      shadowColor: theme.colors.espressoShadow,
      ...theme.elevation.pillOnEspresso,
    },
    round: {
      width: theme.size.homeActionSize,
      height: theme.size.homeActionSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    quiet: {
      justifyContent: 'center',
      height: theme.size.homeActionSize,
      paddingHorizontal: theme.spacing.lgPlus,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
