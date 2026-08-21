import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createValueDisplayStyles } from './ValueDisplay.styles';
import {
  DEFAULT_VALUE_SIZE,
  UNIT_VARIANTS,
  VALUE_VARIANTS,
  type ValueDisplaySize,
} from './valueDisplaySizes';

export interface ValueDisplayProps {
  /** Already formatted by one of the formatters in lib/formatters. */
  readonly value: string;
  readonly label: string;
  readonly unit?: string;
  readonly size?: ValueDisplaySize;
  readonly highlighted?: boolean;
}

/**
 * A large monospaced value with a small caption. Used by brew mode, the ratio
 * calculator and the recipe detail - the three places a number must not jitter.
 */
export const ValueDisplay = ({
  value,
  label,
  unit,
  size = DEFAULT_VALUE_SIZE,
  highlighted = false,
}: ValueDisplayProps): JSX.Element => {
  const styles = useThemedStyles(createValueDisplayStyles);

  return (
    <View style={styles.wrapper} accessibilityLabel={label}>
      <Text variant="labelMedium" tone="muted">
        {label}
      </Text>
      <View style={styles.row}>
        <Text variant={VALUE_VARIANTS[size]} tone={highlighted ? 'tertiary' : 'default'} numeric>
          {value}
        </Text>
        {unit === undefined ? null : (
          <Text variant={UNIT_VARIANTS[size]} tone="muted" numeric>
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
};
