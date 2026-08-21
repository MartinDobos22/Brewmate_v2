import type { JSX } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { createEmptyStateStyles } from '../EmptyState';
import { Text } from '../Text';

export interface LoadingStateProps {
  readonly label: string;
}

/** Shown while a screen waits for its first data. */
export const LoadingState = ({ label }: LoadingStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);
  const theme = useTheme();

  return (
    <View style={styles.wrapper} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text variant="bodyMedium" tone="muted" align="center">
        {label}
      </Text>
    </View>
  );
};
