import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

export interface InfoRowProps {
  readonly label: string;
  readonly value: string | null;
}

/**
 * One recorded fact about a coffee.
 *
 * @returns null when there is nothing to say. A row that printed a dash would
 * be telling somebody the app has a field, not that their coffee has a farm.
 */
export const InfoRow = ({ label, value }: InfoRowProps): JSX.Element | null => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);

  if (value === null || value === '') {
    return null;
  }

  return (
    <View style={styles.row}>
      <Text variant="bodySmall" tone="muted">
        {label}
      </Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
};
