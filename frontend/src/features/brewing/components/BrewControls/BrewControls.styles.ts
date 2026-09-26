import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewControlsStyleMap = ViewStyles<'row' | 'primary' | 'secondary' | 'pressed'>;

/**
 * The three largest touch targets in the app, and the sizes are load-bearing.
 *
 * Ninety points for the primary and sixty-six for the two beside it, which is
 * what makes them findable by a wet finger aiming at a phone propped against a
 * kettle. Nothing is disabled: a control that greys out is one somebody
 * presses twice before realising, and all three are meaningful in every state
 * a brew can be in.
 *
 * The primary shadow is tinted with the arc's own colour rather than with a
 * shade, because it falls on a ground too dark for a shadow to register at
 * all - and the lift is what tells a thumb where the button is before the eyes
 * have found it.
 */
export const createBrewControlsStyles = (theme: Theme): BrewControlsStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.lg,
    },
    primary: {
      flex: 1,
      flexDirection: 'row',
      height: theme.size.brewPrimaryControlSize,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.cream,
      shadowColor: theme.colors.brewArc,
      ...theme.elevation.brewControl,
    },
    secondary: {
      width: theme.size.brewControlSize,
      height: theme.size.brewControlSize,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xxs,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.brewSurface,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
