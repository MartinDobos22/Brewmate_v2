import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BrewSparklineStyleMap = ViewStyles<'chart' | 'column' | 'bar' | 'barEmpty'>;

export const createBrewSparklineStyles = (theme: Theme): BrewSparklineStyleMap =>
  StyleSheet.create({
    chart: {
      flexDirection: 'row',
      alignItems: 'stretch',
      height: theme.size.tileChartHeight,
      gap: theme.spacing.xxs,
    },
    column: { flexGrow: 1, flexBasis: 0, justifyContent: 'flex-end' },
    bar: {
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.primary,
      minHeight: theme.size.tileBarMinHeight,
    },
    /**
     * A day with no coffee in it is still a day.
     *
     * Drawn as a flat outline rather than left blank, because a week with a
     * gap in the middle and a week that has not happened yet look identical
     * once the bars simply stop appearing.
     */
    barEmpty: { backgroundColor: theme.colors.outlineVariant },
  });

/** A bar's share of its column, as a flex weight rather than a measured height. */
export const dayWeight = (weight: number): ViewStyle => ({ flexGrow: weight, flexBasis: 0 });
