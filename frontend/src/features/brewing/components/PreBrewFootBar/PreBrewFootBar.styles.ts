import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewFootBarStyleMap = ViewStyles<
  'bar' | 'plan' | 'line' | 'submit' | 'notices' | 'pressed' | 'disabled'
>;

/**
 * The plan and the commitment, pinned to the bottom edge.
 *
 * Everything on the left was chosen further up the screen, in cards somebody
 * has already scrolled past; by the time they reached the button the dose was
 * four screens away and the only way to check what they were about to spend a
 * model call on was to scroll back through all of it. As a card at the end of
 * the scroll it answered that too late, so it became the bar instead.
 *
 * The layout is fragile on purpose and both halves say why. The numbers must
 * never wrap - a plan that breaks across two lines stops being a glance - and
 * the coffee's name must ellipsise, because a long one would otherwise push
 * the button off the screen. The button therefore takes its own width and the
 * plan takes what is left.
 */
export const createPreBrewFootBarStyles = (theme: Theme): PreBrewFootBarStyleMap =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lgPlus,
      backgroundColor: theme.colors.surface,
      borderTopWidth: theme.borderWidth.thin,
      borderTopColor: theme.colors.dividerStrong,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.footBar,
    },
    plan: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    line: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    submit: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      height: theme.size.footBarPillHeight,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.buttonDark,
    },
    /** What stands between this bar and a recipe, above it rather than in it. */
    notices: {
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lgPlus,
      paddingTop: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { opacity: theme.opacity.disabled },
  });
