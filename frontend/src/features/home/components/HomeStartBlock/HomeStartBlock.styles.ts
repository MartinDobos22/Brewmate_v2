import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type HomeStartBlockStyleMap = ViewStyles<'block' | 'heading' | 'title' | 'track' | 'rows' | 'row'>;

/**
 * The first three things worth doing, in the slot the recommendation will
 * take once they are done.
 *
 * It is in the espresso block rather than in a card below it because on a
 * brand-new account this *is* the recommendation - there is no coffee to
 * suggest yet, and a dark block holding nothing while a checklist sits under
 * it would be the loudest part of the screen saying it has nothing to say.
 */
export const createHomeStartBlockStyles = (theme: Theme): HomeStartBlockStyleMap =>
  StyleSheet.create({
    block: { gap: theme.spacing.lgPlus },
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    title: { flex: 1, minWidth: 0 },
    /** Three segments rather than one bar: three steps is a number, not a fraction. */
    track: { flexDirection: 'row', gap: theme.spacing.xs },
    rows: { gap: theme.spacing.sm },
    row: { flexDirection: 'row', gap: theme.spacing.md },
  });

/**
 * One segment of the count, lit or unlit.
 *
 * Built here rather than in the JSX because its width is a share of the row
 * rather than a measurement, and a flex weight written at a call site is a
 * style in a component by another name.
 */
export const startSegment = (theme: Theme, isDone: boolean): ViewStyle => ({
  flex: 1,
  height: theme.size.startSegmentHeight,
  borderRadius: theme.shape.pill,
  backgroundColor: isDone ? theme.colors.accentOnEspresso : theme.colors.espressoLine,
});
