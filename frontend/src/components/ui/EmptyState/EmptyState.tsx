import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Button, type ButtonVariant } from '../Button';
import { Text } from '../Text';

import { createEmptyStateStyles } from './EmptyState.styles';

const DEFAULT_ACTION_VARIANT: ButtonVariant = 'tertiary';

export interface EmptyStateAction {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
}

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  /**
   * The ways out, in the order they deserve attention. An empty screen with
   * nothing to press is a dead end, so a state that can offer one, does.
   */
  readonly actions?: readonly EmptyStateAction[];
}

const NO_ACTIONS: readonly EmptyStateAction[] = [];

/** Shown when a list has nothing in it yet. */
export const EmptyState = ({
  title,
  description,
  actions = NO_ACTIONS,
}: EmptyStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);

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
      <View style={styles.actions}>
        {actions.map((action: EmptyStateAction): JSX.Element => (
          <Button
            key={action.label}
            label={action.label}
            onPress={action.onPress}
            variant={action.variant ?? DEFAULT_ACTION_VARIANT}
            fullWidth
          />
        ))}
      </View>
    </View>
  );
};
