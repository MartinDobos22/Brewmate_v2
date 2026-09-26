import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { PillButton } from '../PillButton';
import { createEmptyStateStyles } from '../EmptyState';
import {
  DEFAULT_STATE_GROUND,
  StateMark,
  STATE_BODY_TONES,
  STATE_ERROR_TONES,
  type StateGround,
} from '../StateMark';
import { Text } from '../Text';

import { ERROR_STATE_ICON } from './errorStateIcon';

export interface ErrorStateProps {
  readonly title: string;
  readonly description: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
  readonly ground?: StateGround;
}

/**
 * Shown when a request failed and the user can try again.
 *
 * The same mark the empty state carries, because this is the same moment from
 * the reader's side - a screen with nothing on it - and the difference is in
 * the sentence rather than in the picture. The retry is never absent: a
 * failure with no way past it is a dead end, and most of these are a signal
 * that came back a second later.
 */
export const ErrorState = ({
  title,
  description,
  retryLabel,
  onRetry,
  ground = DEFAULT_STATE_GROUND,
}: ErrorStateProps): JSX.Element => {
  const styles = useThemedStyles(createEmptyStateStyles);

  return (
    <View style={styles.wrapper}>
      <StateMark icon={ERROR_STATE_ICON} ground={ground} />
      <View style={styles.text}>
        <Text variant="displayCompact" tone={STATE_ERROR_TONES[ground]} align="center">
          {title}
        </Text>
        <Text variant="bodyText" tone={STATE_BODY_TONES[ground]} align="center">
          {description}
        </Text>
      </View>
      <PillButton
        tone={ground === DEFAULT_STATE_GROUND ? 'surface' : 'lifted'}
        label={retryLabel}
        onPress={onRetry}
        fullWidth
      />
    </View>
  );
};
