import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type PreBrewHeaderStyleMap = ViewStyles<
  | 'row'
  | 'dashed'
  | 'badge'
  | 'badgeBean'
  | 'badgeEmpty'
  | 'body'
  | 'meta'
  | 'metaState'
  | 'dot'
  | 'actions'
  | 'pressed'
>;

/**
 * The coffee, reported rather than offered.
 *
 * The bag list used to live here as well as on the screen before it, and two
 * places that set one value are two places that eventually disagree about it.
 * So this says what was answered and sends anybody who wants to change it back
 * to the question - which keeps every other answer on the screen, because
 * picking up a different bag is not a reason to set the brewer again.
 *
 * With nothing in the cupboard the same row goes dashed. A missing coffee is
 * stated, never enforced: the dashes say the slot is empty without the row
 * turning into an error, and the recipe is never blocked on it.
 */
export const createPreBrewHeaderStyles = (theme: Theme): PreBrewHeaderStyleMap =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.espressoDeep,
    },
    dashed: {
      borderWidth: theme.borderWidth.thin,
      borderStyle: 'dashed',
      borderColor: theme.colors.primary,
    },
    badge: {
      width: theme.size.headerBadgeSize,
      height: theme.size.headerBadgeSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
    },
    badgeBean: { backgroundColor: theme.colors.onFresh },
    badgeEmpty: { backgroundColor: theme.colors.espresso },
    body: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    meta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    /**
     * The state shrinks and the weight does not. A figure is three characters
     * and always fits; "Má to najlepšie za sebou" is the one that has to give
     * way, and a row that let neither give way printed both off the screen.
     */
    metaState: { flexShrink: 1, minWidth: 0 },
    /** The separator between two facts that are not a sentence. */
    dot: {
      width: theme.size.metaDotSize,
      height: theme.size.metaDotSize,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.primary,
    },
    actions: { flexDirection: 'row', gap: theme.spacing.sm },
    pressed: { opacity: theme.opacity.pressed },
  });
