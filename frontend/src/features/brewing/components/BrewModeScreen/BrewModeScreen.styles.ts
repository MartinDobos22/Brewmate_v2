import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewModeScreenStyleMap = ViewStyles<
  'root' | 'wrapper' | 'block' | 'middle' | 'facts' | 'grind'
>;

/**
 * Three blocks pushed apart, with the ring in the middle of them.
 *
 * `space-between` rather than a scroll, because this screen is glanced at
 * rather than read: everything it says has to be in one place for the length
 * of a brew, and a screen somebody has to scroll with a wet hand while a
 * kettle empties is one where the countdown ends up off-screen.
 */
export const createBrewModeScreenStyles = (theme: Theme): BrewModeScreenStyleMap =>
  StyleSheet.create({
    /**
     * Unpadded, so the warm light behind everything is offset from the screen's
     * own edge rather than from the inside of the margin - and clipped, because
     * the glow is wider than the phone on purpose.
     */
    root: { flex: 1, overflow: 'hidden' },
    wrapper: {
      flex: 1,
      padding: theme.spacing.lgPlus,
      gap: theme.spacing.lgPlus,
      justifyContent: 'space-between',
    },
    block: { gap: theme.spacing.lgPlus },
    middle: { alignItems: 'center', justifyContent: 'center', gap: theme.spacing.lgPlus },
    facts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.xl,
    },
    grind: { gap: theme.spacing.xxs },
  });
