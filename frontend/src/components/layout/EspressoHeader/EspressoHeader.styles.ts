import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type EspressoHeaderStyleMap = ViewStyles<'block' | 'content'>;

/**
 * A dark block at the top of a light screen, holding the one thing that
 * screen most wants read.
 *
 * It is not a dark theme and does not borrow one: the same brown appears
 * whichever scheme the phone is set to, because it is the same object on both.
 * Square at the top, where it meets the notch, and rounded where it ends -
 * which is what makes it read as a block laid on the screen rather than as the
 * screen's own colour.
 */
export const createEspressoHeaderStyles = (theme: Theme): EspressoHeaderStyleMap =>
  StyleSheet.create({
    block: {
      backgroundColor: theme.colors.espresso,
      borderBottomLeftRadius: theme.shape.headerBlock,
      borderBottomRightRadius: theme.shape.headerBlock,
      paddingHorizontal: theme.spacing.lgPlus,
      paddingBottom: theme.spacing.xl,
      overflow: 'hidden',
    },
    content: { gap: theme.spacing.lg },
  });

/**
 * The block reaches under the notch, so the inset is its padding rather than
 * the screen's. A screen that claimed the top inset as well would leave a
 * strip of its own background above a block that is meant to start at the
 * glass.
 */
export const headerInset = (theme: Theme, inset: number): ViewStyle => ({
  paddingTop: inset + theme.spacing.lg,
});
