import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

export interface InfoRowProps {
  readonly label: string;
  readonly value: string | null;
  /**
   * An altitude, a weight, a date. Figures are set in the app's numeral face
   * wherever they appear, so a column of them lines up and none of them reads
   * as prose.
   */
  readonly numeric?: boolean;
}

/**
 * One recorded fact about a coffee.
 *
 * @returns null when there is nothing to say. A row that printed a dash would
 * be telling somebody the app has a field, not that their coffee has a farm.
 */
export const InfoRow = ({ label, value, numeric = false }: InfoRowProps): JSX.Element | null => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);

  if (value === null || value === '') {
    return null;
  }

  return (
    <View style={styles.row}>
      <Text variant="eyebrow" tone="muted">
        {label}
      </Text>
      <Text variant="bodyText" numeric={numeric}>
        {value}
      </Text>
    </View>
  );
};
