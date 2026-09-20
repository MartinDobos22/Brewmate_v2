import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteCorrectionCardStyleMap = ViewStyles<
  'card' | 'heading' | 'buttons' | 'primary' | 'secondary' | 'pressed'
>;

/**
 * The two ways to disagree with the profile above, stacked rather than side by
 * side.
 *
 * Answering the questionnaire again is evidence; moving the sliders is an
 * instruction. They are not alternatives of equal kind, so they are not laid
 * out as a pair - the one that teaches comes first, and the one that overrules
 * sits under it.
 *
 * Its own card, on its own ground, because correcting a profile is a different
 * act from reading one and it is the act somebody scrolls here for.
 */
export const createTasteCorrectionCardStyles = (theme: Theme): TasteCorrectionCardStyleMap =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lgPlus,
      borderRadius: theme.shape.xlCard,
      backgroundColor: theme.colors.surfaceContainer,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    buttons: { gap: theme.spacing.sm },
    primary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.bagActionHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espresso,
    },
    secondary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.bagActionHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surface,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
