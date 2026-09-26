import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewStepProgressStyleMap = ViewStyles<'row' | 'track' | 'segment' | 'reached' | 'todo'>;

/**
 * Thin, and beside a count rather than under a heading.
 *
 * It used to be thick, on the argument that everything on this screen is read
 * from half a metre away. That was right about the countdown and wrong about
 * this: how far through the brew is gets glanced at between pours, and a heavy
 * bar across the top competes with the one number the screen exists for.
 *
 * Every segment up to and including the current one is drawn the same. The
 * step being poured is named in words directly underneath at display size, so
 * a third colour here would be a second answer to a question already answered.
 */
export const createBrewStepProgressStyles = (theme: Theme): BrewStepProgressStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    track: { flex: 1, flexDirection: 'row', gap: theme.spacing.sm },
    segment: { height: theme.size.brewProgressHeight, borderRadius: theme.radius.xxs },
    reached: { backgroundColor: theme.colors.accentOnEspresso },
    todo: { backgroundColor: theme.colors.brewTrack },
  });

export const segmentWidth = (): ViewStyle => ({ flexGrow: 1, flexBasis: 0 });
