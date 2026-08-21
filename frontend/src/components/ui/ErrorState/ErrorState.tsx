import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Button } from '../Button';
import { createEmptyStateStyles } from '../EmptyState';
import { Text } from '../Text';

export interface ErrorStateProps {
  readonly title: string;
  readonly description: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
}

/** Shown when a request failed and the user can try again. */
export const ErrorState = ({
  title,
  description,
  retryLabel,
  onRetry,
}: ErrorStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.text}>
        <Text variant="headlineSmall" tone="error" align="center">
          {title}
        </Text>
        <Text variant="bodyMedium" tone="muted" align="center">
          {description}
        </Text>
      </View>
      <Button label={retryLabel} onPress={onRetry} variant="secondary" />
    </View>
  );
};
