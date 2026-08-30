import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type StepProgressStyleMap = ViewStyles<'wrapper' | 'track' | 'segment' | 'done' | 'todo'>;

/**
 * Segments rather than one bar, because the steps are countable and few.
 *
 * A continuous bar at 66% invites the reader to work out what the third is;
 * three blocks with two filled says the same thing without arithmetic - which
 * matters on the screens this is used on, worked through one-handed and often
 * standing up.
 */
export const createStepProgressStyles = (theme: Theme): StepProgressStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs },
    track: { flexDirection: 'row', gap: theme.spacing.xs },
    segment: { height: theme.size.progressBarHeight, borderRadius: theme.radius.xs },
    done: { backgroundColor: theme.colors.primary },
    todo: { backgroundColor: theme.colors.surfaceContainerHigh },
  });

/** Every segment is the same width, whatever the flow turns out to be. */
export const segmentWidth = (): ViewStyle => ({ flexGrow: 1, flexBasis: 0 });
