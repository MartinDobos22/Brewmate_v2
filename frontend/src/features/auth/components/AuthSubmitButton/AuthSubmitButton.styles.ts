import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AuthSubmitButtonStyleMap = ViewStyles<'button' | 'provider' | 'pressed' | 'disabled'>;

/**
 * The two shapes of button on a dark form.
 *
 * The submit is cream on brown and the providers are the lifted brown, which
 * is the same hierarchy the home screen's block uses: one answer and the
 * alternatives beside it. Apple's own button is neither of these - it is drawn
 * by Apple, and only its height and radius are ours to set.
 */
export const createAuthSubmitButtonStyles = (theme: Theme): AuthSubmitButtonStyleMap =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.authSubmitHeight,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.cream,
      shadowColor: theme.colors.espressoShadow,
      ...theme.elevation.pillOnEspresso,
    },
    provider: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.authProviderHeight,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { opacity: theme.opacity.disabled },
  });
