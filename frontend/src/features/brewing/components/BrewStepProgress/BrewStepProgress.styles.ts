import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewStepProgressStyleMap = ViewStyles<'track' | 'segment' | 'done' | 'current' | 'todo'>;

/**
 * Thicker than the strip the short flows use, and unlabelled.
 *
 * Everything on this screen is sized to be read from half a metre away by
 * somebody whose hands are wet, so it uses `brewProgressHeight` rather than
 * the ordinary progress height - and it carries no "krok 2 z 5" of its own,
 * because the panel above already says exactly that at headline size. Two
 * copies of the same count is one of them nobody reads.
 */
export const createBrewStepProgressStyles = (theme: Theme): BrewStepProgressStyleMap =>
  StyleSheet.create({
    track: { flexDirection: 'row', gap: theme.spacing.xs },
    segment: { height: theme.size.brewProgressHeight, borderRadius: theme.radius.xs },
    done: { backgroundColor: theme.colors.outline },
    /** The step being poured, told apart from the ones already behind it. */
    current: { backgroundColor: theme.colors.primary },
    todo: { backgroundColor: theme.colors.surfaceContainerHigh },
  });

export const segmentWidth = (): ViewStyle => ({ flexGrow: 1, flexBasis: 0 });
