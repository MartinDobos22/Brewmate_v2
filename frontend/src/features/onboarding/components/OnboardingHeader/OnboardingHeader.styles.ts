import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OnboardingHeaderStyleMap = ViewStyles<'row' | 'back' | 'skip' | 'pressed'>;

/**
 * The way back and the way out, at the top of every step.
 *
 * Both are drawn as objects laid on the screen rather than as text buttons:
 * this screen is otherwise a column of cards, and two bare words floating
 * above them read as labels for the card underneath. The way back is round
 * because it is one glyph; the way out carries a word because leaving a flow
 * is not something anybody should do by recognising an icon.
 *
 * The way out is on every single screen on purpose. Onboarding a user cannot
 * leave is onboarding they leave the app from instead, and whatever they
 * answered so far is already saved either way.
 */
export const createOnboardingHeaderStyles = (theme: Theme): OnboardingHeaderStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    back: {
      width: theme.size.onboardingBackSize,
      height: theme.size.onboardingBackSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    skip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      height: theme.size.onboardingSkipHeight,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
