import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';
import { BAG_FRESHNESS, type BagFreshness } from '../../../inventory/services';

type BagFreshnessStripStyleMap = ViewStyles<
  'strip' | 'pip' | 'pipUnknown' | 'pipResting' | 'pipIdeal' | 'pipPastPeak' | 'pipAging'
>;

/**
 * One pip per bag, coloured by what to do with it this morning.
 *
 * Honey for a bag that is still resting - the one state the palette reserves a
 * saturated colour for - green for one that is ready, and the quiet neutrals
 * for a bag past its peak or with no roast date at all. A bag going off is the
 * only one drawn in the error colour, because it is the only one where doing
 * nothing costs somebody their coffee.
 */
export const createBagFreshnessStripStyles = (theme: Theme): BagFreshnessStripStyleMap =>
  StyleSheet.create({
    strip: { flexDirection: 'row', gap: theme.spacing.xs, alignItems: 'center' },
    pip: {
      width: theme.size.tilePipSize,
      height: theme.size.tilePipSize,
      borderRadius: theme.radius.xs,
    },
    pipUnknown: { backgroundColor: theme.colors.outlineVariant },
    pipResting: { backgroundColor: theme.colors.tertiary },
    pipIdeal: { backgroundColor: theme.colors.secondary },
    pipPastPeak: { backgroundColor: theme.colors.outline },
    pipAging: { backgroundColor: theme.colors.error },
  });

/** Which pip fill each band uses, named as a key of the stylesheet above. */
export const BAG_FRESHNESS_PIP_STYLES = {
  [BAG_FRESHNESS.unknown]: 'pipUnknown',
  [BAG_FRESHNESS.resting]: 'pipResting',
  [BAG_FRESHNESS.ideal]: 'pipIdeal',
  [BAG_FRESHNESS.pastPeak]: 'pipPastPeak',
  [BAG_FRESHNESS.aging]: 'pipAging',
} as const satisfies Record<BagFreshness, string>;
