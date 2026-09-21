import type { JSX } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { createEmptyStateStyles } from '../EmptyState';
import {
  DEFAULT_STATE_GROUND,
  STATE_BODY_TONES,
  STATE_SPINNER_COLORS,
  type StateGround,
} from '../StateMark';
import { Text } from '../Text';

export interface LoadingStateProps {
  readonly label: string;
  readonly ground?: StateGround;
}

/**
 * Shown while a screen waits for its first data.
 *
 * It takes a ground because two screens in this app are dark in both colour
 * schemes, and a light-grey spinner over brew mode's near-black is the one
 * screen in the product read at arm's length showing nothing at all.
 */
export const LoadingState = ({
  label,
  ground = DEFAULT_STATE_GROUND,
}: LoadingStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);
  const theme = useTheme();

  return (
    <View style={styles.wrapper} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size="large" color={theme.colors[STATE_SPINNER_COLORS[ground]]} />
      <Text variant="bodyText" tone={STATE_BODY_TONES[ground]} align="center">
        {label}
      </Text>
    </View>
  );
};
