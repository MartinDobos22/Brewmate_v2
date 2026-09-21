import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import {
  PILL_BACKGROUNDS,
  PILL_ELEVATIONS,
  PILL_HEIGHTS,
  type PillSize,
  type PillTone,
} from './pillButtonTones';

type PillButtonStyleMap = ViewStyles<'base' | 'grows' | 'fullWidth' | 'pressed' | 'disabled'>;

/**
 * Every button in this app that is shaped like a pill.
 *
 * The geometry is the same on all of them - a row, centred, with a gap between
 * a glyph and a word - so it is written once. What differs is the height, the
 * fill and what the text is painted in, and all three are read off a map at
 * the call site rather than written into a screen's own stylesheet.
 *
 * Before this there were fifteen of these, each with its own `resolveStyle`
 * closure and its own idea of how tall a button is. Six of the heights were
 * within four points of each other.
 */
export const createPillButtonStyles = (theme: Theme): PillButtonStyleMap =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      borderRadius: theme.shape.pill,
    },
    /** Takes the row it is in, for a pair of buttons sharing one. */
    grows: { flex: 1, minWidth: 0 },
    /**
     * Takes the width of whatever it is stacked in.
     *
     * Not the same as `grows`, which divides a row between two buttons. This
     * is one button under a form, and the difference matters in a column: a
     * flexed child of a column stretches vertically instead.
     */
    fullWidth: { alignSelf: 'stretch' },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { opacity: theme.opacity.disabled },
  });

/**
 * The part of a pill that depends on which one it is.
 *
 * Built at runtime rather than as a style per combination: four sizes times
 * six tones is twenty-four stylesheet entries for a component with one shape,
 * and the pair that nobody had used yet would be the one that was wrong.
 */
export const pillAppearance = (theme: Theme, tone: PillTone, size: PillSize): ViewStyle => {
  const height = theme.size[PILL_HEIGHTS[size]];
  const elevation = PILL_ELEVATIONS[tone];

  return {
    height,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors[PILL_BACKGROUNDS[tone]],
    ...(elevation === null
      ? {}
      : { shadowColor: theme.colors.espresso, ...theme.elevation[elevation] }),
  };
};

/**
 * A pill with no word in it, which is a circle.
 *
 * Width equal to height and no side padding: a round button is its glyph, and
 * padding would make it an oval on the first phone with a wide font scale.
 */
export const pillCircle = (theme: Theme, size: PillSize): ViewStyle => {
  const diameter = theme.size[PILL_HEIGHTS[size]];

  return { width: diameter, paddingHorizontal: theme.spacing.none };
};

/**
 * The deeper shadow, for the one button on a screen that is a commitment.
 *
 * Asked for rather than carried by a tone: the same cream pill is the loudest
 * thing on the home screen and an ordinary answer inside a card, and only the
 * first is lifted off what it sits on.
 */
export const pillRaised = (theme: Theme): ViewStyle => ({
  shadowColor: theme.colors.espressoShadow,
  ...theme.elevation.pillOnEspresso,
});
