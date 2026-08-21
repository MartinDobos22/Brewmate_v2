import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useTheme } from '../../../theme';

const CLOSED = 0;
const OPEN = 1;

export interface SheetAnimation {
  readonly progress: Animated.Value;
  readonly scrimOpacity: Animated.AnimatedInterpolation<number>;
  readonly translateY: Animated.AnimatedInterpolation<number>;
}

const SLIDE_DISTANCE = 320;

/** Slides the panel in and fades the scrim. Collapses to a cut on reduce motion. */
export const useSheetAnimation = (visible: boolean): SheetAnimation => {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(CLOSED)).current;

  useEffect((): void => {
    Animated.timing(progress, {
      toValue: visible ? OPEN : CLOSED,
      duration: reduceMotion ? theme.duration.instant : theme.duration.medium,
      easing: Easing.bezier(
        theme.easing.decelerate.x1,
        theme.easing.decelerate.y1,
        theme.easing.decelerate.x2,
        theme.easing.decelerate.y2,
      ),
      useNativeDriver: true,
    }).start();
  }, [visible, reduceMotion, progress, theme]);

  return {
    progress,
    scrimOpacity: progress.interpolate({
      inputRange: [CLOSED, OPEN],
      outputRange: [CLOSED, theme.opacity.scrim],
    }),
    translateY: progress.interpolate({
      inputRange: [CLOSED, OPEN],
      outputRange: [SLIDE_DISTANCE, CLOSED],
    }),
  };
};
