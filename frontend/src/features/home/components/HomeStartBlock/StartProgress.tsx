import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { formatStepCount } from '../../services';

import { createHomeStartBlockStyles, startSegment } from './HomeStartBlock.styles';

const KEY_PREFIX = 'step-';

export interface StartProgressProps {
  readonly completed: number;
  readonly total: number;
}

/**
 * How far through the first three somebody is.
 *
 * Segments rather than a filled bar, because three is a number small enough to
 * count and a continuous bar at one third invites reading a percentage off
 * something that only has three states.
 */
export const StartProgress = ({ completed, total }: StartProgressProps): JSX.Element => {
  const styles = useThemedStyles(createHomeStartBlockStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.title}>
          <Text variant="eyebrowEspresso" tone="accent">
            {t(TRANSLATION_KEYS.homeStartTitle)}
          </Text>
        </View>
        <Text variant="numericLabel" tone="onEspressoMuted" numeric>
          {formatStepCount(completed, total, t(TRANSLATION_KEYS.homeStartCountSeparator))}
        </Text>
      </View>
      <View style={styles.track}>
        {Array.from({ length: total }, (_unused: unknown, index: number): JSX.Element => (
          <View
            key={`${KEY_PREFIX}${String(index)}`}
            style={startSegment(theme, index < completed)}
          />
        ))}
      </View>
    </>
  );
};
