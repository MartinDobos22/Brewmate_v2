import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CoffeeMatchCardStyleMap = ViewStyles<'reasons' | 'reason'>;
type MatchLegendStyleMap = ViewStyles<'legend' | 'entry' | 'youSwatch' | 'coffeeSwatch'>;

export const createCoffeeMatchCardStyles = (theme: Theme): CoffeeMatchCardStyleMap =>
  StyleSheet.create({
    reasons: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    reason: { flexDirection: 'row', gap: theme.spacing.xs },
  });

export const createMatchLegendStyles = (theme: Theme): MatchLegendStyleMap =>
  StyleSheet.create({
    legend: { flexDirection: 'row', gap: theme.spacing.md, alignSelf: 'center' },
    entry: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xxs },
    youSwatch: {
      width: theme.size.legendSwatchWidth,
      height: theme.size.legendSwatchHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.primary,
    },
    /** Outlined rather than filled, the way the overlay itself is drawn. */
    coffeeSwatch: {
      width: theme.size.legendSwatchWidth,
      height: theme.size.legendSwatchHeight,
      borderRadius: theme.radius.xs,
      borderWidth: theme.size.legendSwatchBorder,
      borderColor: theme.colors.tertiary,
    },
  });
