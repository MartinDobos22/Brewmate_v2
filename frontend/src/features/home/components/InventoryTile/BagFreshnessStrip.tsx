import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BagFreshness } from '../../../inventory/services';
import { HOME_FRESHNESS_PIP_MAX } from '../../constants';

import {
  BAG_FRESHNESS_PIP_STYLES,
  createBagFreshnessStripStyles,
} from './BagFreshnessStrip.styles';

const KEY_SEPARATOR = '-';

export interface BagFreshnessStripProps {
  readonly freshness: readonly BagFreshness[];
}

/**
 * The cupboard at a glance: one pip per bag, coloured by its state.
 *
 * Cut off after a handful, because a strip is a glance and nobody counts past
 * six of anything - the caption beside it carries the real number. A bag with
 * no roast date gets a pip of its own rather than being left out: an unknown
 * bag is still a bag on the shelf.
 */
export const BagFreshnessStrip = ({ freshness }: BagFreshnessStripProps): JSX.Element => {
  const styles = useThemedStyles(createBagFreshnessStripStyles);
  const { t } = useTranslation();

  return (
    <View
      style={styles.strip}
      accessibilityLabel={t(TRANSLATION_KEYS.homeTileInventoryFreshnessLabel)}
    >
      {freshness
        .slice(0, HOME_FRESHNESS_PIP_MAX)
        .map((band: BagFreshness, index: number): JSX.Element => (
          <View
            key={`${band}${KEY_SEPARATOR}${String(index)}`}
            style={[styles.pip, styles[BAG_FRESHNESS_PIP_STYLES[band]]]}
          />
        ))}
    </View>
  );
};
