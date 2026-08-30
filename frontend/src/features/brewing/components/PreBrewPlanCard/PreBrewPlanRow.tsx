import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createPreBrewPlanCardStyles } from './PreBrewPlanCard.styles';

export interface PreBrewPlanRowProps {
  readonly label: string;
  readonly value: string;
  /** Measured values are set in the monospaced face, like everywhere else. */
  readonly numeric?: boolean;
}

/** One line of the plan: what was decided, and what it was decided to be. */
export const PreBrewPlanRow = ({
  label,
  value,
  numeric = false,
}: PreBrewPlanRowProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewPlanCardStyles);

  return (
    <View style={styles.row}>
      <Text variant="labelMedium" tone="muted">
        {label}
      </Text>
      <Text variant={numeric ? 'numericSmall' : 'bodyMedium'} numeric={numeric} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};
