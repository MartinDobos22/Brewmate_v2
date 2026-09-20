import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewWeekCardStyleMap = ViewStyles<'card' | 'count' | 'pressed'>;

/**
 * Two cards side by side, each reporting one thing the account has: a week of
 * brewing, and what the app makes of somebody's taste.
 *
 * Equal halves of one row because neither outranks the other, and both are
 * reports rather than invitations - which is why they carry the surface and a
 * shadow rather than a tone. A coloured card here would be competing with the
 * hint above it, which is the one thing on this screen with something to say.
 */
export const createBrewWeekCardStyles = (theme: Theme): BrewWeekCardStyleMap =>
  StyleSheet.create({
    card: {
      flex: 1,
      minWidth: 0,
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    count: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs },
    pressed: { opacity: theme.opacity.pressed },
  });
