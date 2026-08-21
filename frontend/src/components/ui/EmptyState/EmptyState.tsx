import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Button } from '../Button';
import { Text } from '../Text';

import { createEmptyStateStyles } from './EmptyState.styles';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

/** Shown when a list has nothing in it yet. */
export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);
  const hasAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View style={styles.wrapper}>
      <View style={styles.text}>
        <Text variant="headlineSmall" align="center">
          {title}
        </Text>
        <Text variant="bodyMedium" tone="muted" align="center">
          {description}
        </Text>
      </View>
      {hasAction ? <Button label={actionLabel} onPress={onAction} variant="tertiary" /> : null}
    </View>
  );
};
