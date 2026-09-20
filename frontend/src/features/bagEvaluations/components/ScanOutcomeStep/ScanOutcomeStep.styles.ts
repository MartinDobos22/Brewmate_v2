import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ScanOutcomeStyleMap = ViewStyles<
  'wrapper' | 'words' | 'buttons' | 'bought' | 'left' | 'again' | 'pressed'
>;

/**
 * Did the advice survive contact with the shelf?
 *
 * The only thing this app ever learns about whether it was any good at this,
 * so it sits against the bottom of the screen where a thumb already is rather
 * than as another card in the scroll.
 *
 * Both answers are the same size. "Nechal tam" has to look like an ordinary
 * thing to have done, because a screen that makes one answer look like the
 * right one is a screen that stops collecting the other.
 */
export const createScanOutcomeStyles = (theme: Theme): ScanOutcomeStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.lg, marginTop: 'auto' },
    words: { gap: theme.spacing.xs, paddingHorizontal: theme.spacing.xxs },
    buttons: { flexDirection: 'row', gap: theme.spacing.sm },
    bought: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.outcomeButtonHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.buttonDark,
    },
    left: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.outcomeButtonHeight,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    /** Flat and unboxed: it leaves this verdict rather than answering it. */
    again: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: theme.size.minTouchTarget,
    },
    pressed: { opacity: theme.opacity.pressed },
  });
