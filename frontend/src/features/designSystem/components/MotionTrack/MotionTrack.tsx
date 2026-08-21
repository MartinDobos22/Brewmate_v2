import { useRef, type JSX } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

import { Text } from '../../../../components/ui';
import { useReducedMotion } from '../../../../hooks';
import { useTheme, useThemedStyles, type DurationToken } from '../../../../theme';

import { createMotionTrackStyles } from './MotionTrack.styles';
import { dotTransform } from './motionTrackAnimatedStyles';

const START = 0;
const END = 1;

export interface MotionTrackProps {
  readonly label: string;
  readonly duration: DurationToken;
}

/** Tap to replay one duration token with the MD3 standard curve. */
export const MotionTrack = ({ label, duration }: MotionTrackProps): JSX.Element => {
  const styles = useThemedStyles(createMotionTrackStyles);
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(START)).current;

  const run = (): void => {
    progress.setValue(START);
    Animated.timing(progress, {
      toValue: END,
      duration: reduceMotion ? theme.duration.instant : theme.duration[duration],
      easing: Easing.bezier(
        theme.easing.standard.x1,
        theme.easing.standard.y1,
        theme.easing.standard.x2,
        theme.easing.standard.y2,
      ),
      useNativeDriver: true,
    }).start();
  };

  const translateX = progress.interpolate({
    inputRange: [START, END],
    outputRange: [START, theme.size.motionTravel],
  });

  return (
    <Pressable
      style={styles.wrapper}
      onPress={run}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text variant="labelSmall" tone="muted">
        {label}
      </Text>
      <Animated.View style={styles.track}>
        <Animated.View style={[styles.dot, dotTransform(translateX)]} />
      </Animated.View>
    </Pressable>
  );
};
